'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { m } from '@/components/motion/lazy-motion';
import { FooterCharcoal } from '@/components/layout/footer-charcoal';
import { SERVICE_CONTENT, ServiceTab } from '@/data/services';
import { HeroSection } from './hero-section';
import { MethodologySection } from './methodology-section';
import { EngineSection } from './engine-section';
import { DataSection } from './data-section';
import { GallerySection } from './gallery-section';
import { CtaSection } from './cta-section';
import { DESIGN_TOKENS } from '@/lib/design-tokens';

// Token-aligned color class shortcuts
const COLORS = {
  textStrong: 'text-[var(--text-strong)]',
  textBase: 'text-[var(--text-base)]',
  textMuted: 'text-[var(--text-muted)]',
  textSub: 'text-[var(--text-sub)]',
  textSoft: 'text-[var(--text-soft)]',
  textVSoft: 'text-[var(--text-vsoft)]',
  textInvStrong: 'text-[var(--text-inverse-strong)]',
  textInvBase: 'text-[var(--text-inverse-base)]',
  textInvMuted: 'text-[var(--text-inverse-muted)]',
  textInvSub: 'text-[var(--text-inverse-sub)]',
  textInvVSoft: 'text-[var(--text-inverse-vsoft)]',
  bgLight: 'bg-[var(--surface-base)]',
  bgGray: 'bg-[var(--surface-subtle)]',
  bgDark: 'bg-[var(--surface-dark)]',
};

const SECTION_TITLE_STYLE = `${COLORS.textSub} text-3xl font-bold tracking-widest uppercase pb-4 inline-block mb-12`;

interface ServiceTemplateProps {
  initialService: ServiceTab;
}

export function ServiceTemplate({ initialService }: ServiceTemplateProps) {
  const [activeTab] = useState<ServiceTab>(initialService);
  const content = SERVICE_CONTENT[activeTab];
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className={`service-page min-h-screen font-sans selection:bg-[var(--surface-hero)] selection:text-[var(--text-inverse-strong)] transition-colors duration-700`}>
      {/* Parallax background */}
      <div className="fixed inset-0 w-full h-screen z-0">
        <m.img 
          key={content.hero.img}
          src={content.hero.img} 
          alt={`${content.hero.title} hero`} 
          className="w-full h-full object-cover"
          initial={
            prefersReducedMotion ? undefined : { opacity: 0, scale: 1.06, y: 12 }
          }
          animate={
            prefersReducedMotion ? undefined : { opacity: 1, scale: 1, y: 0 }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: DESIGN_TOKENS.animation.duration.page,
                  ease: DESIGN_TOKENS.animation.easing.smooth,
                }
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
      </div>

      {/* Scrollable content */}
      <div className="relative z-10">
        <HeroSection hero={content.hero} />
        <MethodologySection
          narrative={content.narrative}
          sectionTitleClass={SECTION_TITLE_STYLE}
          colors={{
            textStrong: COLORS.textStrong,
            textBase: COLORS.textBase,
            textMuted: COLORS.textMuted,
          }}
        />
        <EngineSection
          items={content.engine}
          sectionTitleClass={SECTION_TITLE_STYLE}
          colors={{
            textStrong: COLORS.textStrong,
            textBase: COLORS.textBase,
            textMuted: COLORS.textMuted,
            textSub: COLORS.textSub,
          }}
        />
        <DataSection
          stats={content.stats}
          colors={{
            textStrong: COLORS.textStrong,
            textBase: COLORS.textBase,
            textSub: COLORS.textSub,
            textSoft: COLORS.textSoft,
          }}
        />
        <GallerySection
          gallery={content.gallery}
          colors={{
            textInvStrong: COLORS.textInvStrong,
            textInvBase: COLORS.textInvBase,
            textInvMuted: COLORS.textInvMuted,
            textInvSub: COLORS.textInvSub,
          }}
        />
        <CtaSection
          activeTab={activeTab}
          colors={{
            textInvStrong: COLORS.textInvStrong,
            textInvBase: COLORS.textInvBase,
            textInvSub: COLORS.textInvSub,
            textInvMuted: COLORS.textInvMuted,
          }}
        />
        <FooterCharcoal />
      </div>
    </div>
  );
}

export default ServiceTemplate;
