'use client';

import {
  BackgroundEffects,
  HeroSection,
  NarrativeTrack,
  NarrativeInterlude,
  AcceleratorZone,
  ParallaxBreaker,
  MonitorZone,
  CtaSection
} from '@/components/jarvis-ai-suite';

/**
 * JARVIS AI Suite Page
 * Premium scroll-driven marketing page featuring:
 * - Fixed background effects layer
 * - Sticky hero section
 * - 400vh narrative track with color morphing
 * - Interactive product zones
 * - Bento grid monitoring products
 * - Conversion CTA section
 */
export default function JarvisAiSuitePage() {
  return (
    <div className="bg-[#050505] min-h-screen font-sans selection:bg-emerald-500/30 text-white relative">
      <style>{`body { overflow-x: hidden; }`}</style>

      {/* Global Background Effects */}
      <BackgroundEffects />

      {/* Hero (Fixed Background) */}
      <HeroSection />

      {/* Narrative Track (Dynamic Background) */}
      <NarrativeTrack />

      {/* Rest of the Page */}
      <div className="relative z-20">
        <NarrativeInterlude />
        <AcceleratorZone />
        <ParallaxBreaker />
        <MonitorZone />
        <CtaSection />
      </div>
    </div>
  );
}
