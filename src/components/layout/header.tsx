/**
 * Header Component
 *
 * 用途：
 * - 全站的頂部導航欄
 * - 包含Logo、主導航菜單、語言切換器
 * - 支持固定定位（sticky/fixed）和滾動行為
 *
 * 功能需求：
 * 1. Logo區域
 *    - 顯示isBIM Logo
 *    - 點擊返回首頁
 *    - 支持深色/淺色模式（可選）
 *
 * 2. 導航菜單
 *    - 集成<Navigation />組件
 *    - 桌面端：水平排列的菜單項
 *    - 移動端：漢堡菜單（Hamburger Menu）
 *
 * 3. 語言切換器
 *    - 集成<LocaleSwitcher />組件
 *    - EN/ZH切換
 *
 * 4. 滾動行為
 *    - 滾動時改變背景透明度或陰影
 *    - 可選：滾動向下時隱藏，向上時顯示
 *    - 使用useScrollProgress監聽滾動
 *
 * 5. 響應式設計
 *    - 桌面（lg+）：完整導航
 *    - 平板/移動（<lg）：漢堡菜單
 *    - 使用useMediaQuery判斷
 *
 * Props：
 * - variant?: "default" | "transparent" (默認或透明背景)
 * - sticky?: boolean (是否固定在頂部)
 * - className?: string
 *
 * 使用場景：
 * - 在layout.tsx中全局引用
 * - 所有頁面共用同一Header
 */

// TODO: 實現Header組件
// TODO: 集成Navigation和LocaleSwitcher
// TODO: 添加移動端漢堡菜單邏輯
// TODO: 實現滾動時的樣式變化
