'use client';

import React from 'react';
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
  return (
    <section className="min-h-screen bg-[var(--surface-subtle)] relative z-20 flex items-center">
      <div className="service-shell py-16 md:py-24">
        <h3 className={`${sectionTitleClass} mb-10 md:mb-14`}>THE ENGINE</h3>
        
        <div className="flex flex-col">
          {items.map((item, idx) => (
            <div key={idx} className={`group flex flex-col md:flex-row md:items-start border-t border-[var(--border-subtle)] py-10 md:py-12 transition-colors duration-300 hover:bg-[var(--surface-base)]
              ${idx === 0 ? 'border-t-[var(--border-strong)]' : ''}
              ${idx === items.length - 1 ? 'border-b border-[var(--border-subtle)]' : ''}
            `}>
                <span className={`text-sm font-mono mr-8 md:mr-12 ${colors.textSub} group-hover:${colors.textStrong} transition-colors min-w-[3ch]`}>
                  {item.id}
                </span>
                <h4 className={`text-3xl md:text-4xl font-medium w-full md:w-1/3 mb-4 md:mb-0 ${colors.textStrong}`}>
                  {item.title}
                </h4>
                <p className={`w-full md:w-1/2 text-lg md:text-xl font-light leading-relaxed ${colors.textMuted} group-hover:${colors.textBase} transition-colors`}>
                    {item.desc}
                </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
