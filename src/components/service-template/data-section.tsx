'use client';

import React from 'react';
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
  return (
    <section className={`service-section-xl bg-[var(--surface-base)] relative z-20`}>
      <div className="service-shell">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="relative">
            <h3 className={SECTION_TITLE}>
              {stats.label}
            </h3>

            <p className={`text-2xl leading-relaxed ${colors.textBase} font-light mt-4`}>
              Traditional construction is plagued by <span className={`${colors.textSoft}`}>uncertainty</span>. JARVIS delivers mathematical certainty.
            </p>
            
            <div className="mt-12 p-10 bg-[var(--surface-subtle)] text-[var(--text-strong)]">
              <span className={`block text-xs font-mono mb-4 ${colors.textSub} tracking-widest`}>
                {stats.main.label}
              </span>
              <span className="text-6xl md:text-8xl font-bold tracking-tighter">
                {stats.main.val}
              </span>
            </div>
          </div>

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
