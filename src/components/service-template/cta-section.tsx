'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/lib/i18n';
import { ROUTES } from '@/lib/constants';
import { ServiceTab } from '@/data/services';

interface CtaSectionProps {
  activeTab: ServiceTab;
  colors: {
    textInvStrong: string;
    textInvBase: string;
    textInvSub: string;
    textInvMuted: string;
  };
}

export const CtaSection: React.FC<CtaSectionProps> = ({ activeTab, colors }) => {
  return (
    <footer className="min-h-[55vh] bg-[var(--surface-dark)] border-t border-[rgba(255,255,255,0.1)] relative z-20 flex items-center">
      <div className="service-shell w-full py-16 md:py-24 flex flex-col md:flex-row md:items-center md:justify-between gap-12">
        <div className="max-w-3xl space-y-6">
          <h2 className={`text-4xl md:text-6xl font-bold tracking-tighter ${colors.textInvStrong}`}>Ready to Transform?</h2>
          <p className={`text-lg md:text-xl ${colors.textInvBase} leading-relaxed`}>
            Book a tailored {activeTab} session and see how JARVIS closes risk gaps with live transparency and execution playbooks.
          </p>
          <Link href={ROUTES.CONTACT} className={`inline-flex items-center text-lg md:text-xl transition-colors group ${colors.textInvBase} hover:${colors.textInvMuted}`}>
            Book your {activeTab} session <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform"/>
          </Link>
        </div>
      </div>
    </footer>
  );
};
