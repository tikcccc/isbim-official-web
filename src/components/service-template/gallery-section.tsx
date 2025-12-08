'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
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
  return (
    <section className={`service-section-xl bg-[var(--surface-dark)] relative z-20`}>
      <div className="service-shell">
        <div className={`flex flex-col md:flex-row justify-between items-end mb-20 border-b border-[rgba(255,255,255,0.2)] pb-8`}>
          <div>
            <span className={`block text-3xl font-bold tracking-widest uppercase pb-4 inline-block mb-12 ${colors.textInvSub}`}>THE GALLERY</span>
            <h2 className={`text-4xl md:text-6xl font-bold tracking-tight ${colors.textInvStrong}`}>{gallery.title}</h2>
          </div>
          <div className="text-right mt-8 md:mt-0">
            <p className={`text-xl md:text-2xl font-mono ${colors.textInvBase}`}>{gallery.meta}</p>
          </div>
        </div>

        <div className="space-y-32">
          {gallery.items.map((item, idx) => (
            <div key={idx} className="group grid grid-cols-1 md:grid-cols-12 gap-12 items-center cursor-pointer">
              {/* Alternating Layout */}
              <div className={`md:col-span-7 overflow-hidden ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="h-[400px] md:h-[600px] relative overflow-hidden bg-[var(--surface-dark)]">
                  <img src={item.img} alt={item.loc} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-1000 ease-out grayscale group-hover:grayscale-0" />
                </div>
              </div>
              <div className={`md:col-span-5 flex flex-col h-full justify-center py-4 ${idx % 2 === 1 ? 'md:order-1 md:text-right' : ''}`}>
                <div>
                  <span className={`text-xs font-mono mb-6 block ${colors.textInvSub} tracking-widest`}>
                    {item.id} — {item.loc}
                  </span>
                  <h3 className={`text-3xl md:text-4xl font-bold mb-6 ${colors.textInvStrong} group-hover:${colors.textInvMuted} transition-colors`}>{item.title}</h3>
                  <p className={`text-lg font-light leading-relaxed mb-8 ${colors.textInvBase} ${idx % 2 === 1 ? 'ml-auto' : ''} max-w-md`}>
                    {item.desc}
                  </p>
                </div>
                <div className={`flex items-center border-t border-[rgba(255,255,255,0.2)] pt-6 ${idx % 2 === 1 ? 'justify-end' : 'justify-between'}`}>
                  <span className={`text-2xl font-mono ${colors.textInvStrong} ${idx % 2 === 1 ? 'order-2 ml-4' : ''}`}>{item.metric}</span>
                  <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
