import type { Metadata } from "next";
import { generateCaseStudiesPageSEO } from "@/lib/seo-generators";
import { JsonLd, createBreadcrumbSchema } from "@/components/seo/json-ld";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  CASE_STUDY_LIST_QUERY,
  CASE_STUDY_CATEGORIES_QUERY,
  FEATURED_CASE_STUDY_QUERY,
} from "@/sanity/lib/queries";
import CaseStudiesPageClient from "./case-studies-page-client";
import type { Image as SanityImage } from 'sanity';
import {
  languageTag,
  type AvailableLanguageTag,
} from "@/paraglide/runtime";
import { getSiteUrl } from "@/lib/env";
import { buildHref } from "@/lib/i18n/route-builder";
import * as m from "@/paraglide/messages";

export const revalidate = 3600;

type MessageFn = (params?: Record<string, never>, options?: { languageTag?: AvailableLanguageTag }) => string;

// Types for Sanity data
interface CaseStudyItem {
  _id: string;
  _type: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  publishedAt: string;
  excerpt?: string;
  mainImage?: {
    asset: SanityImage;
    alt: string;
  };
  category: {
    _id: string;
    title: string;
    slug: { current: string };
    color: string;
  };
  tags?: string[];
  author: string;
  readTime: number;
  featured?: boolean;
}

interface CaseStudyCategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  color: string;
}

/**
 * Case Studies Page Metadata
 *
 * Enhanced SEO emphasizing:
 * - isBIM brand and company updates
 * - Construction technology case studies
 * - Hong Kong location
 * - AI and construction tech innovation
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag() as AvailableLanguageTag;
  return generateCaseStudiesPageSEO(locale);
}

/**
 * Case Studies Page (Server Component)
 *
 * Architecture: Server Component + Sanity CMS + ISR
 * - Fetches case study data from Sanity with cache tags
 * - Passes data to client components for interactivity
 * - Uses ISR for optimal performance
 */
export default async function CaseStudiesPage() {
  const locale = languageTag() as AvailableLanguageTag;
  const t = (fn: MessageFn) => fn({}, { languageTag: locale });

  // Fetch data from Sanity CMS
  const [caseStudies, categories, featuredCaseStudy] = await Promise.all([
    sanityFetch<CaseStudyItem[]>({
      query: CASE_STUDY_LIST_QUERY,
      params: { start: 0, end: 12 },
      tags: ["caseStudy"],
      revalidate,
    }),
    sanityFetch<CaseStudyCategory[]>({
      query: CASE_STUDY_CATEGORIES_QUERY,
      tags: ["caseStudyCategory"],
      revalidate,
    }),
    sanityFetch<CaseStudyItem | null>({
      query: FEATURED_CASE_STUDY_QUERY,
      tags: ["caseStudy"],
      revalidate,
    }),
  ]).catch(() => {
    // Fallback to empty data if Sanity fetch fails
    return [[], [], null] as [CaseStudyItem[], CaseStudyCategory[], CaseStudyItem | null];
  });

  // Breadcrumb Schema for navigation
  const siteUrl = getSiteUrl();
  const homePath = buildHref("/", locale);
  const caseStudiesPath = buildHref("/case-studies", locale);
  const homeLabel = t(m.breadcrumb_home);
  const caseStudiesLabel = t(m.menu_nav_case_studies);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: homeLabel, url: `${siteUrl}${homePath}` },
    { name: caseStudiesLabel, url: `${siteUrl}${caseStudiesPath}` },
  ]);

  return (
    <>
      {/* SEO: Structured Data */}
      <JsonLd data={breadcrumbSchema} id="case-studies-breadcrumb" />

      {/* Main case studies content - using client component matching prototype */}
      <main className="case-studies-page min-h-screen">
        {/* Client component handles all display, routing and interactivity */}
        <CaseStudiesPageClient
          initialCaseStudies={caseStudies}
          categories={categories}
          featuredCaseStudy={featuredCaseStudy}
        />
      </main>
    </>
  );
}
