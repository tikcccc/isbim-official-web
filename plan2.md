About 頁面 i18n
當前: 大量硬編碼文本（約 3 個主要段落）
建議: Phase 2 添加翻譯鍵
🎯 後續工作建議（Phase 2）
根據 ARCHITECTURE.md 的規劃：
Week 2-3: 基礎組件實現
實現通用 Section 組件(通用組件應該和頁面和section分開)
hero-section.tsx（可復用的英雄區塊）
cta-section.tsx（通用行動號召）
product-card.tsx + product-grid.tsx（產品展示網格）
實現動畫包裝組件
fade-in.tsx, slide-in.tsx（基礎動畫）
scroll-reveal.tsx, parallax-section.tsx（滾動觸發）
從 about-us 頁面提取 RevealTitle 模式
實現自定義 Hooks
use-in-view.ts（Intersection Observer 封裝）
use-media-query.ts（響應式斷點）
use-scroll-progress.ts, use-smooth-scroll-to.ts
Week 4-6: 內容與集成
完成 Sanity Schemas
newsType.ts, careerType.ts, projectType.ts
添加對應的 GROQ 查詢
實現數據獲取
使用 TanStack Query hooks
集成到 Newsroom, Careers 頁面
實現表單
Contact 頁面使用 React Hook Form + Zod
郵件服務集成