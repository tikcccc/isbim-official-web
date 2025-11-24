/**
 * CTASection Component (Call-to-Action Section)
 *
 * 用途：
 * - 行動呼籲區域，引導用戶執行特定操作
 * - 通常放在頁面底部或重要轉折點
 * - 包含激勵性文字和按鈕
 *
 * 使用場景：
 * - 每個頁面底部都有CTA（根據web.md）
 * - Home: "Let's explore how we can transform your next project."
 * - About: "Transform your next project with isBIM."
 * - 產品頁: "Request a live demo today."
 *
 * Props：
 * - text: string (激勵文字，斜體顯示)
 * - buttonText: string (按鈕文字，例如"Learn More")
 * - buttonHref: string (按鈕鏈接)
 * - variant?: "default" | "centered" | "split"
 *   - default: 文字和按鈕垂直排列
 *   - centered: 居中對齊
 *   - split: 文字左，按鈕右（桌面端）
 * - className?: string
 *
 * 設計要點：
 * - 使用斜體文字強調激勵語
 * - 大號按鈕（Shadcn Button組件，variant="default" 或 "primary"）
 * - 使用對比色或漸變背景吸引注意
 * - 充足的padding和margin
 *
 * 動畫：
 * - 使用ScrollReveal觸發淡入
 * - 按鈕懸停時有微動畫（scale, shadow）
 *
 * 示例：
 * <CTASection
 *   text="Let's explore how we can transform your next project."
 *   buttonText="Learn More"
 *   buttonHref="/contact"
 * />
 */

// TODO: 實現CTASection組件
// TODO: 使用Shadcn Button組件
// TODO: 添加ScrollReveal動畫
// TODO: 支持多種variant佈局
