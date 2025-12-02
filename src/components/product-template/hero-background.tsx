"use client";

import { useEffect, useRef } from "react";

/**
 * HeroBackground Props
 */
interface HeroBackgroundProps {
  videoSrc: string;
  posterSrc?: string;
  productName: string;
}

/**
 * HeroBackground Component
 *
 * Fixed background layer with video that stays in place during scroll.
 * This is completely decoupled from the foreground content.
 */
export function HeroBackground({
  videoSrc,
  posterSrc,
  productName,
}: HeroBackgroundProps) {
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
    <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden bg-product-dark">
      {/* Video Background */}
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
  );
}
