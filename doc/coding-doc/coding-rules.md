# Coding Rules - isBIM Official Web

**Last Updated**: 2025-11-26 | **Version**: 3.4

Write coding rules here, keep rules simple and understandable. Follow these rules when adding or modifying code.

---

## 0) Routing / Layout Groups
- `(website)` route group: owns providers (LanguageProvider/LocaleProvider/AppProviders), Topbar/Footer/PageTransition. Keep website-only code here.
- `(studio)` route group: Studio-only (NextStudio); keep layout bare (no providers, no i18n middleware).
- `src/app/layout.tsx`: fonts + globals only. Do not reintroduce providers here.

## 0.5) Framer Motion
- Use `MotionProvider` (`components/motion/lazy-motion`) and import `m` instead of `motion`. Keep `AnimatePresence` from `framer-motion` as needed.
- Do not import `framer-motion` directly in new components unless you use only `AnimatePresence`.

---

## 1) i18n (Paraglide v1 + LocaleContext)

### Architecture (FROZEN)
```
Middleware (Paraglide) + URL routing
        |
Layout (Server) + await headers() + setLanguageTag() + LocaleProvider
        |
Client Components + useLocale() / useLocalizedHref()
Server Components + buildHref(path, params.locale)
```

**Frozen Files (Do Not Modify):**
- `src/lib/i18n/locale-context.tsx` - Context + Provider + useLocale
- `src/lib/i18n/route-builder.ts` - Dual-mode routing (functions + hooks)
- `src/app/layout.tsx` - Data flow order

### Rules

**Client Components:**
```tsx
"use client";
import { useLocalizedHref } from "@/lib/i18n/index";

function MyComponent() {
  const { locale, buildHref, linkTo } = useLocalizedHref();
  return <Link href={linkTo("ABOUT")}>About</Link>;
}
```
- Use `useLocalizedHref()` hook
- Import from `@/lib/i18n/index`
- NEVER call `languageTag()` directly

**Server Components:**
```tsx
import { buildHref } from "@/lib/i18n/index";

export default function Page({ params }: { params: { locale: string } }) {
  const href = buildHref("/about", params.locale);
}
```
- Use pure functions with explicit locale
- Get locale from `params.locale` or `await headers()`

**Key Points:**
- Use Paraglide v1 APIs only: `sourceLanguageTag`, `availableLanguageTags`, `setLanguageTag`
- Do NOT use v2 APIs (`getLocale`, `locales`, `baseLocale`)
- Keep flat `app/` structure; NO `[locale]` folders
- Client hooks: `@/lib/i18n/index` | Middleware/nav: `@/lib/i18n`

---

## 2) Sanity Data Layer (FROZEN)

### Architecture
- **Environment CDN**: `useCdn: isProduction()` (read) | `useCdn: false` (write)
- **Type-safe fetch**: `sanityFetch<T>()` with Next.js cache integration
- **Tag-based revalidation**: Auto `sanity:` prefix on all tags
- **Comprehensive queries**: All use `defineQuery()` (GROQ typed)

**Frozen Files:**
- `src/sanity/lib/client.ts` - Client config
- `src/sanity/lib/fetch.ts` - `sanityFetch<T>()` + `REVALIDATE` constants
- `src/sanity/lib/queries.ts` - All GROQ queries
- `src/sanity/lib/types.ts` - TypeScript interfaces
- `src/sanity/lib/seo.ts` - Metadata generators
- `src/sanity/lib/image.ts` - `urlFor()` builder

### Usage

**Fetch with cache:**
```tsx
import { sanityFetch, buildCacheTags, REVALIDATE } from "@/sanity/lib/fetch";
import { POST_QUERY } from "@/sanity/lib/queries";
import type { Post } from "@/sanity/lib/types";

const post = await sanityFetch<Post>({
  query: POST_QUERY,
  params: { slug: "example" },
  tags: buildCacheTags("post", "example"),
  revalidate: REVALIDATE.HOUR, // 3600s
});
```

**Image optimization:**
```tsx
import { urlFor } from "@/sanity/lib/image";

const url = urlFor(image)?.width(1200).height(630).format("webp").quality(85).url();
```

**Revalidation:**
```tsx
REVALIDATE.NEVER    // false (ISR, on-demand)
REVALIDATE.MINUTE   // 60s
REVALIDATE.HOUR     // 3600s (posts/news)
REVALIDATE.DAY      // 86400s (products/careers)
```

### Type Safety
- NEVER use `any`
- Use `Image` (from `sanity`) for images
- Use `PortableTextBlock[]` for rich text
- Import: `import type { Image, Slug, PortableTextBlock } from "sanity"`

### On-Demand ISR webhook
- Endpoint: `src/app/api/revalidate/route.ts` (App Router)
- Auth: HMAC SHA-256 with `SANITY_WEBHOOK_SECRET` (set in `.env.local`, copied into Sanity webhook)
- Behavior: validates secret, reads tags from payload, calls `revalidateTag`
- Sanity Studio: create webhook on create/update/delete with URL `https://<domain>/api/revalidate` and matching secret

---

## 3) SEO Infrastructure (FROZEN)

**Core System:**
- `lib/seo.ts` - canonical + hreflang helpers (`generateHreflangAlternates`, x-default; locales: en, en-US, en-GB, zh, zh-CN, zh-HK, zh-TW)
- `components/seo/json-ld.tsx` - `JsonLd` renderer + helpers (`createOrganizationSchema`, `createProductSchema`, `createJobPostingSchema`, `createBreadcrumbSchema`)
- `sanity/lib/seo.ts` - Content-specific generators
- `app/sitemap.ts` - Dynamic sitemap from Sanity
- `app/robots.ts` - Robots.txt with Studio/API/_next/admin/json/revalidate exclusions; user-agents include Google/Bing/Baidu/Sogou/360Search + GPTBot/Google-Extended
- **Baidu**: verification meta supported in `lib/seo.ts` (set site verification value)

### Usage

**Static page with hreflang/canonical:**
```tsx
import { generateHreflangAlternates } from "@/lib/seo";

export async function generateMetadata() {
  return {
    ...generateHreflangAlternates("/about-us", "en"),
  };
}
```

**Structured data:**
```tsx
import { JsonLd, createProductSchema } from "@/components/seo/json-ld";

<JsonLd data={createProductSchema({
  name: "JARVIS Agent",
  description: "AI-powered construction management",
  brand: "isBIM",
})} />
```

**Dynamic Sanity content:**
```tsx
import { generatePostMetadata } from "@/sanity/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return generatePostMetadata(slug, "en");
}
```

**Post-deployment:** Register Baidu Webmaster, submit sitemap, add verification meta tag; verify hreflang via Google Search Console.

---

## 4) Design Tokens (Single Source of Truth)

**CRITICAL:**
- `design-tokens.ts` is the ONLY source for breakpoints, colors, spacing, etc.
- NEVER duplicate tokens in other files
- Import correctly: `BREAKPOINTS` (capitalized), not `breakpoints`

```tsx
// Correct
import { BREAKPOINTS, SPACING, Z_INDEX } from "@/lib/design-tokens";

// WRONG
import { breakpoints } from "@/lib/design-tokens";
```

**In hooks (avoid naming conflicts):**
```tsx
import { BREAKPOINTS as BREAKPOINT_VALUES } from "@/lib/design-tokens";

export const BREAKPOINTS = {
  sm: `(min-width: ${BREAKPOINT_VALUES.sm}px)`,
  // ...
} as const;
```

**Animation tokens:**
- GSAP config: `src/lib/animations.ts`
- Framer variants: `src/lib/animation-variants.ts`
- Avoid magic numbers for timing/easing/spacing/radius

---

## 5) Hooks & State

- Export via: `src/hooks/index.ts`
- Hooks: `useScrollProgress`, `useInView`, `useMediaQuery`, `useIsMobile/Tablet/Desktop/LargeDesktop`, `useSmoothScrollTo`, `useScrollToElement`, `useScrollToTop`, `useBodyScrollLock`, `useGsapAnimation`, `useGsapTimeline`, `useAutoplay`, `useLocale`, `useLocalizedHref`
- Global state: Only `src/stores/menu-store.ts` (Zustand). Add new stores only if necessary.

---

## 6) Routing & Links

- Routes: `src/lib/constants.ts`
- Client: `useLocalizedHref()` hook
- Server: `buildHref(path, locale)` pure function
- Navigation data: `src/data/navigation.ts` (accepts `buildHref` param)
- NEVER manually concatenate locale strings

---

## 7) Environment Variables

- Use `src/lib/env.ts` for validated access
- Do not read `process.env.*` directly
- Helpers: `env.*`, `sanityConfig`, `NEXT_PUBLIC_MEDIA_URL`, `isDevelopment/Production/Server/Client`
- New: `SANITY_WEBHOOK_SECRET` required for `/api/revalidate`

---

## 8) Sanity Schemas

- Location: `src/sanity/schemaTypes/`
- Active: `postType`, `productType`, `imageType`
- Placeholders: `newsType`, `careerType`, `projectType`
- SEO fields: `metaTitle` (~60 chars), `metaDescription` (~160 chars), `openGraphImage` (1200x630 rec), `keywords` (array)
- Alt text: required 10-125 chars on `product.mainImage.alt` and `imageType.alt`
- Register new schemas in `schemaTypes/index.ts`

---

## 9) Animations & Effects

- Prefer wrappers: `ScrollReveal`, GSAP hooks, Lenis hooks
- Use tokens for all timings/easing/stagger/spring
- Keep heavy animation setup in hooks/helpers (clean UI markup)

---

## 10) Styling

- Tailwind CSS v4 for utilities
- Tokens via style props if needed
- CSS placeholders (`styles/animations.css`, `styles/typography.css`) - backlog only

---

## 11) Assets & Fonts

- Fonts: `next/font/local` (Alliance)
- Assets: `public/` (images/videos/icons/fonts)
- Preload warnings: benign; set `preload: false` on rarely used weights

---

## 12) Build & TypeScript

### Common Errors

**Import case sensitivity:**
```
Error: 'breakpoints' is not exported
Fix: Use BREAKPOINTS (capitalized)
```

**TypeScript `any` types:**
```
Error: Unexpected any. Specify a different type
Fix: Use Image (from sanity) for images
     Use PortableTextBlock[] for rich text
```

### Build Checklist
```bash
cd isbim-official-web
npm run build
```
- 0 errors (warnings OK)
- Sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`
- All static pages pre-rendered

---

## 13) Dev Notes

- Console warning `"headers() should be awaited"`: Safe to ignore (Paraglide v1 + Next.js 15)
- Turbopack disabled (Sanity bundling issues); use `next dev` / `next build` (Webpack)
- Keep flat `app/` structure

---

## 14) Backlog / Placeholders

- Components: `parallax-section.tsx`, `slide-in.tsx`, `slideshow-section.tsx`
- Styles: `animations.css`, `typography.css`
- Data/CMS: `services.ts`, `newsType.ts`, `careerType.ts`, `projectType.ts`

---

## 15) Responsive Design & Mobile Optimization

### Viewport Configuration
```typescript
// app/layout.tsx
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};
```

### Container Width Guidelines
Use shared container utilities from `globals.css`; avoid scattering custom `max-w`/`w-[90%]` styles.
```css
.container-page      /* max-w-[1920px] mx-auto */
.container-content   /* w-[90%] md:w-[85%] max-w-[1800px] mx-auto */
.container-narrow    /* max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20 */
.container-wide      /* max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-24 */
```

### Height & Sizing
- Prefer `min-h-screen`, `min-h-[70vh]`, `aspect-video` utilities over inline px heights.
- Pair viewport heights with guards: `min-h-[70vh] lg:min-h-[600px]`.

### Breakpoint Usage
- Tailwind defaults (aligned with design tokens): `sm:640`, `md:768`, `lg:1024`, `xl:1280`, `2xl:1536`.
- Compose grids responsively: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`.

### Typography Scaling
- Layer responsive sizes: `text-xl sm:text-2xl lg:text-3xl`, `text-4xl md:text-5xl lg:text-6xl`.
- Avoid font sizes below 10px.

### Touch Target Size
- Aim for 44-48px targets on mobile; use `h-11 w-11` or larger for icon buttons.
- Use generous padding (`py-2 px-4`) on inputs/buttons.

### Media Optimization
- Use `next/image` (`fill` + `object-cover` preferred).
- Provide `sizes` and WebP where possible; set `playsInline/muted/autoPlay` on videos (iOS safe).
- `priority` reserved for LCP-critical media: Topbar logo, homepage CTA hero media, interactive-carousel active slide, key hero backgrounds.
- Alt text is required and meaningful (10-125 chars) on all Sanity-driven images; avoid blanks.

### Animation Performance
- Keep observers lightweight; avoid heavy scroll listeners.
- Use `will-change: transform` sparingly; drive durations/easing from design tokens.

### Mobile-Specific Optimizations
- Use visibility utilities (`hidden sm:block`, `md:hidden`) to tailor layouts.
- Stack then row: `flex-col md:flex-row`, `space-y-4 md:space-y-0 md:space-x-6`.
- Sticky/fixed actions should have mobile-friendly offsets (`bottom-4 right-4`).
- Inputs: proper types (`email`, `tel`) and comfortable heights (`h-10 sm:h-12`).

### Testing Checklist
- Viewport meta set
- Containers use shared classes (no inline width hacks)
- Tap targets ≥ 40px
- Animations use tokens (no magic numbers)
- Images: `next/image`, `sizes`, alt text present; priority only on LCP elements
- Video: `playsInline`, `muted`, `autoPlay` set when auto-playing
- Sticky/fixed elements tested on mobile and desktop
*** End Patch
