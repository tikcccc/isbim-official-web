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

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: DESIGN_TOKENS.animation.easing.easeOut,
      },
    },
  };

  const timelineContent = (
    <>
      <h3 className={`${sectionTitleClass} mb-12 md:mb-16`}>{heading}</h3>

      <div className="relative pt-6">
        {/* Desktop animated progress line */}
        <div className="hidden md:block absolute top-[30px] left-0 right-0 h-[2px]" aria-hidden>
          {/* Base line (subtle) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--border-subtle)] via-[var(--border-subtle)] to-transparent opacity-40" />

          {/* Animated progress line (strong) */}
          {!shouldReduceMotion && (
            <m.div
              className="absolute inset-0 bg-gradient-to-r from-[#2f64ff] via-[#4f7dff] to-[#6f9aff] origin-left shadow-[0_0_8px_rgba(47,100,255,0.4)]"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{
                duration: 2.5,
                ease: DESIGN_TOKENS.animation.easing.easeInOut,
              }}
            />
          )}
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 lg:gap-12"
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
                  className="md:hidden absolute left-1/2 -translate-x-1/2 top-6 bottom-[-3rem] w-[2px] bg-gradient-to-b from-[var(--border-subtle)] to-transparent"
                  aria-hidden
                />
              ) : null}

              {/* Dot with animation and pulse effect */}
              <m.span
                className={`absolute left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-0 top-2 md:top-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#2f64ff] to-[#1e4ed8] ring-[3px] ring-white shadow-[0_0_0_8px_rgba(47,100,255,0.1)] ${
                  item.isNow
                    ? 'md:scale-125 md:shadow-[0_0_0_12px_rgba(47,100,255,0.2),0_0_16px_rgba(47,100,255,0.4)] md:ring-[4px]'
                    : ''
                }`}
                aria-hidden
                initial={shouldReduceMotion ? 'visible' : 'hidden'}
                animate={shouldReduceMotion ? 'visible' : inView ? 'visible' : 'hidden'}
                variants={dotVariants}
                transition={{
                  delay: shouldReduceMotion ? 0 : (idx / items.length) * 2.5,
                }}
              />

              {/* Year badge */}
              <div className="flex items-center gap-3 mb-4 md:mb-3">
                <span className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] ${colors.textSub} ${item.isNow ? 'md:text-[#2f64ff]' : ''}`}>
                  {item.year}
                </span>
                {item.isNow && (
                  <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#2f64ff] to-[#4f7dff] text-white rounded-full">
                    Current
                  </span>
                )}
              </div>

              {/* Title */}
              <h4 className={`text-xl md:text-2xl font-bold leading-tight mb-3 ${colors.textStrong} ${item.isNow ? 'md:text-[#2f64ff]' : ''}`}>
                {item.title}
              </h4>

              {/* Description */}
              <p className={`text-sm md:text-base leading-relaxed ${colors.textMuted} max-w-[280px] md:max-w-none`}>
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
