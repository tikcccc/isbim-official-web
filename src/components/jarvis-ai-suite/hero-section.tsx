'use client';

import { m } from '@/components/motion/lazy-motion';
import { ArrowDown } from 'lucide-react';
import * as messages from '@/paraglide/messages';

/**
 * HeroSection Component
 * Fixed sticky hero section with:
 * - Tech grid background overlay
 * - Animated gradient title
 * - Version badge
 * - Scroll indicator
 */
export function HeroSection() {
  return (
    <section className="sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden bg-transparent z-0">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Tech Background Image with Pulse */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center animate-pulse duration-[8000ms] opacity-50" />

        {/* Bottom Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />

        {/* Top Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />

        {/* Tech Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Version Badge */}
          <div className="mb-6 inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <span className="text-xs font-mono tracking-widest uppercase text-emerald-400">
              {messages.jarvis_suite_version_badge()}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 text-white drop-shadow-2xl">
            {messages.jarvis_suite_hero_title_line1()}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 animate-gradient-x">
              {messages.jarvis_suite_hero_title_line2()}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto">
            {messages.jarvis_suite_hero_subtitle()}
          </p>
        </m.div>
      </div>

      {/* Scroll Indicator */}
      <m.div
        className="absolute bottom-12 flex flex-col items-center gap-3 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500/70">
          {messages.jarvis_suite_scroll_prompt()}
        </span>
        <m.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown className="w-5 h-5 text-emerald-500/50" />
        </m.div>
      </m.div>
    </section>
  );
}
