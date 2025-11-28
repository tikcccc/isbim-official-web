"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LENIS_CONFIG } from "@/lib/animations";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

    // 🔑 Connect Lenis with ScrollTrigger for proper integration
    lenisInstance.on("scroll", ScrollTrigger.update);

    // Request animation frame loop
    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 🔑 Refresh ScrollTrigger after Lenis is fully initialized
    // This ensures correct position calculations for all ScrollTriggers
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(refreshTimer);
      lenisInstance.off("scroll", ScrollTrigger.update);
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
