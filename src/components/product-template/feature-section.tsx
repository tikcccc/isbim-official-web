"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { m } from "@/components/motion/lazy-motion";
import { TypewriterLines, TypewriterLinesReverse } from "@/components/animations/typewriter";

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
  imagePriority?: boolean;
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
  imagePriority = false,
}: FeatureSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const indexSpanRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<"video" | "details">("video");
  const [displayedView, setDisplayedView] = useState<"video" | "details">("video");
  const [isFlashing, setIsFlashing] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasFlashedRef = useRef(false);
  const [titleState, setTitleState] = useState<{
    mode: "hidden" | "typewriter" | "typewriter-reverse" | "static";
    visibility: "hidden" | "visible" | "exiting";
    key: number;
  }>({
    mode: "hidden",
    visibility: "hidden",
    key: 0,
  });
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lineActive, setLineActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastScrollY = useRef(0);
  const isInActiveZone = useRef(false); // Track if currently in active zone (>= 30%)
  const hasShownBefore = useRef(false); // Track if content has been shown before
  const ACTIVATION_THRESHOLD = 0.3; // Activation threshold at 30%
  const LINE_THRESHOLD = 0.1; // Line appears at 10%

  // Flash helper: toggles CSS animation class without causing React re-render
  const flashIndex = useCallback((onComplete?: () => void) => {
    const span = indexSpanRef.current;
    if (!span) return;

    if (indexFlashTimerRef.current) {
      clearTimeout(indexFlashTimerRef.current);
    }

    span.classList.add("animate-rapid-pulse");
    indexFlashTimerRef.current = setTimeout(() => {
      span.classList.remove("animate-rapid-pulse");
      indexFlashTimerRef.current = null;
      onComplete?.();
    }, 250);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Track scroll direction
    const updateScrollY = () => {
      lastScrollY.current = window.scrollY;
    };
    updateScrollY();
    window.addEventListener("scroll", updateScrollY, { passive: true });

    // Observer with multiple thresholds for staged animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          const target = entry.target as HTMLElement;
          const currentScrollY = window.scrollY;
          const isScrollingDown = currentScrollY > lastScrollY.current;

          // STAGE 1: Line animation at 10%
          if (ratio >= LINE_THRESHOLD && entry.isIntersecting) {
            target.classList.add("line-active");
            setLineActive(true);
          } else if (ratio < LINE_THRESHOLD) {
            target.classList.remove("line-active");
            setLineActive(false);
          }

          // STAGE 2: Content activation at 30%
          // Enter active zone
          if (ratio >= ACTIVATION_THRESHOLD && entry.isIntersecting) {
            const wasInActiveZone = isInActiveZone.current;
            isInActiveZone.current = true;

            // Add feature-active class
            target.classList.add("feature-active");

            // Flash index on first entry
            if (!hasFlashedRef.current) {
              hasFlashedRef.current = true;
              flashIndex();
            }

            // Only handle entry if not already in active zone
            if (!wasInActiveZone) {
              // Cancel any pending exit animation
              if (exitTimerRef.current) {
                clearTimeout(exitTimerRef.current);
                exitTimerRef.current = null;
              }

              // Determine how to show content based on scroll direction and history
              if (isScrollingDown) {
                // Always use typewriter when scrolling down
                setTitleState({
                  mode: "typewriter",
                  visibility: "visible",
                  key: titleState.key + 1, // Increment key for new animation
                });
                hasShownBefore.current = true;
              } else {
                // Scrolling up: show static content if shown before, otherwise typewriter
                if (hasShownBefore.current) {
                  setTitleState({
                    mode: "static",
                    visibility: "visible",
                    key: titleState.key,
                  });
                } else {
                  setTitleState({
                    mode: "typewriter",
                    visibility: "visible",
                    key: titleState.key + 1,
                  });
                  hasShownBefore.current = true;
                }
              }
            }
          }
          // Exit active zone (dropping below 30%)
          else if (ratio < ACTIVATION_THRESHOLD && isInActiveZone.current) {
            isInActiveZone.current = false;

            // Start reverse typewriter exit animation
            if (titleState.visibility === "visible") {
              // Calculate reverse animation duration
              const totalChars = title.reduce((sum, line) => sum + line.length, 0);
              const reverseDuration = (totalChars * 30) / 1000 + 0.05; // 30ms per char + small initial delay
              const exitDuration = reverseDuration * 1000 + 100; // Add 100ms buffer

              // Switch to reverse typewriter mode without changing key
              setTitleState((prev) => ({
                ...prev,
                mode: "typewriter-reverse",
                visibility: "exiting",
                // Don't change key to avoid remounting
              }));

              // Clear any existing timer
              if (exitTimerRef.current) {
                clearTimeout(exitTimerRef.current);
              }

              // Wait for reverse animation to complete before hiding
              exitTimerRef.current = setTimeout(() => {
                setTitleState((prev) => ({
                  ...prev,
                  mode: "hidden",
                  visibility: "hidden",
                }));
                exitTimerRef.current = null;
              }, exitDuration);
            }

            // Flash and remove feature-active when scrolling up
            if (!isScrollingDown) {
              if (hasFlashedRef.current) {
                flashIndex(() => {
                  target.classList.remove("feature-active");
                  hasFlashedRef.current = false;
                });
              } else {
                target.classList.remove("feature-active");
              }
            } else {
              // When scrolling down past the section, just remove the class
              target.classList.remove("feature-active");
              hasFlashedRef.current = false;
            }
          }
        });
      },
      {
        threshold: [LINE_THRESHOLD, ACTIVATION_THRESHOLD], // 10% for line, 30% for activation
        rootMargin: "0px",
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScrollY);
      // Cleanup timers on unmount
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
      }
      if (indexFlashTimerRef.current) {
        clearTimeout(indexFlashTimerRef.current);
      }
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
      }
    };
  }, [flashIndex, titleState.key]);

  // Handle toggle click with parallelogram transition + rapid pulse animation
  const handleToggleClick = (view: "video" | "details") => {
    if (view === activeView || isTransitioning) return;

    // Step 1: Immediately respond to UI (button state)
    setActiveView(view);
    setIsTransitioning(true);

    // Trigger button flash animation
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
    }
    setIsFlashing(true);
    flashTimerRef.current = setTimeout(() => {
      setIsFlashing(false);
      flashTimerRef.current = null;
    }, 250);

    // Step 2: Start mask transition

    // Step 3: Switch displayed content at T=400ms (when mask fully covers)
    setTimeout(() => {
      setDisplayedView(view);
    }, 400);

    // Step 4: End transition at T=900ms (when mask exits)
    setTimeout(() => {
      setIsTransitioning(false);
    }, 900);
  };

  // Generate all index values and filter out current
  const allIndices = Array.from(
    { length: totalFeatures },
    (_, i) => `0.${i + 1}`
  );
  const currentIndexPosition = allIndices.indexOf(index);
  const beforeIndices = allIndices.slice(0, currentIndexPosition);
  const afterIndices = allIndices.slice(currentIndexPosition + 1);

  // Autoplay/loop video while the media viewport is in view; pause when hidden or when Details is shown.
  useEffect(() => {
    const video = videoRef.current;
    const container = videoContainerRef.current;
    if (!video || !container) return;

    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    const handleVisibility = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!entry) return;

      const isVisible = entry.intersectionRatio > 0;
      if (isVisible && displayedView === "video") {
        video.play().catch(() => {
          /* ignore play errors (e.g., user gesture requirements) */
        });
      } else {
        video.pause();
        if (entry.intersectionRatio === 0) {
          video.currentTime = 0;
        }
      }
    };

    const observer = new IntersectionObserver(handleVisibility, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [displayedView]);

  // Pause video when toggling away from the video view
  useEffect(() => {
    if (displayedView !== "video" && videoRef.current) {
      videoRef.current.pause();
    }
  }, [displayedView]);

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
          <div className="lg:col-span-5 xl:col-span-5 relative">
            <div className="sticky top-32 flex flex-col gap-6">
              {/* Index Animation */}
              <div className="index-anim-container flex items-center w-full text-base md:text-lg lg:text-xl font-light text-gray-600 select-none">
                {/* Before indices */}
                {beforeIndices.length > 0 && (
                  <div className="flex items-center gap-2 opacity-50 text-sm md:text-lg mr-2">
                    {beforeIndices.map((idx, i) => (
                      <span key={idx} className="flex items-center gap-2">
                        <span>{idx}</span>
                        {i < beforeIndices.length - 1 && (
                          <span className="w-3 h-px bg-current index-connector" />
                        )}
                      </span>
                    ))}
                    <span className="w-3 h-px bg-current index-connector" />
                  </div>
                )}

                {/* Current index (highlighted with flash animation) */}
                <span
                  ref={indexSpanRef}
                  className="text-gray-900 font-medium mr-4 inline-block"
                >
                  [{index}]
                </span>

                {/* Animated line */}
                <m.div
                  className="index-line h-px bg-gray-900 flex-grow mx-4 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: lineActive ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />

                {/* After indices */}
                {afterIndices.length > 0 && (
                  <div className="flex items-center gap-2 opacity-50 text-sm md:text-lg">
                    {afterIndices.map((idx, i) => (
                      <span key={idx} className="flex items-center gap-2">
                        <span>{idx}</span>
                        {i < afterIndices.length - 1 && (
                          <span className="w-3 h-px bg-current index-connector" />
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Title with Typewriter Animation or Static Display */}
              <h3
                className="text-2xl sm:text-3xl md:text-[2.5rem] lg:text-[2.9rem] xl:text-[3.2rem] 2xl:text-[3.6rem] text-gray-900 leading-[1.08] tracking-tight break-words w-full max-w-full lg:max-w-[40ch] xl:max-w-[44ch]"
                style={{ textWrap: "balance", wordBreak: "break-word" }}
              >
                {/* Forward Typewriter mode */}
                {titleState.mode === "typewriter" && titleState.visibility !== "hidden" && (
                  <m.div
                    key={`typewriter-${titleState.key}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{
                      opacity: titleState.visibility === "exiting" ? 0 : 1,
                      y: titleState.visibility === "exiting" ? -6 : 0,
                    }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                  >
                    <TypewriterLines
                      lines={title.map((line) => ({
                        text: line,
                        className: "",
                      }))}
                      speed={30}
                      initialDelay={0.2}
                      lineGap={0.05}
                      wrapDuringTyping
                    />
                  </m.div>
                )}

                {/* Reverse Typewriter mode (exit animation) */}
                {titleState.mode === "typewriter-reverse" && titleState.visibility === "exiting" && (
                  <div key={`reverse-${titleState.key}`}>
                    <TypewriterLinesReverse
                      lines={title.map((line) => ({
                        text: line,
                        className: "",
                      }))}
                      speed={30}
                      initialDelay={0}
                      lineGap={0.02}
                      wrapDuringTyping
                    />
                  </div>
                )}

                {/* Static mode */}
                {titleState.mode === "static" && titleState.visibility !== "hidden" && (
                  <m.div
                    key={`static-${titleState.key}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{
                      opacity: titleState.visibility === "exiting" ? 0 : 1,
                      y: titleState.visibility === "exiting" ? -6 : 0,
                    }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                  >
                    {title.map((line, index) => (
                      <span key={index} className="block">
                        {line}
                      </span>
                    ))}
                  </m.div>
                )}
              </h3>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-7 xl:col-span-7 pt-6 md:pt-8 lg:pt-15 flex flex-col lg:self-start">
            <p className="text-xl md:text-2xl text-gray-900 leading-relaxed font-medium tracking-tight mb-8 md:mb-10 w-full">
              {description}
            </p>

            {/* Toggle Pill - accessible tablist with keyboard navigation */}
            {details && details.length > 0 && (
              <div className="mb-10" role="tablist" aria-label="View options">
                <div className="toggle-pill inline-flex h-14 border border-gray-300 rounded-full bg-white/50 backdrop-blur-sm p-1 shadow-sm">
                  <button
                    role="tab"
                    aria-selected={activeView === "video"}
                    aria-controls={`panel-video-${index}`}
                    id={`tab-video-${index}`}
                    tabIndex={activeView === "video" ? 0 : -1}
                    onClick={() => handleToggleClick("video")}
                    disabled={isTransitioning}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        handleToggleClick(
                          activeView === "video" ? "details" : "video"
                        );
                      }
                    }}
                    className={`w-32 px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-colors duration-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9881F3] focus-visible:ring-offset-2 disabled:cursor-not-allowed ${
                      activeView === "video"
                        ? `bg-[#1a1a1a] text-white ${isFlashing ? "animate-rapid-pulse" : ""}`
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {videoLabel.toUpperCase()}
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeView === "details"}
                    aria-controls={`panel-details-${index}`}
                    id={`tab-details-${index}`}
                    tabIndex={activeView === "details" ? 0 : -1}
                    onClick={() => handleToggleClick("details")}
                    disabled={isTransitioning}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        handleToggleClick(
                          activeView === "video" ? "details" : "video"
                        );
                      }
                    }}
                    className={`w-32 px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-colors duration-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9881F3] focus-visible:ring-offset-2 disabled:cursor-not-allowed ${
                      activeView === "details"
                        ? `bg-[#1a1a1a] text-white ${isFlashing ? "animate-rapid-pulse" : ""}`
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {detailsLabel.toUpperCase()}
                  </button>
                </div>
              </div>
            )}

            {/* Media Card / Details View - with tabpanel roles for accessibility */}
            <div className="w-full h-[563px] max-w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden relative">
              {/* Video/Image Panel */}
              <div
                role="tabpanel"
                id={`panel-video-${index}`}
                aria-labelledby={`tab-video-${index}`}
                hidden={displayedView !== "video"}
                className={displayedView === "video" ? "w-full h-full" : "hidden"}
                ref={videoContainerRef}
              >
                {mediaType === "video" ? (
                  <video
                    ref={videoRef}
                    src={mediaSrc}
                    poster={mediaPoster}
                    controls
                    muted
                    playsInline
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
                    priority={imagePriority}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                    className="object-cover"
                    loading={imagePriority ? "eager" : "lazy"}
                  />
                )}
              </div>

              {/* Details Panel */}
              <div
                role="tabpanel"
                id={`panel-details-${index}`}
                aria-labelledby={`tab-details-${index}`}
                hidden={displayedView !== "details"}
                className={`absolute inset-0 bg-[#F5F5F5] p-8 md:p-12 overflow-y-auto ${
                  displayedView !== "details" ? "hidden" : ""
                }`}
              >
                <div className="space-y-8 md:space-y-10 max-w-5xl">
                  {details?.map((item, idx) => (
                    <div
                      key={idx}
                      className="border-b border-gray-200/70 pb-6 md:pb-8 last:border-0 last:pb-0"
                    >
                      <h4 className="text-xl md:text-2xl font-semibold text-[#1E1F2B] mb-3 tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parallelogram Transition Overlay */}
              {isTransitioning && (
                <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-xl">
                  <m.div
                    className="absolute inset-y-0 left-0 w-full h-full flex items-center justify-center"
                    initial={{ x: "-200%" }}
                    animate={{
                      x: ["-200%", "0%", "0%", "200%"],
                    }}
                    transition={{
                      duration: 0.9,
                      times: [0, 0.4, 0.55, 1],
                      ease: ["circOut", "linear", "linear", "circIn"],
                    }}
                  >
                    <div
                      className="h-full w-[250%] flex-none bg-[#767676] shadow-2xl"
                      style={{
                        transform: "skewX(-25deg)",
                        transformOrigin: "center",
                      }}
                    />
                  </m.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
