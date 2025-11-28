"use client";

import * as m from "@/paraglide/messages";
import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";
import { JARVIS_POSTERS, JARVIS_VIDEOS } from "@/lib/media-config";

/**
 * Hero Section 1
 *
 * Full-screen hero section with:
 * - Video background (fixed position for parallax effect)
 * - Centered title with GSAP slide-up animation
 * - Scroll prompt indicator
 */

export function HeroSection1() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const hasAnimatedRef = useRef(false);

  const playTextAnimation = useCallback(() => {
    if (hasAnimatedRef.current) return;
    if (!titleRef.current || !subtitleRef.current) return;

    const titleSpans = titleRef.current.querySelectorAll(".line-mask span");
    const subtitle = subtitleRef.current;

    hasAnimatedRef.current = true;

    gsap.to(titleSpans, {
      y: 0,
      duration: 1.2,
      ease: "expo.out",
      stagger: 0.2,
      delay: 0.2,
    });

    gsap.to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "expo.out",
      delay: 1,
    });
  }, []);

  useEffect(() => {
    // Fallback: ensure text animates even if video is slow/stuck on poster
    const fallback = setTimeout(playTextAnimation, 900);
    return () => clearTimeout(fallback);
  }, [playTextAnimation]);

  return (
    <section className="hero-section relative w-full overflow-hidden bg-black min-h-[92svh] sm:min-h-screen lg:min-h-[120vh] flex">
      {/* Video Background (absolute position within section) */}
      <div className="absolute inset-0 z-[1]">
        {/* Gradient placeholder background - shows before video loads */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />

        <video
          className="hero-video w-full h-full object-cover object-center relative z-10"
          poster={JARVIS_POSTERS.banner}
          playsInline
          autoPlay
          loop
          muted
          preload="auto"
          onLoadedData={playTextAnimation}
          onError={playTextAnimation}
        >
          <source src={JARVIS_VIDEOS.banner} type="video/mp4" />
        </video>
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/50 z-20" />
      </div>

      {/* Hero Content - Inner Container */}
      <header className="relative z-10 container-page grid place-items-center text-white text-center px-6 sm:px-10 flex-1">
        <div className="hero-content">
          {/* Animated Title */}
          <h1 ref={titleRef} className="hero-title overflow-hidden">
            <div className="line-mask block overflow-hidden my-2">
              <span className="inline-block translate-y-full">
                {m.homepage_hero_title()}
              </span>
            </div>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mt-6 text-xl sm:text-2xl opacity-0 translate-y-4 text-zinc-300 max-w-3xl mx-auto"
          >
            {m.homepage_hero_subtitle()}
          </p>

          {/* Scroll Prompt */}
          <div className="scroll-prompt absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70">
            <ChevronDown className="w-6 h-6 mb-2 animate-bounce" />
            <p className="text-sm font-semibold">{m.homepage_scroll_prompt()}</p>
          </div>
        </div>
      </header>
    </section>
  );
}
