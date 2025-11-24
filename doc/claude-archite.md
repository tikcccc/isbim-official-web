# isBIM Official Web — Architecture (v2.1)

## Tech Stack
- Next.js 15 (App Router, Turbopack dev), TypeScript, Tailwind CSS v4
- Paraglide v1 i18n (Level 3 LocaleContext pattern) — use `sourceLanguageTag/availableLanguageTags`
- Animations: Lenis (smooth scroll), GSAP, Framer Motion
- Data/UI: TanStack Query, Zustand (only `menu-store.ts`)

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

### Sanity Schemas
```
src/sanity/schemaTypes/
  postType.ts          # live
  newsType.ts          # TODO
  careerType.ts        # TODO
  projectType.ts       # TODO
  index.ts             # register schemas (currently only postType)
```

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
- **Design tokens**: Use tokens from `design-tokens.ts` for spacing/color/animation; avoid magic numbers; GSAP/Framer configs live in `lib/animations.ts` and `lib/animation-variants.ts`.
- **Providers**: Global providers centralized in `AppProviders`; Zustand store limited to `menu-store.ts`.
- **Env**: Use `lib/env.ts`; do not read `process.env` directly in app code.
- **Legal pages**: `/privacy`, `/terms`, `/cookies` exist as placeholders to prevent 404 in nav/footer/menu.

## Backlog / Placeholder
- Animations: `parallax-section.tsx`, `slide-in.tsx`, `animations.css`, `typography.css`.
- Sections: `section3-placeholder.tsx` (content pending), `services.ts` data placeholder.
- Sanity: `newsType.ts`, `careerType.ts`, `projectType.ts`, `schemaTypes/index.ts` registration updates.

## Recent Changes (2025-11-25)
- Removed `suppressHydrationWarning` from layout `<html>/<body>`.
- Enforced locale-safe imports via `@/lib/i18n/index`.
- Rewired Topbar/Menu/Footer/About page links to use `buildHref`/`ROUTES`; removed hash placeholders.
- Added placeholder legal pages to match footer/menu links.
