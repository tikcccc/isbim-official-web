'use client';

import * as messages from '@/paraglide/messages';

/**
 * ParallaxBreaker Component
 * Visual transition section with:
 * - Fixed background attachment (parallax effect)
 * - Centered title with gradient underline
 * - 60vh height for breathing room
 */
export function ParallaxBreaker() {
  return (
    <section className="h-[60vh] relative flex items-center justify-center overflow-hidden border-t border-b border-white/5">
      {/* Fixed Background Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed bg-center opacity-30 saturate-0" />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-[#050505]" />

      {/* Content */}
      <div className="z-10 text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-2xl">
          {messages.jarvis_suite_breaker_title_part1()}{' '}
          <span className="text-emerald-400">{messages.jarvis_suite_breaker_title_part2()}</span>{' '}
          &{' '}
          <span className="text-teal-400">{messages.jarvis_suite_breaker_title_part3()}</span>
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
      </div>
    </section>
  );
}
