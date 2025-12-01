"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { VIEWPORT_THRESHOLDS } from "@/lib/animations";

/**
 * Detail item for the feature's detail view
 */
interface DetailItem {
  title: string;
  description: string;
}

/**
 * FeatureSection Props
 * @param index - Feature index string (e.g., "0.1", "0.2")
 * @param totalFeatures - Total number of features for breadcrumb generation
 * @param title - Array of title lines (each line on new row)
 * @param description - Feature description text
 * @param mediaSrc - Source URL for video or image
 * @param mediaType - Type of media ("video" or "image")
 * @param mediaPoster - Optional poster image for video
 * @param isLast - Whether this is the last feature (removes border)
 * @param details - Optional array of detail items for the detail view toggle
 * @param videoLabel - Label for video toggle option
 * @param detailsLabel - Label for details toggle option
 */
interface FeatureSectionProps {
  index: string;
  totalFeatures: number;
  title: string[];
  description: string;
  mediaSrc: string;
  mediaType?: "video" | "image";
  mediaPoster?: string;
  isLast?: boolean;
  details?: DetailItem[];
  videoLabel?: string;
  detailsLabel?: string;
}

/**
 * FeatureSection Component
 *
 * A two-column feature block with sticky left column and scrollable right column.
 * Features:
 * - 5/7 column split (left/right) on desktop
 * - Sticky left column (index + title)
 * - Reversible index animation (IntersectionObserver)
 * - Dynamic index breadcrumb generation
 * - Video or image media support
 * - Video/Details toggle for switching between media and detail list
 *
 * Based on product-template.html Section C "Feature Sections".
 */
export function FeatureSection({
  index,
  totalFeatures,
  title,
  description,
  mediaSrc,
  mediaType = "video",
  mediaPoster,
  isLast = false,
  details,
  videoLabel = "Video",
  detailsLabel = "Details",
}: FeatureSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<"video" | "details">("video");
  const [isFlashing, setIsFlashing] = useState(false);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isIndexFlashing, setIsIndexFlashing] = useState(false);
  const indexFlashTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasFlashedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // IntersectionObserver for reversible animation + index flash trigger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("feature-active");

            // Trigger index flash only once when section becomes active
            if (!hasFlashedRef.current) {
              hasFlashedRef.current = true;

              // Clear any existing index flash timer
              if (indexFlashTimerRef.current) {
                clearTimeout(indexFlashTimerRef.current);
              }

              // Wait for index entrance animation to complete (0.8s) before flashing
              setTimeout(() => {
                // Trigger rapid pulse flash on index
                setIsIndexFlashing(true);

                // Reset flash state after animation completes (0.25s)
                indexFlashTimerRef.current = setTimeout(() => {
                  setIsIndexFlashing(false);
                  indexFlashTimerRef.current = null;
                }, 300);
              }, 250);
            }
          } else {
            entry.target.classList.remove("feature-active");
            // Reset flash flag when section exits viewport (allows re-flash on re-entry)
            hasFlashedRef.current = false;
          }
        });
      },
      {
        threshold: VIEWPORT_THRESHOLDS.low, // 30% visible
        rootMargin: "0px",
      }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      // Cleanup timers on unmount
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
      }
      if (indexFlashTimerRef.current) {
        clearTimeout(indexFlashTimerRef.current);
      }
    };
  }, []);

  // Handle toggle click with instant jump + rapid pulse animation
  const handleToggleClick = (view: "video" | "details") => {
    // Clear any existing flash timer to ensure animation can restart
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
    }

    // Force animation restart by briefly disabling then re-enabling
    setIsFlashing(false);

    // Use requestAnimationFrame to ensure DOM update before re-triggering
    requestAnimationFrame(() => {
      // Instant state change (no slide transition)
      setActiveView(view);

      // Trigger rapid pulse flash animation
      setIsFlashing(true);

      // Reset flash state after animation completes (0.25s)
      flashTimerRef.current = setTimeout(() => {
        setIsFlashing(false);
        flashTimerRef.current = null;
      }, 250);
    });
  };

  // Generate all index values and filter out current
  const allIndices = Array.from(
    { length: totalFeatures },
    (_, i) => `0.${i + 1}`
  );
  const currentIndexPosition = allIndices.indexOf(index);
  const beforeIndices = allIndices.slice(0, currentIndexPosition);
  const afterIndices = allIndices.slice(currentIndexPosition + 1);

  return (
    <div
      ref={sectionRef}
      className={`feature-block py-16 md:py-24 px-6 md:px-12 lg:px-24 min-h-screen flex items-center ${
        !isLast ? "border-b border-neutral-200/50" : ""
      }`}
    >
      <div className="container-product w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left Column: Sticky Header */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 flex flex-col gap-8">
              {/* Index Animation */}
              <div className="index-anim-container flex items-center w-full text-base md:text-lg lg:text-xl font-light text-gray-600 select-none">
                {/* Before indices */}
                {beforeIndices.length > 0 && (
                  <div className="flex items-center gap-2 opacity-50 text-sm md:text-lg mr-2">
                    {beforeIndices.map((idx, i) => (
                      <span key={idx} className="flex items-center gap-2">
                        <span>{idx}</span>
                        {i < beforeIndices.length - 1 && (
                          <span className="w-3 h-px bg-current" />
                        )}
                      </span>
                    ))}
                    <span className="w-3 h-px bg-current" />
                  </div>
                )}

                {/* Current index (highlighted with flash animation) */}
                <span className={`text-gray-900 font-medium mr-4 inline-block ${isIndexFlashing ? "animate-rapid-pulse" : ""}`}>
                  [{index}]
                </span>

                {/* Animated line */}
                <div className="index-line h-px bg-gray-900 flex-grow mx-4 opacity-50" />

                {/* After indices */}
                {afterIndices.length > 0 && (
                  <div className="flex items-center gap-2 opacity-50 text-sm md:text-lg">
                    {afterIndices.map((idx, i) => (
                      <span key={idx} className="flex items-center gap-2">
                        <span>{idx}</span>
                        {i < afterIndices.length - 1 && (
                          <span className="w-3 h-px bg-current" />
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 leading-[1.05] tracking-tight">
                {title.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < title.length - 1 && <br />}
                  </span>
                ))}
              </h3>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-7 pt-8 lg:pt-32">
            <p className="text-xl md:text-2xl text-gray-900 leading-relaxed font-light tracking-tight mb-8 md:mb-10 max-w-2xl">
              {description}
            </p>

            {/* Toggle Pill - accessible tablist with keyboard navigation */}
            {details && details.length > 0 && (
              <div className="mb-8" role="tablist" aria-label="View options">
                <div className="toggle-pill inline-flex border border-[#AAAAAA] rounded-full p-[3px]">
                  <button
                    role="tab"
                    aria-selected={activeView === "video"}
                    aria-controls={`panel-video-${index}`}
                    id={`tab-video-${index}`}
                    tabIndex={activeView === "video" ? 0 : -1}
                    onClick={() => handleToggleClick("video")}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        handleToggleClick(activeView === "video" ? "details" : "video");
                      }
                    }}
                    className={`px-6 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9881F3] focus-visible:ring-offset-2 ${
                      activeView === "video"
                        ? `bg-[#1E1F2B] text-[#f2f2f2] ${isFlashing ? "animate-rapid-pulse" : ""}`
                        : "text-[#1E1F2B] hover:bg-gray-100"
                    }`}
                  >
                    {videoLabel}
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeView === "details"}
                    aria-controls={`panel-details-${index}`}
                    id={`tab-details-${index}`}
                    tabIndex={activeView === "details" ? 0 : -1}
                    onClick={() => handleToggleClick("details")}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        handleToggleClick(activeView === "video" ? "details" : "video");
                      }
                    }}
                    className={`px-6 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9881F3] focus-visible:ring-offset-2 ${
                      activeView === "details"
                        ? `bg-[#1E1F2B] text-[#f2f2f2] ${isFlashing ? "animate-rapid-pulse" : ""}`
                        : "text-[#1E1F2B] hover:bg-gray-100"
                    }`}
                  >
                    {detailsLabel}
                  </button>
                </div>
              </div>
            )}

            {/* Media Card / Details View - with tabpanel roles for accessibility */}
            <div className="w-full aspect-[16/10] bg-white border border-black/10 rounded-lg shadow-sm overflow-hidden relative">
              {/* Video/Image Panel */}
              <div
                role="tabpanel"
                id={`panel-video-${index}`}
                aria-labelledby={`tab-video-${index}`}
                hidden={activeView !== "video"}
                className={activeView === "video" ? "w-full h-full" : "hidden"}
              >
                {mediaType === "video" ? (
                  <video
                    src={mediaSrc}
                    poster={mediaPoster}
                    controls
                    preload="metadata"
                    className="w-full h-full object-cover"
                    aria-label={title.join(" ")}
                  >
                    <track kind="captions" />
                  </video>
                ) : (
                  <Image
                    src={mediaSrc}
                    alt={title.join(" ")}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                    className="object-cover"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Details Panel */}
              <div
                role="tabpanel"
                id={`panel-details-${index}`}
                aria-labelledby={`tab-details-${index}`}
                hidden={activeView !== "details"}
                className={`absolute inset-0 bg-[#F5F5F5] p-6 md:p-8 overflow-y-auto ${
                  activeView !== "details" ? "hidden" : ""
                }`}
              >
                <div className="space-y-6">
                  {details?.map((item, idx) => (
                    <div key={idx} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <h4 className="text-lg font-medium text-[#1E1F2B] mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
