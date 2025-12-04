import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd, createBreadcrumbSchema } from "@/components/seo/json-ld";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  NEWS_DETAIL_QUERY,
  NEWS_METADATA_QUERY,
  RELATED_NEWS_QUERY,
} from "@/sanity/lib/queries";
import NewsDetailClient from "./news-detail-client";
import type { Image as SanityImage } from "sanity";
import type { PortableTextBlock } from "@portabletext/types";

export const revalidate = 3600; // Revalidate every hour

// Types for Sanity data
interface NewsItem {
  _id: string;
  _type: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  publishedAt: string;
  excerpt?: string;
  body?: PortableTextBlock[]; // Rich text array
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
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    openGraphImage?: {
      asset: SanityImage;
    };
    keywords?: string[];
  };
}

interface NewsMetadata {
  title?: string;
  subtitle?: string;
  excerpt?: string;
  mainImage?: { asset: SanityImage };
  publishedAt?: string;
  author?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    openGraphImage?: { asset: SanityImage };
    keywords?: string[];
  };
  _updatedAt?: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate metadata for news detail page
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const newsData = await sanityFetch<NewsMetadata | null>({
    query: NEWS_METADATA_QUERY,
    params: { slug },
    tags: [`sanity:news:${slug}`],
  });

  if (!newsData) {
    return { title: "Article Not Found" };
  }

  const title = newsData.seo?.metaTitle || newsData.title || "News";
  const description = newsData.seo?.metaDescription || newsData.subtitle || newsData.excerpt || "";
  const publishedTime = newsData.publishedAt;
  const author = newsData.author || "isBIM Team";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      authors: [author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * News Detail Page (Server Component)
 *
 * Architecture: Server Component + Sanity CMS + ISR
 * - Fetches full article content from Sanity
 * - Passes data to client component for interactivity
 * - Uses ISR for optimal performance
 */
export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const newsDetail = await sanityFetch<NewsItem | null>({
    query: NEWS_DETAIL_QUERY,
    params: { slug },
    tags: [`sanity:news:${slug}`],
  });

  if (!newsDetail) {
    notFound();
  }

  const relatedNews = await sanityFetch<NewsItem[]>({
    query: RELATED_NEWS_QUERY,
    params: { categoryId: newsDetail.category._id, currentSlug: slug },
    tags: ["sanity:news"],
  });

  // Breadcrumb Schema for navigation
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Newsroom", url: "/newsroom" },
    { name: newsDetail.title, url: `/newsroom/${newsDetail.slug.current}` },
  ]);

  // Article Schema for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: newsDetail.title,
    description: newsDetail.subtitle || newsDetail.excerpt,
    datePublished: newsDetail.publishedAt,
    dateModified: newsDetail.publishedAt,
    author: {
      "@type": "Person",
      name: newsDetail.author || "isBIM Team",
    },
    publisher: {
      "@type": "Organization",
      name: "isBIM",
      logo: {
        "@type": "ImageObject",
        url: "https://isbim.com.hk/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://isbim.com.hk/newsroom/${newsDetail.slug.current}`,
    },
  };

  return (
    <>
      {/* SEO: Structured Data */}
      <JsonLd data={breadcrumbSchema} id="newsroom-detail-breadcrumb" />
      <JsonLd data={articleSchema} id="newsroom-detail-article" />

      {/* Main news detail content */}
      <main className="newsroom-page min-h-screen">
        {/* Noise overlay for editorial texture */}
        <div className="newsroom-noise-overlay" />

        {/* News detail client component handles display and interactivity */}
        <NewsDetailClient
          newsDetail={newsDetail}
          relatedNews={relatedNews}
        />
      </main>
    </>
  );
}
