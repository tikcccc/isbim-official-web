"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { LENIS_CONFIG } from "@/lib/animations";

/**
 * Lenis Context
 * Provides access to the Lenis instance for smooth scrolling.
 */
interface LenisContextValue {
  /** Lenis instance, null during SSR or before initialization */
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

/**
 * useLenis Hook
 * Get access to the Lenis instance from context.
 *
 * @returns Lenis instance or null if not available
 *
 * @example
 * ```tsx
 * const { lenis } = useLenis();
 *
 * const handleClick = () => {
 *   lenis?.scrollTo('#section', { offset: -100 });
 * };
 * ```
 */
export function useLenis() {
  const context = useContext(LenisContext);
  if (context === undefined) {
    throw new Error("useLenis must be used within a SmoothScrollProvider");
  }
  return context;
}

/**
 * SmoothScrollProvider
 * Initializes Lenis for smooth scrolling and provides context access.
 *
 * @example
 * ```tsx
 * // In layout.tsx
 * <SmoothScrollProvider>
 *   {children}
 * </SmoothScrollProvider>
 * ```
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with centralized config
    const lenisInstance = new Lenis(LENIS_CONFIG);

    setLenis(lenisInstance);

    // Request animation frame loop
    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenisInstance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis }}>
      {children}
    </LenisContext.Provider>
  );
}
