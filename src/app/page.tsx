import type { Metadata } from "next";
import { HeroSection1 } from "@/components/sections/hero-section-1";
import { InteractiveCarousel } from "@/components/sections/interactive-carousel";
import { Section3Placeholder } from "@/components/sections/section3-placeholder";
import { Section4PlatformList } from "@/components/sections/section4-platform-list";
import { Section5CTA } from "@/components/sections/section5-cta";
import { sanityFetch, buildCacheTags, REVALIDATE } from "@/sanity/lib/fetch";
import { IMAGE_ASSET_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import type { ImageAsset } from "@/sanity/lib/types";
import { urlFor } from "@/sanity/lib/image";
import { generatePageMetadata, COMMON_KEYWORDS } from "@/lib/seo";

/**
 * Generate metadata for home page
 * Includes SEO optimization with cached Sanity image
 */
export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero/OG image from Sanity
  const heroImage = await sanityFetch<ImageAsset | null>({
    query: IMAGE_ASSET_BY_SLUG_QUERY,
    params: { slug: "home-hero" },
    tags: buildCacheTags("imageAsset", "home-hero"),
    revalidate: REVALIDATE.DAY, // Cache for a day
  }).catch(() => null);

  const imageUrl = heroImage?.file
    ? urlFor(heroImage.file)?.width(1200).height(630).url()
    : undefined;

  return generatePageMetadata({
    title: "Construction AI Platform - Powering Global Economies",
    description:
      "isBIM delivers cutting-edge construction AI solutions with JARVIS suite, BIM consultancy, and smart infrastructure management for modern construction projects worldwide.",
    path: "/",
    locale: "en",
    image: imageUrl,
    imageAlt: heroImage?.alt || "isBIM Construction AI Platform",
    keywords: [
      ...COMMON_KEYWORDS,
      "construction platform",
      "infrastructure AI",
      "smart construction",
      "digital construction",
    ],
  });
}

async function getCtaImage() {
  try {
    const data = await sanityFetch<ImageAsset | null>({
      query: IMAGE_ASSET_BY_SLUG_QUERY,
      params: { slug: "home-cta" },
      tags: buildCacheTags("imageAsset", "home-cta"),
      revalidate: REVALIDATE.HOUR, // Revalidate every hour
    });

    if (!data?.file) {
      return { imageUrl: undefined, imageAlt: data?.alt ?? data?.title };
    }

    const built = urlFor(data.file)?.width(1600).url();
    return { imageUrl: built, imageAlt: data.alt ?? data.title };
  } catch (error) {
    console.error("Failed to fetch CTA image from Sanity", error);
    return { imageUrl: undefined, imageAlt: undefined };
  }
}

export default async function Home() {
  const ctaImage = await getCtaImage();

  return (
    <div className="w-full overflow-x-hidden bg-white">
      {/* Section 1: Hero with video background - Full width */}
      <div className="relative w-full">
        <HeroSection1 />
      </div>

      {/* Section 2: Interactive Tab Carousel with animations (full-width wrap) */}
      <div className="relative w-full">
        <InteractiveCarousel />
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
      <Section5CTA imageUrl={ctaImage.imageUrl} imageAlt={ctaImage.imageAlt} />
    </div>
  );
}
