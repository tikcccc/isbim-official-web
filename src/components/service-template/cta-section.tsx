'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/lib/i18n';
import { ROUTES } from '@/lib/constants';
import { ServiceTab } from '@/data/services';
import styles from './cta-section.module.css';

interface CtaSectionProps {
  activeTab: ServiceTab;
  title: string;
  bodyText: string;
  linkText: string;
  colors: {
    textInvStrong: string;
    textInvBase: string;
    textInvSub: string;
    textInvMuted: string;
  };
}

export const CtaSection: React.FC<CtaSectionProps> = ({ activeTab, title, bodyText, linkText, colors }) => {
  return (
    <footer className={`${styles.ctaFooter} bg-[var(--surface-dark)] relative z-20`} data-service={activeTab}>
      <div className="service-shell py-16 md:py-24">
        <div className={`${styles.ctaContent}`}>
          <h2 className={`font-display-section text-4xl md:text-6xl font-bold tracking-tighter ${colors.textInvStrong}`}>{title}</h2>
          <p className={`font-body-lg text-lg md:text-xl ${colors.textInvBase} leading-relaxed`}>
            {bodyText}
          </p>
          <Link href={ROUTES.CONTACT} className={`font-body-base inline-flex items-center text-lg md:text-xl transition-colors group ${colors.textInvBase} hover:${colors.textInvMuted}`}>
            {linkText} <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform"/>
          </Link>
        </div>
      </div>
    </footer>
  );
};
