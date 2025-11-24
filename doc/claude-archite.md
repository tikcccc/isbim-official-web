# isBIM Official Web - Architecture（最新整理）

## 專案概覽
- Next.js 15（App Router，Turbopack 開發）
- TypeScript、Tailwind CSS v4
- Paraglide v1 i18n（`languageTag/sourceLanguageTag/availableLanguageTags`，平鋪 `app/`，無 `[locale]` 目錄）
- 動效：Lenis、GSAP、Framer Motion
- 狀態：TanStack Query、Zustand（僅 `menu-store.ts`）

---

## 目錄結構與模組

### 1. Pages（核心頁面）
```
src/app/
├─ layout.tsx          # async，await headers() 讀 x-language-tag，包 LanguageProvider + AppProviders
├─ page.tsx            # Home
├─ about-us/page.tsx
├─ services-products/page.tsx
├─ jarvis-*/page.tsx   # agent/pay/air/eagle-eye/ssss/dwss/cdcp/assets/jpm
├─ bim-consultancy/page.tsx
├─ project-finance/page.tsx
├─ venture-investments/page.tsx
├─ newsroom/page.tsx
├─ careers/page.tsx
└─ contact/page.tsx
```

### 2. Layout Components
```
src/components/layout/
├─ topbar.tsx
├─ menu-overlay.tsx
├─ footer.tsx
└─ locale-switcher.tsx
```

### 3. Sections
```
src/components/sections/
├─ hero-section-1.tsx
├─ cta-section.tsx
├─ feature-block.tsx
├─ product-grid.tsx
├─ statistics-section.tsx
├─ scroll-prompt.tsx
├─ narrative-section.tsx
├─ interactive-carousel.tsx
└─ (placeholder) slideshow-section.tsx
```

### 4. Animations
```
src/components/animations/
├─ scroll-reveal.tsx          # 已實作，Framer + useInView
├─ parallax-section.tsx       # placeholder
└─ slide-in.tsx               # placeholder
```

### 5. Hooks（集中 export：src/hooks/index.ts）
- 捲動/視口：`useScrollProgress`, `useInView`
- RWD：`useMediaQuery`, `useIsMobile/Tablet/Desktop/LargeDesktop`
- 平滑滾動：`useSmoothScrollTo`, `useScrollToElement`, `useScrollToTop`（Lenis fallback native）
- 鎖捲動：`useBodyScrollLock`
- GSAP 整合：`useGsapAnimation`, `useGsapTimeline`
- 自動播放：`useAutoplay`

### 6. Library / Config
```
src/lib/
├─ design-tokens.ts        # 色彩/間距/圓角/陰影/z-index/排版/動畫時序
├─ animations.ts           # GSAP 配置，引用 tokens
├─ animation-variants.ts   # Framer variants，引用 tokens
├─ constants.ts            # 路由、產品 ID、breakpoints 等
├─ env.ts                  # 型別化 env，輸出 sanityConfig/NEXT_PUBLIC_MEDIA_URL 等
└─ i18n/                   # i18n 模組 (Level 3 LocaleContext 架構)
   ├─ locale-context.tsx   # 🔒 LocaleProvider + useLocale (FROZEN)
   ├─ route-builder.ts     # 🔒 雙模式：純函數 + Hooks (FROZEN)
   └─ index.ts             # Barrel export (Client Components 用)
```

### 7. Data
```
src/data/
├─ products.ts           # 已填充
└─ services.ts           # placeholder
```

### 8. Styles
```
src/styles/
├─ animations.css  # placeholder keyframes
└─ typography.css  # placeholder typographic utilities
```

### 9. Sanity Schemas
```
src/sanity/schemaTypes/
├─ postType.ts          # 現有
├─ newsType.ts          # TODO
├─ careerType.ts        # TODO
├─ projectType.ts       # TODO
└─ index.ts             # 只導出 postType，其餘 TODO
```

### 10. Public Assets
```
public/
├─ images/
├─ videos/
├─ icons/
└─ fonts/Alliance/*.woff2  # 由 next/font/local 載入
```

---

## 設計系統與動效
- Tokens：`design-tokens.ts` 定義顏色、間距、排版、z-index、動畫時長/緩動/stagger/spring
- Animations：
  - GSAP：`lib/animations.ts`（預設與預置配置；Lenis config 亦引用 tokens）
  - Framer：`lib/animation-variants.ts`（全部數值來源於 tokens）
- 原則：新元件以 tokens/variants 為準，避免 magic number。

## i18n 流程 (Level 3 LocaleContext 架構)

### 架構概覽
```
Middleware (Paraglide) → URL routing
        ↓
Layout (Server) → await headers() → setLanguageTag() → LocaleProvider
        ↓
Client Components → useLocale() / useLocalizedHref()
Server Components → buildHref(path, params.locale)
```

### 🔒 FROZEN (不要修改)
| 檔案 | 原因 |
|------|------|
| `src/lib/i18n/locale-context.tsx` | Context 定義、Provider、useLocale hook |
| `src/lib/i18n/route-builder.ts` | 雙模式機制 (Hook vs Function 邊界) |
| `src/app/layout.tsx` 數據流 | `await headers()` → `setLanguageTag()` → `LocaleProvider` 順序 |

### 🔓 OPEN (可自由修改)
| 區域 | 範例 |
|------|------|
| Layout JSX/CSS | layout.tsx 的 HTML 結構、Tailwind classes |
| Paraglide 配置 | `project.inlang/settings.json` 語言列表 |
| UI Components | Topbar, Footer, Menu 視覺設計 |
| 新頁面 | 所有 page.tsx 檔案 |
| Navigation data | `src/data/navigation.ts` 選單項目 |

### 使用規則
- **Client Components**: 使用 `useLocalizedHref()` hook
  ```tsx
  import { useLocalizedHref } from "@/lib/i18n/index";
  const { buildHref, linkTo } = useLocalizedHref();
  ```
- **Server Components**: 使用純函數 + 明確 locale 參數
  ```tsx
  import { buildHref } from "@/lib/i18n/index";
  const href = buildHref("/about", params.locale);
  ```
- **避免**：絕不手寫 `/${locale}/path`，使用路由工具
- **Hydration 錯誤排查**：檢查是否混用 Client hooks 和 Server Components

### 已知問題
- Console 警告 `headers() should be awaited`：Paraglide v1.x 限制，可安全忽略，功能正常

## 狀態與 Provider
- 全域 store：`menu-store.ts`（Zustand）
- AppProviders：包 `QueryProvider`（TanStack Query）與 `SmoothScrollProvider`（Lenis），可透過 props 關閉

## 環境變數
- `lib/env.ts` 驗證並輸出：`env.*`、`sanityConfig`、`NEXT_PUBLIC_MEDIA_URL`、`isDevelopment/Production/Server/Client`
- 已應用於 `sanity/lib/client.ts`、`lib/media-config.ts`、`components/error-boundary.tsx`

## Backlog / Placeholder（保留以後實作）
- 動畫/段落：`parallax-section.tsx`、`slide-in.tsx`、`slideshow-section.tsx`
- 樣式：`animations.css`、`typography.css`
- 資料/CMS：`services.ts`、`newsType.ts`、`careerType.ts`、`projectType.ts`、`schemaTypes/index.ts` TODO

## 操作注意
- `headers()` 錯誤：伺服端組件需 async，先 `await headers()` 再讀取（如 x-language-tag）
- 字型 preload 警告：`next/font/local` 預設 preload，多字重未立即使用會提示；可在少用字重設 `preload: false`
- Turbopack/配置變更後，刪除 `.next` 重啟 dev 可避免舊產物 ENOENT

---

---

## 新增頁面/元件快速檢查清單
- i18n：
  - **Client Components**: 使用 `useLocalizedHref()` hook (從 `@/lib/i18n/index` 匯入)
  - **Server Components**: 使用 `buildHref(path, params.locale)` 純函數
  - 不可手寫 `/${locale}`；Server 取 headers 時 `async` + `await headers()`
- Tokens：動效/間距/圓角/顏色/排版使用 `DESIGN_TOKENS`；Framer/GSAP 優先用現有 variants/presets。
- Hooks：從 `@/hooks` barrel 匯入；平滑滾動用 `useSmoothScrollTo`；RWD 用 `useMediaQuery` 系列；動畫用 `useGsapAnimation`/`useGsapTimeline`；需要鎖捲動用 `useBodyScrollLock`；**i18n 用 `useLocale`/`useLocalizedHref`**。
- Provider：若新全域功能（Theme/Analytics），統一掛在 `AppProviders`；不要繞過。
- 環境變數：透過 `env.ts` 取得，不直接讀 `process.env`；Sanity 用 `sanityConfig`。

**Last Updated**: 2025-11-24
**Architecture Version**: 2.0
**Status**: Level 3 LocaleContext 架構穩定，零 Hydration Mismatch
