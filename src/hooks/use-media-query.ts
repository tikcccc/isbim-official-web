/**
 * useMediaQuery Hook
 *
 * 用途：
 * - 檢測當前屏幕尺寸是否匹配指定的CSS媒體查詢
 * - 實現響應式組件邏輯（而非僅CSS）
 * - 根據設備類型渲染不同內容或行為
 *
 * 使用場景：
 * - 移動端顯示漢堡菜單，桌面端顯示完整導航
 * - 根據屏幕寬度切換組件佈局
 * - 平板和桌面的不同動畫效果
 * - 條件渲染（例如移動端隱藏某些重量級組件）
 *
 * 返回值：
 * - matches: boolean (是否匹配媒體查詢)
 *
 * 參數：
 * - query: string (CSS媒體查詢字符串，例如"(min-width: 768px)")
 *
 * 預設斷點（可配合Tailwind）：
 * - sm: (min-width: 640px)
 * - md: (min-width: 768px)
 * - lg: (min-width: 1024px)
 * - xl: (min-width: 1280px)
 * - 2xl: (min-width: 1536px)
 *
 * 實現要點：
 * - 使用window.matchMedia API
 * - 監聽媒體查詢變化事件
 * - SSR時返回false或默認值
 * - 組件卸載時移除監聽器
 */

"use client";

// TODO: 實現useMediaQuery hook
// TODO: 添加matchMedia邏輯
// TODO: 處理SSR和hydration
// TODO: 可選：導出常用斷點helper函數
