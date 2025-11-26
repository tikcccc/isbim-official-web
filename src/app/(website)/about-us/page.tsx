'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CTASection } from '@/components/layout/cta-section';
import { cn } from '@/lib/utils';
import { useMenuStore } from '@/stores/menu-store';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as m from '@/paraglide/messages';
import { useSmoothScrollTo } from '@/hooks';
import { useLocalizedHref } from '@/lib/i18n/index';
import { ROUTES } from '@/lib/constants';
import { TypewriterWidth } from '@/components/animations';

/**
 * About Us Page
 *
 * A Palantir-style narrative page featuring:
 * - Cinematic blur reveal animations
 * - GSAP ScrollTrigger interactions
 * - Global Lenis smooth scrolling (from layout)
 * - Sticky navigation with glitch effects
 * - Typewriter title animations
 *
 * Route: /[locale]/about-us
 */

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- 1. Global State (Zustand Store) ---
import { create } from 'zustand';

interface NavState {
  activeSection: number;
  setActiveSection: (index: number) => void;
}

const useNavStore = create<NavState>((set) => ({
  activeSection: 1,
  setActiveSection: (index) => set({ activeSection: index }),
}));

// --- 2. UI Components ---

// TechDivider: Tech-style separator line
const TechDivider = ({ className }: { className?: string }) => (
  <div className={cn("w-full h-[1px] relative overflow-visible", className)}>
    <div className="absolute inset-0 bg-neutral-200"></div>
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
  </div>
);

// ArrowLink: Link with arrow and underline animation
const ArrowLink = ({ label, href }: { label: string; href: string }) => (
  <Link href={href} className="group/btn inline-flex flex-col items-start gap-2 cursor-pointer mt-6">
    <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-neutral-900">
      {label}
      <span className="transform group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
    </div>
    <div className="w-full h-[1px] bg-neutral-300 relative overflow-hidden">
       <div className="absolute inset-0 bg-blue-600 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></div>
    </div>
  </Link>
);

// RevealTitle: Cinematic blur reveal title (optimized with ScrollTrigger)
const RevealTitle = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const elementRef = useRef<HTMLHeadingElement>(null);

  // Split words only once during render
  const words = text.split(' ');

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Use gsap.context for proper cleanup in React (Best Practice)
    const ctx = gsap.context(() => {
      const wordElements = el.querySelectorAll('.word');
      
      // Set initial state immediately
      gsap.set(wordElements, { x: 18, opacity: 0 });

      // Animate directly with ScrollTrigger - NO React state updates involved
      gsap.to(wordElements, {
        x: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.04,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%", // Trigger when top of text hits 85% of viewport height
          toggleActions: "play none none reverse",
        }
      });
    }, elementRef);

    return () => ctx.revert(); // Clean up all GSAP animations when component unmounts
  }, [text]);

  return (
    <h3 ref={elementRef} className={cn("cursor-default flex flex-wrap gap-x-[0.3em]", className)}>
      {words.map((word, i) => (
        <span key={i} className="word inline-block will-change-transform">
          {word}
        </span>
      ))}
    </h3>
  );
};

// FeatureRow: What We Do row layout
const FeatureRow = ({
  title,
  content,
  linkLabel,
  href,
}: {
  title: string;
  content: string;
  linkLabel: string;
  href: string;
}) => (
  <div className="group relative py-16 border-t border-neutral-200 first:border-t-0 px-6 -mx-6 rounded-sm isolate">
    {/* Background layer - separated from content to avoid repaint */}
    <div className="absolute inset-0 bg-neutral-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 rounded-sm pointer-events-none" />
    
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      <div className="lg:col-span-5">
        <RevealTitle
          text={title}
          className="text-3xl md:text-4xl lg:text-5xl font-medium text-neutral-900 leading-tight transition-colors duration-500"
        />
      </div>

      <div className="lg:col-span-7 flex flex-col justify-between h-full">
        <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed mb-6">
          {content}
        </p>
        <div>
           <ArrowLink label={linkLabel} href={href} />
        </div>
      </div>
    </div>
  </div>
);

// StickyNav: Navigation component
const StickyNav = () => {
  const activeSection = useNavStore((state) => state.activeSection);
  const scrollTo = useSmoothScrollTo();

  const handleScrollTo = (id: string) => {
    scrollTo(id, { offset: 0, duration: 1.2 });
  };

  useEffect(() => {
    const target = document.getElementById(`nav-item-${activeSection}`);

    if (target) {
      const textElements = target.querySelectorAll('span');
      gsap.killTweensOf(textElements);

      const tl = gsap.timeline();

      tl.to(textElements, {
          color: "#2563eb", opacity: 0, x: -3, duration: 0.06, ease: "steps(1)"
        })
        .to(textElements, {
          color: "#171717", opacity: 1, x: 3, duration: 0.06, ease: "steps(1)"
        })
        .to(textElements, {
          color: "#2563eb", opacity: 0.2, x: 0, scale: 1.1, duration: 0.06, ease: "steps(1)"
        })
        .to(textElements, {
          color: "#171717", opacity: 1, scale: 1, duration: 0.06, ease: "steps(1)"
        });
    }
  }, [activeSection]);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-10 md:left-10 z-50 flex flex-col gap-4 font-mono text-base tracking-widest text-neutral-900 pointer-events-auto mix-blend-darken">
      {[1, 2, 3].map((num) => (
        <div
          key={num}
          id={`nav-item-${num}`}
          onClick={() => handleScrollTo(`#section-${num}`)}
          className={cn(
            "cursor-pointer transition-all duration-300 flex items-center gap-3 group",
            activeSection === num ? "opacity-100 font-bold" : "opacity-40 hover:opacity-70"
          )}
        >
          <span className="text-sm transition-none will-change-transform font-semibold">0{num}</span>
          <span className={cn(
             "overflow-hidden transition-all duration-500 ease-in-out whitespace-nowrap will-change-transform text-sm",
             activeSection === num ? "max-w-[300px] opacity-100" : "max-w-0 opacity-0"
          )}>
            {num === 1 ? m.about_nav_section1() : num === 2 ? m.about_nav_section2() : m.about_nav_section3()}
          </span>
          {activeSection === num && <div className="h-[1px] w-8 bg-neutral-900 animate-pulse" />}
        </div>
      ))}
    </div>
  );
};

// Section: Generic content section
interface SectionProps {
  id: number;
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
  imageSrc?: string;
  children?: React.ReactNode;
}

const Section = ({ id, title, subtitle, content, imageSrc, children }: SectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const setActiveSection = useNavStore((state) => state.setActiveSection);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Navigation tracking - persistent ScrollTrigger
    const navTrigger = ScrollTrigger.create({
      trigger: el,
      start: "top 55%",
      end: "bottom 55%",
      onEnter: () => setActiveSection(id),
      onEnterBack: () => setActiveSection(id),
      markers: false
    });

    // Animation - one-time ScrollTrigger for other elements
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 70%",
        toggleActions: "play none none none",
        once: true,
        markers: false
      }
    });

    tl.fromTo(`.section-${id}-anim`,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.1 },
      "+=1.0" // Delay to allow typewriter to finish
    );

    return () => {
      navTrigger.kill();
      tl.kill();
    };
  }, [id, setActiveSection]);

  return (
    <section
      id={`section-${id}`}
      ref={sectionRef}
      className="min-h-screen w-full flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-24 relative overflow-hidden py-40 lg:py-48 bg-neutral-50 will-change-auto"
    >
      <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-40 mix-blend-multiply pointer-events-none filter grayscale contrast-150"></div>

      <div className="max-w-[1600px] z-10 w-full mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-start lg:items-center mb-12">
          <div className="lg:col-span-7">
            <span className="block text-sm font-mono text-neutral-500 mb-6 font-semibold">
              0{id} <span className="text-neutral-400">/ 03</span>
            </span>

            <TypewriterWidth
              text={title}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none text-neutral-900 uppercase"
              duration={1.5}
              steps={40}
              cursorVisible
              cursorClassName="top-2 h-[80%] w-3 bg-blue-600 ml-1 md:ml-2"
              scrollTrigger={{
                trigger: `#section-${id}`,
                start: "top 70%",
                toggleActions: "play none none none",
              }}
            />
          </div>

          {subtitle && (
            <div className={`section-${id}-anim opacity-0 lg:col-span-5 flex items-start`}>
               <p className="text-xl md:text-2xl font-light text-neutral-600 leading-snug md:leading-normal lg:leading-snug border-l-2 border-blue-600 pl-6">
                 {subtitle}
               </p>
            </div>
          )}
        </div>

        <div className={`section-${id}-anim opacity-0`}>
          <TechDivider className="mb-12" />
        </div>

        {/* Content Area */}
        <div className={`section-${id}-anim opacity-0`}>
          {children || (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-9 text-xl md:text-2xl text-neutral-600 leading-relaxed space-y-8">
                {content}
              </div>
              <div className="lg:col-span-3"></div>
            </div>
          )}
        </div>

        {imageSrc && (
          <div className={`section-${id}-anim opacity-0 mt-16`}>
             <div className="relative w-full aspect-video overflow-hidden bg-neutral-200 shadow-2xl border border-neutral-200 group">
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1600px"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 filter grayscale hover:grayscale-0"
                  priority={id === 1}
                />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
             </div>
          </div>
        )}

      </div>
    </section>
  );
};

// --- 3. Page Entry Point ---
export default function AboutPage() {
  const { closeMenu } = useMenuStore();
  const { buildHref } = useLocalizedHref();

  useEffect(() => {
    // Close menu when navigating to this page
    closeMenu();
  }, [closeMenu]);

  useEffect(() => {
    // Refresh ScrollTrigger after initial render to ensure proper positioning
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="bg-neutral-50 text-neutral-900 min-h-[300vh] selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">

      <StickyNav />

      {/* 01: Why We're Here */}
      <Section
        id={1}
        title={m.about_section1_title()}
        subtitle={m.about_section1_subtitle()}
        imageSrc="/images/cta.png"
        content={
          <>
            <p>{m.about_section1_content1()}</p>
            <p>{m.about_section1_content2()}</p>
            <p>{m.about_section1_content3()}</p>
          </>
        }
      />

      {/* 02: What We Do */}
      <Section
        id={2}
        title={m.about_section2_title()}
        subtitle={m.about_section2_subtitle()}
      >
        <div className="flex flex-col">
          <FeatureRow
            title={m.about_section2_feature1_title()}
            content={m.about_section2_feature1_content()}
            linkLabel={m.about_section2_feature1_link()}
            href={buildHref(ROUTES.SERVICES_PRODUCTS)}
          />
          <FeatureRow
            title={m.about_section2_feature2_title()}
            content={m.about_section2_feature2_content()}
            linkLabel={m.about_section2_feature2_link()}
            href={buildHref(ROUTES.BIM_CONSULTANCY)}
          />
          <FeatureRow
            title={m.about_section2_feature3_title()}
            content={m.about_section2_feature3_content()}
            linkLabel={m.about_section2_feature3_link()}
            href={buildHref(ROUTES.PROJECT_FINANCE)}
          />
          <FeatureRow
            title={m.about_section2_feature4_title()}
            content={m.about_section2_feature4_content()}
            linkLabel={m.about_section2_feature4_link()}
            href={buildHref(ROUTES.CONTACT)}
          />
        </div>
      </Section>

      {/* 03: Where We Are Going */}
      <Section
        id={3}
        title={m.about_section3_title()}
        subtitle={m.about_section3_subtitle()}
        content={
          <>
            <p>{m.about_section3_content1()}</p>
            <p>{m.about_section3_content2()}</p>
            <p className="text-blue-600 italic font-medium mt-4">
              {m.about_section3_content3()}
            </p>
          </>
        }
      />

      <CTASection
        title={m.about_cta_title()}
        subtitle={m.about_cta_subtitle()}
        buttonLabel={m.about_cta_button()}
        href={buildHref(ROUTES.CONTACT)}
      />

    </main>
  );
}
