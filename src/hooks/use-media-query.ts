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
 */

"use client";

import { useEffect, useState } from "react";

/**
 * Tailwind CSS breakpoints for convenience
 */
export const BREAKPOINTS = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

/**
 * useMediaQuery - 檢測媒體查詢是否匹配
 *
 * @param query - CSS媒體查詢字符串
 * @returns boolean - 是否匹配媒體查詢
 *
 * @example
 * ```tsx
 * function Component() {
 *   const isMobile = !useMediaQuery("(min-width: 768px)");
 *   const isDesktop = useMediaQuery("(min-width: 1024px)");
 *
 *   return (
 *     <div>
 *       {isMobile ? <MobileNav /> : <DesktopNav />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using with BREAKPOINTS constant
 * import { useMediaQuery, BREAKPOINTS } from "@/hooks/use-media-query";
 *
 * function Component() {
 *   const isTabletUp = useMediaQuery(BREAKPOINTS.md);
 *
 *   return isTabletUp ? <LargeComponent /> : <SmallComponent />;
 * }
 * ```
 */
export function useMediaQuery(query: string): boolean {
  // Default to false for SSR
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Handler for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Legacy browsers (Safari < 14)
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

/**
 * Helper hooks for common breakpoints
 */
export function useIsMobile(): boolean {
  return !useMediaQuery(BREAKPOINTS.md);
}

export function useIsTablet(): boolean {
  const isAboveMd = useMediaQuery(BREAKPOINTS.md);
  const isBelowLg = !useMediaQuery(BREAKPOINTS.lg);
  return isAboveMd && isBelowLg;
}

export function useIsDesktop(): boolean {
  return useMediaQuery(BREAKPOINTS.lg);
}

export function useIsLargeDesktop(): boolean {
  return useMediaQuery(BREAKPOINTS.xl);
}

export default useMediaQuery;
