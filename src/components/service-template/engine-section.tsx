'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { m } from '@/components/motion/lazy-motion';
import { TypewriterText } from '@/components/animations';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { useInView } from '@/hooks';
import { DESIGN_TOKENS } from '@/lib/design-tokens';
import { ServiceContent } from '@/data/services';

interface EngineSectionProps {
  items: ServiceContent['engine'];
  sectionTitleClass: string;
  colors: {
    textStrong: string;
    textBase: string;
    textMuted: string;
    textSub: string;
  };
}

export const EngineSection: React.FC<EngineSectionProps> = ({
  items,
  sectionTitleClass,
  colors,
}) => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: DESIGN_TOKENS.animation.stagger.relaxed,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
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
    <section className="min-h-screen bg-[var(--surface-subtle)] relative z-20 flex items-center">
      <div className="service-shell py-16 md:py-24">
        {shouldReduceMotion ? (
          <h3 className={`${sectionTitleClass} mb-10 md:mb-14`}>THE ENGINE</h3>
        ) : (
          <ScrollReveal animation="slide-up" duration={DESIGN_TOKENS.animation.duration.slow}>
            <h3 className={`${sectionTitleClass} mb-10 md:mb-14`}>THE ENGINE</h3>
          </ScrollReveal>
        )}
        
        <m.div
          ref={ref}
          className="flex flex-col"
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          animate={shouldReduceMotion ? 'visible' : inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {items.map((item, idx) => (
            <m.div
              key={idx}
              variants={itemVariants}
              className={`group flex flex-col md:flex-row md:items-start border-t border-[var(--border-subtle)] py-10 md:py-12 transition-colors duration-300 hover:bg-[var(--surface-base)]
              ${idx === 0 ? 'border-t-[var(--border-strong)]' : ''}
              ${idx === items.length - 1 ? 'border-b border-[var(--border-subtle)]' : ''}
            `}>
              <span className={`text-sm font-mono mr-8 md:mr-12 ${colors.textSub} group-hover:${colors.textStrong} transition-colors min-w-[3ch]`}>
                {startTypewriter && !shouldReduceMotion ? (
                  <TypewriterText
                    text={item.id}
                    className={`inline-block ${colors.textSub}`}
                    delay={idx * DESIGN_TOKENS.animation.stagger.relaxed}
                    cursorVisible={false}
                  />
                ) : (
                  <span aria-hidden>{item.id}</span>
                )}
              </span>
              <h4
                className={`text-3xl md:text-4xl font-medium w-full md:w-1/3 mb-4 md:mb-0 ${colors.textStrong}`}
              >
                {item.title}
              </h4>
              <p
                className={`w-full md:w-1/2 text-lg md:text-xl font-light leading-relaxed ${colors.textMuted} group-hover:${colors.textBase} transition-colors`}
              >
                {item.desc}
              </p>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
};
