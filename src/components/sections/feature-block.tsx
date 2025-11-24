/**
 * FeatureBlock Component
 *
 * 用途：
 * - 展示單個功能特性的區塊
 * - 包含粗體標題和描述性段落
 * - 可選圖標或插圖
 *
 * 使用場景：
 * - About Us頁的"What We Do"四個子區塊
 * - 所有JARVIS產品頁的功能描述區塊
 * - JPM頁的"Four-Pillar Engine"等章節
 * - 根據web.md，每個產品頁有多個Feature Block
 *
 * Props：
 * - title: string (粗體標題)
 * - content: string | ReactNode (描述內容，支持富文本)
 * - icon?: ReactNode (可選圖標)
 * - layout?: "horizontal" | "vertical"
 *   - horizontal: 圖標左，文字右
 *   - vertical: 圖標上，文字下
 * - className?: string
 *
 * 設計要點：
 * - 標題使用text-2xl或text-3xl，font-bold
 * - 內容使用text-base或text-lg，text-muted-foreground
 * - 圖標使用accent color
 * - 適當的spacing（mb-4, gap-4等）
 *
 * 動畫：
 * - 使用ScrollReveal在進入視口時淡入
 * - 如果是列表，可配合stagger效果
 *
 * 示例（About Us - What We Do）：
 * <FeatureBlock
 *   title="We deliver a verticalized AI copilot for every player in construction."
 *   content="JARVIS is the industry's first full-stack generative AI suite..."
 *   icon={<AiIcon />}
 * />
 */

// TODO: 實現FeatureBlock組件
// TODO: 支持horizontal和vertical佈局
// TODO: 使用ScrollReveal動畫
// TODO: 支持ReactNode類型的content（富文本）
