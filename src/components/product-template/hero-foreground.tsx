"use client";

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
      <div className="relative h-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col justify-end pb-10 md:pb-14 lg:pb-20 will-change-transform transition-transform duration-[180ms] ease-out">
        {/* Main content area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-8 pointer-events-auto">
          {/* Left: Product Name - Anchored bottom-left */}
          <div className="flex flex-col gap-1 md:gap-3 max-w-4xl">
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
            <div className="relative flex flex-col items-end gap-3 product-meta pr-2 pl-8 product-text-inverse-muted product-meta-line">
              {cleanedMetadata.map((item, i) => (
                <span
                  key={i}
                  className="max-w-[240px] text-right leading-tight product-text-inverse-subtle hover:text-white transition-colors duration-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile metadata - horizontal layout */}
        <div className="flex md:hidden gap-2 mt-6 product-text-inverse-muted product-meta-chip flex-wrap pointer-events-auto">
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
    </div>
  );
}
