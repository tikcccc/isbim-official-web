# isBIM Official Web Architecture (v3.9)

**文件说明:** 本文件记录 isBIM 官网的系统架构、技术栈分层、文件结构和模块关系。当添加/移除核心依赖、修改文件夹结构、增加新架构层(认证、支付、分析)或更新环境变量结构时需要更新此文件。

**更新原则:**
- 聚焦"存在什么"和"如何连接",避免实现细节
- 保持简洁,使用列表和代码块
- 删除过时的架构信息

**Last Updated**: 2025-11-29

## Deployment Architecture
- **Deployment Target**: Huawei Cloud (华为云)
- **Architecture**: Pure frontend application with Next.js Server Actions (no separate backend)
- **Rendering**: SSG + ISR (Incremental Static Regeneration) for optimal performance
- **Serverless Compatibility**: ⚠️ Current rate limiting uses in-memory Map (not serverless-compatible); requires distributed cache (Redis) or container deployment with session affinity for multi-instance scenarios

## Tech Stack
- Next.js 15 (App Router, Webpack build), TypeScript, Tailwind CSS v4
- Paraglide v1 i18n (LocaleContext pattern) - use `sourceLanguageTag/availableLanguageTags`
- Animations: Lenis (smooth scroll), GSAP, Framer Motion via `MotionProvider` + `m`
- Data/UI: TanStack Query, Zustand (only `menu-store.ts`)
- CMS: Sanity only for dynamic content (Newsroom posts, Careers positions); other pages use local/static data
- Media: videos via CDN (`media-config` + `NEXT_PUBLIC_VIDEO_CDN_URL`/`NEXT_PUBLIC_MEDIA_URL`), images prefer local `/public` assets
- Email: Dual-provider system (Resend primary, Brevo backup) - switch via `EMAIL_PROVIDER` env var


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
  actions/
    contact-form.action.ts      # Server Action for contact form (Zod validation + rate limiting + email sending)
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
src/components/
  smooth-scroll-provider.tsx  # Lenis provider with ScrollTrigger integration; handles Edge browser image lazy-loading via multiple refresh timings (300ms, 1000ms, window load)
```
- Menu overlay JARVIS AI Suite cards now deep-link to their localized product routes (uses `buildHref` + `ROUTES.JARVIS.*` on click).
- **Lenis + ScrollTrigger**: `smooth-scroll-provider.tsx` connects Lenis scroll events to ScrollTrigger (`lenisInstance.on("scroll", ScrollTrigger.update)`) and refreshes at 300ms/1000ms/window-load to handle Edge browser's deferred image loading.

### Sections (selected)
```
src/components/sections/
  hero-section-1.tsx
  interactive-carousel.tsx
  section3-placeholder.tsx    # GSAP ScrollTrigger animation (sparse-to-dense text); uses useLayoutEffect + gsap.context pattern
  section4-platform-list.tsx
  section5-cta.tsx
  scroll-prompt.tsx
```
- **Section3**: Uses `useLayoutEffect` + `gsap.context()` for ScrollTrigger animations; `invalidateOnRefresh: true` ensures correct position calculations after layout shifts.

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

### Product Template (JARVIS Product Pages)
```
src/components/product-template/
  hero-section.tsx          # 'use client' - Sticky video hero with gradient overlays
  narrative-track.tsx       # 'use client' - 350vh scroll-driven storytelling (dark→light transition, char reveal)
  feature-section.tsx       # 'use client' - Feature showcase with Video/Details toggle, next/image
  cta-section.tsx           # 'use client' - Final CTA with gradient background
  product-page-layout.tsx   # 'use client' - Composite layout (combines Hero+Narrative+Features+CTA)
  index.ts                  # Barrel exports + ProductFeature/ProductPageLayoutProps types

src/app/(website)/jarvis-pay/
  page.tsx                  # Server Component - SEO metadata + JSON-LD Schema only
  jarvis-pay-client.tsx     # 'use client' - All m.*() translations executed client-side
  layout.tsx                # HideDefaultFooter + FooterCharcoal
```
- **Architecture Pattern**: Server Wrapper + Client Content
  - `page.tsx` (Server Component): SEO metadata + JSON-LD Schema only, NO m.*() calls except metadata generation
  - `{product}-client.tsx` (Client Component): ALL content m.*() translations executed client-side
  - Key: m.*() calls in Server Component are pre-rendered and passed as static strings → causes locale mismatch
  - Solution: All page content translations must execute in dedicated client file (e.g., `jarvis-pay-client.tsx`)
  - Advantages: (1) Single page refresh on locale switch, (2) No `dynamic = "force-dynamic"` needed, (3) Real-time locale responsiveness
- **Data Source**: Static resources only (Paraglide m.* translations), NOT Sanity CMS
- **Contrast with Dynamic Pages**: Newsroom/Careers use Server Component + Sanity + ISR pattern (different from Product Template)
- Design reference: `doc/reference-doc/pages/product-template/`
- Uses dedicated `layout.tsx` with `HideDefaultFooter` to suppress global white Footer; renders `FooterCharcoal` instead
- Responsive scroll height: 250vh mobile, 350vh desktop (via `mobileScrollHeight`/`desktopScrollHeight` props)
- SEO: Uses `SoftwareApplicationSchema` + `BreadcrumbSchema` for structured data
- Accessibility: ARIA tablist/tab/tabpanel roles + keyboard navigation for Video/Details toggle

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
- Animations: `useInViewAnimation` (reversible scroll-driven CSS class toggling)

### Library / Config
```
src/lib/
  design-tokens.ts        # color/spacing/radius/shadows/z-index/typography/animation tokens
  animations.ts           # GSAP config from tokens
  animation-variants.ts   # Framer variants from tokens
  constants.ts            # ROUTES + IDs/breakpoints/etc.
  env.ts                  # typed env + sanityConfig + getResendApiKey + getBrevoApiKey + getEmailProvider + getContactEmailTo + getEmailFromInternal + getEmailFromUser + NEXT_PUBLIC_MEDIA_URL + NEXT_PUBLIC_VIDEO_CDN_URL
  media-config.ts         # getVideoUrl/getImageUrl + JARVIS_VIDEOS + CDN helpers
  email/
    resend-client.ts      # Resend client initialization (primary)
    brevo-client.ts       # Brevo client initialization (backup)
    email-client.ts       # Unified email interface (routes to Resend/Brevo based on EMAIL_PROVIDER)
    templates.ts          # Email templates (internal notification + user confirmation, i18n)
    send-contact-email.ts # Dual email orchestration (uses email-client)
    index.ts              # Barrel export
  i18n/
    locale-context.tsx    # LocaleProvider + useLocale (FROZEN)
    route-builder.ts      # buildHref/linkTo/useLocalizedHref (FROZEN)
    index.ts              # Barrel export: Link/useRouter/usePathname/redirect + locale utils (FROZEN)
  i18n.ts                 # Paraglide Navigation API (Link/useRouter/redirect) - server component
next.config.ts            # images.qualities: [75, 85, 90, 100] for Next.js 15+ image quality validation
```

### Environment Variables
Project uses three environment file layers:

**1. `src/lib/env.ts` (TypeScript module)**
- NOT an env file - code layer for type-safe env access
- Exports helper functions: `getResendApiKey()`, `getContactEmailTo()`, `getEmailFromInternal()`, `getEmailFromUser()`
- Runtime validation in development mode
- Single source of truth for environment variable access

**2. `.env.local` (Local development)**
- Used for localhost:3000 development
- Highest priority - overrides all other env files
- NOT committed to Git (.gitignore)
- Contains development-safe values (e.g., `EMAIL_FROM_INTERNAL=isBIM Contact Form <noreply@resend.dev>`)

**3. `.env.production` (Production template)**
- Reference template for production deployment
- Committed to Git (with placeholder values)
- Not used directly - deployment platforms (Vercel) use these as reference
- Contains production values (e.g., `EMAIL_FROM_INTERNAL=isBIM Contact Form <noreply@isbim.com.hk>`)

**Email Sender Configuration:**
- Development: `@resend.dev` domain (no verification needed)
- Production: `@isbim.com.hk` domain (requires DNS verification at https://resend.com/domains)
- Variables: `EMAIL_FROM_INTERNAL` (internal notifications), `EMAIL_FROM_USER` (user confirmations)

**Email Provider Configuration:**
- Primary: Resend (default, 3000/月免费)
- Backup: Brevo (9000/月免费)
- Variables: `RESEND_API_KEY` (required), `BREVO_API_KEY` (optional), `EMAIL_PROVIDER` (resend|brevo, default: resend)

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

### Schemas
```
src/schemas/
  contact-form.schema.ts  # Zod validation schema for contact form (server-side validation)
```

### Styles
```
src/styles/
  animations.css  # placeholder keyframes
  typography.css  # placeholder typography utilities
- home-design-tokens.css      # body base, containers, section spacing, hero/footer/HUD styles (home)
- product-design-tokens.css   # product template backgrounds/gradients, containers, narrative/index animations, sheen/gradient-x/rapid-pulse
- aboutus-design-tokens.css   # about page palette + typography helpers (about-section/bg/overlay/text)
  ```
  - globals.css: imports home/product/aboutus tokens; retains custom variant + shared shimmer (services/products hero)

### SEO & ISR
```
src/lib/seo.ts                     # canonical + hreflang helpers (x-default, en/en-US/en-GB/zh/zh-CN/zh-HK/zh-TW)
src/lib/seo-generators.ts          # SEO metadata generators with hierarchical keyword system; enforces brand (isBIM) + geographic (Hong Kong) + dual identity (AI + Construction tech) on all pages
src/components/seo/json-ld.tsx     # JsonLd component + helpers: Organization/Product/JobPosting/Breadcrumb/SoftwareApplication schemas
src/app/(website)/robots.ts        # disallow Studio/API/_next/admin/json/revalidate; includes CN search engines and AI bots
src/app/layout.tsx                 # renders Organization schema (JsonLd)
src/app/api/revalidate/route.ts    # webhook endpoint with SANITY_WEBHOOK_SECRET for tag-based revalidation
```

**SEO Strategy** (Phase 1 Complete):
- **Hierarchical keywords**: 5 levels (Brand → Identity → Technology → Specific → Geographic)
- **Critical keywords** guaranteed on all pages: isBIM, Hong Kong/香港, AI technology company, Construction technology company
- **Schema.org structured data**: Organization, SoftwareApplication (for JARVIS products), Breadcrumb
- **P0 pages optimized**: Home, About Us, Services & Products, Newsroom (with metadata + schemas)
- **Sitemap**: Excludes `/jarvis-ai-suite` (redesign), lowers `/contact` priority
- **Generators**: `generateProductPageSEO()`, `generateServicePageSEO()`, `generateAboutPageSEO()`, `generateServicesPageSEO()`, `generateNewsroomPageSEO()`, `generateCareersPageSEO()`

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
  newsType.ts          # News posts (live)
  careerType.ts        # Career positions (live)
  index.ts             # register schemas
```

#### Sanity SEO/Media Fields (current)
| Document | Field | Type | Notes | File |
|---|---|---|---|---|
| news | `metaTitle` | string | max ~60 chars | src/sanity/schemaTypes/newsType.ts |
| news | `metaDescription` | text | max ~160 chars | src/sanity/schemaTypes/newsType.ts |
| news | `openGraphImage` | image | recommended 1200x630 | src/sanity/schemaTypes/newsType.ts |
| news | `keywords` | array<string> | optional list | src/sanity/schemaTypes/newsType.ts |
| career | `metaTitle` | string | max ~60 chars | src/sanity/schemaTypes/careerType.ts |
| career | `metaDescription` | text | max ~160 chars | src/sanity/schemaTypes/careerType.ts |

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
- **Content sources & Rendering Patterns**:
  - **Static Product Pages** (Jarvis Pay, etc.): Client Component pattern (ProductPageLayout), Paraglide m.* translations, no Sanity
  - **Dynamic Content Pages** (Newsroom, Careers): Server Component + Sanity CMS + ISR, use `sanityFetch()` with cache tags
  - Videos: CDN links (via `media-config`/`JARVIS_VIDEOS`)
  - Images: prefer local `/public` assets
- **Email (Contact Form)**:
  - Backend: Dual-provider system via Server Actions (`submitContactForm` in `actions/contact-form.action.ts`)
  - Providers: Resend (primary, 3000/月) + Brevo (backup, 9000/月), switch via `EMAIL_PROVIDER` env
  - Architecture: `email-client.ts` routes to `resend-client.ts`/`brevo-client.ts` based on config
  - Dual emails: Internal notification (English, to `CONTACT_EMAIL_TO`) + User confirmation (i18n: en/zh)
  - Rate limiting: 3 submissions per IP per 5 minutes (in-memory Map)
    - ⚠️ **Serverless limitation**: Not compatible with multi-instance serverless
    - **Deployment options**: Single-instance container | Distributed cache (Redis) | Remove rate limiting
  - Validation: Zod schema (`contact-form.schema.ts`) with server-side enforcement
  - Templates: HTML + plain text, responsive, provider-agnostic
  - Environment: `RESEND_API_KEY`/`BREVO_API_KEY`, `EMAIL_PROVIDER` (default: resend), `CONTACT_EMAIL_TO` (default: solution@isbim.com.hk)
  - Error handling: User-friendly localized messages, logs provider used
  - Both providers are serverless-compatible (stateless HTTP)
- **i18n Navigation**:
  - Standard: `import { Link } from "@/lib/i18n"` with `prefetch` prop
  - Advanced: `import { LocalizedLink } from "@/components/ui/localized-link"` with `prefetchMode="hover|viewport|idle|auto|off"`
  - DO NOT use `next/link` or `buildHref()` manually
  - Routing hooks: `useRouter/usePathname/redirect` from `@/lib/i18n`
  - Server utils: `buildHref(path, locale)` / `linkTo(key, locale)`
  - Never handcraft `/${locale}` paths
  - See [navigation-prefetch-guide.md](./navigation-prefetch-guide.md) for detailed strategy
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
- **SEO Metadata**: Use generators from `seo-generators.ts` (`generateProductPageSEO`, `generateServicePageSEO`, etc.) for all pages; generators enforce critical keywords (isBIM + Hong Kong/香港 + AI/Construction tech dual identity) automatically. Build canonical + hreflang via `generateHreflangAlternates` in `lib/seo.ts`.
- **SEO Schemas**: Use helpers from `json-ld.tsx` (`createOrganizationSchema`, `createSoftwareApplicationSchema`, `createBreadcrumbSchema`) and render with `<JsonLd data={schema} id="unique-id" />`. Organization schema for company pages, SoftwareApplication for JARVIS products, Breadcrumb for navigation hierarchy.
- **SEO Sitemap**: Exclude `/jarvis-ai-suite` (redesign) and lower `/contact` priority; keep robots exclusions for Studio/API/Next assets/admin/json/revalidate.
- **ISR**: Sanity webhook hits `api/revalidate` with `SANITY_WEBHOOK_SECRET` (HMAC) and revalidates tags from payload.
- **Media**: Do not hardcode `/videos/*`; use `getVideoUrl` or `JARVIS_VIDEOS` so CDN overrides work (spaces auto-encoded).
- **Services page**: Keep dark cyberpunk theme (`bg-[#050505]`, emerald accents); wrap with `BackgroundLayers`, `ServicesGrid`, `CtaSection`, and `FooterDark`; use `ServiceCard`/`SpotlightCard`/`CornerBrackets` for interactive cards and `servicesData` for content. Page has dedicated layout (`services-products/layout.tsx`) with `HideDefaultFooter` to suppress global Footer and render `FooterDark` instead.
- **About Us**: Use the shared `Section` wrapper with `TypewriterWidth` for headings; keep defaults (1.5s, 40 steps, blue cursor, ScrollTrigger once) and reuse existing reveal timelines (no bespoke GSAP per section).

### Product Template - updated guardrails (2025-02)
- Server wrapper (`page.tsx`): only `generateMetadata` may call `m.*()`. JSON-LD text should use static strings; build URLs with `getSiteUrl()` + `buildHref()` (no hand-crafted `/${locale}`).
- Client content (`{product}-client.tsx`): all translations and layout props live here. Do not pass server-rendered `m.*()` strings down.
- Media: use `getVideoUrl`/`JARVIS_VIDEOS` (and feature-specific helpers) instead of hardcoded `/videos/...` so CDN overrides and URL encoding work.
- Links/CTA: use `Link` or `LocalizedLink` from `@/lib/i18n`; avoid `next/link` to keep locale prefix/prefetch consistent across product pages.

## Backlog / Placeholder
- Animations: `parallax-section.tsx`, `slide-in.tsx`, `animations.css`, `typography.css`.
- Sections: `section3-placeholder.tsx` (content pending).
- Sanity: `newsType.ts`, `careerType.ts`, `projectType.ts`, `schemaTypes/index.ts` registration updates.
