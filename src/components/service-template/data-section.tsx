'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { m } from '@/components/motion/lazy-motion';
import { TypewriterText } from '@/components/animations';
import { useInView } from '@/hooks';
import { DESIGN_TOKENS } from '@/lib/design-tokens';
import { ServiceContent } from '@/data/services';

interface DataSectionProps {
  stats: ServiceContent['stats'];
  introText: string;
  colors: {
    textStrong: string;
    textBase: string;
    textSub: string;
    textSoft: string;
  };
}

const SECTION_TITLE = `text-[var(--text-sub)] text-3xl font-bold tracking-widest uppercase pb-4 inline-block mb-12`;

export const DataSection: React.FC<DataSectionProps> = ({ stats, introText, colors }) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = !!prefersReducedMotion;
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
    initialInView: shouldReduceMotion,
  });
  const [startTypewriter, setStartTypewriter] = useState(shouldReduceMotion);

  useEffect(() => {
    if (inView) {
      setStartTypewriter(true);
    }
  }, [inView]);

  const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DESIGN_TOKENS.animation.duration.slow,
        ease: DESIGN_TOKENS.animation.easing.easeOut,
      },
    },
  };

  return (
    <section className={`service-section-xl bg-[var(--surface-base)] relative z-20`}>
      <div className="service-shell">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <m.div
            ref={ref}
            className="relative"
            initial={shouldReduceMotion ? 'visible' : 'hidden'}
            animate={shouldReduceMotion ? 'visible' : inView ? 'visible' : 'hidden'}
            variants={cardVariants}
          >
            <h3 className={SECTION_TITLE}>{stats.label}</h3>

            <p className={`text-2xl leading-relaxed ${colors.textBase} font-light mt-4`}>
              {introText}
            </p>
            
            <div className="mt-12 p-10 bg-[var(--surface-subtle)] text-[var(--text-strong)]">
              <span className={`block text-sm md:text-base font-mono font-semibold mb-4 ${colors.textSub} tracking-widest uppercase`}>
                {startTypewriter && !shouldReduceMotion ? (
                  <TypewriterText
                    text={stats.main.label}
                    className={`${colors.textSub}`}
                    delay={0}
                    cursorVisible={false}
                  />
                ) : (
                  <span aria-hidden>{stats.main.label}</span>
                )}
              </span>
              <span className="text-6xl md:text-8xl font-bold tracking-tighter">
                {stats.main.val}
              </span>
            </div>
          </m.div>

          {stats.comparison?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-12 mt-14 lg:mt-2 w-full max-w-6xl">
              {stats.comparison.map((item, idx) => (
                <div
                  key={`${item.label}-${idx}`}
                  className="flex flex-col gap-7 pb-10 border-b border-[var(--border-subtle)] max-w-full justify-center"
                >
                  <span className={`text-lg font-bold tracking-[0.2em] uppercase ${colors.textSub}`}>
                    {item.label}
                  </span>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[11px] font-mono tracking-widest ${colors.textSub}`}>Before</span>
                      <span className={`text-4xl md:text-5xl font-semibold whitespace-nowrap ${colors.textSoft}`}>{item.before}</span>
                    </div>
                    <span className={`text-xl font-semibold ${colors.textSub} flex items-center leading-none`}>→</span>
                    <div className="flex flex-col gap-1">
                      <span className={`text-[11px] font-mono tracking-widest ${colors.textSub}`}>After</span>
                      <span className={`text-4xl md:text-5xl font-bold whitespace-nowrap ${colors.textStrong}`}>{item.after}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-12 gap-y-16 mt-8 lg:mt-0">
              {stats.grid.map((stat, idx) => (
                <div key={idx} className={`flex flex-col justify-end border-l pl-6 ${idx % 2 === 0 ? 'border-[var(--border-strong)]' : 'border-[var(--border-subtle)]'}`}>
                  <span className={`text-4xl md:text-5xl font-light mb-2 ${colors.textStrong}`}>{stat.val}</span>
                  <span className={`text-xs font-bold tracking-widest uppercase ${colors.textSub}`}>{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
