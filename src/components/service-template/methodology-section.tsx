'use client';

import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { DESIGN_TOKENS } from '@/lib/design-tokens';
import { ServiceContent } from '@/data/services';
import { TimelineSection } from './timeline-section';

interface MethodologySectionProps {
  narrative: ServiceContent['narrative'];
  sectionTitleClass: string;
  colors: {
    textStrong: string;
    textBase: string;
    textMuted: string;
    textSub: string;
  };
  timeline?: ServiceContent['timeline'];
}

export const MethodologySection: React.FC<MethodologySectionProps> = ({
  narrative,
  sectionTitleClass,
  colors,
  timeline,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const title = (
    <h2 className={`${sectionTitleClass} mb-10 md:mb-14`}>
      {narrative.label}
    </h2>
  );

  const leadBlock = (
    <p className={`text-[clamp(3rem,4.75vw,4.6rem)] font-bold leading-tight tracking-tight ${colors.textStrong} space-y-3`}>
      {narrative.lead} <br/>
      <span className={`${colors.textMuted} font-medium block text-[clamp(2.6rem,4.2vw,3.6rem)]`}>
        {narrative.sub}
      </span>
    </p>
  );

  return (
    <section className="min-h-screen bg-[var(--surface-base)] relative z-20 flex items-center">
      <div className="service-shell py-16 md:py-24">
        {shouldReduceMotion ? (
          title
        ) : (
          <ScrollReveal animation="slide-up" duration={DESIGN_TOKENS.animation.duration.slow}>
            {title}
          </ScrollReveal>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
          <div className="md:col-span-6">
            {shouldReduceMotion ? (
              leadBlock
            ) : (
              <ScrollReveal animation="slide-up" duration={DESIGN_TOKENS.animation.duration.slow} delay={0.08}>
                {leadBlock}
              </ScrollReveal>
            )}
          </div>
          
          <div className="md:col-span-1 hidden md:block h-full">
            <div className="h-full w-px bg-[var(--border-strong)] mx-auto"></div>
          </div> 

          <div className="md:col-span-5 space-y-8">
            <p className={`text-[clamp(1.05rem,2.2vw,1.3rem)] ${colors.textBase} leading-relaxed font-light`}>
              {narrative.p1}
            </p>
            <p className={`text-[clamp(1.05rem,2.2vw,1.3rem)] ${colors.textMuted} leading-relaxed`}>
              {narrative.p2}
            </p>
          </div>
        </div>

        {timeline ? (
          <div className="mt-24 md:mt-28 pt-4">
            <TimelineSection
              inline
              heading={timeline.heading}
              items={timeline.items}
              sectionTitleClass={sectionTitleClass}
              colors={{
                textStrong: colors.textStrong,
                textBase: colors.textBase,
                textSub: colors.textSub,
                textMuted: colors.textMuted,
              }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};
