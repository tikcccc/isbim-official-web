write update history here, keep simple with update time and update number

## 2025-11-26 (v3.6)
- Services & Products page rebuilt with dark cyberpunk theme (noise + grid + emerald glow), shimmer hero, GPU spotlight cards, Bento grid, expandable service details, and final CTA; new component suite (`background-layers`, `hero-section`, `services-grid`, `service-card`, `spotlight-card`, `corner-brackets`, `cta-section`) plus `servicesData` (5 entries). Build succeeded (5.92 kB page, 141 kB first load JS).

## 2025-11-26 (v3.5)
- Added optional video CDN override via `NEXT_PUBLIC_VIDEO_CDN_URL`; centralized video URLs through `media-config` (`getVideoUrl`/`JARVIS_VIDEOS`) for hero + platform media; docs refreshed (coding.md, coding-archite.md, coding-rules.md).

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
