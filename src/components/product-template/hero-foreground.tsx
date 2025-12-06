"use client";

import { cn } from "@/lib/utils";
import styles from "./hero-section.module.css";

/**
 * HeroForeground Props
 */
interface HeroForegroundProps {
  productName: string;
  productSubtitle?: string;
  metadata: string[];
  logoComponent?: React.ReactNode;
}

/**
 * HeroForeground Component
 *
 * Foreground content layer (title and metadata) that moves with scroll.
 * Positioned absolutely to allow smooth upward movement synchronized with NarrativeTrack.
 */
export function HeroForeground({
  productName,
  productSubtitle,
  metadata,
  logoComponent,
}: HeroForegroundProps) {
  const cleanedMetadata = metadata.filter((item) => item?.trim().length);

  return (
    <div
      data-hero-foreground="true"
      className="absolute top-0 left-0 w-full h-screen z-10 pointer-events-none"
    >
      <div
        className={cn(
          "relative h-full max-w-[1800px] mx-auto flex flex-col justify-end will-change-transform transition-transform duration-[180ms] ease-out",
          styles.heroPadding
        )}
      >
        {/* Main content area */}
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-end w-full pointer-events-auto"
          style={{ gap: "var(--product-gap)" }}
        >
          {/* Left: Product Name - Anchored bottom-left */}
          <div
            className="flex flex-col max-w-4xl"
            style={{ gap: "var(--product-gap-sm)" }}
          >
            {logoComponent || (
              <h1 className={styles.heroTitle}>{productName}</h1>
            )}

            {/* Optional subtitle */}
            {productSubtitle && (
              <p className={cn("max-w-lg mt-2 md:pl-2", styles.heroSubtitle)}>
                {productSubtitle}
              </p>
            )}
          </div>

          {/* Right: Metadata - Bottom Right, Minimalist */}
          <div className="hidden md:flex flex-col items-end">
            <div
              className={cn("relative flex flex-col items-end pr-2 pl-8", styles.meta, styles.metaLine)}
              style={{ gap: "var(--product-gap-sm)", transition: "color var(--motion-base) var(--ease-smooth)", color: "var(--text-inverse-muted)" }}
            >
              {cleanedMetadata.map((item, i) => (
                <span
                  key={i}
                  className="max-w-[240px] text-right leading-tight hover:text-white"
                  style={{ color: "var(--text-inverse-subtle)", transition: "color var(--motion-fast) var(--ease-smooth)" }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile metadata - horizontal layout */}
        <div
          className={cn("flex md:hidden mt-6 flex-wrap pointer-events-auto", styles.metaChip)}
          style={{ gap: "var(--product-gap-sm)", color: "var(--text-inverse-muted)" }}
        >
          {cleanedMetadata.slice(0, 4).map((item, i) => (
            <span
              key={i}
              className="px-3 py-1 border backdrop-blur-[1px]"
              style={{
                borderRadius: "var(--product-radius-pill)",
                borderColor: "var(--border-inverse-soft)",
                background: "var(--chip-bg)",
                color: "var(--text-inverse-muted)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
