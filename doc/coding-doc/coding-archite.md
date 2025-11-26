# isBIM Official Web Architecture (v2.4)

Architecture for this Next.js project

## Tech Stack
- Next.js 15 (App Router, Turbopack dev), TypeScript, Tailwind CSS v4
- Paraglide v1 i18n (Level 3 LocaleContext pattern) — use `sourceLanguageTag/availableLanguageTags`
- Animations: Lenis (smooth scroll), GSAP, Framer Motion
- Motion: LazyMotion via `MotionProvider` + `m` factory (Framer)
- Data/UI: TanStack Query, Zustand (only `menu-store.ts`)
- CMS: Sanity with typed queries, tag-based revalidation, environment-based CDN

## App Structure (high level)
```
src/app/
  layout.tsx                    # fonts + globals only (no providers)
  (website)/
    layout.tsx                  # await headers() -> setLanguageTag() -> LocaleProvider -> AppProviders -> Topbar/Footer
    template.tsx                # PageTransition (client) wrapper
    page.tsx                    # Home
    about-us/page.tsx
    services-products/page.tsx
    jarvis-*/page.tsx           # agent/pay/air/eagle-eye/ssss/dwss/cdcp/assets/jpm
    bim-consultancy/page.tsx
    project-finance/page.tsx
    venture-investments/page.tsx
    newsroom/page.tsx
    careers/page.tsx
    contact/page.tsx
    privacy/page.tsx            # minimal placeholder
    terms/page.tsx              # minimal placeholder
    cookies/page.tsx            # minimal placeholder
    sitemap.ts                  # dynamic sitemap
    robots.ts                   # robots with Studio exclusions
  (studio)/
    studio/[[...index]]/page.tsx  # Sanity Studio (NextStudio)
  api/
    revalidate/route.ts         # Sanity webhook -> on-demand ISR (HMAC secret)
```

### Layout / UI
```
src/components/layout/
  topbar.tsx
  menu-overlay.tsx
  footer.tsx
  newsletter-form.tsx   # lazy-loaded in footer
  locale-switcher.tsx
  page-transition.tsx   # global transition overlay; disables browser scroll restoration and uses Lenis/window smooth scroll to top on load/after transitions
  motion/lazy-motion.tsx# LazyMotion provider + `m`
```

### Sections (selected)
```
src/components/sections/
  hero-section-1.tsx
  interactive-carousel.tsx
  section3-placeholder.tsx
  section4-platform-list.tsx
  section5-cta.tsx
  scroll-prompt.tsx
```

### Animations
```
src/components/animations/
  scroll-reveal.tsx          # Framer + useInView
  parallax-section.tsx       # placeholder
  slide-in.tsx               # placeholder
```

### Hooks (barrel: src/hooks/index.ts)
- Scroll/viewport: `useScrollProgress`, `useInView`
- RWD: `useMediaQuery`, `useIsMobile/Tablet/Desktop/LargeDesktop`
- Smooth scroll: `useSmoothScrollTo`, `useScrollToElement`, `useScrollToTop` (Lenis fallback native)
- Body scroll: `useBodyScrollLock`
- GSAP: `useGsapAnimation`, `useGsapTimeline`
- Autoplay: `useAutoplay`

### Library / Config
```
src/lib/
  design-tokens.ts        # color/spacing/radius/shadows/z-index/typography/animation tokens
  animations.ts           # GSAP config from tokens
  animation-variants.ts   # Framer variants from tokens
  constants.ts            # ROUTES + IDs/breakpoints/etc.
  env.ts                  # typed env + sanityConfig + NEXT_PUBLIC_MEDIA_URL
  i18n/
    locale-context.tsx    # LocaleProvider + useLocale (FROZEN)
    route-builder.ts      # buildHref/linkTo/useLocalizedHref (FROZEN)
    index.ts              # Barrel export for client imports (FROZEN path)
```

### Data
```
src/data/
  products.ts           # product cards
  services.ts           # placeholder
  navigation.ts         # nav definitions; pass buildHref to localize
```

### Styles
```
src/styles/
  animations.css  # placeholder keyframes
  typography.css  # placeholder typography utilities
```

### SEO & ISR
```
src/lib/seo.ts                     # canonical + hreflang helpers (x-default, en/en-US/en-GB/zh/zh-CN/zh-HK/zh-TW)
src/components/seo/json-ld.tsx     # JsonLd component + helpers: Organization/Product/JobPosting/Breadcrumb schemas
src/app/(website)/robots.ts        # disallow Studio/API/_next/admin/json/revalidate; includes CN search engines and AI bots
src/app/layout.tsx                 # renders Organization schema (JsonLd)
src/app/api/revalidate/route.ts    # webhook endpoint with SANITY_WEBHOOK_SECRET for tag-based revalidation
```

### Sanity Data Layer
```
src/sanity/lib/
  client.ts            # Sanity clients (read/write) with env-based CDN
  fetch.ts             # Type-safe fetch wrapper with Next.js cache + tags
  queries.ts           # Typed GROQ queries (defineQuery)
  types.ts             # TypeScript types for all schemas
  image.ts             # Image URL builder
  index.ts             # Barrel export
  README.md            # Data layer documentation
```

### Sanity Schemas
```
src/sanity/schemaTypes/
  postType.ts          # live
  productType.ts       # Product doc with mainImage (image + hotspot + alt)
  imageType.ts         # Standalone Image doc (hotspot + alt + slug)
  newsType.ts          # TODO
  careerType.ts        # TODO
  projectType.ts       # TODO
  index.ts             # register schemas
```

#### Sanity SEO/Media Fields (current)
| Document | Field | Type | Notes | File |
|---|---|---|---|---|
| post/product | `metaTitle` | string | max ~60 chars | src/sanity/schemaTypes/postType.ts / productType.ts |
| post/product | `metaDescription` | text | max ~160 chars | src/sanity/schemaTypes/postType.ts / productType.ts |
| post/product | `openGraphImage` | image | recommended 1200x630 | src/sanity/schemaTypes/postType.ts / productType.ts |
| post/product | `keywords` | array<string> | optional list | src/sanity/schemaTypes/postType.ts / productType.ts |
| product | `mainImage.alt` | string | required 10-125 chars | src/sanity/schemaTypes/productType.ts |
| imageAsset | `alt` | string | required 10-125 chars | src/sanity/schemaTypes/imageType.ts |

### Public Assets
```
public/
  images/
  videos/
  icons/
  fonts/Alliance/*.woff2  # via next/font/local
```

## Boundaries
- **FROZEN**: `src/lib/i18n/locale-context.tsx`, `src/lib/i18n/route-builder.ts`, `src/lib/i18n/index.ts`, `src/app/layout.tsx` (await headers -> setLanguageTag -> LocaleProvider order), route groups `(website)` / `(studio)` separation.
- **OPEN**: layout JSX/CSS in `(website)`, Paraglide language list, UI components, new pages, navigation data, styles placeholders, animation placeholders, schema placeholders.

## Patterns & Rules (current)
- **i18n**: Client imports must use `@/lib/i18n/index`; do not import from `@/lib/i18n` (server middleware file). Client: `useLocalizedHref()`; Server: `buildHref(path, locale)` / `linkTo(key, locale)`. Never handcraft `/${locale}`.
- **Hydration**: Locale provided via Context from layout; `suppressHydrationWarning` removed from `<html>/<body>`.
- **Design tokens**: Single source of truth in `design-tokens.ts`; drives GSAP/Framer configs (`lib/animations.ts`, `lib/animation-variants.ts`) and hooks (`use-media-query.ts`). No duplicate breakpoints/z-index in `constants.ts`.
- **Providers**: Global providers centralized in `AppProviders`; Zustand store limited to `menu-store.ts`.
- **Env**: Use `lib/env.ts`; do not read `process.env` directly in app code.
- **Legal pages**: `/privacy`, `/terms`, `/cookies` exist as placeholders to prevent 404 in nav/footer/menu.
- **Build tooling**: Turbopack disabled due to Sanity bundle issues; scripts use Webpack (`next dev`, `next build`).
- **Sanity Client**: Use `client` (read, CDN-enabled in prod) or `writeClient` (write, CDN-bypassed) from `@/sanity/lib/client`.
- **Sanity Fetching**: Use `sanityFetch()` from `@/sanity/lib/fetch` with typed queries from `queries.ts`; supports tag-based revalidation and environment-aware caching.
- **Cache Strategy**: Tag all queries (`sanity:all`, `sanity:{type}`, `sanity:{type}:{id}`); use `REVALIDATE` constants for time-based revalidation; use `revalidateTag()` for on-demand invalidation.
- **Studio isolation**: Studio lives under `(studio)` route group; keep bare layout for Studio only.
- **Sanity usage in app**: Use typed queries and `sanityFetch` for all data operations; home uses `IMAGE_ASSET_BY_SLUG_QUERY` with cache tags and hourly revalidation.
- **Motion**: Use `MotionProvider`/`m` from `components/motion/lazy-motion` instead of direct `motion` imports; keep `AnimatePresence` named imports.
- **SEO**: Build canonical + hreflang via `generateHreflangAlternates` in `lib/seo.ts`; render structured data with `JsonLd` helpers; keep robots exclusions for Studio/API/Next assets/admin/json/revalidate.
- **ISR**: Sanity webhook hits `api/revalidate` with `SANITY_WEBHOOK_SECRET` (HMAC) and revalidates tags from payload.

## Backlog / Placeholder
- Animations: `parallax-section.tsx`, `slide-in.tsx`, `animations.css`, `typography.css`.
- Sections: `section3-placeholder.tsx` (content pending), `services.ts` data placeholder.
- Sanity: `newsType.ts`, `careerType.ts`, `projectType.ts`, `schemaTypes/index.ts` registration updates.

## Recent Changes (2025-11-26)
- Split routes into `(website)` vs `(studio)` groups; root layout now fonts/globals only; website layout owns providers + Topbar/Footer; Studio isolated to bare shell.
- Added `MotionProvider` (LazyMotion + `m`) and migrated Framer usages to the `m` factory to reduce bundle size.
- Footer newsletter form is now lazy-loaded; shared fonts moved to `src/app/fonts.ts`.
- Home page uses literal `revalidate` config (3600s) for Next.js page config parsing.
- SEO/Performance pass: added hreflang/canonical helper, JsonLd schema helpers (Org/Product/JobPosting/Breadcrumb), on-demand ISR webhook with secret, expanded Sanity SEO fields + required alt text, tightened robots.txt, and marked LCP-critical images with `priority`.
