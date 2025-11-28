"use client";

/**
 * Background Layers Component
 *
 * Renders the dark cyberpunk-style background layers:
 * 1. Noise texture overlay
 * 2. Tech grid pattern with radial fade
 * 3. Ambient emerald glow from top-center
 *
 * Grid sheen is paused by default; it starts when `grid-sheen-start` is dispatched
 * (with a 1.2s fallback timer) so the sweep is visible after page transition.
 */

import { useEffect, useRef, useState } from "react";

export function BackgroundLayers() {
  const [sheenKey, setSheenKey] = useState(0);
  const [sheenActive, setSheenActive] = useState(false);
  const lastTriggerRef = useRef(0);
  const sheenContainerRef = useRef<HTMLDivElement | null>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const triggerSheen = () => {
      // Restart animation by toggling active state and key
      setSheenActive(false);
      requestAnimationFrame(() => {
        setSheenKey((k) => k + 1);
        setSheenActive(true);
      });
    };

    const handler = () => triggerSheen();
    window.addEventListener("grid-sheen-start", handler);

    // Fallback: start sheen after initial delay in case no event is fired
    const fallback = setTimeout(triggerSheen, 1200);

    // Watch visibility to avoid triggering when off-screen
    const containerEl = sheenContainerRef.current;
    const observer =
      typeof window !== "undefined" && "IntersectionObserver" in window && containerEl
        ? new IntersectionObserver(
            ([entry]) => {
              isVisibleRef.current = entry.isIntersecting;
            },
            { threshold: 0 }
          )
        : null;
    if (observer && containerEl) observer.observe(containerEl);

    // Trigger on upward scroll with cooldown to avoid spam (RAF throttled)
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const delta = currentY - lastScrollY;
          lastScrollY = currentY;

          const now = performance.now();
          // Increased cooldown: 5s (5000ms) and higher threshold (-50px) to reduce animation spam
          if (
            delta < -20 &&
            isVisibleRef.current &&
            now - lastTriggerRef.current > 2500
          ) {
            lastTriggerRef.current = now;
            triggerSheen();
          }

          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("grid-sheen-start", handler);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(fallback);
      if (observer && containerEl) observer.unobserve(containerEl);
    };
  }, []);

  return (
    <>
      {/* Noise Texture Overlay */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-10 bg-[url('/images/noise.svg')] bg-repeat will-change-opacity"
      />

      {/* Tech Grid Pattern */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]"
        style={{
          backgroundSize: "60px 60px",
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          maskImage: "radial-gradient(circle at 50% 0%, black 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 0%, black 40%, transparent 85%)",
        }}
      />

      {/* Grid Sheen Sweep (starts on event) */}
      <div
        className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
        ref={sheenContainerRef}
        style={{
          maskImage: "radial-gradient(circle at 50% 0%, black 35%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 0%, black 35%, transparent 85%)",
        }}
      >
        <div
          key={sheenKey}
          className={`grid-sheen-overlay${sheenActive ? " grid-sheen-overlay--run" : ""}`}
        />
      </div>

      {/* Ambient Emerald Glow */}
      <div
        className="fixed left-1/2 -translate-x-1/2 w-full h-[80vh] pointer-events-none"
        style={{
          top: "-20%",
          zIndex: 0,
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
    </>
  );
}
