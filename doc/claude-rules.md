Below are the coding rules and conventions for this project. Follow these when adding or modifying code.

## 1) i18n (Paraglide v1 + LocaleContext)

### Architecture (Level 3 - LocaleContext Pattern)

**Data Flow (FROZEN - Do Not Modify):**
```
Middleware (Paraglide) → URL routing
        ↓
Layout (Server) → await headers() → setLanguageTag() → LocaleProvider
        ↓
Client Components → useLocale() / useLocalizedHref()
Server Components → buildHref(path, params.locale)
```

**Key Files (FROZEN):**
- `src/lib/i18n/locale-context.tsx` - Context definition (LocaleProvider, useLocale)
- `src/lib/i18n/route-builder.ts` - Dual-mode routing (pure functions + hooks)
- `src/app/layout.tsx` - Data flow: headers → setLanguageTag → Provider

### Rules for Writing Components

**Client Components (UI):**
```tsx
"use client";
import { useLocalizedHref } from "@/lib/i18n/index";

function MyComponent() {
  const { locale, buildHref, linkTo } = useLocalizedHref();
  return <Link href={linkTo("about")}>About</Link>;
}
```
- ALWAYS use `useLocalizedHref()` hook
- Import from `@/lib/i18n/index` (NOT `@/lib/i18n` server middleware file)
- NEVER call `languageTag()` directly - use `useLocale()` instead

**Server Components (Pages/SEO):**
```tsx
import { buildHref } from "@/lib/i18n/index";

export default function Page({ params }: { params: { locale: string } }) {
  const href = buildHref("/about", params.locale);
  // ...
}

export async function generateMetadata({ params }) {
  return {
    alternates: { canonical: buildHref("/products", params.locale) }
  };
}
```
- Use pure functions with explicit locale parameter
- Get locale from `params.locale` or `await headers()`

**Troubleshooting:**
- Hydration error? Check if you're mixing Client hooks in Server Components
- "useLocale must be used within LocaleProvider"? Check import path
- Console warnings about headers? Safe to ignore (Paraglide v1.x known issue)

### General i18n Rules
- Use Paraglide v1 APIs: `sourceLanguageTag`, `availableLanguageTags`, `setLanguageTag`
- Do **NOT** use v2 APIs (`getLocale`, `locales`, `baseLocale`)
- Keep flat `app/` structure; do **NOT** create `[locale]` folders
- NEVER handcraft locale prefixes like `/${locale}/path`
- Client imports: prefer `@/lib/i18n/index` for hooks/helpers; `@/lib/i18n` is reserved for middleware/navigation exports.

## 2) Design Tokens & Animations
- Central tokens: `src/lib/design-tokens.ts` (colors, spacing, radius, shadows, z-index, typography, animation duration/easing/stagger/spring).
- GSAP config: `src/lib/animations.ts` (all values from tokens). Framer variants: `src/lib/animation-variants.ts` (all values from tokens).
- New components should use tokens/variants; avoid magic numbers for timing, easing, spacing, radius.
- Lenis config must come from tokens (see `SmoothScrollProvider`).

## 3) Hooks & State
- Export hooks via `src/hooks/index.ts`.
- Use existing hooks where applicable:
  - Scroll/viewport: `useScrollProgress`, `useInView`
  - RWD: `useMediaQuery`, `useIsMobile/Tablet/Desktop/LargeDesktop`
  - Smooth scroll: `useSmoothScrollTo`, `useScrollToElement`, `useScrollToTop`
  - Body scroll lock: `useBodyScrollLock`
  - GSAP: `useGsapAnimation`, `useGsapTimeline`
  - Autoplay: `useAutoplay`
  - **i18n: `useLocale`, `useLocalizedHref`** (from `@/lib/i18n/index`)
- Global state: only `src/stores/menu-store.ts` (Zustand). Add new stores only if necessary.

## 4) Routing & Links
- Routes/constants live in `src/lib/constants.ts`.
- Locale-safe hrefs:
  - **Client Components**: Use `useLocalizedHref()` hook
  - **Server Components**: Use `buildHref(path, locale)` pure function
- Navigation data helpers in `src/data/navigation.ts` accept `buildHref` function parameter.
- NEVER manually concatenate locale strings.

## 5) Environment Variables
- Use `src/lib/env.ts` for validated access. Do not read `process.env.*` directly in app code.
- Helpers: `env.*`, `sanityConfig`, `NEXT_PUBLIC_MEDIA_URL`, `isDevelopment/Production/Server/Client`.

## 6) Sanity CMS
- Schemas under `src/sanity/schemaTypes/`. Currently only `postType` is active; `newsType`, `careerType`, `projectType` are placeholders.
- When adding schemas, register them in `schemaTypes/index.ts`.

## 7) Animations & Effects
- Prefer reusable wrappers/hooks: `ScrollReveal` (Framer + `useInView`), GSAP hooks, Lenis scroll hooks.
- For new GSAP timelines, keep UI markup clean by moving heavy animation setup into hooks/helpers.
- Use tokens for all animation timings/easing/stagger/spring.

## 8) Styling
- Tailwind CSS v4 for utilities. Tokens may be used inline via style props if needed.
- CSS placeholders (`styles/animations.css`, `styles/typography.css`) are backlog; implement only if you need custom keyframes/typography utilities.

## 9) Assets & Fonts
- Fonts loaded via `next/font/local` (Alliance). Preload warnings are benign; set `preload: false` on rarely used weights if needed.
- Assets under `public/` (images/videos/icons/fonts).

## 10) Dev/Build Notes
- Console warning "headers() should be awaited": Safe to ignore - Paraglide v1.x known issue with Next.js 15.
- Turbopack/config changes: delete `.next` and restart dev to avoid stale/ENOENT build artifacts.
- Keep the flat `app/` structure; do not reintroduce `[locale]`.

## 11) Backlog / Placeholders
- Components: `parallax-section.tsx`, `slide-in.tsx`, `slideshow-section.tsx` (not implemented).
- Styles: `animations.css`, `typography.css` (placeholder).
- Data/CMS: `services.ts`, `newsType.ts`, `careerType.ts`, `projectType.ts` (placeholder).
- These are safe to ignore unless implementing related features.

---

## Architecture Boundaries

### FROZEN (Do Not Modify)
These are architectural foundations - modifying them may break the entire i18n system:

| File | Reason |
|------|--------|
| `src/lib/i18n/locale-context.tsx` | Context definition, Provider, useLocale hook |
| `src/lib/i18n/route-builder.ts` | Dual-mode mechanism (Hook vs Function boundary) |
| `src/app/layout.tsx` data flow | `await headers()` → `setLanguageTag()` → `LocaleProvider` order |

### OPEN (Free to Modify)
These can be changed without breaking architecture:

| Area | Examples |
|------|----------|
| Layout JSX/CSS | HTML structure, Tailwind classes in layout.tsx |
| Paraglide config | Language list in `project.inlang/settings.json` |
| UI Components | Topbar, Footer, Menu visual design |
| New Pages | All page.tsx files |
| Navigation data | `src/data/navigation.ts` menu items |

---

**Last Updated**: 2025-11-24
**Rules Version**: 2.0

## Practical Examples

### Client Component - Locale-safe Links
```tsx
"use client";
import Link from "next/link";
import { useLocalizedHref } from "@/lib/i18n/index";

function Nav() {
  const { buildHref, linkTo } = useLocalizedHref();
  return (
    <>
      <Link href={linkTo("home")}>Home</Link>
      <Link href={linkTo("about")}>About</Link>
      <Link href={buildHref("/contact")}>Contact</Link>
    </>
  );
}
```

### Server Component - SEO Links
```tsx
// In page.tsx or generateMetadata
import { buildHref } from "@/lib/i18n/index";

export async function generateMetadata({ params }) {
  const locale = params.locale;
  return {
    alternates: {
      canonical: buildHref("/products", locale),
      languages: {
        en: buildHref("/products", "en"),
        zh: buildHref("/products", "zh"),
      }
    }
  };
}
```

### Locale Switcher Pattern
```tsx
"use client";
import { useLocale } from "@/lib/i18n/index";
import { useRouter, usePathname } from "@/lib/i18n";

function LocaleSwitcher() {
  const currentLocale = useLocale(); // From Context, NOT languageTag()
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale) => {
    router.push(pathname, { locale: newLocale });
  };
  // ...
}
```

### Tokens in Animations (GSAP/Framer)
```ts
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { motion } from "framer-motion";
import { gsap } from "gsap";

// Framer
const card = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DESIGN_TOKENS.animation.duration.fast,
      ease: DESIGN_TOKENS.animation.easing.easeOut,
    },
  },
};

// GSAP
gsap.to(el, {
  y: 0,
  duration: DESIGN_TOKENS.animation.duration.normal,
  ease: DESIGN_TOKENS.animation.easing.smooth,
});
```
- Avoid new magic numbers for timing/easing; use tokens.

### Sanity Schema Addition (when needed)
1) Create schema under `src/sanity/schemaTypes/yourType.ts`.
2) Export and register in `schemaTypes/index.ts`.
3) Ensure required env vars via `lib/env.ts` (use `sanityConfig`).
