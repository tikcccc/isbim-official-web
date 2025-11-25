/**
 * SEO Utilities
 *
 * Purpose:
 * - Type-safe metadata generation for Next.js pages
 * - Reusable helpers for Open Graph, Twitter Cards, structured data
 * - Integration with Sanity CMS for dynamic SEO content
 * - Internationalization (i18n) support
 *
 * Usage:
 * ```tsx
 * import { generatePageMetadata, buildOpenGraph } from "@/lib/seo";
 *
 * export async function generateMetadata() {
 *   return generatePageMetadata({
 *     title: "About Us",
 *     description: "Learn about our company",
 *     path: "/about-us",
 *   });
 * }
 * ```
 */

import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/env";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Base metadata options
 */
export interface BaseMetadataOptions {
  /** Page title */
  title: string;
  /** Page description */
  description: string;
  /** Page path (without locale, e.g., "/about-us") */
  path?: string;
  /** Current locale */
  locale?: string;
  /** Open Graph image URL */
  image?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Keywords for SEO */
  keywords?: string[];
  /** Page type (article, website, etc.) */
  type?: "website" | "article";
  /** Article publish date (for type="article") */
  publishedTime?: string;
  /** Article modified date (for type="article") */
  modifiedTime?: string;
  /** Canonical URL override */
  canonical?: string;
  /** Disable indexing */
  noIndex?: boolean;
}

/**
 * Default Open Graph image
 */
export const DEFAULT_OG_IMAGE = "/images/og-default.png";

/**
 * Generate page metadata with SEO best practices
 *
 * @param options - Metadata configuration
 * @returns Next.js Metadata object
 *
 * @example
 * ```tsx
 * export async function generateMetadata() {
 *   return generatePageMetadata({
 *     title: "About isBIM",
 *     description: "Leading construction AI platform",
 *     path: "/about-us",
 *     locale: "en",
 *   });
 * }
 * ```
 */
export function generatePageMetadata(options: BaseMetadataOptions): Metadata {
  const {
    title,
    description,
    path = "/",
    locale = "en",
    image,
    imageAlt,
    keywords = [],
    type = "website",
    publishedTime,
    modifiedTime,
    canonical,
    noIndex = false,
  } = options;

  const siteUrl = getSiteUrl();
  const fullTitle = title.includes(SITE_CONFIG.name)
    ? title
    : `${title} | ${SITE_CONFIG.name}`;
  const url = canonical || `${siteUrl}${path}`;
  const ogImage = image ? (image.startsWith("http") ? image : `${siteUrl}${image}`) : `${siteUrl}${DEFAULT_OG_IMAGE}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: url,
      languages: {
        "en": `${siteUrl}/en${path}`,
        "zh": `${siteUrl}/zh${path}`,
        "zh-CN": `${siteUrl}/zh${path}`, // Baidu prefers zh-CN
      },
    },
    openGraph: {
      type: type,
      locale: locale === "zh" ? "zh_CN" : "en_US", // Baidu format
      url: url,
      title: fullTitle,
      description: description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt || fullTitle,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description,
      images: [ogImage],
    },
    // Baidu-specific meta tags (via other field)
    other: {
      // Baidu site verification (to be filled in after registering with Baidu Webmaster)
      // "baidu-site-verification": "code-from-baidu",
      // Mobile optimization hint for Baidu
      "applicable-device": "pc,mobile",
      // Format detection for phone numbers (important for Chinese sites)
      "format-detection": "telephone=no",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };

  return metadata;
}
/**
 * Generate structured data (JSON-LD) for organization
 *
 * @returns Organization JSON-LD object
 *
 * @example
 * ```tsx
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }}
 * />
 * ```
 */
export function generateOrganizationSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    description: SITE_CONFIG.description,
    sameAs: [
      SITE_CONFIG.social.linkedin,
      SITE_CONFIG.social.twitter,
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.youtube,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE_CONFIG.contact.email,
      telephone: SITE_CONFIG.contact.phone,
      contactType: "Customer Service",
    },
  };
}

/**
 * Generate structured data (JSON-LD) for article
 *
 * @param options - Article metadata
 * @returns Article JSON-LD object
 */
export interface ArticleSchemaOptions {
  title: string;
  description: string;
  image: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  url: string;
}

export function generateArticleSchema(options: ArticleSchemaOptions) {
  const { title, description, image, publishedTime, modifiedTime, author, url } = options;
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      "@type": author ? "Person" : "Organization",
      name: author || SITE_CONFIG.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/logo.png`,
      },
    },
    url: url,
  };
}

/**
 * Generate breadcrumb structured data (JSON-LD)
 *
 * @param items - Breadcrumb items
 * @returns BreadcrumbList JSON-LD object
 *
 * @example
 * ```tsx
 * generateBreadcrumbSchema([
 *   { name: "Home", url: "/" },
 *   { name: "About", url: "/about-us" },
 * ])
 * ```
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

/**
 * Common SEO keywords for the site
 */
export const COMMON_KEYWORDS = [
  "isBIM",
  "BIM",
  "construction AI",
  "JARVIS",
  "construction management",
  "building information modeling",
  "construction technology",
  "smart construction",
] as const;

/**
 * Generate locale-specific alternate links
 *
 * @param path - Page path
 * @returns Locale alternate URLs
 */
export function generateAlternates(path: string) {
  const siteUrl = getSiteUrl();

  return {
    canonical: `${siteUrl}${path}`,
    languages: {
      en: `${siteUrl}/en${path}`,
      zh: `${siteUrl}/zh${path}`,
    },
  };
}
