"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";
import { PRODUCT_TEMPLATE_ANIMATIONS } from "@/lib/animations";
import { PRODUCT_TEMPLATE_COLORS } from "@/lib/design-tokens";
import { useIsMobile } from "@/hooks";

/**
 * NarrativeTrack Props
 * @param stage1Text - First stage text (character reveal animation)
 * @param stage2Text - Second stage text (block reveal + gradient)
 * @param stage2Gradient - Enable gradient effect on stage 2 text
 * @param description - Description text below stage 2
 * @param descriptionHighlight - Optional text to highlight in description
 * @param scrollPromptText - Custom scroll prompt text
 * @param mobileScrollHeight - Custom scroll height for mobile (default: 250vh)
 * @param desktopScrollHeight - Custom scroll height for desktop (default: 350vh)
 */
interface NarrativeTrackProps {
  stage1Text: string;
  stage2Text: string;
  stage2Gradient?: boolean;
  description: string;
  descriptionHighlight?: string;
  scrollPromptText?: string;
  mobileScrollHeight?: string;
  desktopScrollHeight?: string;
}

/**
 * NarrativeTrack Component
 *
 * A scroll-driven storytelling section that transitions from dark to light background.
 * Features:
 * - 350vh height drives scroll animation progress
 * - Sticky inner stage (content stays centered)
 * - Background color transition (dark + light)
 * - Text color transition (white + dark)
 * - Character-by-character reveal animation (using transitionend events for sequencing)
 * - Gradient text overlay effect
 * - Reversible animations (scroll up/down)
 *
 * Based on product-template.html Section B "Narrative Track".
 */
export function NarrativeTrack({
  stage1Text,
  stage2Text,
  stage2Gradient = true,
  description,
  descriptionHighlight,
  scrollPromptText = "Scroll to explore",
  mobileScrollHeight = "130vh",
  desktopScrollHeight = "220vh",
}: NarrativeTrackProps) {
  const trackRef = useRef<HTMLElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const lastProgressRef = useRef(0);

  // Stage 1 state (complete text, no parts)
  const stage1CompleteRef = useRef(false);
  const stage1StartedRef = useRef(false);

  // Stage 2 state
  const stage2StartedRef = useRef(false);
  const stage2ThresholdReachedRef = useRef(false);

  // Gradient and bottom state
  const gradientStartedRef = useRef(false);
  const bottomRevealedRef = useRef(false);

  // Animation completion state
  const allAnimationsCompleteRef = useRef(false);
  const scrollLockActiveRef = useRef(false);

  // Responsive scroll height for better mobile UX
  const isMobile = useIsMobile();
  const scrollHeight = isMobile ? mobileScrollHeight : desktopScrollHeight;

  // Custom thresholds to ensure background turns white BEFORE text appears
  const thresholds = useMemo(
    () => ({
      bgTransitionStart: 0.05,
      bgTransitionEnd: 0.25, // Background fully white by 25%
      stage1Start: 0.3, // Stage 1 text starts appearing (complete, no parts)
      stage2Start: 0.45, // Stage 2 starts appearing (after Stage 1 completes)
      gradientActive: 0.6, // Gradient starts shortly after Stage 2 appears
      bottomReveal: 0.7, // Bottom reveals after a small scroll distance beyond gradient start
    }),
    []
  );

  /**
   * Split text into individual character spans for animation (complete text, no parts)
   */
  const splitTextToChars = useCallback((element: HTMLElement) => {
    const text = element.textContent || "";
    element.innerHTML = "";
    const words = text.split(" ");
    const totalChars = text.replace(/\s/g, "").length;
    const baseDelayMs = PRODUCT_TEMPLATE_ANIMATIONS.charReveal.stagger * 1000;

    let charIndex = 0;

    words.forEach((word, wordIdx) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.whiteSpace = "nowrap";

      word.split("").forEach((char) => {
        const charSpan = document.createElement("span");
        charSpan.className = "product-char";
        charSpan.textContent = char;

        // Stagger in normal order for enter; reverse order for exit
        const forwardDelay = charIndex * baseDelayMs;
        const reverseDelay = (totalChars - 1 - charIndex) * baseDelayMs;

        charSpan.style.setProperty("--char-delay-in", `${forwardDelay}ms`);
        charSpan.style.setProperty("--char-delay-out", `${reverseDelay}ms`);

        wordSpan.appendChild(charSpan);
        charIndex++;
      });

      element.appendChild(wordSpan);
      if (wordIdx < words.length - 1) {
        element.appendChild(document.createTextNode(" "));
      }
    });

    return { totalChars };
  }, []);

  /**
   * Map a value from one range to another (with clamping)
   */
  const mapRange = useCallback(
    (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
      if (value < inMin) return outMin;
      if (value > inMax) return outMax;
      return outMin + ((outMax - outMin) * (value - inMin)) / (inMax - inMin);
    },
    []
  );

  /**
   * Interpolate between two RGB colors
   */
  const interpolateColor = useCallback(
    (
      start: { r: number; g: number; b: number },
      end: { r: number; g: number; b: number },
      factor: number
    ): string => {
      const r = Math.round(start.r + (end.r - start.r) * factor);
      const g = Math.round(start.g + (end.g - start.g) * factor);
      const b = Math.round(start.b + (end.b - start.b) * factor);
      return `rgb(${r}, ${g}, ${b})`;
    },
    []
  );

  /**
   * Parse hex color to RGB object
   */
  const hexToRgb = useCallback((hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 30, g: 31, b: 43 }; // fallback to dark
  }, []);

  /**
   * Update hero foreground shift by directly manipulating the hero foreground element.
   * Keeps background video untouched while foreground moves with narrative scroll.
   */
  const setHeroShift = useCallback((value: number) => {
    if (typeof document === "undefined") return;

    // Find hero foreground element by data attribute
    const heroForeground = document.querySelector('[data-hero-foreground="true"]') as HTMLElement;
    if (heroForeground) {
      heroForeground.style.transform = `translateY(${-value}px)`;
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    const bottom = bottomRef.current;

    if (!track || !text1 || !text2 || !bottom) return;

    // Initialize character splitting only once
    if (!hasInitialized.current) {
      splitTextToChars(text1);

      // Set up transitionend listener for Stage 1 (complete text)
      const handleStage1TransitionEnd = (e: TransitionEvent) => {
        if (
          e.target instanceof HTMLElement &&
          e.target.classList.contains("product-char") &&
          e.propertyName === "opacity"
        ) {
          const allChars = text1.querySelectorAll('.product-char');
          const allRevealed = Array.from(allChars).every(
            (char) => getComputedStyle(char).opacity === "1"
          );

          if (allRevealed && !stage1CompleteRef.current) {
            stage1CompleteRef.current = true;

            // If Stage 2 threshold was already reached, start Stage 2 immediately
            if (stage2ThresholdReachedRef.current && !stage2StartedRef.current) {
              text2.classList.add("revealed");
              stage2StartedRef.current = true;
            }
          }
        }
      };

      // Set up transitionend listener for Stage 2
      const handleStage2TransitionEnd = (e: TransitionEvent) => {
        if (e.target === text2 && e.propertyName === "opacity" && getComputedStyle(text2).opacity === "1") {
          // Stage 2 is now fully visible, can activate gradient
          // Gradient activation is still controlled by scroll threshold
        }
      };

      text1.addEventListener("transitionend", handleStage1TransitionEnd);
      text2.addEventListener("transitionend", handleStage2TransitionEnd);

      hasInitialized.current = true;

      return () => {
        text1.removeEventListener("transitionend", handleStage1TransitionEnd);
        text2.removeEventListener("transitionend", handleStage2TransitionEnd);
      };
    }
  }, [splitTextToChars]);

  useEffect(() => {
    const track = trackRef.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    const bottom = bottomRef.current;

    if (!track || !text1 || !text2 || !bottom) return;

    // Color values from design tokens
    const darkBg = hexToRgb(PRODUCT_TEMPLATE_COLORS.darkBg);
    const lightBg = hexToRgb(PRODUCT_TEMPLATE_COLORS.lightBg);
    const whiteText = { r: 255, g: 255, b: 255 };
    const darkText = hexToRgb(PRODUCT_TEMPLATE_COLORS.textMain);

    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!track || !text1 || !text2 || !bottom) return;

        const rect = track.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollDistance = rect.height - windowHeight;

        // Calculate scroll progress (0 to 1)
        let progress = -rect.top / scrollDistance;
        progress = Math.max(0, Math.min(1, progress));
        const isScrollingDown = progress >= lastProgressRef.current;

        // Sync hero foreground (title/metadata) upward shift with early scroll progress
        const heroShiftMax = windowHeight * 0.45;
        const heroShift = mapRange(progress, 0, thresholds.stage1Start, 0, heroShiftMax);
        setHeroShift(heroShift);

        // Background color transition
        const bgFactor = mapRange(progress, thresholds.bgTransitionStart, thresholds.bgTransitionEnd, 0, 1);
        track.style.backgroundColor = interpolateColor(darkBg, lightBg, bgFactor);

        // Text color transition (stage 1 text)
        const textFactor = mapRange(progress, thresholds.bgTransitionStart, thresholds.bgTransitionEnd, 0, 1);
        text1.style.color = interpolateColor(whiteText, darkText, textFactor);

        // ============================================
        // STAGE 1 ANIMATION (Unified - no part 1/part 2 split)
        // ============================================
        if (progress > thresholds.stage1Start) {
          // Ensure exit class is cleared on any re-entry so direction stays consistent (left-to-right)
          text1.classList.remove("stage1-exiting");

          if (!stage1StartedRef.current) {
            text1.classList.add("revealed");
            stage1StartedRef.current = true;
          }

          // Idempotent check: if chars are already visible (e.g., coming back from another page), mark stage 1 complete and unblock stage 2.
          const chars = text1.querySelectorAll(".product-char");
          const allVisible =
            chars.length > 0 &&
            Array.from(chars).every((char) => getComputedStyle(char).opacity === "1");
          if (allVisible && !stage1CompleteRef.current) {
            stage1CompleteRef.current = true;
            if (stage2ThresholdReachedRef.current && !stage2StartedRef.current) {
              text2.classList.add("revealed");
              stage2StartedRef.current = true;
            }
          }
        } else {
          // Exiting Stage 1 - reset everything
          if (!isScrollingDown && stage1StartedRef.current) {
            text1.classList.add("stage1-exiting");
          }
          text1.classList.remove("revealed");
          stage1StartedRef.current = false;
          stage1CompleteRef.current = false;
          stage2StartedRef.current = false;
          stage2ThresholdReachedRef.current = false;
          gradientStartedRef.current = false;
          bottomRevealedRef.current = false;
          allAnimationsCompleteRef.current = false;
          scrollLockActiveRef.current = false;

          text2.classList.remove("revealed");
          text2.classList.remove("gradient-active");
          bottom.classList.remove("revealed");
        }

        // ============================================
        // STAGE 2 THRESHOLD
        // ============================================
        if (progress > thresholds.stage2Start) {
          stage2ThresholdReachedRef.current = true;

          // Only start Stage 2 if Stage 1 is complete
          if (stage1CompleteRef.current && !stage2StartedRef.current) {
            text2.classList.add("revealed");
            stage2StartedRef.current = true;
          }
        } else {
          // Below Stage 2 threshold
          stage2ThresholdReachedRef.current = false;
          stage2StartedRef.current = false;
          gradientStartedRef.current = false;
          bottomRevealedRef.current = false;
          allAnimationsCompleteRef.current = false;
          scrollLockActiveRef.current = false;

          text2.classList.remove("revealed");
          text2.classList.remove("gradient-active");
          bottom.classList.remove("revealed");
        }

        // ============================================
        // GRADIENT ACTIVATION
        // ============================================
        if (progress > thresholds.gradientActive && stage2Gradient && stage2StartedRef.current) {
          if (!gradientStartedRef.current) {
            text2.classList.add("gradient-active");
            gradientStartedRef.current = true;
          }
        } else {
          text2.classList.remove("gradient-active");
          gradientStartedRef.current = false;

          // Reset bottom when gradient is removed
          if (progress <= thresholds.gradientActive) {
            bottomRevealedRef.current = false;
            allAnimationsCompleteRef.current = false;
            scrollLockActiveRef.current = false;
            bottom.classList.remove("revealed");
          }
        }

        // ============================================
        // BOTTOM REVEAL (separate scroll trigger after gradient)
        // ============================================
        if (progress > thresholds.bottomReveal && gradientStartedRef.current) {
          if (!bottomRevealedRef.current) {
            bottom.classList.add("revealed");
            bottomRevealedRef.current = true;

            // Mark animations as complete after bottom fade-in completes (0.6s)
            setTimeout(() => {
              allAnimationsCompleteRef.current = true;
              scrollLockActiveRef.current = false;
            }, 600);
          }
        } else if (progress <= thresholds.bottomReveal) {
          bottomRevealedRef.current = false;
          allAnimationsCompleteRef.current = false;
          scrollLockActiveRef.current = false;
          bottom.classList.remove("revealed");
        }

        // ============================================
        // SCROLL LOCK - Prevent leaving section until animations complete
        // ============================================
        if (progress > 0.95 && !allAnimationsCompleteRef.current && !scrollLockActiveRef.current) {
          scrollLockActiveRef.current = true;

          // Calculate the scroll position for 95% progress
          const lockPosition = track.offsetTop + scrollDistance * 0.95;

          // Smoothly scroll back to lock position
          window.scrollTo({
            top: lockPosition,
            behavior: "smooth",
          });
        }

        lastProgressRef.current = progress;
      });
    };

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call to set correct state

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
      setHeroShift(0);
    };
  }, [mapRange, interpolateColor, hexToRgb, stage2Gradient, thresholds, setHeroShift]);

  /**
   * Render description with optional highlighted text
   */
  const renderDescription = () => {
    if (!descriptionHighlight) {
      return description;
    }

    const parts = description.split(descriptionHighlight);
      return parts.map((part, i, arr) =>
        i < arr.length - 1 ? (
          <span key={i}>
            {part}
            <span className="product-text-body font-medium">{descriptionHighlight}</span>
          </span>
        ) : (
          part
        )
      );
  };

  return (
    <section
      ref={trackRef}
      className="relative z-20 product-surface-dark"
      style={{
        height: scrollHeight,
        boxShadow: "0 -50px 100px rgba(0,0,0,0.5)",
        marginTop: "-1px",
        transition: "background-color 0.3s linear",
      }}
    >
      {/* Sticky Stage - Centers content while scrolling */}
      <div
        className="sticky top-6 sm:top-10 md:top-14 lg:top-16 h-screen flex items-center justify-center overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center z-10 flex flex-col items-center justify-center h-full">
          {/* Stage 1: Character reveal animation */}
          <h2
            ref={text1Ref}
            className="product-stage-title-light mb-6 product-text-inverse max-w-7xl"
            style={{ transition: "color var(--product-motion-base, 0.5s) var(--product-motion-ease, ease-out)" }}
          >
            {stage1Text}
          </h2>

          {/* Stage 2: Block reveal with gradient overlay using data-text attribute */}
          <div
            ref={text2Ref}
            data-text={stage2Text}
            className={`product-block-anim product-stage2-text product-stage-title pb-4 relative z-[1] max-w-7xl`}
            style={{ color: PRODUCT_TEMPLATE_COLORS.textMain }}
          >
            {stage2Text}
          </div>

          {/* Bottom: Description + Scroll prompt */}
          <div
            ref={bottomRef}
            className="product-bounce-anim mt-20 md:mt-28 flex flex-col items-center gap-8"
          >
            <p className="product-stage-desc product-text-muted max-w-lg mx-auto text-center">
              {renderDescription()}
            </p>

            {/* Custom chevron scroll indicator */}
            <div className="flex flex-col items-center mt-4 animate-bounce-slow opacity-80 hover:opacity-100 transition-opacity product-transition-fast">
              <span
                className="product-label-sm mb-3"
                style={{ color: PRODUCT_TEMPLATE_COLORS.textMain }}
              >
                {scrollPromptText}
              </span>
              <div className="flex flex-col items-center gap-[-4px]">
                <div
                  className="w-[1px] h-12 bg-gradient-to-b from-transparent to-current"
                  style={{ color: PRODUCT_TEMPLATE_COLORS.textMain }}
                />
                <div
                  className="w-3 h-3 border-b-[1px] border-r-[1px] rotate-45 -mt-1.5"
                  style={{ borderColor: PRODUCT_TEMPLATE_COLORS.textMain }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
