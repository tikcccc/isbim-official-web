# Claude Reminders - isBIM Official Web (Updated 2025-11-26)

wirte item need to remind here , record the problem you fix and solution. keep simple

## CDN Migration (2025-11-26)
**Phase 1 Completed**: Switched from Mainland China CDN to Hong Kong CDN
- **Old**: `https://posix-jarvis-cn.obs.cn-south-1.myhuaweicloud.com/share/resource/video`
- **New**: `https://posix-jarvis-hk.obs.ap-southeast-1.myhuaweicloud.com/jarvis/share/video`
- **Reason**: Better international reach; Hong Kong node (ap-southeast-1) serves all regions
- **Files Updated**: `.env.local`, `.env.production` (created), `coding-archite.md`
- **Compatibility**: Existing `media-config.ts` fully compatible (no changes needed)

**Phase 2 Pending**: Smart geo-based CDN switching (mainland CN vs HK)
- **Trigger**: After deployment platform is confirmed (Vercel / Huawei Cloud HK / other)
- **Options**:
  - If Vercel: Use Edge Runtime + `x-vercel-ip-country` header (server-side detection)
  - If Huawei Cloud: Use client-side language detection (`zh-CN` → CN CDN, others → HK CDN) + optional Cloudflare Trace API
- **Implementation**: Add `lib/geo-detector.ts`, `hooks/use-geo-cdn.ts`, update `media-config.ts` for dynamic CDN selection
- **Fallback**: Default to Hong Kong CDN (international priority)

## SEO/Performance follow-ups (2025-11-26)
- Set `SANITY_WEBHOOK_SECRET` in `.env.local` and configure the Sanity webhook (create/update/delete -> `/api/revalidate`) with the same secret; confirm revalidate 200 OK.
- Add Baidu site verification value in `lib/seo.ts` and verify in Baidu Webmaster.
- Populate Sanity SEO fields (metaTitle/metaDescription/openGraphImage/keywords) and alt text (10-125 chars) for posts/products/images; no empty alt values.
- Choose OG image generation path (Sanity URL builder or `app/og/route.tsx`) and wire previews.
- Add Product/JobPosting `JsonLd` schemas on relevant pages.
- Submit sitemap to Google Search Console + Baidu; run Rich Results Test and PageSpeed (CLS/LCP) checks.
- Monitor webhook logs when publishing Sanity content.

## i18n (Paraglide) Essentials
- Paraglide Next v0.8.1 + Paraglide JS v1.x (use `availableLanguageTags`, `sourceLanguageTag`, `languageTag`; NOT v2 APIs).
- Flat `app/` (no `[locale]` folder). PrefixStrategy middleware handles `/en` `/zh`.
- Client hooks/helpers import path: `@/lib/i18n/index` (NOT `@/lib/i18n`, which is middleware).
- Middleware/nav exports (`Link`, `useRouter`, `usePathname`) come from `@/lib/i18n`.
- LocaleContext (Level 3) provides locale from `layout.tsx` → `LocaleProvider`; hydration warnings solved. `suppressHydrationWarning` removed.

## Key Files
- `src/lib/i18n.ts` — Strategy, Middleware, Navigation (server).
- `src/lib/i18n/index.ts` — Client barrel (`useLocalizedHref`, `useLocale`, `buildHref`, `linkTo`, `hasLocalePrefix`).
- `src/lib/i18n/locale-context.tsx` — LocaleProvider + `useLocale` (FROZEN).
- `src/lib/i18n/route-builder.ts` — `buildHref/linkTo/useLocalizedHref` (FROZEN, `"use client"`).
- `src/app/layout.tsx` — `await headers()` → `setLanguageTag()` → `LocaleProvider` → `AppProviders` order (FROZEN).
- `src/middleware.ts` — re-exports middleware.

## Usage Patterns
**Client Components (hooks from `@/lib/i18n/index`):**
```tsx
"use client";
import { useLocalizedHref, useLocale } from "@/lib/i18n/index";

const { locale, buildHref, linkTo } = useLocalizedHref();
// <Link href={linkTo("ABOUT")}>...</Link>
```

**Server Components (pure functions from `@/lib/i18n/index`):**
```tsx
import { buildHref, linkTo } from "@/lib/i18n/index";
const href = buildHref("/about-us", params.locale);
```

**Navigation / Router:**
- `Link`, `useRouter`, `usePathname` from `@/lib/i18n` (middleware exports).
- Router example: `router.push(pathname, { locale: newLocale })`.

**Locale Switcher (client):**
```tsx
"use client";
import { useLocale } from "@/lib/i18n/index";
import { useRouter, usePathname } from "@/lib/i18n"; // middleware
```

## Troubleshooting
- Console warning `"headers() should be awaited"`: Paraglide v1 internal issue; harmless. We already await in layout.
- Hydration mismatch: ensure components using `useLocale`/`useLocalizedHref` are client; server uses pure `buildHref`.
- Import errors: client hooks must come from `@/lib/i18n/index`; middleware/nav from `@/lib/i18n`.
- Build errors with Turbopack + Sanity: currently disabled; use Webpack (`next dev`, `next build`). Re-enable Turbopack only if Sanity chunks are fixed.

## Common Pitfalls
- Hardcoded `/${locale}` → replace with `buildHref`/`linkTo`/`useLocalizedHref`.
- Calling `languageTag()` in server components → use `params.locale` + pure `buildHref`; only call in client.
- Missing providers → all global providers go through `AppProviders`.
- Direct `process.env` → use `lib/env.ts`.

## Type/Animation Notes
- Framer easing tuples use `as const`; `when: "beforeChildren" as const`.
- GSAP `trigger` typed as `gsap.DOMTarget`.
- Lenis options: use `Partial<LenisOptions>`; `smoothTouch` not available.
- Prefer tokens from `src/lib/design-tokens.ts` for spacing/color/animation; avoid magic numbers; variants in `lib/animation-variants.ts` and `lib/animations.ts`.

## Quick Checklist
- Links/CTA use `buildHref/linkTo` (locale-safe), not `#` placeholders.
- Client imports from `@/lib/i18n/index`; middleware/nav from `@/lib/i18n`.
- Layout keeps `await headers()` + `setLanguageTag()` + `LocaleProvider`.
- Legal links map to existing placeholders: `/privacy`, `/terms`, `/cookies`.

---
### Type Safety
- **NEVER use `any`** — Use `Image` (from `sanity`) for image fields, `PortableTextBlock[]` for rich text.
- Import types: `import type { Image, Slug, PortableTextBlock } from "sanity"`.
- All metadata query results must be typed inline or use interfaces from `types.ts`.

## Build & TypeScript

### Common Errors
**Import case sensitivity:**
- Build error: `'breakpoints' is not exported` → Use `BREAKPOINTS` (capitalized).
- Solution: Check `design-tokens.ts` export names match import names exactly.

**TypeScript `any` types:**
- Build error: `Unexpected any. Specify a different type` → Use proper Sanity types.
- For images: `Image` (from `sanity`)
- For rich text: `PortableTextBlock[]` (from `sanity`)
- Never use `any` in production code.

### Build Checklist
```bash
cd isbim-official-web
npm run build
```
- ✅ Must compile with 0 errors (warnings OK).
- ✅ Sitemap generates at `/sitemap.xml`.
- ✅ Robots.txt at `/robots.txt`.
- ✅ All static pages pre-rendered.

---
