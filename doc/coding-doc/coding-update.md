write update history here, keep simple with update time and update number

## 2025-11-26 (v3.4)
- Added hreflang/canonical helper (`generateHreflangAlternates`) and tightened robots.txt for Studio/API/_next/admin/json/revalidate plus CN search engines and AI bots.
- Introduced `JsonLd` helpers (Organization/Product/JobPosting/Breadcrumb) and render Organization schema in `app/layout.tsx`.
- Enabled on-demand ISR webhook (`/api/revalidate`) with `SANITY_WEBHOOK_SECRET`; expanded Sanity post/product schemas with SEO fields (metaTitle/metaDescription/openGraphImage/keywords) and required alt text (10-125 chars).
- Performance/UX: fixed Footer min-height to prevent CLS; marked LCP media `priority` (Topbar logo, CTA media, interactive carousel center/hero).

## 2025-11-26 (v3.3)
- Added tsconfig `baseUrl` for `@/*` aliases; clears module resolution warnings.
- Fixed Topbar logo sizing (width/height) to remove Next.js aspect ratio warning.

## 2025-11-26 (v3.2)
- Split routes into `(website)` vs `(studio)` groups; root layout now fonts/globals only; website layout owns providers + Topbar/Footer; Studio isolated to bare shell.
- Added MotionProvider (LazyMotion + `m`) and migrated Framer usages to `m`; keep `AnimatePresence` imports only.
- Footer newsletter form lazy-loaded; shared fonts moved to `src/app/fonts.ts`; home `revalidate` set to literal `3600`.
- Docs updated: coding-archite.md, coding-rules.md.
