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
      className="relative py-40 overflow-hidden bg-[#0A0A0A] border-t border-white/5"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      <div className="container mx-auto px-6 relative z-10 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Large Typography */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter leading-[0.9]">
              {messages.jarvis_suite_interlude_title_part1()}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                {messages.jarvis_suite_interlude_title_part2()}
              </span>
            </h3>
            <div className="mt-8 w-32 h-1.5 bg-gradient-to-r from-emerald-500 to-transparent rounded-full" />
          </m.div>

          {/* Right: Content & Badges */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <p className="text-xl md:text-3xl text-gray-300 leading-relaxed font-light mb-12">
              {messages.jarvis_suite_interlude_description()}
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="group px-6 py-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm flex items-center gap-4 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 cursor-default">
                <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                  <Cpu className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-sm font-mono font-bold tracking-widest text-gray-300 group-hover:text-white">
                  {messages.jarvis_suite_badge_alibaba()}
                </span>
              </div>
              <div className="group px-6 py-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm flex items-center gap-4 hover:bg-teal-500/10 hover:border-teal-500/40 transition-all duration-300 cursor-default">
                <div className="p-2 bg-teal-500/20 rounded-lg group-hover:bg-teal-500/30 transition-colors">
                  <Database className="w-5 h-5 text-teal-400" />
                </div>
                <span className="text-sm font-mono font-bold tracking-widest text-gray-300 group-hover:text-white">
                  {messages.jarvis_suite_badge_isbim()}
                </span>
              </div>
            </div>
          </m.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
    </section>
  );
}
