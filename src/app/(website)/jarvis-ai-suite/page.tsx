import { HeroSection } from '@/components/jarvis/hero-section';
import { BuildersSection } from '@/components/jarvis/builders-section';
import { GenerateSection } from '@/components/jarvis/generate-section';
import { SenseSection } from '@/components/jarvis/sense-section';
import { CtaSection } from '@/components/jarvis/cta-section';
import { FooterCharcoal } from '@/components/layout/footer-charcoal';

/**
 * JARVIS AI Suite Page
 * Industrial Futurism design with:
 * - Kinetic typography backgrounds
 * - 120s epic marquees
 * - Glass morphism panels
 * - Interactive product showcases
 * - Neon cyan accents in dark mode
 */
export default function JarvisAiSuitePage() {
  return (
    <div className="jarvis-page">
      <HeroSection />
      <BuildersSection />
      <GenerateSection />

      {/* Gradient Transition */}
      <div className="w-full h-24 bg-gradient-to-b from-[#F2F2F2] via-[#7A7B85] to-[#1E1F2B]" />

      <SenseSection />
      <CtaSection />
      <FooterCharcoal />
    </div>
  );
}
