/**
 * QuotationSection Component
 *
 * 用途：
 * - 顯示引用文字、公司使命陳述或重要聲明
 * - 突出顯示核心價值主張
 *
 * 使用場景：
 * - Home頁的Quotation Section:
 *   "We catalyze digital transformation across the global construction industry—
 *    delivering infrastructure that is faster, cheaper, safer, and greener."
 * - 客戶證言（可選）
 * - 重要里程碑宣言
 *
 * Props：
 * - quote: string (引用文字)
 * - author?: string (作者/來源，可選)
 * - variant?: "default" | "large"
 *   - default: 標準尺寸
 *   - large: 超大號文字（用於使命宣言）
 * - className?: string
 *
 * 設計要點：
 * - 使用斜體（italic）
 * - 較大字號（text-xl或text-2xl）
 * - 居中對齊
 * - 左右引號裝飾（""）或引用線條
 * - author使用較小字號和muted color
 * - 充足的垂直padding
 *
 * 動畫：
 * - 使用FadeIn或ScrollReveal淡入
 * - 文字可選打字機效果（可選，適合重要宣言）
 *
 * 示例（Home頁）：
 * <QuotationSection
 *   quote="We catalyze digital transformation across the global construction industry..."
 *   variant="large"
 * />
 */

// TODO: 實現QuotationSection組件
// TODO: 添加引號裝飾
// TODO: 支持author顯示
// TODO: 使用ScrollReveal動畫
