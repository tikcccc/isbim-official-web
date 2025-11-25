# Coding Rules - isBIM Official Web

**Last Updated**: 2025-11-25 | **Version**: 3.1

Follow these rules when adding or modifying code.

---

## 1) i18n (Paraglide v1 + LocaleContext)

### Architecture (FROZEN)
```
Middleware (Paraglide) → URL routing
        ↓
Layout (Server) → await headers() → setLanguageTag() → LocaleProvider
        ↓
Client Components → useLocale() / useLocalizedHref()
Server Components → buildHref(path, params.locale)
```

**Frozen Files (Do Not Modify):**
- `src/lib/i18n/locale-context.tsx` - Context + Provider + useLocale
- `src/lib/i18n/route-builder.ts` - Dual-mode routing (functions + hooks)
- `src/app/layout.tsx` - Data flow order

### Rules

**Client Components:**
```tsx
"use client";
import { useLocalizedHref } from "@/lib/i18n/index";

function MyComponent() {
  const { locale, buildHref, linkTo } = useLocalizedHref();
  return <Link href={linkTo("ABOUT")}>About</Link>;
}
```
- ✅ Use `useLocalizedHref()` hook
- ✅ Import from `@/lib/i18n/index`
- ❌ NEVER call `languageTag()` directly

**Server Components:**
```tsx
import { buildHref } from "@/lib/i18n/index";

export default function Page({ params }: { params: { locale: string } }) {
  const href = buildHref("/about", params.locale);
}
```
- ✅ Use pure functions with explicit locale
- ✅ Get locale from `params.locale` or `await headers()`

**Key Points:**
- Use Paraglide v1 APIs only: `sourceLanguageTag`, `availableLanguageTags`, `setLanguageTag`
- ❌ Do NOT use v2 APIs (`getLocale`, `locales`, `baseLocale`)
- Keep flat `app/` structure; ❌ NO `[locale]` folders
- Client hooks: `@/lib/i18n/index` | Middleware/nav: `@/lib/i18n`

---

## 2) Sanity Data Layer (FROZEN)

### Architecture
- **Environment CDN**: `useCdn: isProduction()` (read) | `useCdn: false` (write)
- **Type-safe fetch**: `sanityFetch<T>()` with Next.js cache integration
- **Tag-based revalidation**: Auto `sanity:` prefix on all tags
- **Comprehensive queries**: All use `defineQuery()` (GROQ typed)

**Frozen Files:**
- `src/sanity/lib/client.ts` - Client config
- `src/sanity/lib/fetch.ts` - `sanityFetch<T>()` + `REVALIDATE` constants
- `src/sanity/lib/queries.ts` - All GROQ queries
- `src/sanity/lib/types.ts` - TypeScript interfaces
- `src/sanity/lib/seo.ts` - Metadata generators
- `src/sanity/lib/image.ts` - `urlFor()` builder

### Usage

**Fetch with cache:**
```tsx
import { sanityFetch, buildCacheTags, REVALIDATE } from "@/sanity/lib/fetch";
import { POST_QUERY } from "@/sanity/lib/queries";
import type { Post } from "@/sanity/lib/types";

const post = await sanityFetch<Post>({
  query: POST_QUERY,
  params: { slug: "example" },
  tags: buildCacheTags("post", "example"),
  revalidate: REVALIDATE.HOUR, // 3600s
});
```

**Image optimization:**
```tsx
import { urlFor } from "@/sanity/lib/image";

const url = urlFor(image)?.width(1200).height(630).format("webp").quality(85).url();
```

**Revalidation:**
```tsx
REVALIDATE.NEVER    // false (ISR, on-demand)
REVALIDATE.MINUTE   // 60s
REVALIDATE.HOUR     // 3600s (posts/news)
REVALIDATE.DAY      // 86400s (products/careers)
```

### Type Safety
- ❌ **NEVER use `any`**
- ✅ Use `Image` (from `sanity`) for images
- ✅ Use `PortableTextBlock[]` for rich text
- ✅ Import: `import type { Image, Slug, PortableTextBlock } from "sanity"`

---

## 3) SEO Infrastructure (FROZEN)

**Core System:**
- `lib/seo.ts` - Core metadata builders (Open Graph, Twitter, structured data)
- `sanity/lib/seo.ts` - Content-specific generators
- `app/sitemap.ts` - Dynamic sitemap from Sanity
- `app/robots.ts` - Robots.txt with Chinese search engines
- **Baidu optimizations**: `zh-CN` locale, `applicable-device`, `format-detection`

### Usage

**Static page:**
```tsx
import { generatePageMetadata, COMMON_KEYWORDS } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "About Us",
  description: "...",
  path: "/about-us",
  locale: "en",
  keywords: [...COMMON_KEYWORDS, "about"],
});
```

**Dynamic Sanity content:**
```tsx
import { generatePostMetadata } from "@/sanity/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return generatePostMetadata(slug, "en");
}
```

**Post-deployment:** Register Baidu Webmaster, submit sitemap, add verification meta tag (see `doc/baidu-seo-guide.md`)

---

## 4) Design Tokens (Single Source of Truth)

**CRITICAL:**
- ✅ `design-tokens.ts` is the ONLY source for breakpoints, colors, spacing, etc.
- ❌ NEVER duplicate tokens in other files
- ✅ Import correctly: `BREAKPOINTS` (capitalized), not `breakpoints`

```tsx
// Correct ✅
import { BREAKPOINTS, SPACING, Z_INDEX } from "@/lib/design-tokens";

// WRONG ❌
import { breakpoints } from "@/lib/design-tokens";
```

**In hooks (avoid naming conflicts):**
```tsx
import { BREAKPOINTS as BREAKPOINT_VALUES } from "@/lib/design-tokens";

export const BREAKPOINTS = {
  sm: `(min-width: ${BREAKPOINT_VALUES.sm}px)`,
  // ...
} as const;
```

**Animation tokens:**
- GSAP config: `src/lib/animations.ts`
- Framer variants: `src/lib/animation-variants.ts`
- ❌ Avoid magic numbers for timing/easing/spacing/radius

---

## 5) Hooks & State

**Export via:** `src/hooks/index.ts`

**Available hooks:**
- Scroll/viewport: `useScrollProgress`, `useInView`
- RWD: `useMediaQuery`, `useIsMobile/Tablet/Desktop/LargeDesktop`
- Smooth scroll: `useSmoothScrollTo`, `useScrollToElement`, `useScrollToTop`
- Body lock: `useBodyScrollLock`
- GSAP: `useGsapAnimation`, `useGsapTimeline`
- Autoplay: `useAutoplay`
- i18n: `useLocale`, `useLocalizedHref` (from `@/lib/i18n/index`)

**Global state:** Only `src/stores/menu-store.ts` (Zustand). Add new stores only if necessary.

---

## 6) Routing & Links

- Routes: `src/lib/constants.ts`
- **Client**: `useLocalizedHref()` hook
- **Server**: `buildHref(path, locale)` pure function
- Navigation data: `src/data/navigation.ts` (accepts `buildHref` param)
- ❌ NEVER manually concatenate locale strings

---

## 7) Environment Variables

- Use `src/lib/env.ts` for validated access
- ❌ Do not read `process.env.*` directly
- Helpers: `env.*`, `sanityConfig`, `NEXT_PUBLIC_MEDIA_URL`, `isDevelopment/Production/Server/Client`

---

## 8) Sanity Schemas

- Location: `src/sanity/schemaTypes/`
- Active: `postType`, `imageAssetType`
- Placeholders: `newsType`, `careerType`, `projectType`
- Register new schemas in `schemaTypes/index.ts`

---

## 9) Animations & Effects

- Prefer wrappers: `ScrollReveal`, GSAP hooks, Lenis hooks
- Use tokens for all timings/easing/stagger/spring
- Keep heavy animation setup in hooks/helpers (clean UI markup)

---

## 10) Styling

- **Tailwind CSS v4** for utilities
- Tokens via style props if needed
- CSS placeholders (`styles/animations.css`, `styles/typography.css`) - backlog only

---

## 11) Assets & Fonts

- Fonts: `next/font/local` (Alliance)
- Assets: `public/` (images/videos/icons/fonts)
- Preload warnings: benign; set `preload: false` on rarely used weights

---

## 12) Build & TypeScript

### Common Errors

**Import case sensitivity:**
```
Error: 'breakpoints' is not exported
Fix: Use BREAKPOINTS (capitalized)
```

**TypeScript `any` types:**
```
Error: Unexpected any. Specify a different type
Fix: Use Image (from sanity) for images
     Use PortableTextBlock[] for rich text
```

### Build Checklist
```bash
cd isbim-official-web
npm run build
```
- ✅ 0 errors (warnings OK)
- ✅ Sitemap at `/sitemap.xml`
- ✅ Robots.txt at `/robots.txt`
- ✅ All static pages pre-rendered

---

## 13) Dev Notes

- Console warning `"headers() should be awaited"`: Safe to ignore (Paraglide v1 + Next.js 15)
- **Turbopack disabled** (Sanity bundling issues); use `next dev` / `next build` (Webpack)
- Keep flat `app/` structure

---

## 14) Backlog / Placeholders

**Components:** `parallax-section.tsx`, `slide-in.tsx`, `slideshow-section.tsx`
**Styles:** `animations.css`, `typography.css`
**Data/CMS:** `services.ts`, `newsType.ts`, `careerType.ts`, `projectType.ts`

Safe to ignore unless implementing related features.

---

## Architecture Boundaries

### FROZEN (Do Not Modify)
| File | Reason |
|------|--------|
| `src/lib/i18n/locale-context.tsx` | Context, Provider, useLocale |
| `src/lib/i18n/route-builder.ts` | Dual-mode mechanism |
| `src/app/layout.tsx` data flow | headers → setLanguageTag → LocaleProvider order |
| `src/sanity/lib/client.ts` | Client config |
| `src/sanity/lib/fetch.ts` | Fetch wrapper + cache |
| `src/lib/seo.ts` | Core SEO utilities |
| `src/sanity/lib/seo.ts` | Sanity metadata generators |
| `src/app/sitemap.ts` | Dynamic sitemap |
| `src/app/robots.ts` | Robots.txt |

### OPEN (Free to Modify)
- Layout HTML/CSS structure
- Paraglide config (`project.inlang/settings.json`)
- UI components (Topbar, Footer, Menu)
- Page components (`page.tsx` files)
- Navigation data (`src/data/navigation.ts`)
- New features (non-core)

---

## Quick Reference

### Locale-safe Link (Client)
```tsx
"use client";
import { useLocalizedHref } from "@/lib/i18n/index";
import Link from "next/link";

const { linkTo, buildHref } = useLocalizedHref();
<Link href={linkTo("ABOUT")}>About</Link>
```

### SEO Metadata (Server)
```tsx
import { buildHref } from "@/lib/i18n/index";

export async function generateMetadata({ params }) {
  return {
    alternates: {
      canonical: buildHref("/products", params.locale),
      languages: {
        en: buildHref("/products", "en"),
        zh: buildHref("/products", "zh"),
      }
    }
  };
}
```

### Locale Switcher
```tsx
"use client";
import { useLocale } from "@/lib/i18n/index";
import { useRouter, usePathname } from "@/lib/i18n";

const currentLocale = useLocale(); // From Context
const router = useRouter();
const pathname = usePathname();

const switchLocale = (newLocale) => {
  router.push(pathname, { locale: newLocale });
};
```

### Animation with Tokens
```tsx
import { DESIGN_TOKENS } from "@/lib/design-tokens";

// Framer Motion
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DESIGN_TOKENS.animation.duration.fast,
      ease: DESIGN_TOKENS.animation.easing.easeOut,
    },
  },
};

// GSAP
gsap.to(el, {
  y: 0,
  duration: DESIGN_TOKENS.animation.duration.normal,
  ease: DESIGN_TOKENS.animation.easing.smooth,
});
```

---

## 15) Responsive Design & Mobile Optimization

### Viewport Configuration
```typescript
// app/layout.tsx
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // 允許用戶縮放（無障礙友好）
};
```

### Container Width Guidelines
**CRITICAL**: 使用集中式容器 utility classes（定義於 `globals.css`）

#### 可用容器類別
```css
/* globals.css @layer components */
.container-page      /* 頁面主容器: max-w-[1920px] mx-auto */
.container-content   /* 內容區塊: w-[90%] md:w-[85%] max-w-[1800px] mx-auto */
.container-narrow    /* 窄容器: max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20 */
.container-wide      /* 寬容器: max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-24 */
```

#### 使用規範
- ✅ 所有頁面主容器: `className="container-page"`
- ✅ Section/內容區塊: `className="container-content"`
- ❌ 禁止內聯寬度定義如 `w-[90%] max-w-[1800px]`
- ❌ 禁止 style 屬性寬度如 `style={{ width: "90vw", maxWidth: "1800px" }}`

```tsx
// Good ✅ - 使用集中式容器類別
<main className="container-page">
  <section className="container-content">

// Bad ❌ - 避免分散定義
<main className="w-full max-w-[1920px] mx-auto">
<section className="w-[90%] md:w-[85%] max-w-[1800px] mx-auto">
<div style={{ width: "90vw", maxWidth: "1800px" }}>
```

**優勢**: 修改容器寬度只需更新 `globals.css` 一處，全站自動同步

#### Hero Section 特殊處理
對於需要全螢幕背景（影片/圖片延伸到螢幕邊緣）的 Hero Section，使用**雙層結構**：

```tsx
// Hero Section 架構 ✅
<section className="relative w-full min-h-screen"> {/* 外層：全寬背景 */}
  <div className="absolute inset-0"> {/* 背景層：影片/圖片 */}
    <video className="w-full h-full object-cover">...</video>
  </div>

  <div className="relative z-10 container-page"> {/* 內層：限寬內容 */}
    {/* 標題與按鈕內容 */}
  </div>
</section>
```

**原理**：
- **外層** (`w-full`): 背景延伸到螢幕邊緣（支援 4K/8K 寬屏）
- **內層** (`container-page`): 內容限制在 `max-w-[1920px]` 居中顯示

### Height & Sizing
- ❌ 避免硬編碼 `px` 高度（如 `minHeight: "600px"`）
- ✅ 使用 viewport 單位或 Tailwind 類：`min-h-screen`, `min-h-[70vh]`
- ✅ 響應式高度：`min-h-[70vh] lg:min-h-[600px]`
- ✅ 使用 `aspect-*` 維持比例：`aspect-video`, `aspect-[4/3]`

```tsx
// Good ✅
className="min-h-screen lg:min-h-[120vh]"
className="min-h-[70vh] max-h-[80vh] lg:min-h-[600px] lg:max-h-[700px]"

// Bad ❌
style={{ minHeight: "600px" }}
```

### Breakpoint Usage
使用 Tailwind 斷點（來自 `design-tokens.ts`）：
- `sm: 640px` - 小平板/大手機
- `md: 768px` - 平板 (最重要)
- `lg: 1024px` - 小桌面
- `xl: 1280px` - 標準桌面
- `2xl: 1536px` - 超寬屏

**響應式 Grid 模式**:
```tsx
// 漸進式增加列數
grid-cols-1 md:grid-cols-2 lg:grid-cols-4

// Mobile 堆疊 → Desktop 分欄
grid-cols-1 lg:grid-cols-12
```

### Typography Scaling
✅ 平滑的字體大小過渡：
```tsx
text-xl sm:text-2xl lg:text-3xl
text-4xl md:text-5xl lg:text-6xl xl:text-[100px]
```

❌ 避免：
- 最小字體 < 10px（可讀性問題）
- 固定字體大小（無響應式）

### Touch Target Size
**WCAG 標準**: 最小 44×44px（iOS）或 48×48px（Android）

✅ 推薦尺寸：
```tsx
// 按鈕/圖標
h-10 w-10    // 40px (最小可接受)
h-11 w-11    // 44px (推薦)
h-12 w-12    // 48px (最佳)

// 文字鏈接
py-2 px-4    // 最小 32px 高度
```

### Media Optimization
**圖片**:
- ✅ 使用 `next/image` 而非 `<img>`
- ✅ 提供 `sizes` 屬性優化加載
- ✅ 使用 `fill` + `object-cover` 響應式容器
- ✅ 移動端優先：`priority` 或懶加載

```tsx
// Good ✅
<Image
  src={imageUrl}
  alt="Description"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover"
  priority  // 首屏圖片
/>

// Bad ❌
<img src={imageUrl} className="w-full h-full" />
```

**視頻**:
- ✅ 添加 `playsInline` (防止 iOS 全螢幕)
- ✅ 添加 `muted` (允許自動播放)
- ✅ 使用 IntersectionObserver 控制播放
- ✅ 非視窗內的視頻暫停

### Animation Performance
- ✅ 只在 `inView` 時啟動 scroll/hover 動畫
- ✅ 使用 `will-change-transform` (謹慎)
- ✅ 使用 tokens 定義時間/緩動（避免魔法數字）
- ❌ 避免每次 scroll 新建多個 tween

```tsx
// Good ✅ - 使用 design tokens
import { DESIGN_TOKENS } from "@/lib/design-tokens";

transition={{
  duration: DESIGN_TOKENS.animation.duration.fast,
  ease: DESIGN_TOKENS.animation.easing.smooth,
}}
```

### Mobile-Specific Optimizations
1. **隱藏非必要元素**:
```tsx
className="hidden sm:block"  // Desktop only
className="md:hidden"        // Mobile only
```

2. **調整布局**:
```tsx
flex-col md:flex-row        // Mobile 堆疊 → Desktop 水平
space-y-4 md:space-y-0 md:space-x-6
```

3. **Sticky 元素位置**:
```tsx
// Mobile 右下 → Desktop 左下
fixed bottom-4 right-4 md:bottom-10 md:left-10
```

4. **輸入表單**:
```tsx
type="email"    // 觸發移動端鍵盤優化
type="tel"      // 數字鍵盤
h-10 sm:h-12    // 觸摸友好高度
```

### Testing Checklist
移動端測試必查項：
- [ ] Viewport meta 配置正確
- [ ] 所有容器有 max-width 上限
- [ ] 觸摸目標 ≥ 40px
- [ ] 文字最小 10px
- [ ] 圖片使用 next/image
- [ ] 表單輸入高度 ≥ 40px
- [ ] 視頻不自動全螢幕播放
- [ ] Sticky 元素不遮擋內容

---