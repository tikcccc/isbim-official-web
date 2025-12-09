'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { TypewriterText } from '@/components/animations';
import { DESIGN_TOKENS } from '@/lib/design-tokens';
import { ServiceContent } from '@/data/services';

interface HeroSectionProps {
  hero: ServiceContent['hero'];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero }) => {
  const shouldReduceMotion = useReducedMotion();
  const descText = hero.desc.includes('\n') ? hero.desc : hero.desc.replace(' — ', '\n— ');
  const tagLine = shouldReduceMotion ? (
    <span className="text-white/60 text-lg md:text-xl mt-4 block font-mono uppercase tracking-[0.22em]">
      {hero.tag}
    </span>
  ) : (
    <TypewriterText
      text={hero.tag}
      className="text-white/60 text-lg md:text-xl mt-4 block font-mono uppercase tracking-[0.22em]"
      cursorVisible={false}
    />
  );

  return (
    <header className="relative min-h-screen w-full flex flex-col justify-end pointer-events-none">
      <div className="w-full px-6 md:px-12 lg:px-16 relative z-10 pb-20 md:pb-32 text-white pointer-events-auto">
        <div className="grid grid-cols-12 gap-6 items-end">
          
          {/* Main Title Area */}
          <div className="col-span-12 lg:col-span-8">
            <ScrollReveal animation="slide-up" duration={DESIGN_TOKENS.animation.duration.slow}>
              <div className="w-24 h-1 bg-white mb-8"></div>
            </ScrollReveal>
            
            <ScrollReveal animation="slide-up" duration={DESIGN_TOKENS.animation.duration.slow}>
              <h1 className="text-[15vw] md:text-[10rem] font-black leading-[0.8] tracking-tighter mb-4 mix-blend-overlay opacity-90">
                {hero.title}
              </h1>
            </ScrollReveal>
            <ScrollReveal animation="slide-up" duration={DESIGN_TOKENS.animation.duration.slow} delay={0.12}>
              <h2 className="text-4xl md:text-7xl font-light tracking-tight text-white/90 leading-none">
                {hero.subTitle}
              </h2>
            </ScrollReveal>
          </div>

          {/* Description & Meta Area */}
          <div className="col-span-12 lg:col-span-4 flex flex-col justify-end">
            <ScrollReveal animation="fade" duration={DESIGN_TOKENS.animation.duration.normal} delay={0.1}>
              <div className="border-l-2 border-white/30 pl-6 mb-8">
                <p className="text-xl md:text-2xl font-light leading-relaxed text-white/80 whitespace-pre-line">
                  {descText}
                </p>
                {tagLine}
              </div>
            </ScrollReveal>
            
            <div className="animate-bounce">
              <ChevronDown className="w-6 h-6 text-white/50" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
