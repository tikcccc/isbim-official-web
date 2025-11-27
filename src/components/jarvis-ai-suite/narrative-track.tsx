'use client';

import { useRef } from 'react';
import { m } from '@/components/motion/lazy-motion';
import { useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import * as messages from '@/paraglide/messages';
import { AnimatedCounter } from './animated-counter';

/**
 * NarrativeTrack Component
 * 400vh tall section with scroll-driven animations:
 * - Background color morphing (5 stages)
 * - Sequential content reveals (3 stages + footer)
 * - Smooth scroll progress tracking with spring physics
 */
export function NarrativeTrack() {
  const contentSectionRef = useRef<HTMLDivElement>(null);

  // Scroll Progress Tracking
  const { scrollYProgress } = useScroll({
    target: contentSectionRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001
  });

  // Background Color Interpolation
  // 0.0 - 0.2: Black (Hero Transition)
  // 0.3 - 0.5: Deep Navy/Slate (Enterprise Autonomy)
  // 0.6 - 0.8: Dark Metallic Grey (Stats)
  // 0.9 - 1.0: Black (Exit)
  const trackBackgroundColor = useTransform(
    smoothProgress,
    [0, 0.2, 0.45, 0.7, 1],
    [
      '#050505', // Black
      '#050505', // Stay Black
      '#0B1121', // Deep Slate/Navy (Rich Blue-Black)
      '#18181B', // Zinc 900 (Metallic Grey)
      '#050505'  // Back to Black
    ]
  );

  // Content Transformations
  const title1Opacity = useTransform(smoothProgress, [0.05, 0.2], [0, 1]);
  const title1Y = useTransform(smoothProgress, [0.05, 0.2], [40, 0]);
  const title1Blur = useTransform(smoothProgress, [0.05, 0.2], ['10px', '0px']);

  const title2Opacity = useTransform(smoothProgress, [0.3, 0.45], [0, 1]);
  const title2Y = useTransform(smoothProgress, [0.3, 0.45], [40, 0]);
  const title2Blur = useTransform(smoothProgress, [0.3, 0.45], ['10px', '0px']);

  const statsOpacity = useTransform(smoothProgress, [0.55, 0.7], [0, 1]);
  const statsY = useTransform(smoothProgress, [0.55, 0.7], [20, 0]);

  const footerOpacity = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);

  const handleScrollToNext = () => {
    document.getElementById('narrative-bridge')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={contentSectionRef} className="relative z-10 h-[400vh]">
      {/* Dynamic Background Layer */}
      <m.div style={{ backgroundColor: trackBackgroundColor }} className="absolute inset-0 z-0">
        {/* Overlay Grids for texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        {/* Vignette to focus attention */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      </m.div>

      {/* Sticky Content Viewport */}
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden z-10">
        <div className="flex-1 flex flex-col justify-center items-center text-center px-6 max-w-6xl mx-auto">
          {/* Stage 1: Intro */}
          <m.h2
            style={{ opacity: title1Opacity, y: title1Y, filter: title1Blur }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white text-gradient-mask mb-4 leading-[1.1] drop-shadow-2xl"
          >
            {messages.jarvis_suite_narrative_stage1()}
          </m.h2>

          {/* Stage 2: Enterprise (Blue Background Phase) */}
          <m.h2
            style={{ opacity: title2Opacity, y: title2Y, filter: title2Blur }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-16"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500">
              {messages.jarvis_suite_narrative_stage2()}
            </span>
          </m.h2>

          {/* Stage 3: Stats (Grey Background Phase) - With Animated Counters */}
          <m.div
            style={{ opacity: statsOpacity, y: statsY }}
            className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mt-8"
          >
            <AnimatedCounter
              value={messages.jarvis_suite_stat1_value()}
              label={messages.jarvis_suite_stat1_label()}
              glow
            />

            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            <AnimatedCounter
              value={messages.jarvis_suite_stat2_value()}
              label={messages.jarvis_suite_stat2_label()}
            />

            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            <AnimatedCounter
              value={messages.jarvis_suite_stat3_value()}
              label={messages.jarvis_suite_stat3_label()}
              glow
            />
          </m.div>
        </div>

        {/* Footer Scroll Indicator */}
        <m.div
          style={{ opacity: footerOpacity }}
          className="absolute bottom-12 flex flex-col items-center gap-3 cursor-pointer group"
          onClick={handleScrollToNext}
        >
          <div className="relative w-6 h-6 flex flex-col items-center justify-center text-emerald-500/50 transition-colors group-hover:text-emerald-400">
            <div className="w-[1px] h-3 bg-current mb-[2px]" />
            <div className="w-3 h-[1px] bg-current absolute top-0" />
            <ChevronDown className="w-5 h-5 -mt-1" strokeWidth={1.5} />
            <div className="w-3 h-[1px] bg-current mt-1" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-emerald-500/50 font-medium group-hover:text-emerald-400 transition-colors">
            {messages.jarvis_suite_scroll_explore()}
          </span>
        </m.div>
      </div>
    </div>
  );
}
