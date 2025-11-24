/**
 * NarrativeSection Component
 *
 * 用途：
 * - 展示長篇敘事性內容
 * - 用於講述故事、闡述理念、詳細介紹
 *
 * 使用場景：
 * - About Us頁的"Why We're Here"和"Where We Are Going"
 * - JPM頁的"Four-Pillar Engine"詳細描述
 * - 產品頁的深度介紹內容
 *
 * Props：
 * - title?: string (章節標題)
 * - content: string | ReactNode (正文內容，支持富文本)
 * - variant?: "single" | "multi-column"
 *   - single: 單列排版（適合移動端和一般內容）
 *   - multi-column: 多列排版（桌面端，類似報紙）
 * - className?: string
 *
 * 設計要點：
 * - 使用易讀的字號（text-base或text-lg）
 * - 合適的行高（leading-relaxed）
 * - 段落間距（space-y-4）
 * - 最大寬度限制（max-w-4xl或max-w-prose）保持可讀性
 * - 支持粗體、斜體、列表等富文本格式
 *
 * 動畫：
 * - 使用ScrollReveal逐段淡入（可選）
 * - 標題先出現，內容延遲淡入
 *
 * 實現要點：
 * - 支持Markdown或HTML內容渲染
 * - 可選：集成react-markdown或dangerouslySetInnerHTML
 * - 如果是純文字，用<p>標籤包裹並處理換行
 *
 * 示例（About Us - Why We're Here）：
 * <NarrativeSection
 *   title="Why We're Here"
 *   content={`isBIM is accelerating the global infrastructure build-out...`}
 *   variant="single"
 * />
 */

// TODO: 實現NarrativeSection組件
// TODO: 支持單列和多列佈局
// TODO: 處理富文本內容渲染
// TODO: 添加ScrollReveal動畫（可選）
