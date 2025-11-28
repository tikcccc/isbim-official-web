# isBIM Official Web Architecture (v3.7)

Architecture for this Next.js project.

## Tech Stack
- Next.js 15 (App Router, Webpack build), TypeScript, Tailwind CSS v4
- Paraglide v1 i18n (LocaleContext pattern) - use `sourceLanguageTag/availableLanguageTags`
- Animations: Lenis (smooth scroll), GSAP, Framer Motion via `MotionProvider` + `m`
- Data/UI: TanStack Query, Zustand (only `menu-store.ts`)
- CMS: Sanity with typed queries, tag-based revalidation, env-based CDN
- Media: `media-config` with optional video-only CDN override (`NEXT_PUBLIC_VIDEO_CDN_URL`)

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
- Menu overlay JARVIS AI Suite cards now deep-link to their localized product routes (uses `buildHref` + `ROUTES.JARVIS.*` on click).

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

### Services & Products Page
```
src/components/services-products/
  background-layers.tsx   # noise + tech grid + emerald glow layers
  hero-section.tsx        # dark hero with shimmer text
  services-grid.tsx       # Bento grid with staggered Framer animations
  service-card.tsx        # interactive cards (hover expand, grayscale->color)
  spotlight-card.tsx      # GPU mouse-follow spotlight wrapper
  corner-brackets.tsx     # HUD-style brackets overlay
  cta-section.tsx         # final CTA with local grid background
```
- services data: `src/data/services.ts` (5 services/products)

### Animations
```
src/components/animations/
  scroll-reveal.tsx          # Framer + useInView
  parallax-section.tsx       # placeholder
  slide-in.tsx               # placeholder
  typewriter.tsx             # TypewriterText/TypewriterWidth/TypewriterLines (GSAP + ScrollTrigger)
  index.ts                   # barrel for animations suite
```
- `TypewriterWidth` drives about-us section titles (1.5s duration, 40 steps, blue block cursor, ScrollTrigger once).

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
  env.ts                  # typed env + sanityConfig + NEXT_PUBLIC_MEDIA_URL + NEXT_PUBLIC_VIDEO_CDN_URL
  media-config.ts         # getVideoUrl/getImageUrl + JARVIS_VIDEOS + CDN helpers
  i18n/
    locale-context.tsx    # LocaleProvider + useLocale (FROZEN)
    route-builder.ts      # buildHref/linkTo/useLocalizedHref (FROZEN)
    index.ts              # Barrel export: Link/useRouter/usePathname/redirect + locale utils (FROZEN)
  i18n.ts                 # Paraglide Navigation API (Link/useRouter/redirect) - server component
```

### UI Components
```
src/components/ui/
  localized-link.tsx      # Enhanced Link wrapper with auto-prefetch (optional alternative to @/lib/i18n Link)
  ...other ui components
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
- globals.css: shared utilities + text shimmer animation (services/products hero)

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
- Media CDN: `NEXT_PUBLIC_VIDEO_CDN_URL` (video-only override) falls back to `NEXT_PUBLIC_MEDIA_URL`, else local `/videos`; use `getVideoUrl`/`JARVIS_VIDEOS`.

## Boundaries
- **FROZEN**: `src/lib/i18n/locale-context.tsx`, `src/lib/i18n/route-builder.ts`, `src/lib/i18n/index.ts`, `src/app/layout.tsx` (await headers -> setLanguageTag -> LocaleProvider order), route groups `(website)` / `(studio)` separation.
- **OPEN**: layout JSX/CSS in `(website)`, Paraglide language list, UI components, new pages, navigation data, styles placeholders, animation placeholders, schema placeholders.

## Patterns & Rules (current)
- **i18n Navigation**: Use `import { Link } from "@/lib/i18n"` for all navigation. Link component automatically handles locale prefixes and prefetching. DO NOT use `next/link` or `buildHref()` manually. For routing hooks: `useRouter/usePathname/redirect` also from `@/lib/i18n`. Server utils: `buildHref(path, locale)` / `linkTo(key, locale)`. Never handcraft `/${locale}`.
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
- **Media**: Do not hardcode `/videos/*`; use `getVideoUrl` or `JARVIS_VIDEOS` so CDN overrides work (spaces auto-encoded).
- **Services page**: Keep dark cyberpunk theme (`bg-[#050505]`, emerald accents); wrap with `BackgroundLayers`, `ServicesGrid`, `CtaSection`, and `FooterDark`; use `ServiceCard`/`SpotlightCard`/`CornerBrackets` for interactive cards and `servicesData` for content. Page has dedicated layout (`services-products/layout.tsx`) with `HideDefaultFooter` to suppress global Footer and render `FooterDark` instead.
- **About Us**: Use the shared `Section` wrapper with `TypewriterWidth` for headings; keep defaults (1.5s, 40 steps, blue cursor, ScrollTrigger once) and reuse existing reveal timelines (no bespoke GSAP per section).

## Backlog / Placeholder
- Animations: `parallax-section.tsx`, `slide-in.tsx`, `animations.css`, `typography.css`.
- Sections: `section3-placeholder.tsx` (content pending).
- Sanity: `newsType.ts`, `careerType.ts`, `projectType.ts`, `schemaTypes/index.ts` registration updates.
