import type { Metadata } from "next";
import { HeroSection1 } from "@/components/sections/hero-section-1";
import { InteractiveCarouselLazy } from "@/components/sections/interactive-carousel-lazy";
import { Section3Placeholder } from "@/components/sections/section3-placeholder";
import { Section4PlatformList } from "@/components/sections/section4-platform-list";
import { Section5CTA } from "@/components/sections/section5-cta";
import { generatePageMetadata, COMMON_KEYWORDS } from "@/lib/seo";

// Use literal number to satisfy Next.js page config parsing.
export const revalidate = 3600;

/**
 * Generate metadata for home page
 * Includes SEO optimization with cached Sanity image
 */
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Construction AI Platform - Powering Global Economies",
    description:
      "isBIM delivers cutting-edge construction AI solutions with JARVIS suite, BIM consultancy, and smart infrastructure management for modern construction projects worldwide.",
    path: "/",
    locale: "en",
    image: "/images/cta.png",
    imageAlt: "isBIM Construction AI Platform",
    keywords: [
      ...COMMON_KEYWORDS,
      "construction platform",
      "infrastructure AI",
      "smart construction",
      "digital construction",
    ],
  });
}

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden bg-white">
      {/* Section 1: Hero with video background - Full width */}
      <div className="relative w-full">
        <HeroSection1 />
      </div>

      {/* Section 2: Interactive Tab Carousel with animations (full-width wrap) */}
      <div className="relative w-full">
        <InteractiveCarouselLazy />
      </div>

      {/* Full-bleed white wrapper to cover edges beneath the carousel */}
      <div className="relative w-full bg-white">
        <section className="w-full bg-white">
          <div className="container-page">
            {/* Section 3: Wide-format narrative text aggregation */}
            <Section3Placeholder />

            {/* Section 4: AI Platforms with video hover animation */}
            <Section4PlatformList />
          </div>
        </section>
      </div>

      {/* Section 5: Call to Action with dual-column layout (full-width gray background) */}
      <Section5CTA imageUrl="/images/cta.png" imageAlt="Call to action" />
    </div>
  );
}
