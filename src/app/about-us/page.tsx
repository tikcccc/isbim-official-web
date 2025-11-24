'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useMenuStore } from '@/stores/menu-store';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as m from '@/paraglide/messages';
import { useSmoothScrollTo } from '@/hooks';
import { useLocalizedHref } from '@/lib/i18n/index';
import { ROUTES } from '@/lib/constants';

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

// RevealTitle: Cinematic blur reveal title
const RevealTitle = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const elementRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const words = elementRef.current.querySelectorAll('.word');

    gsap.fromTo(words,
      {
        y: 20,
        opacity: 0,
        filter: 'blur(10px)'
      },
      {
        scrollTrigger: {
          trigger: elementRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.04,
        ease: "power2.out"
      }
    );
  }, [text]);

  const words = text.split(' ');

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
  <div className="group py-16 border-t border-neutral-200 first:border-t-0 hover:bg-neutral-100/50 transition-colors duration-500 px-6 -mx-6 rounded-sm">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      <div className="lg:col-span-5">
        <RevealTitle
          text={title}
          className="text-3xl md:text-4xl lg:text-5xl font-medium text-neutral-900 leading-tight group-hover:text-blue-700 transition-colors duration-500"
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
    <div className="fixed bottom-10 left-10 z-50 flex flex-col gap-4 font-mono text-base tracking-widest text-neutral-900 pointer-events-auto mix-blend-darken">
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const setActiveSection = useNavStore((state) => state.setActiveSection);

  useEffect(() => {
    const el = sectionRef.current;
    const titleEl = titleRef.current;
    const cursorEl = cursorRef.current;

    if (!el || !titleEl) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 55%",
      end: "bottom 55%",
      onEnter: () => setActiveSection(id),
      onEnterBack: () => setActiveSection(id),
      markers: false
    });

    gsap.set(titleEl, { width: "0%" });
    gsap.set(cursorEl, { left: "0%" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 70%",
        toggleActions: "play none none reverse",
      }
    });

    const blinkAnim = gsap.to(cursorEl, {
      opacity: 0,
      repeat: -1,
      yoyo: true,
      duration: 0.5,
      ease: "steps(1)"
    });

    tl.to(titleEl, {
      width: "100%",
      duration: 1.5,
      ease: "steps(40)",
    });

    tl.to(cursorEl, {
      left: "100%",
      duration: 1.5,
      ease: "steps(40)",
    }, "<");

    tl.fromTo(`.section-${id}-anim`,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.1 },
      "-=0.5"
    );

    return () => {
      trigger.kill();
      tl.kill();
      blinkAnim.kill();
    };
  }, [id, title, setActiveSection]);

  return (
    <section
      id={`section-${id}`}
      ref={sectionRef}
      className="min-h-screen w-full flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-24 relative overflow-hidden py-40 lg:py-48 bg-neutral-50"
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-multiply pointer-events-none filter grayscale contrast-150"></div>

      <div className="max-w-[1600px] z-10 w-full mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-start mb-12">
          <div className="lg:col-span-7">
            <span className="block text-sm font-mono text-neutral-500 mb-6 font-semibold">
              0{id} <span className="text-neutral-400">/ 03</span>
            </span>

            <div className="relative inline-block">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none text-transparent select-none uppercase invisible">
                {title}
              </h2>
              <h2
                ref={titleRef}
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none text-neutral-900 whitespace-nowrap overflow-hidden align-middle uppercase absolute top-0 left-0"
                style={{ width: '0%' }}
              >
                {title}
              </h2>
              <span
                ref={cursorRef}
                className="absolute top-2 h-[80%] w-3 bg-blue-600 block ml-1 md:ml-2"
                style={{ left: '0%' }}
              ></span>
            </div>
          </div>

          {subtitle && (
            <div className={`section-${id}-anim opacity-0 lg:col-span-5 flex items-start`}>
               <p className="text-xl md:text-2xl font-light text-neutral-600 leading-relaxed border-l-2 border-blue-600 pl-6">
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
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 filter grayscale hover:grayscale-0"
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
        imageSrc="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
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

      {/* Call To Action (Footer) */}
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center bg-gradient-to-b from-neutral-50 to-neutral-100 border-t border-neutral-200 relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-multiply pointer-events-none filter grayscale"></div>

        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 border border-neutral-400 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 border border-neutral-400 rounded-full"></div>
        </div>

        <div className="max-w-3xl z-10 space-y-6">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-4 tracking-tight leading-tight">
            {m.about_cta_title()}
          </h3>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            {m.about_cta_subtitle()}
          </p>

          <div className="pt-4">
            <Link
              href={buildHref(ROUTES.CONTACT)}
              className="group relative px-8 py-4 bg-blue-600 text-white font-medium text-sm tracking-wide uppercase overflow-hidden hover:bg-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl inline-block"
            >
              <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">{m.about_cta_button()}</span>
              <div className="absolute inset-0 bg-neutral-900 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
            </Link>
          </div>
        </div>
      </div>

    </main>
  );
}
