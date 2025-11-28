/**
 * Services & Products Page
 *
 * Showcases isBIM's services and AI products with:
 * - Dark cyberpunk aesthetic with emerald accents
 * - Interactive Bento grid layout
 * - Mouse-following spotlight effects
 * - Smooth animations and transitions
 *
 * Note: This page uses its own dark theme that overrides the website layout background.
 * FooterDark is rendered by the page-specific layout (layout.tsx in this directory).
 */

import type { Metadata } from "next";
import { BackgroundLayers } from "@/components/services-products/background-layers";
import { HeroSection } from "@/components/services-products/hero-section";
import { ServicesGrid } from "@/components/services-products/services-grid";
import { CtaSection } from "@/components/services-products/cta-section";
import { generateServicesPageSEO } from "@/lib/seo-generators";
import { JsonLd, createBreadcrumbSchema } from "@/components/seo/json-ld";

/**
 * Generate metadata for Services & Products page
 *
 * Enhanced SEO emphasizing:
 * - Comprehensive construction technology solutions
 * - Combination of AI products (JARVIS Suite) and professional services
 * - Hong Kong location and dual identity (AI + Construction tech)
 */
export async function generateMetadata(): Promise<Metadata> {
  return generateServicesPageSEO("en");
}

export default function ServicesProductsPage() {
  // Breadcrumb Schema for navigation
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services & Products", url: "/services-products" },
  ]);

  return (
    <main className="min-h-screen w-full bg-[#050505] text-white selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-x-hidden">
      {/* SEO: Structured Data */}
      <JsonLd data={breadcrumbSchema} id="services-products-breadcrumb" />

      {/* Background Layers */}
      <BackgroundLayers />

      {/* Hero Section */}
      <HeroSection />

      {/* Bento Grid Section */}
      <ServicesGrid />

      {/* Final CTA Section */}
      <CtaSection />
    </main>
  );
}
