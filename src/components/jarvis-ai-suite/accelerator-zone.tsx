'use client';

import { useState, useRef, useEffect } from 'react';
import { m } from '@/components/motion/lazy-motion';
import { AnimatePresence, useInView } from 'framer-motion';
import { Brain, FileSignature, Zap, ArrowRight } from 'lucide-react';
import * as messages from '@/paraglide/messages';
import { DataStream } from './data-stream';

/**
 * AcceleratorZone Component
 * Product showcase section with:
 * - Scrollable feature list (left column)
 * - Sticky visual (right column, desktop only)
 * - Intersection Observer for auto-switching tabs
 */
export function AcceleratorZone() {
  const [activeTab, setActiveTab] = useState<'agent' | 'pay' | 'air'>('agent');

  return (
    <section
      id="execute"
      className="relative py-32 bg-gradient-to-b from-[#020617] to-[#050505] overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-emerald-500" />
            <span className="text-emerald-500 font-mono text-sm tracking-widest">
              {messages.jarvis_suite_zone1_label()}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            {messages.jarvis_suite_zone1_title()}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Left: Scrollable Trigger List */}
          <div className="lg:w-1/2 flex flex-col gap-12 pb-32">
            <FeatureItem
              id="agent"
              icon={<Brain className="w-8 h-8" />}
              title={messages.jarvis_suite_agent_title()}
              badge={messages.jarvis_suite_agent_badge()}
              desc={messages.jarvis_suite_agent_desc()}
              isActive={activeTab === 'agent'}
              onActivate={() => setActiveTab('agent')}
            />
            <FeatureItem
              id="pay"
              icon={<FileSignature className="w-8 h-8" />}
              title={messages.jarvis_suite_pay_title()}
              badge={messages.jarvis_suite_pay_badge()}
              desc={messages.jarvis_suite_pay_desc()}
              isActive={activeTab === 'pay'}
              onActivate={() => setActiveTab('pay')}
            />
            <FeatureItem
              id="air"
              icon={<Zap className="w-8 h-8" />}
              title={messages.jarvis_suite_air_title()}
              badge={messages.jarvis_suite_air_badge()}
              desc={messages.jarvis_suite_air_desc()}
              isActive={activeTab === 'air'}
              onActivate={() => setActiveTab('air')}
            />
          </div>

          {/* Right: Sticky Visual */}
          <div className="hidden lg:block lg:w-1/2 relative">
            <div className="sticky top-32 h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0F1115] shadow-2xl shadow-emerald-900/10 ring-1 ring-white/5">
              {/* Data Stream Background Effect */}
              <DataStream />

              {/* Render Active Visual */}
              <AnimatePresence mode="wait">
                {activeTab === 'agent' && (
                  <m.div
                    key="agent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555421689-491a97ff4181?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"
                  >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                    <div className="absolute bottom-10 left-10 right-10 bg-[#0a0a0a]/90 border border-emerald-500/30 p-6 rounded-xl shadow-lg">
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 animate-pulse">
                          <Brain className="w-4 h-4 text-black" />
                        </div>
                        <div>
                          <div className="text-emerald-400 text-xs font-mono mb-1">JARVIS AGENT</div>
                          <p className="text-sm text-gray-300">
                            Invoice #2024-889 scanned. Discrepancy found in line item 4.
                            Auto-correction applied based on contract clause 12.B.
                          </p>
                        </div>
                      </div>
                    </div>
                  </m.div>
                )}

                {activeTab === 'pay' && (
                  <m.div
                    key="pay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black" />
                    <div className="text-center relative z-10">
                      <div className="text-7xl font-bold text-white mb-2 tabular-nums">60 Days</div>
                      <div className="text-emerald-400 font-mono text-sm tracking-widest">
                        CERTIFICATION CYCLE
                      </div>
                    </div>
                  </m.div>
                )}

                {activeTab === 'air' && (
                  <m.div
                    key="air"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2089&auto=format&fit=crop')] bg-cover bg-center"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full border-[20px] border-emerald-500/10 animate-pulse" />
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * FeatureItem Component
 * Individual feature card with intersection observer
 */
interface FeatureItemProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  badge: string;
  desc: string;
  isActive: boolean;
  onActivate: () => void;
}

function FeatureItem({ icon, title, badge, desc, isActive, onActivate }: FeatureItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-50% 0px -50% 0px' });

  useEffect(() => {
    if (isInView) {
      onActivate();
    }
  }, [isInView, onActivate]);

  return (
    <div
      ref={ref}
      onClick={onActivate}
      className={`cursor-pointer py-8 pl-8 border-l-2 transition-all duration-500 ${
        isActive
          ? 'border-emerald-500 opacity-100 bg-white/05'
          : 'border-white/10 opacity-30 hover:opacity-60 hover:bg-white/05'
      } rounded-r-xl`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={isActive ? 'text-emerald-500' : 'text-gray-400'}>{icon}</div>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <span
          className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
            isActive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-white/5 text-gray-500 border-white/10'
          }`}
        >
          {badge}
        </span>
      </div>
      <p className="text-lg text-gray-400 mb-4 leading-relaxed">{desc}</p>
      <div
        className={`flex items-center gap-2 text-sm font-bold ${
          isActive ? 'text-white' : 'text-transparent'
        } transition-colors`}
      >
        Explore {title} <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
}
