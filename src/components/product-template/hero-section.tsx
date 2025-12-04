"use client";

import { useEffect, useRef } from "react";

/**
 * HeroSection Props
 * @param productName - The product name to display (e.g., "JARVIS Pay")
 * @param productSubtitle - Optional subtitle below the product name
 * @param videoSrc - URL to the background video
 * @param posterSrc - Optional poster image for video fallback
 * @param metadata - Array of metadata strings displayed in sidebar
 * @param logoComponent - Optional custom logo component instead of text
 */
interface HeroSectionProps {
  productName: string;
  productSubtitle?: string;
  videoSrc: string;
  posterSrc?: string;
  metadata: string[];
  logoComponent?: React.ReactNode;
}

/**
 * HeroSection Component
 *
 * A sticky hero section that acts as the underlayer for product pages.
 * Features:
 * - Sticky positioning (stays fixed while content scrolls over)
 * - Full-screen video background with autoplay
 * - Gradient overlay for text legibility
 * - Elegant typography with balanced sizing
 * - Metadata sidebar with vertical accent line
 *
 * Based on product-template.html reference design with refined aesthetics.
 */
export function HeroSection({
  productName,
  productSubtitle,
  videoSrc,
  posterSrc,
  metadata,
  logoComponent,
}: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cleanedMetadata = metadata.filter((item) => item?.trim().length);

  useEffect(() => {
    // Ensure video plays on mount (Safari/iOS compatibility)
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay blocked - user interaction required
        // Video will show poster or first frame
      });
    }
  }, []);

  return (
    <header className="sticky top-0 h-screen z-0 overflow-hidden product-surface-dark">
      {/* Background Video Layer - stays fixed (or slow parallax) */}
      <div className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          preload="metadata"
          className="w-full h-full object-cover"
          aria-label={`${productName} background video`}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Gradient Overlay - enhanced for better depth and readability */}
        <div className="absolute inset-0 product-hero-overlay-vertical transition-opacity product-transition-base" />
        <div className="absolute inset-0 product-hero-overlay-horizontal transition-opacity product-transition-base" />
      </div>

      {/* Foreground Content Layer - moves with narrative track */}
      <div
        data-hero-foreground="true"
        className="relative z-10 h-full max-w-[1800px] mx-auto product-hero-padding flex flex-col justify-end will-change-transform"
        style={{
          transition: "transform 0.18s ease-out",
        }}
      >
        {/* Main content area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full product-gap">
          {/* Left: Product Name - Anchored bottom-left */}
          <div className="flex flex-col product-gap-sm max-w-4xl">
            {logoComponent || (
              <h1 className="product-hero-title product-text-inverse">
                {productName}
              </h1>
            )}

            {/* Optional subtitle */}
            {productSubtitle && (
              <p className="product-hero-subtitle product-text-inverse-muted max-w-lg mt-2 md:pl-2">
                {productSubtitle}
              </p>
            )}
          </div>

          {/* Right: Metadata - Bottom Right, Minimalist */}
          <div className="hidden md:flex flex-col items-end product-text-inverse">
            <div className="relative flex flex-col items-end product-gap-sm product-meta pr-2 pl-8 product-text-inverse-muted product-meta-line transition-colors product-transition-base">
              {cleanedMetadata.map((item, i) => (
                <span
                  key={i}
                  className="max-w-[240px] text-right leading-tight product-text-inverse-subtle hover:text-white transition-colors product-transition-fast"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile metadata - horizontal layout */}
        <div className="flex md:hidden product-gap-sm mt-6 product-text-inverse-muted product-meta-chip flex-wrap">
          {cleanedMetadata.slice(0, 4).map((item, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full border product-border-inverse product-chip backdrop-blur-[1px]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
