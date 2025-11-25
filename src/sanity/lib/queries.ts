/**
 * Sanity GROQ Queries
 *
 * Purpose:
 * - Centralized GROQ query definitions
 * - Type-safe query strings with defineQuery
 * - Reusable query patterns for common data fetching
 *
 * Query Patterns:
 * - List queries: Fetch multiple documents with filtering/sorting
 * - Single queries: Fetch one document by slug/id
 * - Projection: Select specific fields to reduce payload
 *
 * Usage:
 * ```tsx
 * import { sanityFetch } from "@/sanity/lib/fetch";
 * import { IMAGE_ASSET_BY_SLUG_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";
 *
 * const image = await sanityFetch({
 *   query: IMAGE_ASSET_BY_SLUG_QUERY,
 *   params: { slug: "home-cta" },
 *   tags: ["imageAsset"],
 * });
 * ```
 */

import { defineQuery } from "next-sanity";

/**
 * Post Queries
 */

/** Fetch all posts ordered by creation date (newest first) */
export const POSTS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    _type,
    _createdAt,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage
  }`
);

/** Fetch a single post by slug */
export const POST_BY_SLUG_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    title,
    slug,
    publishedAt,
    excerpt,
    body,
    mainImage
  }`
);

/**
 * Product Queries
 */

/** Fetch all products */
export const PRODUCTS_QUERY = defineQuery(
  `*[_type == "product" && defined(slug.current)] | order(name asc) {
    _id,
    _type,
    name,
    slug,
    description,
    mainImage,
    price,
    category
  }`
);

/** Fetch a single product by slug */
export const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug][0] {
    _id,
    _type,
    name,
    slug,
    description,
    mainImage,
    price,
    category
  }`
);

/**
 * Image Asset Queries
 */

/** Fetch all image assets */
export const IMAGE_ASSETS_QUERY = defineQuery(
  `*[_type == "imageAsset"] | order(title asc) {
    _id,
    _type,
    title,
    alt,
    file,
    slug
  }`
);

/** Fetch a single image asset by slug */
export const IMAGE_ASSET_BY_SLUG_QUERY = defineQuery(
  `*[_type == "imageAsset" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    alt,
    file,
    slug
  }`
);

/**
 * News Queries
 */

/** Fetch all news ordered by publish date (newest first) */
export const NEWS_QUERY = defineQuery(
  `*[_type == "news" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    publishedAt,
    excerpt,
    coverImage
  }`
);

/** Fetch a single news item by slug */
export const NEWS_BY_SLUG_QUERY = defineQuery(
  `*[_type == "news" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    publishedAt,
    excerpt,
    body,
    coverImage
  }`
);

/**
 * Career Queries
 */

/** Fetch all open career positions */
export const CAREERS_QUERY = defineQuery(
  `*[_type == "career" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    _type,
    title,
    slug,
    department,
    location,
    employmentType
  }`
);

/** Fetch a single career position by slug */
export const CAREER_BY_SLUG_QUERY = defineQuery(
  `*[_type == "career" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    department,
    location,
    employmentType,
    description,
    requirements,
    benefits
  }`
);

/**
 * Project Queries
 */

/** Fetch all projects ordered by completion date (newest first) */
export const PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current)] | order(completedAt desc) {
    _id,
    _type,
    title,
    slug,
    client,
    completedAt,
    coverImage,
    category
  }`
);

/** Fetch a single project by slug */
export const PROJECT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "project" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    client,
    completedAt,
    description,
    coverImage,
    gallery,
    category
  }`
);

/**
 * SEO Metadata Queries
 * Lightweight queries for metadata generation only
 */

/** Fetch post metadata for SEO */
export const POST_METADATA_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0] {
    title,
    excerpt,
    mainImage,
    publishedAt,
    _updatedAt
  }`
);

/** Fetch product metadata for SEO */
export const PRODUCT_METADATA_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug][0] {
    name,
    description,
    mainImage
  }`
);

/** Fetch news metadata for SEO */
export const NEWS_METADATA_QUERY = defineQuery(
  `*[_type == "news" && slug.current == $slug][0] {
    title,
    excerpt,
    coverImage,
    publishedAt,
    _updatedAt
  }`
);

/** Fetch career metadata for SEO */
export const CAREER_METADATA_QUERY = defineQuery(
  `*[_type == "career" && slug.current == $slug][0] {
    title,
    description,
    department,
    location
  }`
);

/** Fetch project metadata for SEO */
export const PROJECT_METADATA_QUERY = defineQuery(
  `*[_type == "project" && slug.current == $slug][0] {
    title,
    description,
    coverImage,
    client
  }`
);

/**
 * Sitemap Queries
 * Ultra-lightweight queries for sitemap generation (only slugs + dates)
 */

/** Fetch all post slugs for sitemap */
export const POSTS_SITEMAP_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }`
);

/** Fetch all product slugs for sitemap */
export const PRODUCTS_SITEMAP_QUERY = defineQuery(
  `*[_type == "product" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }`
);

/** Fetch all news slugs for sitemap */
export const NEWS_SITEMAP_QUERY = defineQuery(
  `*[_type == "news" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }`
);

/** Fetch all career slugs for sitemap */
export const CAREERS_SITEMAP_QUERY = defineQuery(
  `*[_type == "career" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }`
);

/** Fetch all project slugs for sitemap */
export const PROJECTS_SITEMAP_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }`
);

