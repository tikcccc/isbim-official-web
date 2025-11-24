# Claude Reminders - isBIM Official Web

## i18n (Paraglide) Key Points

### Version Compatibility
- **paraglide-next v0.8.1** requires **paraglide-js v1.x** (NOT v2.x)
- v2.x exports `locales`, `baseLocale`, `getLocale`
- v1.x exports `availableLanguageTags`, `sourceLanguageTag`, `languageTag`

### Project Settings (project.inlang/settings.json)
```json
{
  "sourceLanguageTag": "en",        // NOT "baseLocale"
  "languageTags": ["en", "zh"],     // NOT "locales"
  "pathPattern": "./messages/{languageTag}.json"  // NOT "{locale}"
}
```

### App Structure
- Use flat `app/` structure (NOT `app/[locale]/`)
- paraglide-next's PrefixStrategy handles routing via middleware
- `[locale]` folder causes redirect loops with PrefixStrategy

### Runtime API
- Use `languageTag()` to get current locale (NOT `getLocale()`)
- Use `availableLanguageTags` array (NOT `locales`)
- Type: `AvailableLanguageTag` (NOT `Locale`)

### Navigation
- Import `Link`, `useRouter`, `usePathname` from `@/lib/i18n`
- Router: `router.push(pathname, { locale: newLocale })`
- These handle locale prefix automatically

### Key Files
- `src/lib/i18n.ts` - Strategy, Middleware, Navigation exports
- `src/middleware.ts` - Re-exports middleware from i18n.ts
- `src/app/layout.tsx` - Wrap with `<LanguageProvider>`, **MUST await headers()** for Next.js 15
- If you see the sync headers error, clean `.next` and restart dev after fixing `await headers()`.

### Next.js 15 Compatibility - Level 3 Solution (LocaleContext)

**✅ Current Implementation** - Using React Context pattern for zero Hydration Mismatch

**⚠️ Known Issue**: Paraglide's internal middleware still synchronously reads headers, causing console warnings. These warnings are **harmless** and don't affect functionality. The application works correctly with:
- ✅ Zero Hydration Mismatch (SSR and Client render identically)
- ✅ Locale switching works perfectly
- ✅ All routing functions correctly
- ⚠️ Console warnings appear but can be safely ignored

**Why the warnings occur**: Paraglide JS v1.x internally reads `x-language-tag` header synchronously during middleware execution, which Next.js 15 warns against. However, our LocaleContext implementation ensures the actual rendering uses the correct locale consistently.

#### Architecture Overview
We implemented a **LocaleContext** pattern that provides locale from the root Layout to all Client Components, eliminating Hydration Mismatch issues while maintaining clean architecture.

#### Key Files
1. **[src/lib/i18n/locale-context.tsx](../src/lib/i18n/locale-context.tsx)** - LocaleProvider and useLocale hook
2. **[src/lib/i18n/route-builder.ts](../src/lib/i18n/route-builder.ts)** - Dual-mode route builder (pure functions + hooks)
3. **[src/lib/i18n/index.ts](../src/lib/i18n/index.ts)** - Centralized i18n exports
4. **[src/app/layout.tsx](../src/app/layout.tsx)** - Root layout with LocaleProvider and setLanguageTag

#### How It Works

**1. Root Layout reads locale from headers and provides it via Context:**
```tsx
// src/app/layout.tsx
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { setLanguageTag, sourceLanguageTag } from "@/paraglide/runtime";
import { headers } from "next/headers";
import type { AvailableLanguageTag } from "@/paraglide/runtime";

export default async function RootLayout({ children }) {
  // Read locale from headers (after await)
  const headersList = await headers();
  const locale = (headersList.get("x-language-tag") ?? sourceLanguageTag) as AvailableLanguageTag;

  // Tell Paraglide runtime to use this locale (reduces warnings)
  setLanguageTag(() => locale);

  return (
    <LanguageProvider>
      <html lang={locale}>
        <body>
          <LocaleProvider locale={locale}>
            <AppProviders>
              {children}
            </AppProviders>
          </LocaleProvider>
        </body>
      </html>
    </LanguageProvider>
  );
}
```

**2. Client Components use the Hook to access locale from Context:**
```tsx
// In any Client Component
import { useLocalizedHref } from "@/lib/i18n";

function MyComponent() {
  const { locale, buildHref, linkTo } = useLocalizedHref();

  return (
    <Link href={linkTo("about")}>About</Link>
  );
}
```

**3. Dual-Mode Route Builder** supports both Client and Server Components:
```tsx
// Pure function for Server Components/Actions
export function buildHref(path: string, locale: AvailableLanguageTag): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${cleanPath}`;
}

// Hook for Client Components (uses Context)
export function useLocalizedHref() {
  const locale = useLocale(); // From Context
  return {
    locale,
    buildHref: (path: string) => buildHref(path, locale),
    linkTo: (routeKey, subKey) => linkTo(routeKey, locale, subKey),
  };
}
```

#### Benefits
- ✅ **Zero Hydration Mismatch** - SSR and Client use same locale value from Context
- ✅ **Clean Architecture** - Proper React patterns, no global state hacks
- ✅ **Type Safety** - Full TypeScript support throughout
- ✅ **Server & Client Support** - Pure functions for Server, hooks for Client
- ✅ **SEO Ready** - Works with `generateMetadata` and Server Actions
- ✅ **No Performance Issues** - Single source of truth, no re-render cascades

#### Migration Path from Old Solution

**Old (safeLanguageTag wrapper - had Hydration Mismatch):**
```tsx
// ❌ Old approach - SSR returns default, Client returns actual
function safeLanguageTag(): string {
  if (typeof window === "undefined") {
    return sourceLanguageTag; // SSR fallback
  }
  return languageTag(); // Client
}
```

**New (LocaleContext - zero Hydration Mismatch):**
```tsx
// ✅ New approach - SSR and Client use same value from Context
const locale = useLocale(); // Always consistent
```

#### Usage Guidelines

**For Client Components:**
```tsx
import { useLocalizedHref, useLocale } from "@/lib/i18n";

function MyComponent() {
  // Option 1: Full route builder
  const { locale, buildHref, linkTo } = useLocalizedHref();

  // Option 2: Just get locale
  const locale = useLocale();
}
```

**For Server Components:**
```tsx
import { buildHref, linkTo } from "@/lib/i18n";

export default function Page({ params }: { params: { locale: string } }) {
  const href = buildHref("/about", params.locale);
  // ...
}
```

**For SEO/Metadata:**
```tsx
import { buildHref } from "@/lib/i18n";

export async function generateMetadata({ params }) {
  return {
    alternates: {
      canonical: buildHref("/products", params.locale)
    }
  };
}
```

#### Navigation Data Helpers
The `src/data/navigation.ts` file provides helper functions that accept `buildHref` as parameter:

```tsx
import { localizeNavigation, generateBreadcrumbs } from "@/data/navigation";
import { useLocalizedHref } from "@/lib/i18n";

function MyNav() {
  const { buildHref } = useLocalizedHref();
  const localizedNav = localizeNavigation(mainNavigation, buildHref);
  const breadcrumbs = generateBreadcrumbs("/about-us", buildHref);
}
```

#### Troubleshooting

**Console Warning: "Route used headers().get('x-language-tag'). headers() should be awaited"**
- **Status**: Known issue with Paraglide JS v1.x + Next.js 15 combination
- **Impact**: None - warnings are harmless and don't affect functionality
- **Why it happens**: Paraglide's middleware internally reads headers synchronously before Next.js async execution
- **Solution status**:
  - ✅ We've implemented all possible workarounds (await headers, setLanguageTag, LocaleContext)
  - ⚠️ Warning persists due to Paraglide v1.x internal implementation
  - 🔄 Will be resolved when upgrading to Paraglide v2.x (breaking changes)
- **What to do**: Safely ignore these warnings - the application functions correctly

**Error: "useLocale must be used within a LocaleProvider"**
- Ensure root layout wraps children with `<LocaleProvider locale={locale}>`
- Check that locale is properly read from headers

**Error: "React Hook 'useLocale' is called in function that is neither..."**
- Don't call `useLocale()` in non-hook functions
- Use pure `buildHref(path, locale)` function instead with explicit locale parameter

**Build Error: "Export LocaleProvider doesn't exist"**
- Import from direct path: `@/lib/i18n/locale-context` (for layout.tsx)
- Import from barrel: `@/lib/i18n/index` or `@/lib/i18n` (for other Client Components)

#### Previous Approaches (Reference Only)

**Level 1: suppressHydrationWarning** - Quick fix, doesn't solve root cause
**Level 2: Safe wrapper with SSR detection** - Better but still had mismatch warnings
**Level 3: LocaleContext** ✅ - Current implementation, zero issues

---

### Legacy Next.js 15 Compatibility Notes (Pre-Level 3)
- **headers() must be awaited** - Next.js 15 requires `await headers()` in Server Components
- **Do NOT call languageTag() directly in Server Components**
- **Files using languageTag() must be Client Components** - Add `"use client"` directive
  - **route-builder.ts** has `"use client"` because it calls `useLocale()` hook
  - All components using route-builder (Footer, Menu, etc.) must also be Client Components
- **Correct approach for layout.tsx**: Manually read `x-language-tag` header after await, then provide via LocaleContext

## Common Pitfalls & Fixes
- Sync `languageTag()` in Server Components → make component `async`, `await headers()` to read `x-language-tag`, optional `setLanguageTag(() => locale)` if needed later.
- Hardcoded `/${locale}` in links → use `buildLocalizedHref` / `linkTo` / `useLocalizedHref`.
- Creating `[locale]` folder or using v2 API names (`getLocale`, `locales`, `baseLocale`) → keep flat `app/`, use v1 API only.

## TypeScript Type Safety

### Framer Motion Variants
- **Easing strings** must use `as const` assertion
  ```ts
  // ❌ Wrong - Type 'string' not assignable to 'Easing'
  const variants = {
    visible: { opacity: 1, transition: { ease: "easeOut" } }
  };

  // ✅ Correct - Use 'as const'
  const variants = {
    visible: { opacity: 1, transition: { ease: "easeOut" as const } }
  };
  ```

- **Cubic bezier arrays** must use `as const` for tuple type
  ```ts
  // ❌ Wrong - Type 'number[]' not assignable
  ease: [0.22, 1, 0.36, 1]

  // ✅ Correct - Inferred as [0.22, 1, 0.36, 1]
  ease: [0.22, 1, 0.36, 1] as const
  ```

- **When property** needs literal type
  ```ts
  when: "beforeChildren" as const  // NOT just "beforeChildren"
  ```

### React Hooks with Generics
- **useInView** must specify element type when used with motion components
  ```ts
  // ❌ Wrong - Returns RefObject<HTMLElement | null>
  const { ref } = useInView({ threshold: 0.5 });

  // ✅ Correct - Returns RefObject<HTMLDivElement | null>
  const { ref } = useInView<HTMLDivElement>({ threshold: 0.5 });
  ```

- **Custom hooks returning refs** must include `null` in return type
  ```ts
  // ❌ Wrong - useRef<T>(null) returns RefObject<T | null>
  function useMyHook<T extends HTMLElement>(): React.RefObject<T> {
    return useRef<T>(null);
  }

  // ✅ Correct - Include null in return type
  function useMyHook<T extends HTMLElement>(): React.RefObject<T | null> {
    return useRef<T>(null);
  }
  ```

### GSAP & ScrollTrigger
- **trigger property** expects `gsap.DOMTarget`, use type assertion
  ```ts
  // ❌ Wrong - TweenTarget not assignable to DOMTarget
  trigger: scrollTriggerConfig?.trigger || target

  // ✅ Correct - Cast to DOMTarget
  trigger: (scrollTriggerConfig?.trigger || target) as gsap.DOMTarget
  ```

### Lenis Configuration
- Check Lenis type definitions before adding options
- `smoothTouch` does NOT exist in `LenisOptions` (removed in recent versions)
- Always use `Partial<LenisOptions>` for config objects

## Architecture Best Practices

### Design Tokens Usage
- **Always use tokens** from `@/lib/design-tokens` for spacing, colors, animations
- **Avoid magic numbers** - Replace hardcoded values progressively
- **New components MUST use tokens** - Enforce via PR checklist
  ```ts
  // ❌ Wrong - Magic numbers
  <div className="p-4" style={{ animationDuration: '0.3s' }} />

  // ✅ Correct - Use design tokens
  import { DESIGN_TOKENS } from "@/lib/design-tokens";
  <div
    className="p-4"
    style={{
      padding: DESIGN_TOKENS.spacing.md,
      animationDuration: `${DESIGN_TOKENS.animation.duration.fast}s`
    }}
  />
  ```

### Locale Routing
- **Never manually build locale paths** - Use route builder utilities
- **Scan all Links** to replace hardcoded locale prefixes
- Consider creating `LocalizedLink` wrapper to prevent misuse of `next/link`
  ```ts
  // ❌ Wrong - Manual locale prefix
  <Link href={`/${locale}/about`}>About</Link>

  // ✅ Correct - Use route builder
  import { useLocalizedHref } from "@/lib/i18n";
  const { buildHref } = useLocalizedHref();
  <Link href={buildHref("/about")}>About</Link>
  ```

### Provider Management
- **All providers MUST go through AppProviders** - Check all pages use it
- **Never add providers directly in pages** - Add to `app-providers.tsx`
- Future additions (Theme, Analytics, Toast) centralize here
- Prevents partial provider coverage bugs

### Environment Variables
- **Never use `process.env` directly** - Use typed `env.*` from `@/lib/env`
- Migrate existing `process.env` usage progressively
- Type-safe env prevents deployment bugs from missing values
  ```ts
  // ❌ Wrong - Direct process.env access
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  // ✅ Correct - Use typed env
  import { env } from "@/lib/env";
  const apiKey = env.NEXT_PUBLIC_API_KEY;
  ```

### Animation Configuration Consistency
- **animations.ts** and **animation-variants.ts** must share values
- Check `animation-variants.ts` for hardcoded durations/easing
- Progressively migrate to shared tokens to prevent drift
- Both should reference `DESIGN_TOKENS.animation.*`

### State Management Boundaries
- **Page-specific Zustand stores** belong in `src/stores/`
- Pass state via props/selectors for reusability
- Example: `about-us` nav store should be in `stores/about-nav-store.ts`
- Improves testability and prevents tight coupling

