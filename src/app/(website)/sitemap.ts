/**
 * Dynamic Sitemap Generator
 *
 * Purpose:
 * - Generate XML sitemap dynamically from Sanity CMS content
 * - Include static pages and dynamic content (posts, products, news, etc.)
 * - Support multi-language with proper hreflang
 * - Cache with tag-based revalidation
 *
 * Access: https://isbim.com/sitemap.xml
 *
 * Features:
 * - Automatic URL generation from Sanity content
 * - Last modified dates for better SEO
 * - Priority and change frequency optimization
 * - Locale-aware URLs (en/zh)
 */

import type { MetadataRoute } from "next";
import { sanityFetch, REVALIDATE } from "@/sanity/lib/fetch";
import {
  POSTS_SITEMAP_QUERY,
  PRODUCTS_SITEMAP_QUERY,
  NEWS_SITEMAP_QUERY,
  CAREERS_SITEMAP_QUERY,
  PROJECTS_SITEMAP_QUERY,
} from "@/sanity/lib/queries";
import { ROUTES } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";

interface SitemapEntry {
  slug: string;
  _updatedAt: string;
}

/**
 * Generate sitemap with static pages and dynamic Sanity content
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  // Fetch all dynamic content slugs from Sanity
  const [posts, products, news, careers, projects] = await Promise.all([
    sanityFetch<SitemapEntry[]>({
      query: POSTS_SITEMAP_QUERY,
      tags: ["post"],
      revalidate: REVALIDATE.HOUR,
    }).catch(() => []),
    sanityFetch<SitemapEntry[]>({
      query: PRODUCTS_SITEMAP_QUERY,
      tags: ["product"],
      revalidate: REVALIDATE.DAY,
    }).catch(() => []),
    sanityFetch<SitemapEntry[]>({
      query: NEWS_SITEMAP_QUERY,
      tags: ["news"],
      revalidate: REVALIDATE.HOUR,
    }).catch(() => []),
    sanityFetch<SitemapEntry[]>({
      query: CAREERS_SITEMAP_QUERY,
      tags: ["career"],
      revalidate: REVALIDATE.DAY,
    }).catch(() => []),
    sanityFetch<SitemapEntry[]>({
      query: PROJECTS_SITEMAP_QUERY,
      tags: ["project"],
      revalidate: REVALIDATE.DAY,
    }).catch(() => []),
  ]);

  // Static pages (high priority, frequent changes)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${siteUrl}/en`,
          zh: `${siteUrl}/zh`,
        },
      },
    },
    {
      url: `${siteUrl}${ROUTES.ABOUT}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/en${ROUTES.ABOUT}`,
          zh: `${siteUrl}/zh${ROUTES.ABOUT}`,
        },
      },
    },
    {
      url: `${siteUrl}${ROUTES.SERVICES_PRODUCTS}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${siteUrl}/en${ROUTES.SERVICES_PRODUCTS}`,
          zh: `${siteUrl}/zh${ROUTES.SERVICES_PRODUCTS}`,
        },
      },
    },
    {
      url: `${siteUrl}${ROUTES.NEWSROOM}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/en${ROUTES.NEWSROOM}`,
          zh: `${siteUrl}/zh${ROUTES.NEWSROOM}`,
        },
      },
    },
    {
      url: `${siteUrl}${ROUTES.CAREERS}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${siteUrl}/en${ROUTES.CAREERS}`,
          zh: `${siteUrl}/zh${ROUTES.CAREERS}`,
        },
      },
    },
    // Note: Contact page included but under redesign (lower priority)
    {
      url: `${siteUrl}${ROUTES.CONTACT}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5, // Lower priority - page under redesign
      alternates: {
        languages: {
          en: `${siteUrl}/en${ROUTES.CONTACT}`,
          zh: `${siteUrl}/zh${ROUTES.CONTACT}`,
        },
      },
    },
  ];

  // JARVIS product pages (excluding SUITE - under redesign)
  const jarvisPages: MetadataRoute.Sitemap = Object.values(ROUTES.JARVIS)
    .filter((route) => route !== ROUTES.JARVIS.SUITE) // Exclude /jarvis-ai-suite
    .map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: {
        languages: {
          en: `${siteUrl}/en${route}`,
          zh: `${siteUrl}/zh${route}`,
        },
      },
    }));

  // BIM Consultancy, Project Finance, Venture Investments
  const servicePages: MetadataRoute.Sitemap = [
    ROUTES.BIM_CONSULTANCY,
    ROUTES.PROJECT_FINANCE,
    ROUTES.VENTURE_INVESTMENTS,
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        en: `${siteUrl}/en${route}`,
        zh: `${siteUrl}/zh${route}`,
      },
    },
  }));

  // Dynamic Sanity content pages
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
    alternates: {
      languages: {
        en: `${siteUrl}/en/posts/${post.slug}`,
        zh: `${siteUrl}/zh/posts/${post.slug}`,
      },
    },
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        en: `${siteUrl}/en/products/${product.slug}`,
        zh: `${siteUrl}/zh/products/${product.slug}`,
      },
    },
  }));

  const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${siteUrl}/newsroom/${item.slug}`,
    lastModified: new Date(item._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: `${siteUrl}/en/newsroom/${item.slug}`,
        zh: `${siteUrl}/zh/newsroom/${item.slug}`,
      },
    },
  }));

  const careerPages: MetadataRoute.Sitemap = careers.map((career) => ({
    url: `${siteUrl}/careers/${career.slug}`,
    lastModified: new Date(career._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: `${siteUrl}/en/careers/${career.slug}`,
        zh: `${siteUrl}/zh/careers/${career.slug}`,
      },
    },
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: new Date(project._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: `${siteUrl}/en/projects/${project.slug}`,
        zh: `${siteUrl}/zh/projects/${project.slug}`,
      },
    },
  }));

  // Combine all pages
  return [
    ...staticPages,
    ...jarvisPages,
    ...servicePages,
    ...postPages,
    ...productPages,
    ...newsPages,
    ...careerPages,
    ...projectPages,
  ];
}
