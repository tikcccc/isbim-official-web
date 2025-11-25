/**
 * Sanity Type Definitions
 *
 * Purpose:
 * - TypeScript types for all Sanity document schemas
 * - Type-safe query results
 * - Matches schema definitions in schemaTypes/
 *
 * Usage:
 * ```tsx
 * import type { ImageAsset, Post, Product } from "@/sanity/lib/types";
 *
 * const image: ImageAsset = await sanityFetch({...});
 * ```
 */

import type { Image, Slug, PortableTextBlock } from "sanity";

/**
 * Base document fields (common to all Sanity documents)
 */
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

/**
 * Image Asset document type
 * Standalone image with metadata
 */
export interface ImageAsset extends SanityDocument {
  _type: "imageAsset";
  title: string;
  alt?: string;
  file?: Image;
  slug: Slug;
}

/**
 * Post document type
 */
export interface Post extends SanityDocument {
  _type: "post";
  title: string;
  slug: Slug;
  publishedAt?: string;
  excerpt?: string;
  body?: PortableTextBlock[]; // Block content
  mainImage?: Image;
}

/**
 * Product document type
 */
export interface Product extends SanityDocument {
  _type: "product";
  name: string;
  slug: Slug;
  description?: string;
  mainImage?: Image;
  price?: number;
  category?: string;
}

/**
 * News document type
 */
export interface News extends SanityDocument {
  _type: "news";
  title: string;
  slug: Slug;
  publishedAt?: string;
  excerpt?: string;
  body?: PortableTextBlock[];
  coverImage?: Image;
}

/**
 * Career document type
 */
export interface Career extends SanityDocument {
  _type: "career";
  title: string;
  slug: Slug;
  department?: string;
  location?: string;
  employmentType?: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
}

/**
 * Project document type
 */
export interface Project extends SanityDocument {
  _type: "project";
  title: string;
  slug: Slug;
  client?: string;
  completedAt?: string;
  description?: string;
  coverImage?: Image;
  gallery?: Image[];
  category?: string;
}

/**
 * SEO Metadata type
 * Minimal fields needed for generating page metadata
 */
export interface SeoMetadata {
  title: string;
  description?: string;
  image?: Image;
  keywords?: string[];
}
