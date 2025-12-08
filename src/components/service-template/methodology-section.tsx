'use client';

import React from 'react';
import { ServiceContent } from '@/data/services';

interface MethodologySectionProps {
  narrative: ServiceContent['narrative'];
  sectionTitleClass: string;
  colors: {
    textStrong: string;
    textBase: string;
    textMuted: string;
  };
}

export const MethodologySection: React.FC<MethodologySectionProps> = ({
  narrative,
  sectionTitleClass,
  colors,
}) => {
  return (
    <section className="min-h-screen bg-[var(--surface-base)] relative z-20 flex items-center shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
      <div className="service-shell py-16 md:py-24">
        <h2 className={`${sectionTitleClass} mb-10 md:mb-14`}>
          {narrative.label}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
          <div className="md:col-span-6">
            <p className={`text-[clamp(3rem,4.75vw,4.6rem)] font-bold leading-tight tracking-tight ${colors.textStrong} space-y-3`}>
              {narrative.lead} <br/>
              <span className={`${colors.textMuted} font-medium block text-[clamp(2.6rem,4.2vw,3.6rem)]`}>
                {narrative.sub}
              </span>
            </p>
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
      </div>
    </section>
  );
};
