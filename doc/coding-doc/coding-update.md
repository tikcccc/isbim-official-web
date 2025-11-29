# isBIM 官网更新日志 (Change Log)

**文件说明:** 本文件记录 isBIM 官网的主要变更和版本历史。当完成重大功能(联系表单、SEO 系统等)、升级核心依赖(Next.js、Tailwind 等)或重构重要模块时需要更新此文件。

**更新原则:**
- 记录日期 + 简要描述 + 影响的文件
- 保持简洁,每条更新不超过 3-5 行
- 按时间倒序排列(最新的在前)
- 仅记录重大变更,避免记录小修小补

**Last Updated**: 2025-11-29

---

## 2025-11-29 (v4.0)
- **Email System**: Moved sender addresses to env vars (`EMAIL_FROM_INTERNAL`, `EMAIL_FROM_USER`); use `@resend.dev` for dev, `@isbim.com.hk` for production
- **Documentation**: Added file descriptions to all coding docs; created `coding-backup-plan.md` for service alternatives (Resend → Brevo migration guide)
- **Files**: `.env.local`, `.env.production`, `src/lib/env.ts`, `src/lib/email/send-contact-email.ts`, `doc/coding-doc/*`

## 2025-11-26 (v3.7)
- Added reusable typewriter suite in `src/components/animations/typewriter.tsx` (barrel-exported): `TypewriterText` (character-level), `TypewriterWidth` (width-based with cursor + ScrollTrigger), `TypewriterLines` (multi-line sequencing).
- Replaced about-us title animation with `TypewriterWidth` while preserving 1.5s/40-step blue cursor + ScrollTrigger timing; simplified `Section` to drop duplicate typewriter logic while keeping existing reveal animations.

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
