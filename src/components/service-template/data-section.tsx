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
  colors: {
    textStrong: string;
    textBase: string;
    textSub: string;
    textSoft: string;
  };
}

const SECTION_TITLE = `text-[var(--text-sub)] text-3xl font-bold tracking-widest uppercase pb-4 inline-block mb-12`;

export const DataSection: React.FC<DataSectionProps> = ({ stats, colors }) => {
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
              Traditional construction is plagued by <span className={`${colors.textSoft}`}>uncertainty</span>. JARVIS delivers mathematical certainty.
            </p>
            
            <div className="mt-12 p-10 bg-[var(--surface-subtle)] text-[var(--text-strong)]">
              <span className={`block text-xs font-mono mb-4 ${colors.textSub} tracking-widest`}>
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

          <div className="grid grid-cols-2 gap-x-12 gap-y-16 mt-8 lg:mt-0">
            {stats.grid.map((stat, idx) => (
              <div key={idx} className={`flex flex-col justify-end border-l pl-6 ${idx % 2 === 0 ? 'border-[var(--border-strong)]' : 'border-[var(--border-subtle)]'}`}>
                <span className={`text-4xl md:text-5xl font-light mb-2 ${colors.textStrong}`}>{stat.val}</span>
                <span className={`text-xs font-bold tracking-widest uppercase ${colors.textSub}`}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
