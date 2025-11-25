# isBIM Official Web — Architecture (v2.2)

## Tech Stack
- Next.js 15 (App Router, Turbopack dev), TypeScript, Tailwind CSS v4
- Paraglide v1 i18n (Level 3 LocaleContext pattern) — use `sourceLanguageTag/availableLanguageTags`
- Animations: Lenis (smooth scroll), GSAP, Framer Motion
- Data/UI: TanStack Query, Zustand (only `menu-store.ts`)
- CMS: Sanity with typed queries, tag-based revalidation, environment-based CDN

## App Structure (high level)
```
src/app/
  layout.tsx            # await headers() -> setLanguageTag() -> LocaleProvider -> AppProviders
  page.tsx              # Home
  about-us/page.tsx
  services-products/page.tsx
  jarvis-*/page.tsx     # agent/pay/air/eagle-eye/ssss/dwss/cdcp/assets/jpm
  bim-consultancy/page.tsx
  project-finance/page.tsx
  venture-investments/page.tsx
  newsroom/page.tsx
  careers/page.tsx
  contact/page.tsx
  privacy/page.tsx      # minimal placeholder
  terms/page.tsx        # minimal placeholder
  cookies/page.tsx      # minimal placeholder
```

### Layout / UI
```
src/components/layout/
  topbar.tsx
  menu-overlay.tsx
  footer.tsx
  locale-switcher.tsx
  page-transition.tsx   # global transition overlay; disables browser scroll restoration and uses Lenis/window smooth scroll to top on load/after transitions
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

#### Sanity Image Content Table (current)
| Document | Field | Type | Notes | File |
|---|---|---|---|---|
| product | `mainImage` | `image` | hotspot enabled; has `alt` subfield | src/sanity/schemaTypes/productType.ts |
| imageAsset | `file` | `image` | hotspot enabled; has `alt`; standalone image entry | src/sanity/schemaTypes/imageType.ts |


### Public Assets
```
public/
  images/
  videos/
  icons/
  fonts/Alliance/*.woff2  # via next/font/local
```

## Boundaries
- **FROZEN**: `src/lib/i18n/locale-context.tsx`, `src/lib/i18n/route-builder.ts`, `src/lib/i18n/index.ts`, `src/app/layout.tsx` (await headers -> setLanguageTag -> LocaleProvider order).
- **OPEN**: layout JSX/CSS, Paraglide language list, UI components, new pages, navigation data, styles placeholders, animation placeholders, schema placeholders.

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
- **Studio isolation**: Layout detects Studio (headers `next-url`/`x-invoke-path`/`x-pathname`/`referer`) and renders bare HTML/Body only—no i18n/Paraglide, no providers, no Topbar/Footer.
- **Sanity usage in app**: Use typed queries and `sanityFetch` for all data operations; `app/page.tsx` uses `IMAGE_ASSET_BY_SLUG_QUERY` with cache tags and hourly revalidation.

## Backlog / Placeholder
- Animations: `parallax-section.tsx`, `slide-in.tsx`, `animations.css`, `typography.css`.
- Sections: `section3-placeholder.tsx` (content pending), `services.ts` data placeholder.
- Sanity: `newsType.ts`, `careerType.ts`, `projectType.ts`, `schemaTypes/index.ts` registration updates.

## Recent Changes (2025-11-25)
- Removed `suppressHydrationWarning` from layout `<html>/<body>`.
- Enforced locale-safe imports via `@/lib/i18n/index`.
- Rewired Topbar/Menu/Footer/About page links to use `buildHref`/`ROUTES`; removed hash placeholders.
- Added placeholder legal pages to match footer/menu links.
- **Foundation hardening**: Fixed `next.config.ts` Sanity CDN domain; cleaned `globals.css` (removed Geist/shadcn variables); removed duplicate `BREAKPOINTS`/`Z_INDEX` from `constants.ts`; unified design tokens as single source of truth.
- **Data layer overhaul**: Implemented typed Sanity fetch layer with environment-based CDN (`client.ts`), tag-based revalidation (`fetch.ts`), typed queries (`queries.ts`), TypeScript types (`types.ts`), and comprehensive documentation (`README.md`).
- **SEO infrastructure**: Added `lib/seo.ts` with metadata builders, `sanity/lib/seo.ts` for Sanity-driven metadata, metadata queries, and `generateMetadata()` in `app/page.tsx` with cached Open Graph images from Sanity.
- **Sitemap & Robots**: Dynamic sitemap generation (`app/sitemap.ts`) from Sanity content with multi-language support; `robots.txt` (`app/robots.ts`) with Studio exclusion and AI crawler controls.
- **Responsive Design Optimization**:
  - Added viewport configuration in `layout.tsx` for proper mobile scaling
  - Implemented centralized container system in `globals.css` (`@layer components`) with 4 utility classes: `.container-page`, `.container-content`, `.container-narrow`, `.container-wide`
  - Refactored all sections to use unified container classes, eliminating inline width definitions
  - Implemented Hero Section double-layer architecture (full-width background + constrained content)
  - Applied responsive height adjustments (viewport units instead of fixed px values)
  - Optimized touch targets (40px minimum), typography (10px minimum), and images (next/image with sizes)
  - Updated mobile-specific positioning (sticky nav, footer social icons)
  - Comprehensive responsive design guidelines documented in `claude-rules.md` Section 15
- **Menu Overlay Scrolling**: Fixed scroll conflicts with Lenis; implemented unified smooth scrolling with custom RAF-based easing (capture-phase wheel handler with ease-out animation).
