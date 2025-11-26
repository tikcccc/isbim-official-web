# SEO & Performance Optimization Summary

## 完成日期: 2025-11-26

本文檔總結了對 isBIM 官網進行的所有 SEO 和性能優化工作。

---

## ✅ 已完成的優化

### 1. Footer CLS (累積佈局位移) 修復

**問題**: Newsletter 表單懶加載時可能導致頁面內容跳動

**解決方案**:
- ✅ 在 [footer.tsx:173](src/components/layout/footer.tsx#L173) 添加 `min-h-[72px]` 容器
- ✅ 為錯誤和成功消息預留固定空間
- ✅ 與 NewsletterFallback 組件尺寸完全匹配

**影響**: 改善 Google Core Web Vitals CLS 分數

---

### 2. Sanity Webhook 與 On-Demand ISR

**問題**: 首頁使用 1 小時靜態緩存，內容更新延遲

**解決方案**:
- ✅ 創建 [/api/revalidate/route.ts](src/app/api/revalidate/route.ts) webhook 端點
- ✅ 支持基於 tag 的精細化重新驗證
- ✅ 包含 webhook 簽名驗證 (HMAC SHA-256)
- ✅ 自動處理所有 Sanity 內容類型

**配置步驟**:
1. 在 `.env.local` 中設置 `SANITY_WEBHOOK_SECRET`（可選但推薦）
2. 在 Sanity Studio → API → Webhooks 創建新 webhook:
   - URL: `https://your-domain.com/api/revalidate`
   - 觸發器: On create/update/delete
   - Secret: 與 `.env.local` 中相同

**影響**: 即時內容更新 + 保持靜態緩存性能

---

### 3. 國際化 SEO - hreflang 與 canonical

**問題**: 缺少明確的語言版本標記，可能導致重複內容懲罰

**解決方案**:
- ✅ 在 [lib/seo.ts](src/lib/seo.ts) 中增強 `generateHreflangAlternates()` 函數
- ✅ 支持多個 hreflang 代碼: en, en-US, en-GB, zh, zh-CN, zh-HK, zh-TW
- ✅ 添加 `x-default` fallback 指向英文版本
- ✅ 正確的 canonical URL 設置

**使用示例**:
```tsx
import { generateHreflangAlternates } from "@/lib/seo";

export async function generateMetadata() {
  return {
    ...generateHreflangAlternates("/about-us", "en"),
  };
}
```

**影響**: 改善國際 SEO，防止重複內容懲罰

---

### 4. 結構化數據 (JSON-LD Schema.org)

**問題**: 缺少結構化數據，搜索引擎無法理解內容類型

**解決方案**:
- ✅ 創建 [components/seo/json-ld.tsx](src/components/seo/json-ld.tsx) 組件
- ✅ 提供預構建的 Schema 助手:
  - `createOrganizationSchema` - 公司信息
  - `createProductSchema` - 產品頁面
  - `createJobPostingSchema` - 招聘信息
  - `createBreadcrumbSchema` - 麵包屑導航

**已實施**:
- ✅ 在 [app/layout.tsx](src/app/layout.tsx) 中添加全局 Organization schema
- ✅ 包含公司名稱、Logo、社交媒體鏈接、聯絡信息

**使用示例**:
```tsx
import { JsonLd, createProductSchema } from "@/components/seo/json-ld";

<JsonLd data={createProductSchema({
  name: "JARVIS Agent",
  description: "AI-powered construction management",
  brand: "isBIM",
})} />
```

**影響**: 啟用 Google 和 Baidu 的富媒體搜索結果 (Rich Snippets)

---

### 5. Sanity Schema SEO 字段

**問題**: CMS 中缺少 SEO 元數據字段

**解決方案**:
- ✅ 更新 [postType.ts](src/sanity/schemaTypes/postType.ts) - 添加完整 SEO 對象
- ✅ 更新 [productType.ts](src/sanity/schemaTypes/productType.ts) - 添加完整 SEO 對象
- ✅ SEO 字段包括:
  - `metaTitle` - 自定義 SEO 標題 (60 字符限制)
  - `metaDescription` - 搜索描述 (160 字符限制)
  - `openGraphImage` - 社交分享圖片 (推薦 1200x630px)
  - `keywords` - 焦點關鍵詞 (可選)

**特性**:
- 可摺疊 UI，不影響內容編輯流程
- 字符數驗證，符合 SEO 最佳實踐
- 支持 Alt text 的 OG 圖片

---

### 6. 圖片 Alt Text 強制驗證

**問題**: 部分圖片缺少 Alt text，影響 SEO 和無障礙性

**解決方案**:
- ✅ 在 [imageType.ts](src/sanity/schemaTypes/imageType.ts) 中設置 Alt text 為必填
- ✅ 在 [productType.ts](src/sanity/schemaTypes/productType.ts) 主圖中設置 Alt text 為必填
- ✅ 添加字符數驗證 (10-125 字符)
- ✅ 提供清晰的描述性幫助文本

**影響**:
- 改善 SEO (Google 圖片搜索)
- 改善 Web 無障礙性 (WCAG 合規)
- 防止內容編輯遺漏 Alt text

---

### 7. Robots.txt 精確控制

**問題**: 搜索引擎可能爬取 CMS 後台和 API 端點

**解決方案**:
- ✅ 在 [robots.ts](src/app/(website)/robots.ts) 中明確禁止:
  - `/studio/` 和 `/studio` (Sanity CMS)
  - `/api/` (所有 API 路由)
  - `/_next/` (Next.js 內部文件)
  - `/admin/` (管理路由)
  - `/*.json$` (JSON 文件)
  - `/api/revalidate` (Webhook 端點)

**支持的爬蟲**:
- Google, Bing (通用)
- Baidu, Sogou, 360Search (中國市場)
- GPTBot, Google-Extended (禁止 AI 訓練)

**影響**: 節省爬蟲預算 (Crawl Budget)，保護敏感路由

---

### 8. Core Web Vitals - LCP 優化

**問題**: 首屏圖片加載可能影響 Largest Contentful Paint

**解決方案 (已驗證)**:
- ✅ [topbar.tsx](src/components/layout/topbar.tsx) Logo: `priority={true}`
- ✅ [section5-cta.tsx](src/components/sections/section5-cta.tsx) CTA 圖片: `priority={true}`
- ✅ [interactive-carousel.tsx](src/components/sections/interactive-carousel.tsx) 中心幻燈片: `priority={isCenter}`
- ✅ 英雄區使用視頻背景，不需要 priority (已針對 autoPlay 優化)

**額外優化**:
- 使用 Next.js Image 組件的自動 WebP 優化
- 響應式 `sizes` 屬性以優化帶寬
- 視頻使用 `playsInline`, `muted`, `autoPlay` 避免 iOS 阻塞

**影響**: 改善 Google PageSpeed Insights LCP 分數

---

## 📋 後續建議

### 高優先級
1. **配置 Sanity Webhook**
   - 在生產環境設置 webhook URL
   - 生成並配置 SANITY_WEBHOOK_SECRET

2. **填寫 Baidu 網站驗證**
   - 在 [lib/seo.ts](src/lib/seo.ts#L145) 中取消註釋 `baidu-site-verification`
   - 添加 Baidu Webmaster Tools 代碼

3. **為現有內容添加 SEO 元數據**
   - 在 Sanity Studio 中為所有產品頁面填寫 SEO 字段
   - 為所有圖片添加描述性 Alt text

### 中優先級
4. **創建動態 OG 圖片生成器**
   - 選項 A: 使用 Sanity URL Builder + 文字覆蓋
   - 選項 B: Next.js ImageResponse API (`app/og/route.tsx`)

5. **在產品頁面添加 Product Schema**
   ```tsx
   <JsonLd data={createProductSchema({
     name: product.title,
     description: product.description,
     brand: "isBIM",
     offers: {
       url: productUrl,
       availability: "https://schema.org/InStock"
     }
   })} />
   ```

6. **在招聘頁面添加 JobPosting Schema**
   - 使用 `createJobPostingSchema` 助手
   - 改善 Google for Jobs 索引

### 低優先級
7. **設置 Google Search Console 和 Baidu Webmaster Tools**
   - 監控索引狀態
   - 提交 sitemap
   - 檢查移動友好性

8. **考慮添加 FAQ Schema**
   - 為常見問題頁面
   - 啟用 Google 的 FAQ 富媒體結果

---

## 🔍 驗證清單

### 開發環境測試
- [x] Footer 不再產生佈局位移
- [x] Webhook 端點響應 200 OK (GET /api/revalidate)
- [x] JSON-LD 在頁面源碼中可見
- [x] Sanity Studio 中 SEO 字段可編輯
- [x] Alt text 為空時無法發布圖片

### 生產環境部署後
- [ ] 在 Google Search Console 提交 sitemap.xml
- [ ] 驗證 hreflang 標籤 (使用 Google Search Console 國際定位報告)
- [ ] 使用 [Google Rich Results Test](https://search.google.com/test/rich-results) 驗證 Schema
- [ ] 檢查 PageSpeed Insights 的 CLS 和 LCP 分數
- [ ] 測試 Sanity Webhook (創建/更新內容並驗證即時更新)

---

## 📂 修改文件列表

### 新增文件
- `src/app/api/revalidate/route.ts` - Sanity webhook 端點
- `src/components/seo/json-ld.tsx` - JSON-LD 結構化數據組件
- `OPTIMIZATION_SUMMARY.md` - 本文檔

### 修改文件
- `src/components/layout/footer.tsx` - 添加 min-height
- `src/lib/seo.ts` - 增強 hreflang 函數
- `src/app/layout.tsx` - 添加 Organization schema
- `src/sanity/schemaTypes/postType.ts` - 添加 SEO 字段
- `src/sanity/schemaTypes/productType.ts` - 添加 SEO 字段和 alt 驗證
- `src/sanity/schemaTypes/imageType.ts` - 強制 alt text 驗證
- `src/app/(website)/robots.ts` - 精確控制爬蟲
- `.env.local` - 添加 NEXT_PUBLIC_SITE_URL 和 SANITY_WEBHOOK_SECRET

### 已驗證未修改 (已優化)
- `src/components/layout/topbar.tsx` - Logo 已有 priority
- `src/components/sections/section5-cta.tsx` - CTA 圖片已有 priority
- `src/components/sections/interactive-carousel.tsx` - 輪播圖已優化
- `src/components/sections/hero-section-1.tsx` - 視頻背景無需 priority

---

## 📞 技術支持

如有任何問題或需要進一步優化，請聯繫技術團隊。

**文檔版本**: 1.0
**最後更新**: 2025-11-26
