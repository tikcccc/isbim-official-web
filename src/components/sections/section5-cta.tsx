"use client";

import React, { useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Section5CTA() {
  // Phase 2: Refs for GSAP DOM control
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Phase 3: Macro Animation (GSAP + ScrollTrigger)
  // Responsibility: Narrative entrance animation when user scrolls to this section
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%", // Trigger when top of section reaches 75% of viewport
          toggleActions: "play none none none",
        },
      });

      // Step A: Image slides in from left with fade
      tl.from(imageRef.current, {
        x: -80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      // Step B: Text content floats up sequentially
      // Use -=0.8 offset to create overlap with image animation for smooth narrative flow
      tl.from(
        [titleRef.current, subtitleRef.current, buttonRef.current],
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.8" // Overlap with image animation
      );
    }, containerRef);

    // Cleanup is mandatory
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full min-h-screen bg-zinc-50 text-slate-900 py-12 sm:py-20 flex flex-col justify-center"
    >
      <div className="mx-auto w-full" style={{ width: "90vw", maxWidth: "1800px" }}>
        {/* Phase 2: Tailwind Grid - Two-column responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Image with gradient overlay */}
          <div
            ref={imageRef}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-2xl bg-zinc-200"
          >
            <img
              src="/images/cta.png"
              alt="Modern business technology and collaboration"
              className="object-cover w-full h-full"
            />
            {/* Gradient overlay for atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent" />
          </div>

{/* Right: Content area - Centered Layout */}
<div
  ref={textWrapperRef}
  // 優化重點 1: items-center (水平置中) + text-center (文字置中)
  // md:px-8 確保在視窗縮放時左右有足夠留白
  className="flex flex-col items-center text-center justify-center md:px-8 lg:px-12"
>
  {/* Title */}
  <h2
    ref={titleRef}
    // 優化重點 2: 
    // - tracking-wide (解決太密)
    // - mb-6 (拉開標題與副標題的距離，比原本寬鬆)
    className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-wide text-slate-900 leading-[1.1] text-balance mb-6"
  >
    Call to Action
  </h2>

  {/* Subtitle */}
  <p
    ref={subtitleRef}
    // 優化重點 3:
    // - mx-auto: 因為有設 max-w，必須加這個才能讓整個段落置中
    // - font-normal: 稍微加粗一點點，提升閱讀舒適度
    className="text-lg sm:text-xl lg:text-xl leading-relaxed font-normal text-gray-600 max-w-lg text-pretty mx-auto"
  >
    Let's explore how we can transform your next project with our innovative solutions.
  </p>

  {/* Button Area */}
  {/* 優化重點 4: pt-10 拉大按鈕與上方文字的距離，強調層級 */}
  <div ref={buttonRef} className="pt-10">
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* 保留原本按鈕樣式 */}
      <Button
        variant="outline"
        className="border-slate-300 text-slate-900 hover:bg-slate-900 hover:text-white h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg transition-all duration-300 rounded-lg uppercase tracking-wider"
      >
        Learn More
        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </motion.div>
  </div>
</div>

        </div>
      </div>
    </section>
  );
}
