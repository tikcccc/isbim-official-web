import { HeroSection1 } from "@/components/sections/hero-section-1";
import { InteractiveCarousel } from "@/components/sections/interactive-carousel";
import { Section3Placeholder } from "@/components/sections/section3-placeholder";
import { Section4PlatformList } from "@/components/sections/section4-platform-list";
import { Section5CTA } from "@/components/sections/section5-cta";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

const CTA_QUERY = `*[_type == "imageAsset" && slug.current == "home-cta"][0]{
  title,
  alt,
  file
}`;

async function getCtaImage() {
  try {
    const data = await client.fetch<{
      title?: string;
      alt?: string;
      file?: any;
    }>(CTA_QUERY);

    if (!data?.file) return { imageUrl: undefined, imageAlt: data?.alt ?? data?.title };

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
      <Section5CTA imageUrl={ctaImage.imageUrl} imageAlt={ctaImage.imageAlt} />
    </main>
  );
}
