/**
 * StatisticsSection Component
 *
 * 用途：
 * - 展示數據指標、統計數字、成果展示
 * - 用數字說話，增強說服力
 *
 * 使用場景：
 * - JPM頁面的"By the Numbers"（5個關鍵指標）:
 *   - Total Project Cost: 70–80% (20–30% savings)
 *   - Delivery Time: 55–70% (30–45% faster)
 *   - Quality Defects: 5% (71% reduction)
 *   - Budget Overruns: 19% (72% reduction)
 *   - Cash Conversion: 24 months (33% shorter)
 * - About Us頁的公司數據（可選）
 * - 產品頁的效能指標
 *
 * Props：
 * - stats: Statistic[]
 *   - value: string (數字或百分比)
 *   - label: string (指標名稱)
 *   - description?: string (詳細說明)
 *   - highlight?: boolean (是否高亮顯示)
 * - layout?: "grid" | "horizontal"
 *   - grid: 網格佈局（2x2或3x3）
 *   - horizontal: 水平排列
 * - title?: string (區塊標題)
 * - className?: string
 *
 * 設計要點：
 * - 數字使用超大字號（text-4xl或text-5xl）和粗體
 * - 數字使用accent color（primary或brand color）
 * - label使用較小字號和muted color
 * - description使用text-sm
 * - 卡片或框線分隔每個統計項
 *
 * 動畫：
 * - Count-up動畫（數字從0遞增到目標值）
 * - 使用useInView觸發（進入視口時開始計數）
 * - 使用react-countup或自定義hook實現
 * - Stagger效果（統計項逐個動畫）
 *
 * 示例（JPM頁）：
 * <StatisticsSection
 *   title="By the Numbers: Core Value Creation"
 *   stats={jpmStats}
 *   layout="grid"
 * />
 */

// TODO: 實現StatisticsSection組件
// TODO: 添加count-up動畫效果
// TODO: 使用useInView觸發動畫
// TODO: 支持grid和horizontal佈局
