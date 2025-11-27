'use client';

import * as messages from '@/paraglide/messages';

/**
 * CtaSection Component
 * Final conversion section with:
 * - Primary and secondary CTAs
 * - Social proof stats grid
 * - Emerald/teal gradient accents
 */
export function CtaSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-[#050505]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-emerald-900/5" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
        {/* Heading */}
        <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white drop-shadow-xl">
          {messages.jarvis_suite_cta_title_part1()}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            {messages.jarvis_suite_cta_title_part2()}
          </span>
        </h2>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            {messages.jarvis_suite_cta_primary()}
          </button>
          <button className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest rounded-full hover:border-white hover:bg-white/10 transition-all">
            {messages.jarvis_suite_cta_secondary()}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8 text-gray-500 font-mono text-xs">
          <div>{messages.jarvis_suite_cta_stat1()}</div>
          <div>{messages.jarvis_suite_cta_stat2()}</div>
          <div>{messages.jarvis_suite_cta_stat3()}</div>
          <div>{messages.jarvis_suite_cta_stat4()}</div>
        </div>
      </div>
    </section>
  );
}
