"use client";

import * as m from "@/paraglide/messages";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";

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

  useEffect(() => {
    // GSAP animation: slide up from bottom with stagger
    if (titleRef.current && subtitleRef.current) {
      const titleSpans = titleRef.current.querySelectorAll(".line-mask span");
      const subtitle = subtitleRef.current;

      gsap.to(titleSpans, {
        y: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.2,
        delay: 0.5,
      });

      gsap.to(subtitle, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "expo.out",
        delay: 1.5,
      });
    }
  }, []);

  return (
    <section className="hero-section relative w-full overflow-hidden bg-black min-h-screen lg:min-h-[120vh]">
      {/* Video Background (absolute position within section) */}
      <div className="absolute inset-0 z-[1]">
        <video
          className="hero-video w-full h-full object-cover object-center"
          poster="/videos/banner.mp4"
          playsInline
          autoPlay
          loop
          muted
        >
          <source src="/videos/banner.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Hero Content - Inner Container */}
      <header className="relative z-10 container-page grid place-items-center text-white text-center px-6 sm:px-10 min-h-screen lg:min-h-[120vh]">
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
