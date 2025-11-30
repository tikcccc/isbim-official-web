export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { generateProductPageSEO } from "@/lib/seo-generators";
import { languageTag } from "@/paraglide/runtime";
import * as m from "@/paraglide/messages";
import { JARVIS_VIDEOS, JARVIS_POSTERS } from "@/lib/media-config";
import {
  HeroSection,
  NarrativeTrack,
  FeatureSection,
  ProductCTASection,
} from "@/components/product-template";
import {
  JsonLd,
  createSoftwareApplicationSchema,
  createBreadcrumbSchema,
} from "@/components/seo/json-ld";

/**
 * Generate SEO metadata for JARVIS Pay page
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();

  return generateProductPageSEO(
    "pay",
    m.jarvis_pay_meta_title(),
    m.jarvis_pay_meta_description(),
    locale
  );
}

/**
 * JARVIS Pay Product Page
 *
 * A premium product showcase page following the Palantir-inspired design.
 * Features four main sections:
 * 1. Hero Section - Sticky video background with product branding
 * 2. Narrative Track - Scroll-driven storytelling with color transitions
 * 3. Feature Sections - Detailed product feature breakdowns with Video/Details toggle
 * 4. CTA Section - Call to action with demo request
 *
 * @see /doc/reference-doc/pages/product-template/ for design reference
 */
export default function JarvisPayPage() {
  const locale = languageTag();
  const baseUrl = "https://www.isbim.com.hk";

  // SEO Schema Data
  const softwareSchema = createSoftwareApplicationSchema({
    name: "JARVIS Pay",
    description: m.jarvis_pay_meta_description(),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web-based, Cloud",
    softwareVersion: "3.7",
    provider: {
      name: "isBIM Technologies",
      url: baseUrl,
    },
    featureList: [
      "Transparent Payment Tracking",
      "Multi-tier Contract Management",
      "Automated Compliance",
      "Real-time Cash Flow Visibility",
      "AI-powered Risk Assessment",
    ],
    offers: {
      price: "Contact for pricing",
      priceCurrency: "HKD",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/${locale}/jarvis-pay`,
    },
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === "zh" ? "首頁" : "Home", url: `${baseUrl}/${locale}` },
    {
      name: locale === "zh" ? "產品" : "Products",
      url: `${baseUrl}/${locale}/services-products`,
    },
    { name: "JARVIS Pay", url: `${baseUrl}/${locale}/jarvis-pay` },
  ]);

  return (
    <div className="relative bg-product-light">
      {/* SEO Structured Data */}
      <JsonLd data={softwareSchema} id="jarvis-pay-software-schema" />
      <JsonLd data={breadcrumbSchema} id="jarvis-pay-breadcrumb-schema" />

      {/* Section A: Hero (Sticky Underlayer) */}
      <HeroSection
        productName="JARVIS Pay"
        videoSrc={JARVIS_VIDEOS.pay}
        posterSrc={JARVIS_POSTERS.pay}
        metadata={[
          m.jarvis_pay_hero_meta1(),
          m.jarvis_pay_hero_meta2(),
          m.jarvis_pay_hero_meta3(),
        ]}
      />

      {/* Section B: Narrative Track (Scroll-driven Story) */}
      <NarrativeTrack
        stage1Text={m.jarvis_pay_narrative_stage1()}
        stage2Text={m.jarvis_pay_narrative_stage2()}
        stage2Gradient
        description={m.jarvis_pay_narrative_desc()}
        scrollPromptText={m.jarvis_pay_scroll_prompt()}
      />

      {/* Section C: Feature Sections */}
      <main className="relative z-10 bg-product-light">
        {/* Feature 0.1: Transparent Payments for Complex Contracts */}
        <FeatureSection
          index="0.1"
          totalFeatures={3}
          title={[
            m.jarvis_pay_feature1_title_line1(),
            m.jarvis_pay_feature1_title_line2(),
          ]}
          description={m.jarvis_pay_feature1_desc()}
          mediaSrc="/videos/jarvis-pay-feature1.mp4"
          mediaType="video"
          videoLabel={m.jarvis_pay_toggle_video()}
          detailsLabel={m.jarvis_pay_toggle_details()}
          details={[
            {
              title: m.jarvis_pay_feature1_detail1_title(),
              description: m.jarvis_pay_feature1_detail1_desc(),
            },
            {
              title: m.jarvis_pay_feature1_detail2_title(),
              description: m.jarvis_pay_feature1_detail2_desc(),
            },
            {
              title: m.jarvis_pay_feature1_detail3_title(),
              description: m.jarvis_pay_feature1_detail3_desc(),
            },
          ]}
        />

        {/* Feature 0.2: R&D Funded Innovation */}
        <FeatureSection
          index="0.2"
          totalFeatures={3}
          title={[
            m.jarvis_pay_feature2_title_line1(),
            m.jarvis_pay_feature2_title_line2(),
          ]}
          description={m.jarvis_pay_feature2_desc()}
          mediaSrc="/videos/jarvis-pay-feature2.mp4"
          mediaType="video"
          videoLabel={m.jarvis_pay_toggle_video()}
          detailsLabel={m.jarvis_pay_toggle_details()}
          details={[
            {
              title: m.jarvis_pay_feature2_detail1_title(),
              description: m.jarvis_pay_feature2_detail1_desc(),
            },
            {
              title: m.jarvis_pay_feature2_detail2_title(),
              description: m.jarvis_pay_feature2_detail2_desc(),
            },
            {
              title: m.jarvis_pay_feature2_detail3_title(),
              description: m.jarvis_pay_feature2_detail3_desc(),
            },
          ]}
        />

        {/* Feature 0.3: Compliance, Visibility, and Capital Unlocked */}
        <FeatureSection
          index="0.3"
          totalFeatures={3}
          title={[
            m.jarvis_pay_feature3_title_line1(),
            m.jarvis_pay_feature3_title_line2(),
          ]}
          description={m.jarvis_pay_feature3_desc()}
          mediaSrc="/videos/jarvis-pay-feature3.mp4"
          mediaType="video"
          videoLabel={m.jarvis_pay_toggle_video()}
          detailsLabel={m.jarvis_pay_toggle_details()}
          details={[
            {
              title: m.jarvis_pay_feature3_detail1_title(),
              description: m.jarvis_pay_feature3_detail1_desc(),
            },
            {
              title: m.jarvis_pay_feature3_detail2_title(),
              description: m.jarvis_pay_feature3_detail2_desc(),
            },
            {
              title: m.jarvis_pay_feature3_detail3_title(),
              description: m.jarvis_pay_feature3_detail3_desc(),
            },
          ]}
          isLast
        />
      </main>

      {/* Section D: Call to Action */}
      <ProductCTASection
        title={m.jarvis_pay_cta_title()}
        subtitle={m.jarvis_pay_cta_subtitle()}
        buttonText={m.jarvis_pay_cta_button()}
        buttonHref="/contact"
      />
    </div>
  );
}
