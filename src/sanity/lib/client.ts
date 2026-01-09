/**
 * Sanity Client Configuration
 *
 * Purpose:
 * - Centralized Sanity client setup with environment-based CDN configuration
 * - Separate clients for read operations (with CDN) and write operations (without CDN)
 * - Type-safe configuration from environment variables
 *
 * CDN Strategy:
 * - Always bypass CDN for freshest data (useCdn: false)
 * - Write operations also bypass CDN for immediate consistency
 *
 * Usage:
 * ```tsx
 * import { client, writeClient } from "@/sanity/lib/client";
 *
 * // Read operations (bypasses CDN for fresh data)
 * const data = await client.fetch(query);
 *
 * // Write operations (bypasses CDN)
 * await writeClient.create(document);
 * ```
 */

import { createClient } from "next-sanity";
import { sanityConfig } from "@/lib/env";

export const projectId = sanityConfig.projectId;
export const dataset = sanityConfig.dataset;
export const apiVersion = sanityConfig.apiVersion;

/**
 * Read-only client for data fetching
 * Always bypass CDN for fresh data (both dev and prod)
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  stega: {
    enabled: false,
    studioUrl: "/studio",
  },
});

/**
 * Write client for mutations
 * Always bypasses CDN for immediate consistency
 * Requires authentication token from environment
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: sanityConfig.token,
  perspective: "published",
});

/**
 * Preview client (includes drafts when using a valid token)
 * Use this only for preview/editorial surfaces. Do NOT expose publicly.
 */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: sanityConfig.token,
  perspective: "previewDrafts",
  stega: {
    enabled: false,
    studioUrl: "/studio",
  },
});
