import type { Metadata } from "next";
import { generateNewsroomPageSEO } from "@/lib/seo-generators";
import { JsonLd, createBreadcrumbSchema } from "@/components/seo/json-ld";
import NewsroomPageClient from "./newsroom-page-client";

/**
 * Newsroom Page Metadata
 *
 * Enhanced SEO emphasizing:
 * - isBIM brand and company updates
 * - Construction technology news
 * - Hong Kong location
 * - AI and construction tech innovation
 */
export async function generateMetadata(): Promise<Metadata> {
  return generateNewsroomPageSEO("en");
}

/**
 * Newsroom Page (Server Component Wrapper)
 *
 * Server component wrapper to provide metadata generation
 * The actual page content is in the client component
 */
export default function NewsroomPage() {
  // Breadcrumb Schema for navigation
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Newsroom", url: "/newsroom" },
  ]);

  return (
    <>
      {/* SEO: Structured Data */}
      <JsonLd data={breadcrumbSchema} id="newsroom-breadcrumb" />

      {/* Client component with all interactivity */}
      <NewsroomPageClient />
    </>
  );
}
