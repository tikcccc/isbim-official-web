/**
 * HeroSection Component
 *
 * 用途：
 * - 頁面頂部的主視覺區域（Hero Banner）
 * - 展示頁面標題和副標題
 * - 可選背景圖片或視頻
 *
 * 使用場景：
 * - 所有主要頁面的頂部（Home, About, Services, 所有JARVIS產品頁）
 * - 根據web.md，每個頁面都有Header Section
 *
 * Props：
 * - title: string (主標題，支持Paraglide message key)
 * - subtitle?: string (副標題/標語)
 * - backgroundImage?: string (背景圖片URL)
 * - variant?: "default" | "minimal" | "full-screen"
 *   - default: 標準高度，居中文字
 *   - minimal: 緊湊版，較小padding
 *   - full-screen: 全屏高度
 * - className?: string
 *
 * 設計要點：
 * - 大號粗體標題（text-5xl或text-6xl）
 * - 副標題使用斜體或較細字重
 * - 居中對齊或左對齊（根據variant）
 * - 支持漸變背景或圖片背景
 * - 響應式字體大小（mobile: text-4xl, desktop: text-6xl）
 *
 * 動畫：
 * - 標題和副標題使用FadeIn包裝
 * - 標題先出現，副標題延遲0.2秒
 * - 背景圖片可選ParallaxSection效果
 *
 * 示例（Home頁）：
 * <HeroSection
 *   title="Construction AI Powering the Backbone of Global Economies"
 *   subtitle="AI That Predicts. Systems That Deliver. Results That Scale."
 *   variant="full-screen"
 * />
 */

// TODO: 實現HeroSection組件
// TODO: 使用Paraglide messages for i18n
// TODO: 集成FadeIn動畫
// TODO: 添加背景圖片/視頻支持
