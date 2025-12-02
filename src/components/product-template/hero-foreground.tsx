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
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[9rem] leading-[0.85] font-bold tracking-tighter text-white">
                {productName}
              </h1>
            )}

            {/* Optional subtitle */}
            {productSubtitle && (
              <p className="text-white/80 text-lg md:text-xl lg:text-2xl font-light tracking-wide max-w-lg mt-2 md:pl-2">
                {productSubtitle}
              </p>
            )}
          </div>

          {/* Right: Metadata - Bottom Right, Minimalist */}
          <div className="hidden md:flex flex-col items-end text-white">
            <div className="relative flex flex-col items-end gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] leading-[1.8] pr-2 pl-8 text-white/80 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-px before:bg-gradient-to-b before:from-white/0 before:via-white/55 before:to-white/0 before:opacity-80">
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
        <div className="flex md:hidden gap-2 mt-6 text-white/75 text-[10px] uppercase tracking-[0.2em] flex-wrap pointer-events-auto">
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
    </div>
  );
}
