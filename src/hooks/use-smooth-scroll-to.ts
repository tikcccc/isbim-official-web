/**
 * useSmoothScrollTo Hook
 *
 * 用途：
 * - 提供編程式的平滑滾動功能
 * - 配合Lenis實現流暢的滾動跳轉
 * - 用於錨點跳轉、回到頂部等交互
 *
 * 使用場景：
 * - "回到頂部"按鈕點擊
 * - 導航點擊滾動到頁面特定區域（錨點導航）
 * - 多步驟表單的分段跳轉
 * - FAQ折疊展開後滾動到問題位置
 * - CTA按鈕點擊後滾動到表單區域
 *
 * 返回值：
 * - scrollTo: (target: string | number, options?: ScrollOptions) => void
 *   - target可以是:
 *     - number: 滾動到指定像素位置
 *     - string: CSS選擇器（滾動到匹配元素）
 *     - "top": 滾動到頁面頂部
 *   - options:
 *     - offset?: number (偏移量)
 *     - duration?: number (動畫時長)
 *     - easing?: string (緩動函數)
 *
 * 實現要點：
 * - 通過useContext獲取Lenis實例（從SmoothScrollProvider）
 * - 調用lenis.scrollTo()方法
 * - 支持傳入元素ref或選擇器字符串
 * - 處理Lenis未初始化的情況（降級為原生滾動）
 */

"use client";

// TODO: 實現useSmoothScrollTo hook
// TODO: 獲取Lenis實例（需要在SmoothScrollProvider中提供Context）
// TODO: 返回scrollTo函數
// TODO: 添加降級處理（Lenis不可用時使用window.scrollTo）
