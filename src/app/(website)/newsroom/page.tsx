import type { Metadata } from "next";
import { generateNewsroomPageSEO } from "@/lib/seo-generators";
import { JsonLd, createBreadcrumbSchema } from "@/components/seo/json-ld";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  NEWS_LIST_QUERY,
  NEWS_CATEGORIES_QUERY,
  FEATURED_NEWS_QUERY,
} from "@/sanity/lib/queries";
import NewsroomPageClient from "./newsroom-page-client";
import type { Image as SanityImage } from 'sanity';

export const revalidate = 0; // Disable ISR: always fetch fresh data

// Types for Sanity data
interface NewsItem {
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

interface NewsCategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  color: string;
}

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
 * Newsroom Page (Server Component)
 *
 * Architecture: Server Component + Sanity CMS + ISR
 * - Fetches news data from Sanity with cache tags
 * - Passes data to client components for interactivity
 * - Uses ISR for optimal performance
 */
export default async function NewsroomPage() {
  // Fetch data from Sanity CMS
  const [newsList, categories, featuredNews] = await Promise.all([
    sanityFetch<NewsItem[]>({
      query: NEWS_LIST_QUERY,
      params: { start: 0, end: 12 },
      tags: ["sanity:news"],
      cache: "no-store",
    }),
    sanityFetch<NewsCategory[]>({
      query: NEWS_CATEGORIES_QUERY,
      tags: ["sanity:newsCategory"],
      cache: "no-store",
    }),
    sanityFetch<NewsItem | null>({
      query: FEATURED_NEWS_QUERY,
      tags: ["sanity:news"],
      cache: "no-store",
    }),
  ]).catch(() => {
    // Fallback to empty data if Sanity fetch fails
    return [[], [], null] as [NewsItem[], NewsCategory[], NewsItem | null];
  });

  // Breadcrumb Schema for navigation
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Newsroom", url: "/newsroom" },
  ]);

  return (
    <>
      {/* SEO: Structured Data */}
      <JsonLd data={breadcrumbSchema} id="newsroom-breadcrumb" />

      {/* Main newsroom content - using client component matching prototype */}
      <main className="newsroom-page min-h-screen">
        {/* Client component handles all display, routing and interactivity */}
        <NewsroomPageClient
          initialNews={newsList}
          categories={categories}
          featuredNews={featuredNews}
        />
      </main>
    </>
  );
}
