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

    // dY"` Connect Lenis with ScrollTrigger for proper integration
    lenisInstance.on("scroll", ScrollTrigger.update);

    // Request animation frame loop
    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // dY"` Refresh ScrollTrigger after Lenis is fully initialized
    // Multiple refreshes to handle Edge browser's lazy image loading
    // Edge defers load events for lazily-loaded images, affecting layout calculations

    // Initial refresh after Lenis initialization
    const refreshTimer1 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300); // Increased delay for Edge's image loading

    // Additional refresh to ensure deferred images are processed
    const refreshTimer2 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    // Final refresh when all resources (including lazy images) are loaded
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", handleLoad);

    // Cleanup
    return () => {
      clearTimeout(refreshTimer1);
      clearTimeout(refreshTimer2);
      window.removeEventListener("load", handleLoad);
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
