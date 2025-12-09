'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { m } from '@/components/motion/lazy-motion';
import { FooterCharcoal } from '@/components/layout/footer-charcoal';
import {
  getLocalizedServiceContent,
  getLocalizedServiceMeta,
  ServiceTab,
} from '@/data/services';
import { HeroSection } from './hero-section';
import { MethodologySection } from './methodology-section';
import { EngineSection } from './engine-section';
import { DataSection } from './data-section';
import { GallerySection } from './gallery-section';
import { CtaSection } from './cta-section';
import { DESIGN_TOKENS } from '@/lib/design-tokens';
import * as messages from '@/paraglide/messages';

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
  const content = getLocalizedServiceContent(activeTab);
  const meta = getLocalizedServiceMeta(activeTab);
  const prefersReducedMotion = useReducedMotion();
  const engineHeading =
    activeTab === "JPM"
      ? messages.service_jpm_engine_heading
        ? messages.service_jpm_engine_heading()
        : messages.service_engine_heading()
      : messages.service_engine_heading();
  const galleryHeading = messages.service_gallery_heading();
  const ctaTitle = messages.service_cta_title();
  const ctaBody = activeTab === "JPM"
    ? messages.service_cta_body_prefix_jpm()
    : `${messages.service_cta_body_prefix()}${meta.title}${messages.service_cta_body_suffix()}`;
  const ctaLinkText = `${messages.service_cta_link_prefix()}${meta.title}${messages.service_cta_link_suffix()}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className={`service-page relative min-h-screen font-sans selection:bg-[var(--surface-hero)] selection:text-[var(--text-inverse-strong)] transition-colors duration-700 overflow-hidden`}>
      {/* Parallax background */}
      <div className="absolute top-0 left-0 right-0 w-full h-[120vh] z-0 overflow-hidden pointer-events-none">
        <m.div
          key={content.hero.img}
          className="absolute inset-0"
          initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 1.06, y: 12 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: DESIGN_TOKENS.animation.duration.page,
                  ease: DESIGN_TOKENS.animation.easing.smooth,
                }
          }
        >
          <Image
            src={content.hero.img}
            alt={`${content.hero.title} hero`}
            fill
            priority
            className="object-cover"
          />
        </m.div>
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
            textSub: COLORS.textSub,
          }}
          timeline={activeTab === "BIM" ? content.timeline : undefined}
        />
        <EngineSection
          items={content.engine}
          heading={engineHeading}
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
          introText={content.stats.intro}
          colors={{
            textStrong: COLORS.textStrong,
            textBase: COLORS.textBase,
            textSub: COLORS.textSub,
            textSoft: COLORS.textSoft,
          }}
        />
        <GallerySection
          gallery={content.gallery}
          heading={galleryHeading}
          colors={{
            textInvStrong: COLORS.textInvStrong,
            textInvBase: COLORS.textInvBase,
            textInvMuted: COLORS.textInvMuted,
            textInvSub: COLORS.textInvSub,
          }}
        />
        <CtaSection
          activeTab={activeTab}
          title={ctaTitle}
          bodyText={ctaBody}
          linkText={ctaLinkText}
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
