import { HeroSection } from "@/components/ai-suite/hero-section";
import { BuildersSection } from "@/components/ai-suite/builders-section";
import { CtaSection } from "@/components/ai-suite/cta-section";
import { ProductMatrix } from "@/components/ai-suite/product-matrix";

/**
 * JARVIS AI Suite Page
 * Renders the AI Suite sections (copied from the previous version for iteration).
 */
export default function JarvisAiSuitePage() {
  return (
    <div className="jarvis-page product-page">
      <HeroSection />
      <BuildersSection />
      <ProductMatrix />
      <CtaSection />
    </div>
  );
}
