/**
 * Dynamic Sitemap Generator
 *
 * Purpose:
 * - Generate XML sitemap dynamically from Sanity CMS content
 * - Include static pages and dynamic content (posts, products, news, etc.)
 * - Support multi-language with proper hreflang
 * - Cache with tag-based revalidation
 *
 * Access: /sitemap.xml
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
  NEWS_SITEMAP_QUERY,
  CASE_STUDIES_SITEMAP_QUERY,
  CAREERS_SITEMAP_QUERY,
} from "@/sanity/lib/queries";
import { ROUTES } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";
import { sourceLanguageTag } from "@/paraglide/runtime";

interface SitemapEntry {
  slug: string;
  _updatedAt: string;
}

const STATIC_PAGE_LAST_MODIFIED: Record<string, string> = {
  "/": "2025-12-30",
  "/about-us": "2025-12-30",
  "/services-products": "2025-12-22",
  "/newsroom": "2025-12-30",
  "/case-studies": "2026-02-09",
  "/careers": "2026-01-12",
  "/contact": "2025-12-22",
  "/privacy": "2026-03-16",
  "/terms": "2026-03-16",
  "/cookies": "2026-03-16",
  "/privacy-cookie-policy": "2026-03-16",
  "/jarvis-agent": "2026-03-16",
  "/jarvis-pay": "2025-12-01",
  "/jarvis-air": "2025-12-01",
  "/jarvis-eagle-eye": "2025-12-01",
  "/jarvis-ssss": "2025-12-01",
  "/jarvis-dwss": "2025-12-01",
  "/jarvis-cdcp": "2025-12-01",
  "/jarvis-assets": "2025-12-01",
  "/jarvis-jpm": "2025-12-09",
  "/bim-consultancy": "2025-12-09",
  "/project-finance": "2025-12-09",
  "/venture-investments": "2025-12-09",
};

function getStaticLastModified(route: string): Date {
  return new Date(`${STATIC_PAGE_LAST_MODIFIED[route] ?? "2025-12-01"}T00:00:00.000Z`);
}

/**
 * Generate sitemap with static pages and dynamic Sanity content
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const defaultLocale = sourceLanguageTag;
  const withLocale = (route: string, locale: string) =>
    `${siteUrl}/${locale}${route === "/" ? "" : route}`;

  // Fetch all dynamic content slugs from Sanity
  const [news, caseStudies, careers] = await Promise.all([
    sanityFetch<SitemapEntry[]>({
      query: NEWS_SITEMAP_QUERY,
      tags: ["news"],
      revalidate: REVALIDATE.HOUR,
    }).catch(() => []),
    sanityFetch<SitemapEntry[]>({
      query: CASE_STUDIES_SITEMAP_QUERY,
      tags: ["caseStudy"],
      revalidate: REVALIDATE.HOUR,
    }).catch(() => []),
    sanityFetch<SitemapEntry[]>({
      query: CAREERS_SITEMAP_QUERY,
      tags: ["career"],
      revalidate: REVALIDATE.DAY,
    }).catch(() => []),
  ]);

  // Static pages (high priority, frequent changes)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: withLocale(ROUTES.HOME, defaultLocale),
      lastModified: getStaticLastModified(ROUTES.HOME),
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          en: withLocale(ROUTES.HOME, "en"),
          zh: withLocale(ROUTES.HOME, "zh"),
        },
      },
    },
    {
      url: withLocale(ROUTES.ABOUT, defaultLocale),
      lastModified: getStaticLastModified(ROUTES.ABOUT),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: withLocale(ROUTES.ABOUT, "en"),
          zh: withLocale(ROUTES.ABOUT, "zh"),
        },
      },
    },
    {
      url: withLocale(ROUTES.SERVICES_PRODUCTS, defaultLocale),
      lastModified: getStaticLastModified(ROUTES.SERVICES_PRODUCTS),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: withLocale(ROUTES.SERVICES_PRODUCTS, "en"),
          zh: withLocale(ROUTES.SERVICES_PRODUCTS, "zh"),
        },
      },
    },
    {
      url: withLocale(ROUTES.NEWSROOM, defaultLocale),
      lastModified: getStaticLastModified(ROUTES.NEWSROOM),
      changeFrequency: "daily",
      priority: 0.8,
      alternates: {
        languages: {
          en: withLocale(ROUTES.NEWSROOM, "en"),
          zh: withLocale(ROUTES.NEWSROOM, "zh"),
        },
      },
    },
    {
      url: withLocale(ROUTES.CASE_STUDIES, defaultLocale),
      lastModified: getStaticLastModified(ROUTES.CASE_STUDIES),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          en: withLocale(ROUTES.CASE_STUDIES, "en"),
          zh: withLocale(ROUTES.CASE_STUDIES, "zh"),
        },
      },
    },
    {
      url: withLocale(ROUTES.CAREERS, defaultLocale),
      lastModified: getStaticLastModified(ROUTES.CAREERS),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          en: withLocale(ROUTES.CAREERS, "en"),
          zh: withLocale(ROUTES.CAREERS, "zh"),
        },
      },
    },
    // Note: Contact page included but under redesign (lower priority)
    {
      url: withLocale(ROUTES.CONTACT, defaultLocale),
      lastModified: getStaticLastModified(ROUTES.CONTACT),
      changeFrequency: "monthly",
      priority: 0.5, // Lower priority - page under redesign
      alternates: {
        languages: {
          en: withLocale(ROUTES.CONTACT, "en"),
          zh: withLocale(ROUTES.CONTACT, "zh"),
        },
      },
    },
  ];

  // Legal pages (low priority, rare updates)
  const legalRoutes = [
    "/privacy-cookie-policy",
    "/privacy",
    "/terms",
    "/cookies",
  ];

  const legalPages: MetadataRoute.Sitemap = legalRoutes.map((route) => ({
    url: withLocale(route, defaultLocale),
    lastModified: getStaticLastModified(route),
    changeFrequency: "yearly" as const,
    priority: 0.3,
    alternates: {
      languages: {
        en: withLocale(route, "en"),
        zh: withLocale(route, "zh"),
      },
    },
  }));

  // JARVIS product pages (excluding SUITE - under redesign)
  const jarvisPages: MetadataRoute.Sitemap = Object.values(ROUTES.JARVIS)
    .filter((route) => route !== ROUTES.JARVIS.SUITE) // Exclude /jarvis-ai-suite
    .map((route) => ({
      url: withLocale(route, defaultLocale),
      lastModified: getStaticLastModified(route),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: {
        languages: {
          en: withLocale(route, "en"),
          zh: withLocale(route, "zh"),
        },
      },
    }));

  // BIM Consultancy, Project Finance, Venture Investments
  const servicePages: MetadataRoute.Sitemap = [
    ROUTES.BIM_CONSULTANCY,
    ROUTES.PROJECT_FINANCE,
    ROUTES.VENTURE_INVESTMENTS,
  ].map((route) => ({
    url: withLocale(route, defaultLocale),
    lastModified: getStaticLastModified(route),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        en: withLocale(route, "en"),
        zh: withLocale(route, "zh"),
      },
    },
  }));

  // Dynamic Sanity content pages
  const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
    url: withLocale(`/newsroom/${item.slug}`, defaultLocale),
    lastModified: new Date(item._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: withLocale(`/newsroom/${item.slug}`, "en"),
        zh: withLocale(`/newsroom/${item.slug}`, "zh"),
      },
    },
  }));

  const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map((item) => ({
    url: withLocale(`/case-studies/${item.slug}`, defaultLocale),
    lastModified: new Date(item._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: withLocale(`/case-studies/${item.slug}`, "en"),
        zh: withLocale(`/case-studies/${item.slug}`, "zh"),
      },
    },
  }));

  const careerPages: MetadataRoute.Sitemap = careers.map((career) => ({
    url: withLocale(`/careers/${career.slug}`, defaultLocale),
    lastModified: new Date(career._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: withLocale(`/careers/${career.slug}`, "en"),
        zh: withLocale(`/careers/${career.slug}`, "zh"),
      },
    },
  }));

  // Combine all pages
  return [
    ...staticPages,
    ...legalPages,
    ...jarvisPages,
    ...servicePages,
    ...newsPages,
    ...caseStudyPages,
    ...careerPages,
  ];
}
