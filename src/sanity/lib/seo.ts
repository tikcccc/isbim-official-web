/**
 * Sanity SEO Helpers
 *
 * Purpose:
 * - Bridge between Sanity CMS and Next.js metadata generation
 * - Type-safe metadata builders using Sanity data
 * - Reusable patterns for different content types
 *
 * Usage:
 * ```tsx
 * import { generatePostMetadata } from "@/sanity/lib/seo";
 *
 * export async function generateMetadata({ params }) {
 *   return generatePostMetadata(params.slug, params.locale);
 * }
 * ```
 */

import type { Metadata } from "next";
import type { Image } from "sanity";
import { sanityFetch, buildCacheTags, REVALIDATE } from "./fetch";
import {
  POST_METADATA_QUERY,
  PRODUCT_METADATA_QUERY,
  NEWS_METADATA_QUERY,
  CAREER_METADATA_QUERY,
  PROJECT_METADATA_QUERY,
} from "./queries";
import { urlFor } from "./image";
import { generatePageMetadata, COMMON_KEYWORDS } from "@/lib/seo";

/**
 * Generate metadata for a post
 *
 * @param slug - Post slug
 * @param locale - Current locale
 * @returns Next.js Metadata object
 */
export async function generatePostMetadata(
  slug: string,
  locale: string = "en"
): Promise<Metadata> {
  try {
    const post = await sanityFetch<{
      title: string;
      excerpt?: string;
      mainImage?: Image;
      publishedAt?: string;
      _updatedAt: string;
    } | null>({
      query: POST_METADATA_QUERY,
      params: { slug },
      tags: buildCacheTags("post", slug),
      revalidate: REVALIDATE.HOUR,
    });

    if (!post) {
      return generatePageMetadata({
        title: "Post Not Found",
        description: "The requested post could not be found.",
        path: `/posts/${slug}`,
        locale,
        noIndex: true,
      });
    }

    const imageUrl = post.mainImage ? urlFor(post.mainImage)?.width(1200).height(630).url() : undefined;

    return generatePageMetadata({
      title: post.title,
      description: post.excerpt || `Read more about ${post.title}`,
      path: `/posts/${slug}`,
      locale,
      image: imageUrl,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      keywords: [...COMMON_KEYWORDS, "blog", "news"],
    });
  } catch (error) {
    console.error(`[SEO] Failed to generate post metadata for slug: ${slug}`, error);
    return generatePageMetadata({
      title: "Error Loading Post",
      description: "An error occurred while loading the post.",
      path: `/posts/${slug}`,
      locale,
      noIndex: true,
    });
  }
}

/**
 * Generate metadata for a product
 *
 * @param slug - Product slug
 * @param locale - Current locale
 * @returns Next.js Metadata object
 */
export async function generateProductMetadata(
  slug: string,
  locale: string = "en"
): Promise<Metadata> {
  try {
    const product = await sanityFetch<{
      name: string;
      description?: string;
      mainImage?: Image;
    } | null>({
      query: PRODUCT_METADATA_QUERY,
      params: { slug },
      tags: buildCacheTags("product", slug),
      revalidate: REVALIDATE.DAY,
    });

    if (!product) {
      return generatePageMetadata({
        title: "Product Not Found",
        description: "The requested product could not be found.",
        path: `/products/${slug}`,
        locale,
        noIndex: true,
      });
    }

    const imageUrl = product.mainImage ? urlFor(product.mainImage)?.width(1200).height(630).url() : undefined;

    return generatePageMetadata({
      title: product.name,
      description: product.description || `Learn more about ${product.name}`,
      path: `/products/${slug}`,
      locale,
      image: imageUrl,
      keywords: [...COMMON_KEYWORDS, "product", "solution"],
    });
  } catch (error) {
    console.error(`[SEO] Failed to generate product metadata for slug: ${slug}`, error);
    return generatePageMetadata({
      title: "Error Loading Product",
      description: "An error occurred while loading the product.",
      path: `/products/${slug}`,
      locale,
      noIndex: true,
    });
  }
}

/**
 * Generate metadata for a news article
 *
 * @param slug - News slug
 * @param locale - Current locale
 * @returns Next.js Metadata object
 */
export async function generateNewsMetadata(
  slug: string,
  locale: string = "en"
): Promise<Metadata> {
  try {
    const news = await sanityFetch<{
      title: string;
      excerpt?: string;
      coverImage?: Image;
      publishedAt?: string;
      _updatedAt: string;
    } | null>({
      query: NEWS_METADATA_QUERY,
      params: { slug },
      tags: buildCacheTags("news", slug),
      revalidate: REVALIDATE.HOUR,
    });

    if (!news) {
      return generatePageMetadata({
        title: "News Not Found",
        description: "The requested news article could not be found.",
        path: `/newsroom/${slug}`,
        locale,
        noIndex: true,
      });
    }

    const imageUrl = news.coverImage ? urlFor(news.coverImage)?.width(1200).height(630).url() : undefined;

    return generatePageMetadata({
      title: news.title,
      description: news.excerpt || `Read the latest news: ${news.title}`,
      path: `/newsroom/${slug}`,
      locale,
      image: imageUrl,
      type: "article",
      publishedTime: news.publishedAt,
      modifiedTime: news._updatedAt,
      keywords: [...COMMON_KEYWORDS, "news", "updates", "announcements"],
    });
  } catch (error) {
    console.error(`[SEO] Failed to generate news metadata for slug: ${slug}`, error);
    return generatePageMetadata({
      title: "Error Loading News",
      description: "An error occurred while loading the news article.",
      path: `/newsroom/${slug}`,
      locale,
      noIndex: true,
    });
  }
}

/**
 * Generate metadata for a career position
 *
 * @param slug - Career slug
 * @param locale - Current locale
 * @returns Next.js Metadata object
 */
export async function generateCareerMetadata(
  slug: string,
  locale: string = "en"
): Promise<Metadata> {
  try {
    const career = await sanityFetch<{
      title: string;
      description?: string;
      department?: string;
      location?: string;
    } | null>({
      query: CAREER_METADATA_QUERY,
      params: { slug },
      tags: buildCacheTags("career", slug),
      revalidate: REVALIDATE.DAY,
    });

    if (!career) {
      return generatePageMetadata({
        title: "Career Position Not Found",
        description: "The requested career position could not be found.",
        path: `/careers/${slug}`,
        locale,
        noIndex: true,
      });
    }

    const description =
      career.description ||
      `Join our team as ${career.title}${career.department ? ` in ${career.department}` : ""}${career.location ? ` (${career.location})` : ""}`;

    return generatePageMetadata({
      title: career.title,
      description,
      path: `/careers/${slug}`,
      locale,
      keywords: [...COMMON_KEYWORDS, "careers", "jobs", "hiring", career.title],
    });
  } catch (error) {
    console.error(`[SEO] Failed to generate career metadata for slug: ${slug}`, error);
    return generatePageMetadata({
      title: "Error Loading Career",
      description: "An error occurred while loading the career position.",
      path: `/careers/${slug}`,
      locale,
      noIndex: true,
    });
  }
}

/**
 * Generate metadata for a project
 *
 * @param slug - Project slug
 * @param locale - Current locale
 * @returns Next.js Metadata object
 */
export async function generateProjectMetadata(
  slug: string,
  locale: string = "en"
): Promise<Metadata> {
  try {
    const project = await sanityFetch<{
      title: string;
      description?: string;
      coverImage?: Image;
      client?: string;
    } | null>({
      query: PROJECT_METADATA_QUERY,
      params: { slug },
      tags: buildCacheTags("project", slug),
      revalidate: REVALIDATE.DAY,
    });

    if (!project) {
      return generatePageMetadata({
        title: "Project Not Found",
        description: "The requested project could not be found.",
        path: `/projects/${slug}`,
        locale,
        noIndex: true,
      });
    }

    const imageUrl = project.coverImage ? urlFor(project.coverImage)?.width(1200).height(630).url() : undefined;

    const description =
      project.description || `Explore our project: ${project.title}${project.client ? ` for ${project.client}` : ""}`;

    return generatePageMetadata({
      title: project.title,
      description,
      path: `/projects/${slug}`,
      locale,
      image: imageUrl,
      keywords: [...COMMON_KEYWORDS, "project", "case study", "portfolio"],
    });
  } catch (error) {
    console.error(`[SEO] Failed to generate project metadata for slug: ${slug}`, error);
    return generatePageMetadata({
      title: "Error Loading Project",
      description: "An error occurred while loading the project.",
      path: `/projects/${slug}`,
      locale,
      noIndex: true,
    });
  }
}
