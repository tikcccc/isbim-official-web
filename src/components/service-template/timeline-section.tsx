'use client';

import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { m } from '@/components/motion/lazy-motion';
import { useInView } from '@/hooks';
import { DESIGN_TOKENS } from '@/lib/design-tokens';

interface TimelineItem {
  year: string;
  title: string;
  desc: string;
  isNow?: boolean;
}

interface TimelineSectionProps {
  heading: string;
  items: TimelineItem[];
  sectionTitleClass: string;
  colors: {
    textStrong: string;
    textBase: string;
    textSub: string;
    textMuted: string;
  };
  inline?: boolean;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  heading,
  items,
  sectionTitleClass,
  colors,
  inline = false,
}) => {
  const shouldReduceMotion = !!useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
    initialInView: shouldReduceMotion,
  });

  const itemVariants = {
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

  const timelineContent = (
    <>
      <h3 className={`${sectionTitleClass} mb-6`}>{heading}</h3>

      <div className="relative">
        {/* Desktop line */}
        <div
          className="hidden md:block absolute top-[18px] left-0 right-0 h-px bg-[var(--border-subtle)]"
          aria-hidden
        />

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12"
        >
          {items.map((item, idx) => (
            <m.div
              key={`${item.year}-${idx}`}
              className="relative flex flex-col items-center md:items-start text-center md:text-left pt-8 md:pt-12"
              initial={shouldReduceMotion ? 'visible' : 'hidden'}
              animate={shouldReduceMotion ? 'visible' : inView ? 'visible' : 'hidden'}
              variants={itemVariants}
              transition={{ delay: shouldReduceMotion ? 0 : idx * 0.05 }}
            >
              {/* Mobile vertical line */}
              {idx < items.length - 1 ? (
                <div
                  className="md:hidden absolute left-1/2 -translate-x-1/2 top-4 bottom-[-2.5rem] w-px bg-[var(--border-subtle)]"
                  aria-hidden
                />
              ) : null}

              {/* Dot */}
              <span
                className={`absolute left-1/2 -translate-x-1/2 top-1 w-4 h-4 rounded-full bg-[#2f64ff] ring-4 ring-white shadow-[0_0_0_6px_rgba(47,100,255,0.08)] ${item.isNow ? 'scale-110 shadow-[0_0_0_10px_rgba(47,100,255,0.12)]' : ''}`}
                aria-hidden
              />

              <span className={`mt-3 text-sm font-semibold uppercase tracking-[0.18em] ${colors.textSub}`}>
                {item.year}
              </span>
              <h4 className={`mt-2 text-2xl font-semibold leading-tight ${colors.textStrong}`}>
                {item.title}
              </h4>
              <p className={`mt-2 text-base leading-relaxed ${colors.textMuted}`}>
                {item.desc}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </>
  );

  if (inline) {
    return <div className="mt-10 md:mt-12">{timelineContent}</div>;
  }

  return (
    <section className="service-section-lg bg-[var(--surface-base)] relative z-20">
      <div className="service-shell">{timelineContent}</div>
    </section>
  );
};
