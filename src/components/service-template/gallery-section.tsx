'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { m } from '@/components/motion/lazy-motion';
import { TypewriterText } from '@/components/animations';
import { useInView } from '@/hooks';
import { DESIGN_TOKENS } from '@/lib/design-tokens';
import { ServiceContent } from '@/data/services';

interface GallerySectionProps {
  gallery: ServiceContent['gallery'];
  colors: {
    textInvStrong: string;
    textInvBase: string;
    textInvMuted: string;
    textInvSub: string;
  };
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery, colors }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="service-section-xl bg-[var(--surface-dark)] relative z-20">
      <div className="service-shell">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-[rgba(255,255,255,0.2)] pb-8">
          <div>
            <span className={`block text-3xl font-bold tracking-widest uppercase pb-4 inline-block mb-12 ${colors.textInvSub}`}>
              THE GALLERY
            </span>
            <h2 className={`text-4xl md:text-6xl font-bold tracking-tight ${colors.textInvStrong}`}>{gallery.title}</h2>
          </div>
          <div className="text-right mt-8 md:mt-0">
            <p className={`text-xl md:text-2xl font-mono ${colors.textInvBase}`}>{gallery.meta}</p>
          </div>
        </div>

        <div className="space-y-32">
          {gallery.items.map((item, idx) => (
            <GalleryItem
              key={idx}
              item={item}
              index={idx}
              colors={colors}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface GalleryItemProps {
  item: GallerySectionProps['gallery']['items'][number];
  index: number;
  colors: GallerySectionProps['colors'];
  shouldReduceMotion: boolean;
}

function GalleryItem({ item, index, colors, shouldReduceMotion }: GalleryItemProps) {
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

  const rowVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DESIGN_TOKENS.animation.duration.slow,
        ease: DESIGN_TOKENS.animation.easing.easeOut,
        delay: shouldReduceMotion ? 0 : index * 0.08,
      },
    },
  };

  const labelText = `${item.id} — ${item.loc}`;

  return (
    <m.div
      ref={ref}
      className="group grid grid-cols-1 md:grid-cols-12 gap-12 items-center cursor-pointer"
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      animate={shouldReduceMotion ? 'visible' : inView ? 'visible' : 'hidden'}
      variants={rowVariants}
    >
      <div className={`md:col-span-7 overflow-hidden ${index % 2 === 1 ? 'md:order-2' : ''}`}>
        <div className="h-[400px] md:h-[600px] relative overflow-hidden bg-[var(--surface-dark)]">
          <img
            src={item.img}
            alt={item.loc}
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-1000 ease-out grayscale group-hover:grayscale-0"
          />
        </div>
      </div>
      <div className={`md:col-span-5 flex flex-col h-full justify-center py-4 ${index % 2 === 1 ? 'md:order-1 md:text-right' : ''}`}>
        <div>
          <span className={`text-xs font-mono mb-6 block ${colors.textInvSub} tracking-widest`}>
            {startTypewriter && !shouldReduceMotion ? (
              <TypewriterText
                text={labelText}
                className={colors.textInvSub}
                delay={index * DESIGN_TOKENS.animation.stagger.relaxed}
                cursorVisible={false}
              />
            ) : (
              <span aria-hidden>{labelText}</span>
            )}
          </span>
          <h3 className={`text-3xl md:text-4xl font-bold mb-6 ${colors.textInvStrong} group-hover:${colors.textInvMuted} transition-colors`}>
            {item.title}
          </h3>
          <p className={`text-lg font-light leading-relaxed mb-8 ${colors.textInvBase} ${index % 2 === 1 ? 'ml-auto' : ''} max-w-md`}>
            {item.desc}
          </p>
        </div>
        <div className={`flex items-center border-t border-[rgba(255,255,255,0.2)] pt-6 ${index % 2 === 1 ? 'justify-end' : 'justify-between'}`}>
          <span className={`text-2xl font-mono ${colors.textInvStrong} ${index % 2 === 1 ? 'order-2 ml-4' : ''}`}>{item.metric}</span>
          <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-white" />
        </div>
      </div>
    </m.div>
  );
}
