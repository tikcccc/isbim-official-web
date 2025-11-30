# Coding Rules - isBIM Official Web

**文件说明:** 本文件定义代码风格规则、命名约定、反模式和最佳实践。当建立新的编码模式(动画时序、组件结构)、定义新库的导入/导出规则、添加 TypeScript 类型安全要求或设置动画协调规则时需要更新此文件。

**更新原则:**
- 使用简洁的要点和代码片段,避免长篇解释
- 规则简明扼要,关键时刻使用
- 删除已过时或不再适用的规则

**Last Updated**: 2025-11-29 | **Version**: 3.9

## Layout & Routing
- `(website)` owns providers/Topbar/Footer/PageTransition; `(studio)` stays bare (no providers/i18n).
- `src/app/layout.tsx`: fonts + globals only; keep app structure flat (no `[locale]` folders).

## i18n (FROZEN)
- **Navigation**: Always use `import { Link } from "@/lib/i18n"` - never `next/link`. Link handles locale prefixes automatically. Add `prefetch` prop for important routes.
- **CTAs/Client links**: Prefer `LocalizedLink` from `@/components/ui/localized-link` for buttons/CTA links (use `prefetchMode="hover"` for primary actions); keep using `Link` from `@/lib/i18n` in simple cases.
- **Routing**: Use `useRouter/usePathname/redirect` from `@/lib/i18n`, not `next/navigation`.
- **Server utils**: Use `buildHref(path, locale)` in server components only; never handcraft `/${locale}` paths.
- Do not touch `src/lib/i18n/locale-context.tsx`, `route-builder.ts`, `index.ts`, `i18n.ts` or `src/app/layout.tsx` order.

## Env & ISR
- Read env via `env.ts` only; `NEXT_PUBLIC_MEDIA_URL`/`NEXT_PUBLIC_VIDEO_CDN_URL` drive media bases; `SANITY_WEBHOOK_SECRET` required for `/api/revalidate`.
- Contact form email: `RESEND_API_KEY` (required), `CONTACT_EMAIL_TO` (default: solution@isbim.com.hk).
- Email sender addresses: `EMAIL_FROM_INTERNAL` (internal notifications), `EMAIL_FROM_USER` (user confirmations).
  - Development (`.env.local`): Use `@resend.dev` domain (no verification needed)
  - Production (`.env.production`): Use `@isbim.com.hk` domain (requires DNS verification at https://resend.com/domains)
  - Access via `getEmailFromInternal()` and `getEmailFromUser()` from `@/lib/env`
- Environment file hierarchy: `.env.local` (dev, highest priority, not committed) > `.env.production` (template, committed) > `src/lib/env.ts` (code layer, type-safe access)

## Media & Assets
- Videos via CDN links using `media-config` (`getVideoUrl`/`JARVIS_VIDEOS`); avoid hardcoded `/videos/*`.
- Images優先使用本地 `/public` 資源。
- 動態內容頁（Newsroom、Careers）使用 Sanity 管理資料；其他頁面不依賴 Sanity。
- `NEXT_PUBLIC_VIDEO_CDN_URL` can override video base; keep filenames consistent.
- When embedding any video, extract the first frame with `ffmpeg` as a poster (store under `public/images/post` via `ffmpeg -i <video> -frames:v 1 -q:v 2 <poster>`), set it as `poster`, and preload `metadata` for buffering fallback.
- **Next.js Images**: Declare all quality values in `next.config.ts` `images.qualities` array (currently: [75, 85, 90, 100]) to avoid warnings in Next.js 15+ and prepare for Next.js 16 requirement.

## Motion & GSAP
- Import `m` from `components/motion/lazy-motion`; `AnimatePresence` only when needed. No direct `motion` imports.
- Services/Products: keep SpotlightCard + CornerBrackets for hover/spotlight; don't reinvent mousemove handlers.
- Use `TypewriterText/TypewriterWidth/TypewriterLines` from `components/animations`; about-us headings stick to `TypewriterWidth` defaults (1.5s, 40 steps, blue block cursor, ScrollTrigger once) via the shared Section; keep Services/Products hero on character-level `TypewriterText`.
- **ScrollTrigger Components**: Use `useLayoutEffect` (not `useEffect`) + `gsap.context()` wrapper; cleanup with `ctx.revert()`; add `invalidateOnRefresh: true` to ScrollTrigger config for layout-shift resilience.
- **Lenis Integration**: `smooth-scroll-provider.tsx` connects Lenis to ScrollTrigger via `lenisInstance.on("scroll", ScrollTrigger.update)` and handles Edge browser image lazy-loading with staggered refresh (300ms/1000ms/window-load). Do not modify this integration.

## Styling & Tokens
- Design tokens live in `design-tokens.ts`; no duplicate breakpoints/z-index/colors elsewhere; reuse shared container utilities from `globals.css`.
- Tailwind v4 utilities; shimmer utility lives in `globals.css` (Services/Products hero).

## Services & Products Page
- Dark cyberpunk vibe: `bg-[#050505]`, emerald accents, `BackgroundLayers`, `ServicesGrid` -> `ServiceCard`/`SpotlightCard`/`CornerBrackets`, `CtaSection`, `FooterDark`.
- Data from `src/data/services.ts` (5 entries) only; no inline duplicates.
- Uses dedicated `layout.tsx` with `HideDefaultFooter` to suppress global white Footer; renders `FooterDark` instead.

## Product Template (JARVIS Product Pages)
- Palantir-inspired design: sticky video hero, scroll-driven narrative, feature sections with Video/Details toggle.
- Components: `HeroSection`, `NarrativeTrack`, `FeatureSection`, `ProductCTASection`, `ProductPageLayout` (composite).
- **Layout**: Use dedicated `layout.tsx` with `HideDefaultFooter` + `FooterDark` (same pattern as services-products).
- **NarrativeTrack**: Responsive scroll height via `mobileScrollHeight` (250vh) / `desktopScrollHeight` (350vh) props. Uses `data-text` + `::before` pseudo-element for gradient text overlay.
- **FeatureSection**: Uses `next/image` with fill+sizes for optimized images. ARIA tablist/tab/tabpanel roles + keyboard navigation (ArrowLeft/ArrowRight) for accessibility.
- **SEO**: Add `SoftwareApplicationSchema` + `BreadcrumbSchema` via `<JsonLd>` for each product page.
- **Animation hooks**: Use `useInViewAnimation` for reversible scroll-driven CSS class toggling.
- **CSS utilities**: `.product-section`, `.product-char`, `.product-block-anim`, `.product-stage2-text` in `globals.css`.

## Sanity & SEO
- **Sanity**: Fetch with `sanityFetch` + typed queries; tag caches; no `any`; no direct `process.env`. Registered schemas: `newsType`, `careerType` only. Dynamic content pages (Newsroom, Careers) use Sanity; other pages stay static/CDN.
- **SEO Metadata**: Use generators from `seo-generators.ts` for all pages:
  - Products: `generateProductPageSEO(productKey, title, desc, locale)`
  - Services: `generateServicePageSEO(serviceKey, title, desc, locale)`
  - About: `generateAboutPageSEO(locale)`
  - Services overview: `generateServicesPageSEO(locale)`
  - Newsroom: `generateNewsroomPageSEO(locale)`
  - Careers: `generateCareersPageSEO(locale)`
- **Critical keywords**: All pages MUST include isBIM + Hong Kong/香港 + dual identity (AI + Construction tech). Generators enforce this automatically via `composeKeywords()`.
- **Structured data**: Use helpers from `json-ld.tsx`:
  - Organization: `createOrganizationSchema()` (company info)
  - Software: `createSoftwareApplicationSchema()` (JARVIS products)
  - Breadcrumb: `createBreadcrumbSchema()` (navigation)
  - Render with `<JsonLd data={schema} id="unique-id" />`
- **Sitemap**: Keep exclusions (`/jarvis-ai-suite` redesign, `/contact` low priority). Leave canonical/hreflang helpers and ISR webhook flow untouched.

## Contact Form Email (Dual Provider: Resend + Brevo)
- **Architecture**: Use Server Action `submitContactForm` from `actions/contact-form.action.ts`; never call email APIs directly from client.
- **Provider Selection**: Switch via `EMAIL_PROVIDER` env var (`resend` [default] | `brevo`); routing handled by `sendEmail()` from `lib/email/email-client.ts`.
- **Dual emails**: Internal (English, to `getContactEmailTo()`) + User confirmation (i18n based on locale).
- **Sender addresses**: Use `getEmailFromInternal()` and `getEmailFromUser()` from `@/lib/env`; never hardcode sender addresses.
- **Rate limiting**: 3 submissions/IP/5min (in-memory Map); WARNING: NOT serverless-compatible (use Redis for distributed deployment).
- **Validation**: `contactFormSchema` from `schemas/contact-form.schema.ts`; enforce server-side.
- **Templates**: `lib/email/templates.ts`; HTML + plain text, responsive, inline CSS.
- **Env variables**:
  - `EMAIL_PROVIDER`: `resend` (default) | `brevo` - controls which provider to use
  - `RESEND_API_KEY`: Required if using Resend
  - `BREVO_API_KEY`: Required if using Brevo
  - `CONTACT_EMAIL_TO`: Optional (defaults to solution@isbim.com.hk)
  - `EMAIL_FROM_INTERNAL`/`EMAIL_FROM_USER`: Optional (defaults to `@resend.dev` for dev, `@isbim.com.hk` for production)
- **Provider details**:
  - Resend: 3000 emails/month free, requires domain verification for production
  - Brevo: 9000 emails/month free, optional domain verification
