'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import { Link } from '@/lib/i18n';
import { ROUTES } from '@/lib/constants';
import { SERVICE_CONTENT, ServiceTab } from './service-data';

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className={`service-page min-h-screen font-sans selection:bg-[var(--surface-hero)] selection:text-[var(--text-inverse-strong)] transition-colors duration-700`}>
      {/* --- PARALLAX BACKGROUND LAYER --- 
          This is fixed in position. The content below scrolls over it. 
      */}
      <div className="fixed inset-0 w-full h-screen z-0">
         <img 
            key={content.hero.img} // Key forces animation on change
            src={content.hero.img} 
            alt={`${content.hero.title} hero`} 
            className="w-full h-full object-cover animate-fade-in"
         />
         {/* Gradient Scrim */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
      </div>

      {/* --- SCROLLABLE CONTENT LAYER --- 
          Contains the text overlay for the hero (transparent bg)
          and the subsequent sections (solid bg).
      */}
      <div className="relative z-10">

        {/* SECTION 1: HERO TEXT OVERLAY */}
        <header className="relative min-h-screen w-full flex flex-col justify-end pointer-events-none">
          <div className="service-shell relative z-10 pb-20 md:pb-32 text-white pointer-events-auto">
              <div className="grid grid-cols-12 gap-6 items-end">
                  
                  {/* Main Title Area */}
                  <div className="col-span-12 lg:col-span-8">
                      {/* Decorative Line */}
                      <div className="w-24 h-1 bg-white mb-8"></div>
                      
                      <h1 className="text-[15vw] md:text-[10rem] font-black leading-[0.8] tracking-tighter mb-4 mix-blend-overlay opacity-90">
                          {content.hero.title}
                      </h1>
                      <h2 className="text-4xl md:text-7xl font-light tracking-tight text-white/90 leading-none">
                          {content.hero.subTitle}
                      </h2>
                  </div>

                  {/* Description & Meta Area */}
                  <div className="col-span-12 lg:col-span-4 flex flex-col justify-end">
                      <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-white/80 border-l-2 border-white/30 pl-6">
                          {content.hero.desc} <br/>
                          <span className="text-white/50 text-base mt-2 block font-mono uppercase tracking-wider">{content.hero.tag}</span>
                      </p>
                      
                      <div className="animate-bounce">
                        <ChevronDown className="w-6 h-6 text-white/50" />
                      </div>
                  </div>
              </div>
          </div>
        </header>

        {/* SECTION 2: The Narrative */}
        <section className={`service-section-xl ${COLORS.bgLight} relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]`}>
          <div className="service-shell">
              <h2 className={SECTION_TITLE_STYLE}>
                {content.narrative.label}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mt-4">
                  <div className="md:col-span-5">
                      <p className={`text-4xl md:text-6xl font-bold leading-tight tracking-tight ${COLORS.textStrong} mb-8`}>
                          {content.narrative.lead} <br/>
                          <span className={`${COLORS.textMuted} font-medium`}>
                            {content.narrative.sub}
                          </span>
                      </p>
                  </div>
                  
                  <div className="md:col-span-1"></div> 
                  <div className="md:col-span-6 space-y-8 pt-2">
                      <p className={`text-lg md:text-xl ${COLORS.textBase} leading-relaxed font-light border-l border-[var(--border-strong)] pl-6`}>
                          {content.narrative.p1}
                      </p>
                      <p className={`text-lg ${COLORS.textMuted} leading-relaxed pl-6`}>
                          {content.narrative.p2}
                      </p>
                  </div>
              </div>
          </div>
        </section>

        {/* SECTION 3: The Engine */}
        <section className={`service-section-lg ${COLORS.bgGray} relative z-20`}>
          <div className="service-shell">
              <h3 className={SECTION_TITLE_STYLE}>THE ENGINE</h3>
              
              <div className="flex flex-col mt-8">
                  {content.engine.map((item, idx) => (
                    <div key={idx} className={`group flex flex-col md:flex-row md:items-baseline border-t border-[var(--border-subtle)] py-12 transition-colors duration-300 hover:bg-[var(--surface-base)]
                      ${idx === 0 ? 'border-t-[var(--border-strong)]' : ''}
                      ${idx === content.engine.length - 1 ? 'border-b border-[var(--border-subtle)]' : ''}
                    `}>
                        <span className={`text-sm font-mono mr-12 ${COLORS.textSub} group-hover:${COLORS.textStrong} transition-colors min-w-[3ch]`}>
                          {item.id}
                        </span>
                        <h4 className={`text-3xl md:text-4xl font-medium w-full md:w-1/3 mb-4 md:mb-0 ${COLORS.textStrong}`}>
                          {item.title}
                        </h4>
                        <p className={`w-full md:w-1/2 font-light leading-relaxed ${COLORS.textMuted} group-hover:${COLORS.textBase} transition-colors`}>
                            {item.desc}
                        </p>
                    </div>
                  ))}
              </div>
          </div>
        </section>

        {/* SECTION 4: Data */}
        <section className={`service-section-xl ${COLORS.bgLight} relative z-20`}>
          <div className="service-shell">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                  <div className="relative">
                      <h3 className={SECTION_TITLE_STYLE}>
                        {content.stats.label}
                      </h3>

                      <p className={`text-2xl leading-relaxed ${COLORS.textBase} font-light mt-4`}>
                          Traditional construction is plagued by <span className={`${COLORS.textSoft}`}>uncertainty</span>. JARVIS delivers mathematical certainty.
                      </p>
                      
                      <div className="mt-12 p-10 bg-[var(--surface-subtle)] text-[var(--text-strong)]">
                          <span className={`block text-xs font-mono mb-4 ${COLORS.textSub} tracking-widest`}>
                            {content.stats.main.label}
                          </span>
                          <span className="text-6xl md:text-8xl font-bold tracking-tighter">
                            {content.stats.main.val}
                          </span>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-12 gap-y-16 mt-8 lg:mt-0">
                      {content.stats.grid.map((stat, idx) => (
                        <div key={idx} className={`flex flex-col justify-end border-l pl-6 ${idx % 2 === 0 ? 'border-[var(--border-strong)]' : 'border-[var(--border-subtle)]'}`}>
                            <span className={`text-4xl md:text-5xl font-light mb-2 ${COLORS.textStrong}`}>{stat.val}</span>
                            <span className={`text-xs font-bold tracking-widest uppercase ${COLORS.textSub}`}>{stat.label}</span>
                        </div>
                      ))}
                  </div>
              </div>
          </div>
        </section>

        {/* SECTION 5: Gallery - DARK THEME */}
        <section className={`service-section-xl ${COLORS.bgDark} relative z-20`}>
          <div className="service-shell">
              <div className={`flex flex-col md:flex-row justify-between items-end mb-20 border-b border-[rgba(255,255,255,0.2)] pb-8`}>
                  <div>
                     <span className={`block text-3xl font-bold tracking-widest uppercase pb-4 inline-block mb-12 ${COLORS.textInvSub}`}>THE GALLERY</span>
                     <h2 className={`text-4xl md:text-6xl font-bold tracking-tight ${COLORS.textInvStrong}`}>{content.gallery.title}</h2>
                  </div>
                  <div className="text-right mt-8 md:mt-0">
                      <p className={`text-xl md:text-2xl font-mono ${COLORS.textInvBase}`}>{content.gallery.meta}</p>
                  </div>
              </div>

              <div className="space-y-32">
                  {content.gallery.items.map((item, idx) => (
                    <div key={idx} className="group grid grid-cols-1 md:grid-cols-12 gap-12 items-center cursor-pointer">
                        {/* Alternating Layout */}
                        <div className={`md:col-span-7 overflow-hidden ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                            <div className="h-[400px] md:h-[600px] relative overflow-hidden bg-[var(--surface-dark)]">
                                <img src={`https://source.unsplash.com/random/1200x800/?construction,${idx}`} alt={item.loc} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-1000 ease-out grayscale group-hover:grayscale-0" />
                            </div>
                        </div>
                        <div className={`md:col-span-5 flex flex-col h-full justify-center py-4 ${idx % 2 === 1 ? 'md:order-1 md:text-right' : ''}`}>
                            <div>
                                <span className={`text-xs font-mono mb-6 block ${COLORS.textInvSub} tracking-widest`}>
                                  {item.id} — {item.loc}
                                </span>
                                <h3 className={`text-3xl md:text-4xl font-bold mb-6 ${COLORS.textInvStrong} group-hover:${COLORS.textInvMuted} transition-colors`}>{item.title}</h3>
                                <p className={`text-lg font-light leading-relaxed mb-8 ${COLORS.textInvBase} ${idx % 2 === 1 ? 'ml-auto' : ''} max-w-md`}>
                                    {item.desc}
                                </p>
                            </div>
                            <div className={`flex items-center border-t border-[rgba(255,255,255,0.2)] pt-6 ${idx % 2 === 1 ? 'justify-end' : 'justify-between'}`}>
                                <span className={`text-2xl font-mono ${COLORS.textInvStrong} ${idx % 2 === 1 ? 'order-2 ml-4' : ''}`}>{item.metric}</span>
                                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                            </div>
                        </div>
                    </div>
                  ))}
              </div>
          </div>
        </section>

        {/* FOOTER - DARK THEME */}
        <footer className={`py-20 ${COLORS.bgDark} border-t border-[rgba(255,255,255,0.1)] relative z-20`}>
          <div className="service-shell flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                  <h2 className={`text-4xl md:text-6xl font-bold tracking-tighter mb-4 ${COLORS.textInvStrong}`}>Ready to Transform?</h2>
                  <Link href={ROUTES.CONTACT} className={`inline-flex items-center text-xl transition-colors group ${COLORS.textInvBase} hover:${COLORS.textInvMuted}`}>
                      Book your {activeTab} session <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform"/>
                  </Link>
              </div>
              <div className="mt-12 md:mt-0 text-right">
                  <p className={`text-sm font-mono ${COLORS.textInvSub}`}>JARVIS {activeTab}</p>
                  <p className={`text-sm font-mono ${COLORS.textInvSub}`}>AC 2025</p>
              </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default ServiceTemplate;
