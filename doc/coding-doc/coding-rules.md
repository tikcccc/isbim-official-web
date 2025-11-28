# Coding Rules - isBIM Official Web
Rules are terse and vibe-critical only; keep future edits short, actionable, and in this style.

**Last Updated**: 2025-11-26 | **Version**: 3.7

## Layout & Routing
- `(website)` owns providers/Topbar/Footer/PageTransition; `(studio)` stays bare (no providers/i18n).
- `src/app/layout.tsx`: fonts + globals only; keep app structure flat (no `[locale]` folders).

## i18n (FROZEN)
- **Navigation**: Always use `import { Link } from "@/lib/i18n"` - never `next/link`. Link handles locale prefixes automatically. Add `prefetch` prop for important routes.
- **Routing**: Use `useRouter/usePathname/redirect` from `@/lib/i18n`, not `next/navigation`.
- **Server utils**: Use `buildHref(path, locale)` in server components only; never handcraft `/${locale}` paths.
- Do not touch `src/lib/i18n/locale-context.tsx`, `route-builder.ts`, `index.ts`, `i18n.ts` or `src/app/layout.tsx` order.

## Env & ISR
- Read env via `env.ts` only; `NEXT_PUBLIC_MEDIA_URL`/`NEXT_PUBLIC_VIDEO_CDN_URL` drive media bases; `SANITY_WEBHOOK_SECRET` required for `/api/revalidate`.

## Media & Assets
- Videos via CDN links using `media-config` (`getVideoUrl`/`JARVIS_VIDEOS`); avoid hardcoded `/videos/*`.
- Images優先使用本地 `/public` 資源。
- 動態內容頁（Newsroom、Careers）使用 Sanity 管理資料；其他頁面不依賴 Sanity。
- `NEXT_PUBLIC_VIDEO_CDN_URL` can override video base; keep filenames consistent.
- When embedding any video, extract the first frame with `ffmpeg` as a poster (store under `public/images/post` via `ffmpeg -i <video> -frames:v 1 -q:v 2 <poster>`), set it as `poster`, and preload `metadata` for buffering fallback.

## Motion
- Import `m` from `components/motion/lazy-motion`; `AnimatePresence` only when needed. No direct `motion` imports.
- Services/Products: keep SpotlightCard + CornerBrackets for hover/spotlight; don't reinvent mousemove handlers.
- Use `TypewriterText/TypewriterWidth/TypewriterLines` from `components/animations`; about-us headings stick to `TypewriterWidth` defaults (1.5s, 40 steps, blue block cursor, ScrollTrigger once) via the shared Section; keep Services/Products hero on character-level `TypewriterText`.

## Styling & Tokens
- Design tokens live in `design-tokens.ts`; no duplicate breakpoints/z-index/colors elsewhere; reuse shared container utilities from `globals.css`.
- Tailwind v4 utilities; shimmer utility lives in `globals.css` (Services/Products hero).

## Services & Products Page
- Dark cyberpunk vibe: `bg-[#050505]`, emerald accents, `BackgroundLayers`, `ServicesGrid` -> `ServiceCard`/`SpotlightCard`/`CornerBrackets`, `CtaSection`, `FooterDark`.
- Data from `src/data/services.ts` (5 entries) only; no inline duplicates.
- Uses dedicated `layout.tsx` with `HideDefaultFooter` to suppress global white Footer; renders `FooterDark` instead.

## Sanity & SEO (FROZEN)
- Fetch with `sanityFetch` + typed queries; tag caches; no `any`; no direct `process.env`.
- Leave `sanity` libs, `seo` helpers, and ISR webhook flow untouched; keep canonical/hreflang via `seo.ts`.
- Leave `sanity` libs, `seo` helpers, and ISR webhook flow untouched.
