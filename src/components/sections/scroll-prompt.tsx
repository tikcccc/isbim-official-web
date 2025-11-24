/**
 * ScrollPrompt Component
 *
 * 用途：
 * - 提示用戶向下滾動的視覺指示器
 * - 引導用戶探索頁面內容
 *
 * 使用場景：
 * - 所有JARVIS產品詳情頁（根據web.md）
 * - 顯示"Scroll to Explore"文字
 * - 通常放在Hero Section下方
 *
 * Props：
 * - text?: string (提示文字，默認"Scroll to Explore"，支持i18n)
 * - className?: string
 *
 * 設計要點：
 * - 居中顯示
 * - 使用斜體（italic）
 * - 配合向下箭頭圖標或鼠標滾動圖標
 * - 輕量的顏色（muted或secondary）
 * - 滾動一段距離後自動隱藏
 *
 * 動畫：
 * - 向下的bounce動畫（無限循環）
 * - 使用CSS animation或Framer Motion
 * - @keyframes bounce { ... }
 * - 滾動後淡出（使用useScrollProgress）
 *
 * 實現要點：
 * - 使用useScrollProgress監聽滾動
 * - scrollY > 100時opacity變為0
 * - 可選：添加點擊事件，平滑滾動到下一section
 *
 * 示例：
 * <ScrollPrompt text="Scroll to Explore" />
 */

"use client";

// TODO: 實現ScrollPrompt組件
// TODO: 添加bounce動畫
// TODO: 使用useScrollProgress控制顯示/隱藏
// TODO: 可選：添加點擊滾動功能
