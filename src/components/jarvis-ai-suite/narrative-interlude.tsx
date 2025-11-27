'use client';

import { m } from '@/components/motion/lazy-motion';
import { Cpu, Database } from 'lucide-react';
import * as messages from '@/paraglide/messages';

/**
 * NarrativeInterlude Component
 * Transition section between narrative and product zones:
 * - Indigo/Purple ambient glow
 * - Partner/technology badges
 * - Credibility building content
 */
export function NarrativeInterlude() {
  return (
    <section
      id="narrative-bridge"
      className="relative py-32 overflow-hidden bg-[#07090E] border-t border-white/5"
    >
      {/* Indigo Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl text-center">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            {messages.jarvis_suite_interlude_title_part1()}{' '}
            <span className="text-emerald-400">{messages.jarvis_suite_interlude_title_part2()}</span>
          </h3>

          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light mb-12 max-w-3xl mx-auto">
            {messages.jarvis_suite_interlude_description()}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="group px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm flex items-center gap-3 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 cursor-default">
              <Cpu className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-mono font-bold tracking-widest text-gray-300 group-hover:text-white">
                {messages.jarvis_suite_badge_alibaba()}
              </span>
            </div>
            <div className="group px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm flex items-center gap-3 hover:bg-teal-500/10 hover:border-teal-500/40 transition-all duration-300 cursor-default">
              <Database className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-mono font-bold tracking-widest text-gray-300 group-hover:text-white">
                {messages.jarvis_suite_badge_isbim()}
              </span>
            </div>
          </div>
        </m.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
    </section>
  );
}
