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
    <header className="sticky top-0 h-screen z-0 overflow-hidden bg-product-dark">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* Foreground Content Layer - moves with narrative track */}
      <div
        data-hero-foreground="true"
        className="relative z-10 h-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col justify-end pb-10 md:pb-14 lg:pb-20 will-change-transform"
        style={{
          transition: "transform 0.18s ease-out",
        }}
      >
        {/* Main content area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-8">
          {/* Left: Product Name - Anchored bottom-left */}
          <div className="flex flex-col gap-1 md:gap-3 max-w-4xl">
            {logoComponent || (
              <h1 className="product-hero-title text-white">
                {productName}
              </h1>
            )}

            {/* Optional subtitle */}
            {productSubtitle && (
              <p className="product-hero-subtitle text-white/80 max-w-lg mt-2 md:pl-2">
                {productSubtitle}
              </p>
            )}
          </div>

          {/* Right: Metadata - Bottom Right, Minimalist */}
          <div className="hidden md:flex flex-col items-end text-white">
            <div className="relative flex flex-col items-end gap-3 product-meta pr-2 pl-8 text-white/80 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-px before:bg-gradient-to-b before:from-white/0 before:via-white/55 before:to-white/0 before:opacity-80">
              {cleanedMetadata.map((item, i) => (
                <span
                  key={i}
                  className="max-w-[240px] text-right leading-tight hover:text-white transition-colors duration-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile metadata - horizontal layout */}
        <div className="flex md:hidden gap-2 mt-6 text-white/75 product-meta-chip flex-wrap">
          {cleanedMetadata.slice(0, 4).map((item, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-[1px]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
