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
          "relative h-full w-full flex flex-col justify-end will-change-transform transition-transform duration-[180ms] ease-out",
          styles.foreground,
          styles.heroPadding
        )}
      >
        {/* Main content area (match service hero grid layout) */}
        <div
          className="grid grid-cols-12 items-end w-full pointer-events-auto"
          style={{ gap: "var(--product-gap)" }}
        >
          {/* Left: Product Name - Always left aligned */}
          <div
            className="col-span-12 lg:col-span-9 xl:col-span-9 flex flex-col max-w-5xl xl:max-w-none"
            style={{ gap: "var(--product-gap-sm)" }}
          >
            {logoComponent || (
              <h1 className="font-product-title-hero xl:whitespace-nowrap">
                {productName}
              </h1>
            )}

            {productSubtitle && (
              <p className={cn("font-product-subtitle max-w-lg mt-2 md:pl-2")}>
                {productSubtitle}
              </p>
            )}
          </div>

          {/* Right: Metadata - consistent right column position */}
          <div className="col-span-12 lg:col-span-3 xl:col-span-3 hidden md:flex flex-col items-end justify-end">
            <div
              className={cn(
                "font-product-label-bold tracking-[0.28em] relative flex flex-col items-end pr-2 pl-8",
                styles.metaLine,
                styles.metadataLine,
                styles.gapSm,
                styles.metaColor
              )}
            >
              {cleanedMetadata.map((item, i) => (
                <span
                  key={i}
                  className="max-w-[240px] text-right leading-tight hover:text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile metadata - horizontal layout */}
        <div
          className={cn(
            "font-product-label-bold tracking-[0.18em] flex md:hidden mt-6 flex-wrap pointer-events-auto",
            styles.metaChipWrap
          )}
        >
          {cleanedMetadata.slice(0, 4).map((item, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full border backdrop-blur-[1px]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
