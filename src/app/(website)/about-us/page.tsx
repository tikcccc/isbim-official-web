import type { Metadata } from "next";
import { generateAboutPageSEO } from "@/lib/seo-generators";
import { JsonLd, createOrganizationSchema } from "@/components/seo/json-ld";
import { getSiteUrl } from "@/lib/env";
import { languageTag } from "@/paraglide/runtime";
import AboutPageClient from "./about-page-client";
import { SmartImage } from "@/components/ui/smart-image";

/**
 * About Us Page Metadata
 *
 * Enhanced SEO emphasizing:
 * - isBIM brand identity
 * - Hong Kong location
 * - Dual identity: AI technology company + Construction technology company
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();
  return generateAboutPageSEO(locale);
}

/**
 * About Us Page (Server Component Wrapper)
 *
 * Server component wrapper to provide metadata generation
 * The actual page content is in the client component
 */
export default function AboutUsPage() {
  const siteUrl = getSiteUrl();

  // Organization Schema with AboutPage context
  const organizationSchema = createOrganizationSchema({
    name: "isBIM Limited",
    url: siteUrl,
    logo: `${siteUrl}/icons/isbim_black.svg`,
    description: "isBIM is Hong Kong's leading AI technology company and construction technology company. We develop JARVIS AI Suite and deliver innovative construction solutions for global infrastructure projects. Combining artificial intelligence with construction industry expertise.",
    sameAs: [
      "https://www.linkedin.com/company/isbim",
      "https://www.facebook.com/isbim",
      "https://twitter.com/isbim",
    ],
    contactPoint: {
      email: "info@isbim.com.hk",
      telephone: "+852-xxxx-xxxx",
      contactType: "Customer Service",
    },
  });

  return (
    <>
      {/* SEO: Structured Data */}
      <JsonLd data={organizationSchema} id="about-organization-schema" />

      {/* Client component with all animations and interactivity */}
      <AboutPageClient heroImageSrc="/images/about/hero.png" />

      {/* Preload hero image variants for the about page */}
      <SmartImage
        src="/images/about/hero.webp"
        sources={[
          { src: "/images/about/hero.avif", type: "image/avif" },
          { src: "/images/about/hero.webp", type: "image/webp" },
        ]}
        fallbackSrc="/images/about/hero.png"
        alt="About isBIM"
        preload
        priority
        width={3540}
        height={2360}
        sizes="100vw"
        wrapperClassName="hidden"
      />
    </>
  );
}
