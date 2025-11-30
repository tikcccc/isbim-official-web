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
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={posterSrc}
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover -z-10"
        aria-label={`${productName} background video`}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Gradient Overlay - enhanced for better depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent z-0" />

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col justify-end pb-16 md:pb-20 lg:pb-24">
        {/* Main content area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-8 md:gap-12">
          {/* Left: Product Name - anchored bottom-left, not centered */}
          <div className="flex flex-col gap-2 md:gap-4">
            {/* Small JARVIS prefix */}
            <span className="text-white/60 text-xs sm:text-sm uppercase tracking-[0.25em] font-light">
              JARVIS Platform
            </span>

            {logoComponent || (
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem] leading-[0.9] font-bold tracking-tight text-white">
                {productName}
              </h1>
            )}

            {/* Optional subtitle */}
            {productSubtitle && (
              <p className="text-white/70 text-lg md:text-xl lg:text-2xl font-light tracking-wide max-w-md mt-2">
                {productSubtitle}
              </p>
            )}
          </div>

          {/* Right: Metadata Sidebar - refined styling */}
          <div className="hidden md:flex flex-col gap-4 text-white/60 text-[11px] uppercase tracking-[0.12em] border-l border-white/20 pl-5 max-w-[200px]">
            {metadata.map((item, i) => (
              <div
                key={i}
                className="leading-relaxed text-right hover:text-white/90 transition-colors duration-300"
              >
                {item}
              </div>
            ))}
            {/* Copyright notice - more subtle */}
            <div className="opacity-40 mt-6 text-[9px] text-right">
              &copy; {new Date().getFullYear()} isBIM
              <br />
              TECHNOLOGIES LTD.
            </div>
          </div>
        </div>

        {/* Mobile metadata - horizontal layout */}
        <div className="flex md:hidden gap-4 mt-8 text-white/50 text-[10px] uppercase tracking-[0.1em]">
          {metadata.slice(0, 3).map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="w-1 h-1 rounded-full bg-white/30" />}
              {item}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
