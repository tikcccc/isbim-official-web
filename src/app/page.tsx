import { HeroSection1 } from "@/components/sections/hero-section-1";
import { InteractiveCarousel } from "@/components/sections/interactive-carousel";
import { Section3Placeholder } from "@/components/sections/section3-placeholder";
import { Section4PlatformList } from "@/components/sections/section4-platform-list";
import { Section5CTA } from "@/components/sections/section5-cta";

export default function Home() {
  return (
    <main className="relative">
      {/* Section 1: Hero with video background */}
      <HeroSection1 />

      {/* Section 2: Interactive Tab Carousel with animations */}
      <InteractiveCarousel />

      {/* Section 3: Wide-format narrative text aggregation */}
      <Section3Placeholder />

      {/* Section 4: AI Platforms with video hover animation */}
      <Section4PlatformList />

      {/* Section 5: Call to Action with dual-column layout */}
      <Section5CTA />
    </main>
  );
}
