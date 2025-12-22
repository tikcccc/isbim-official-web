/**
 * Robots.txt Generator
 *
 * Purpose:
 * - Tell search engines which pages to crawl
 * - Provide sitemap location
 * - Block crawling of admin/internal routes
 * - Support Chinese search engines (Baidu, Sogou, 360Search)
 *
 * Access: /robots.txt
 */

import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      // General crawlers (Google, Bing, etc.)
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/studio/", // Sanity Studio (admin) - explicit trailing slash
          "/studio", // Sanity Studio (admin)
          "/api/", // API routes
          "/_next/", // Next.js internal
          "/admin/", // Any admin routes
          "/*.json$", // JSON files
          "/api/revalidate", // Webhook endpoints
        ],
      },
      // Baidu (百度) - Chinese market leader
      {
        userAgent: "Baiduspider",
        allow: "/",
        disallow: ["/studio/", "/studio", "/api/", "/_next/", "/admin/"],
      },
      // Sogou (搜狗) - Chinese search engine
      {
        userAgent: "Sogou web spider",
        allow: "/",
        disallow: ["/studio/", "/studio", "/api/", "/_next/", "/admin/"],
      },
      // 360Search (360搜索) - Chinese search engine
      {
        userAgent: "360Spider",
        allow: "/",
        disallow: ["/studio/", "/studio", "/api/", "/_next/", "/admin/"],
      },
      // OpenAI crawler - Optional: block AI training
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      // Google Extended (for AI training)
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
