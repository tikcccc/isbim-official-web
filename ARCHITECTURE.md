# isBIM Official Website - Architecture Summary

## 📋 Project Overview

本文檔記錄了isBIM官方網站的完整文件架構。此階段重點是**創建架構骨架**，所有文件均包含詳細註釋說明用途，但尚未實現具體代碼。

## 🗂️ 完整文件清單

### 1. **Pages (頁面路由)**  - 共18個頁面
```
src/app/[locale]/
├── page.tsx                    # Home頁（已有基本實現）
├── about-us/page.tsx           # 關於我們
├── services-products/page.tsx  # 服務與產品總覽
├── jarvis-ai-suite/page.tsx    # JARVIS AI Suite總覽
├── jarvis-agent/page.tsx       # JARVIS Agent詳情
├── jarvis-pay/page.tsx         # JARVIS Pay詳情
├── jarvis-air/page.tsx         # JARVIS Air詳情
├── jarvis-eagle-eye/page.tsx   # JARVIS Eagle Eye詳情
├── jarvis-ssss/page.tsx        # JARVIS SSSS詳情
├── jarvis-dwss/page.tsx        # JARVIS DWSS詳情
├── jarvis-cdcp/page.tsx        # JARVIS CDCP詳情
├── jarvis-assets/page.tsx      # JARVIS Assets詳情
├── jarvis-jpm/page.tsx         # JARVIS Project Management
├── bim-consultancy/page.tsx    # BIM咨詢服務
├── project-finance/page.tsx    # 項目融資
├── venture-investments/page.tsx # 風險投資
├── newsroom/page.tsx           # 新聞中心
├── careers/page.tsx            # 招聘頁面
└── contact/page.tsx            # 聯繫我們
```

### 2. **Layout Components (佈局組件)** - 共4個
```
src/components/layout/
├── header.tsx          # 全局導航欄（Logo + Navigation + LocaleSwitcher）
├── footer.tsx          # 全局Footer（快捷鏈接、社交媒體、版權信息）
├── navigation.tsx      # 主導航菜單（桌面端下拉菜單、移動端漢堡菜單）
└── locale-switcher.tsx # 語言切換器（EN/ZH）
```

### 3. **Section Components (頁面區塊組件)** - 共10個
```
src/components/sections/
├── hero-section.tsx       # Hero標題區塊（標題+副標題+背景）
├── cta-section.tsx        # 行動呼籲區塊（激勵文字+按鈕）
├── feature-block.tsx      # 功能特性區塊（標題+描述+圖標）
├── product-card.tsx       # 產品卡片（單個產品展示）
├── product-grid.tsx       # 產品網格（多個產品卡片佈局）
├── quotation-section.tsx  # 引用/宣言區塊（斜體大字）
├── statistics-section.tsx # 統計數字區塊（count-up動畫）
├── scroll-prompt.tsx      # 滾動提示（"Scroll to Explore"）
├── narrative-section.tsx  # 敘事內容區塊（長文本）
└── slideshow-section.tsx  # 輪播圖區塊（自動/手動切換）
```

### 4. **Animation Components (動畫組件)** - 共4個
```
src/components/animations/
├── fade-in.tsx         # 淡入動畫包裝器（Framer Motion）
├── slide-in.tsx        # 滑入動畫包裝器（四個方向）
├── scroll-reveal.tsx   # 滾動觸發動畫（useInView + Framer Motion）
└── parallax-section.tsx # 視差滾動效果（GSAP ScrollTrigger）
```

### 5. **Custom Hooks (自定義Hooks)** - 共4個
```
src/hooks/
├── use-scroll-progress.ts  # 追蹤滾動進度（0-1百分比）
├── use-in-view.ts          # Intersection Observer封裝
├── use-media-query.ts      # 響應式斷點檢測
└── use-smooth-scroll-to.ts # 編程式平滑滾動（配合Lenis）
```

### 6. **Library Utilities (工具庫)** - 共4個
```
src/lib/
├── utils.ts       # cn() utility（已有，Shadcn）
├── constants.ts   # 全站常量（路由、產品ID、斷點等）
├── types.ts       # TypeScript類型定義（已完成）
└── animations.ts  # 動畫配置預設（Framer Motion variants、GSAP config）
```

### 7. **Data Files (靜態數據)** - 共3個
```
src/data/
├── products.ts    # JARVIS產品數據（8個產品）
├── services.ts    # 服務數據（4個服務）
└── navigation.ts  # 導航菜單結構（多級菜單）
```

### 8. **CSS Utilities (樣式文件)** - 共2個
```
src/styles/
├── animations.css  # 自定義CSS動畫keyframes（fadeIn, bounce等）
└── typography.css  # 自定義排版樣式（hero-title, quote等）
```

### 9. **Sanity CMS Schemas (內容管理Schema)** - 共3個新增
```
src/sanity/schemaTypes/
├── postType.ts     # 文章schema（已有）
├── newsType.ts     # 新聞schema（新增）
├── careerType.ts   # 職位schema（新增）
└── projectType.ts  # 項目案例schema（新增）
```

### 10. **Public Assets (靜態資源目錄)**
```
public/
├── images/
│   ├── products/   # 產品截圖
│   ├── projects/   # 項目照片
│   └── logos/      # Logo素材
├── videos/         # 視頻資源
└── icons/          # 圖標資源
```

---

## 📊 統計數據

| 類別 | 數量 | 狀態 |
|------|------|------|
| **頁面路由** | 18個 | ✅ 架構完成 |
| **佈局組件** | 4個 | ✅ 架構完成 |
| **區塊組件** | 10個 | ✅ 架構完成 |
| **動畫組件** | 4個 | ✅ 架構完成 |
| **自定義Hooks** | 4個 | ✅ 架構完成 |
| **工具庫文件** | 4個 | ✅ 架構完成 |
| **數據文件** | 3個 | ✅ 架構完成 |
| **CSS文件** | 2個 | ✅ 架構完成 |
| **Sanity Schemas** | 3個新增 | ✅ 架構完成 |
| **資源目錄** | 5個 | ✅ 架構完成 |
| **總計** | **57個文件/目錄** | **100%完成** |

---

## 🎯 設計原則

### 組件分層邏輯
```
Layout Components (header, footer)
    ↓ 包含
Section Components (hero, cta, product-grid)
    ↓ 使用
Animation Wrappers (fade-in, scroll-reveal)
    ↓ 依賴
Custom Hooks (use-in-view, use-scroll-progress)
```

### 頁面構建模式
每個頁面由可復用的section組件組合而成：
```typescript
// 典型頁面結構
<Header />
<HeroSection />
<ScrollPrompt />
<FeatureBlock />  // x3
<StatisticsSection />
<CTASection />
<Footer />
```

---

## 🔄 下一步實現順序

### Phase 1: 基礎組件實現（優先）
1. ✅ 安裝Shadcn UI組件（button, card, dropdown-menu等）
2. 實現Layout組件（Header, Footer, Navigation, LocaleSwitcher）
3. 實現基礎Section組件（HeroSection, CTASection, FeatureBlock）
4. 實現Animation組件（FadeIn, ScrollReveal）

### Phase 2: 數據與內容
1. 填充data文件（products.ts, services.ts, navigation.ts）
2. 擴展messages/zh.json和messages/en.json（添加所有頁面文案）
3. 編譯Paraglide messages: `npm run paraglide:compile`

### Phase 3: 頁面實現
1. 實現Home頁（使用ProductGrid展示8個JARVIS產品）
2. 實現About Us頁
3. 實現Services & Products頁
4. 實現8個JARVIS產品詳情頁
5. 實現次要頁面（Newsroom, Careers, Contact等）

### Phase 4: 動畫與優化
1. 實現GSAP滾動動畫
2. 實現Framer Motion微動畫
3. 優化移動端響應式
4. 性能優化（圖片懶加載、代碼分割等）

---

## 📝 重要約定

### 命名規範
- **組件文件**: kebab-case（hero-section.tsx）
- **TypeScript文件**: kebab-case（use-in-view.ts）
- **React組件**: PascalCase（HeroSection, ProductCard）
- **Hooks**: camelCase with "use" prefix（useInView, useScrollProgress）

### 文件組織
- **Client組件**: 必須標記`"use client"`（hooks、動畫、交互組件）
- **Server組件**: 默認（頁面、靜態section組件）
- **數據文件**: 純TypeScript，導出常量或配置

### 響應式優先級
- **Mobile First**: 所有組件先設計移動端
- **Breakpoints**: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)
- **測試設備**: iPhone, iPad, Desktop

---

## 🛠️ 技術棧快速參考

| 技術 | 用途 | 關鍵文件 |
|------|------|---------|
| **Next.js 15** | 頁面路由、SSR | `app/[locale]/*/page.tsx` |
| **Paraglide JS** | 國際化 | `messages/*.json`, `src/paraglide/` |
| **Lenis** | 平滑滾動 | `smooth-scroll-provider.tsx` |
| **GSAP** | 滾動動畫 | `animations/parallax-section.tsx` |
| **Framer Motion** | 組件動畫 | `animations/fade-in.tsx`, `slide-in.tsx` |
| **Shadcn/ui** | UI組件庫 | `components/ui/` |
| **Sanity CMS** | 內容管理 | `sanity/schemaTypes/` |
| **TanStack Query** | API請求 | 待實現於頁面中 |
| **React Hook Form** | 表單處理 | Contact頁面 |
| **Tailwind CSS v4** | 樣式 | `globals.css`, 組件內聯 |

---

## 📖 參考文檔

- 項目詳細文檔: `CLAUDE.md`
- 網站內容結構: `web.md`
- Palantir設計參考: https://www.palantir.com/

---

**Last Updated**: 2025-11-14
**Architecture Version**: 1.0
**Status**: 架構骨架完成，待實現具體代碼
