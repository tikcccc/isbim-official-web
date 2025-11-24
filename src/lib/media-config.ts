/**
 * Media Configuration
 *
 * Centralized media asset management for videos and images.
 * Supports switching between local assets (development/testing) and
 * remote CDN URLs (production) via environment variable.
 *
 * Usage:
 * ```tsx
 * import { getVideoUrl, getImageUrl } from "@/lib/media-config";
 *
 * <video src={getVideoUrl("banner.mp4")} />
 * <img src={getImageUrl("logo.png")} />
 * ```
 *
 * Environment Setup:
 * ```env
 * # .env.local (development - use local assets)
 * NEXT_PUBLIC_MEDIA_URL=
 *
 * # .env.production (production - use CDN)
 * NEXT_PUBLIC_MEDIA_URL=https://cdn.example.com
 * ```
 */

import { env } from "@/lib/env";

/**
 * Media Base URL
 * Set via NEXT_PUBLIC_MEDIA_URL environment variable.
 * If not set, uses local public directory.
 */
export const MEDIA_BASE_URL = env.NEXT_PUBLIC_MEDIA_URL || "";

/**
 * Media URL Mode
 * Determines if using local or remote media sources.
 */
export const MEDIA_MODE = MEDIA_BASE_URL ? "remote" : "local";

/**
 * Media Configuration Object
 * Structured media URLs for different asset types.
 */
export const MEDIA_CONFIG = {
  /** Videos directory */
  videos: {
    local: "/videos",
    remote: MEDIA_BASE_URL ? `${MEDIA_BASE_URL}/videos` : "/videos",
  },
  /** Images directory */
  images: {
    local: "/images",
    remote: MEDIA_BASE_URL ? `${MEDIA_BASE_URL}/images` : "/images",
  },
  /** Icons directory */
  icons: {
    local: "/icons",
    remote: MEDIA_BASE_URL ? `${MEDIA_BASE_URL}/icons` : "/icons",
  },
  /** Fonts directory */
  fonts: {
    local: "/fonts",
    remote: MEDIA_BASE_URL ? `${MEDIA_BASE_URL}/fonts` : "/fonts",
  },
} as const;

/**
 * Get Video URL
 * Returns the full URL for a video asset.
 *
 * @param filename - Video filename (e.g., "banner.mp4")
 * @returns Full URL to video asset
 *
 * @example
 * ```tsx
 * const videoUrl = getVideoUrl("Agent.mp4");
 * // Local: "/videos/Agent.mp4"
 * // Remote: "https://cdn.example.com/videos/Agent.mp4"
 * ```
 */
export function getVideoUrl(filename: string): string {
  if (MEDIA_MODE === "remote") {
    return `${MEDIA_CONFIG.videos.remote}/${filename}`;
  }
  return `${MEDIA_CONFIG.videos.local}/${filename}`;
}

/**
 * Get Image URL
 * Returns the full URL for an image asset.
 *
 * @param filename - Image filename (e.g., "logo.png")
 * @param subfolder - Optional subfolder (e.g., "products", "projects")
 * @returns Full URL to image asset
 *
 * @example
 * ```tsx
 * const imageUrl = getImageUrl("hero.jpg");
 * const productImage = getImageUrl("agent-preview.png", "products");
 * ```
 */
export function getImageUrl(filename: string, subfolder?: string): string {
  const base =
    MEDIA_MODE === "remote"
      ? MEDIA_CONFIG.images.remote
      : MEDIA_CONFIG.images.local;

  if (subfolder) {
    return `${base}/${subfolder}/${filename}`;
  }
  return `${base}/${filename}`;
}

/**
 * Get Icon URL
 * Returns the full URL for an icon asset.
 *
 * @param filename - Icon filename (e.g., "isbim_white.svg")
 * @returns Full URL to icon asset
 */
export function getIconUrl(filename: string): string {
  if (MEDIA_MODE === "remote") {
    return `${MEDIA_CONFIG.icons.remote}/${filename}`;
  }
  return `${MEDIA_CONFIG.icons.local}/${filename}`;
}

/**
 * Get Font URL
 * Returns the full URL for a font asset.
 *
 * @param filename - Font filename (e.g., "AllianceNo1-Regular.woff2")
 * @param subfolder - Optional subfolder (e.g., "Alliance")
 * @returns Full URL to font asset
 */
export function getFontUrl(filename: string, subfolder?: string): string {
  const base =
    MEDIA_MODE === "remote"
      ? MEDIA_CONFIG.fonts.remote
      : MEDIA_CONFIG.fonts.local;

  if (subfolder) {
    return `${base}/${subfolder}/${filename}`;
  }
  return `${base}/${filename}`;
}

/**
 * Media Asset Configuration Object
 * For complex assets with multiple sources and fallbacks.
 */
export interface MediaAsset {
  /** Local asset path (development) */
  local: string;
  /** Remote asset URL (production) */
  remote: string;
  /** Fallback image (for videos or failed loads) */
  fallback?: string;
  /** Alt text for images */
  alt?: string;
}

/**
 * Get Media Asset URL
 * Returns the appropriate URL based on current media mode.
 *
 * @param asset - MediaAsset configuration object
 * @returns URL string based on current mode
 *
 * @example
 * ```tsx
 * const asset: MediaAsset = {
 *   local: "/videos/Agent.mp4",
 *   remote: "https://cdn.example.com/videos/Agent.mp4",
 *   fallback: "/images/agent-poster.jpg"
 * };
 *
 * const url = getMediaAssetUrl(asset);
 * ```
 */
export function getMediaAssetUrl(asset: MediaAsset): string {
  return MEDIA_MODE === "remote" ? asset.remote : asset.local;
}

/**
 * Create Media Asset Object
 * Helper to create MediaAsset configuration with fallback.
 *
 * @param localPath - Local asset path
 * @param remotePath - Remote asset URL
 * @param fallbackPath - Optional fallback path
 * @returns MediaAsset object
 *
 * @example
 * ```tsx
 * const videoAsset = createMediaAsset(
 *   "/videos/banner.mp4",
 *   "https://cdn.example.com/videos/banner.mp4",
 *   "/images/banner-poster.jpg"
 * );
 * ```
 */
export function createMediaAsset(
  localPath: string,
  remotePath: string,
  fallbackPath?: string
): MediaAsset {
  return {
    local: localPath,
    remote: remotePath,
    fallback: fallbackPath,
  };
}

/**
 * JARVIS Product Videos
 * Pre-configured video URLs for JARVIS products.
 */
export const JARVIS_VIDEOS = {
  agent: getVideoUrl("Agent.mp4"),
  pay: getVideoUrl("pay.mp4"),
  air: getVideoUrl("Air.mp4"),
  eagleEye: getVideoUrl("Eagle Eye.mp4"),
  ssss: getVideoUrl("4S.mp4"),
  dwss: getVideoUrl("dwss.mp4"),
  cdcp: getVideoUrl("CDCP.mp4"),
  assets: getVideoUrl("Assets.mp4"),
  banner: getVideoUrl("banner.mp4"),
} as const;

/**
 * Common Image Paths
 * Pre-configured image URLs for common assets.
 */
export const COMMON_IMAGES = {
  ctaBackground: getImageUrl("cta.png"),
  aboutHeader: getImageUrl("about-header.jpg"),
  logoBlack: getIconUrl("isbim_black.svg"),
  logoWhite: getIconUrl("isbim_white.svg"),
} as const;

/**
 * Check if Media is Remote
 * Helper to determine if using remote CDN.
 *
 * @returns true if using remote CDN, false if local
 */
export function isRemoteMedia(): boolean {
  return MEDIA_MODE === "remote";
}

/**
 * Get Media Info
 * Returns debugging information about media configuration.
 */
export function getMediaInfo() {
  return {
    mode: MEDIA_MODE,
    baseUrl: MEDIA_BASE_URL || "local",
    isRemote: isRemoteMedia(),
    config: MEDIA_CONFIG,
  };
}

export default {
  MEDIA_BASE_URL,
  MEDIA_MODE,
  MEDIA_CONFIG,
  getVideoUrl,
  getImageUrl,
  getIconUrl,
  getFontUrl,
  getMediaAssetUrl,
  createMediaAsset,
  JARVIS_VIDEOS,
  COMMON_IMAGES,
  isRemoteMedia,
  getMediaInfo,
};
