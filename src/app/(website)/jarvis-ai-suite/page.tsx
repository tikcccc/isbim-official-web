import { HeroSection } from '@/components/jarvis/hero-section';
import { BuildersSection } from '@/components/jarvis/builders-section';
import { GenerateSection } from '@/components/jarvis/generate-section';
import { SenseSection } from '@/components/jarvis/sense-section';
import { CtaSection } from '@/components/jarvis/cta-section';
import { FooterConfig } from '@/components/layout/footer-config';

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
    <div className="jarvis-page product-page">
      <FooterConfig variant="charcoal" />
      <HeroSection />
      <BuildersSection />
      <GenerateSection />

      <SenseSection />
      <CtaSection />
    </div>
  );
}
