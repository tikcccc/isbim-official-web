'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ServiceContent } from '@/data/services';

interface HeroSectionProps {
  hero: ServiceContent['hero'];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero }) => {
  return (
    <header className="relative min-h-screen w-full flex flex-col justify-end pointer-events-none">
      <div className="service-shell relative z-10 pb-20 md:pb-32 text-white pointer-events-auto">
        <div className="grid grid-cols-12 gap-6 items-end">
          
          {/* Main Title Area */}
          <div className="col-span-12 lg:col-span-8">
            {/* Decorative Line */}
            <div className="w-24 h-1 bg-white mb-8"></div>
            
            <h1 className="text-[15vw] md:text-[10rem] font-black leading-[0.8] tracking-tighter mb-4 mix-blend-overlay opacity-90">
              {hero.title}
            </h1>
            <h2 className="text-4xl md:text-7xl font-light tracking-tight text-white/90 leading-none">
              {hero.subTitle}
            </h2>
          </div>

          {/* Description & Meta Area */}
          <div className="col-span-12 lg:col-span-4 flex flex-col justify-end">
            <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-white/80 border-l-2 border-white/30 pl-6">
              {hero.desc} <br/>
              <span className="text-white/50 text-base mt-2 block font-mono uppercase tracking-wider">{hero.tag}</span>
            </p>
            
            <div className="animate-bounce">
              <ChevronDown className="w-6 h-6 text-white/50" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
