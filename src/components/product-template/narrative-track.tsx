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
 * - Character-by-character reveal animation
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
  mobileScrollHeight = "250vh",
  desktopScrollHeight = "350vh",
}: NarrativeTrackProps) {
  const trackRef = useRef<HTMLElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const lastProgressRef = useRef(0);

  // Responsive scroll height for better mobile UX
  const isMobile = useIsMobile();
  const scrollHeight = isMobile ? mobileScrollHeight : desktopScrollHeight;

  // Custom thresholds to ensure background turns white BEFORE text appears
  const thresholds = useMemo(
    () => ({
      bgTransitionStart: 0.05,
      bgTransitionEnd: 0.25, // Background fully white by 25%
      stage1Start: 0.3, // Text 1 Part 1 starts appearing
      stage1Part2: 0.38, // Text 1 Part 2 starts appearing (subtle delay)
      stage2Start: 0.55, // Text 2 starts appearing
      gradientActive: 0.65,
      bottomReveal: 0.8,
    }),
    []
  );

  /**
   * Split text into individual character spans for animation
   */
  const splitTextToChars = useCallback((element: HTMLElement) => {
    const text = element.textContent || "";
    element.innerHTML = "";
    const words = text.split(" ");
    const totalChars = text.replace(/\s/g, "").length;
    const splitIndex = Math.floor(totalChars * 0.4); // Split at 40% for part 1

    const part1Count = splitIndex + 1;
    const part2Count = Math.max(totalChars - part1Count, 0);
    const baseDelayMs = PRODUCT_TEMPLATE_ANIMATIONS.charReveal.stagger * 1000;

    let charIndex = 0;
    let part1Pos = 0;
    let part2Pos = 0;
    words.forEach((word, wordIdx) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.whiteSpace = "nowrap";

      word.split("").forEach((char) => {
        const charSpan = document.createElement("span");
        charSpan.className = "product-char";
        charSpan.textContent = char;
        // Assign part 1 or 2 based on index
        const isPart1 = charIndex <= splitIndex;
        charSpan.setAttribute("data-part", isPart1 ? "1" : "2");

        // Stagger in normal order for enter; reverse order for exit
        const localIndex = isPart1 ? part1Pos++ : part2Pos++;
        const forwardDelay = localIndex * baseDelayMs;
        const reverseDelay =
          (isPart1 ? Math.max(part1Count - 1 - localIndex, 0) : Math.max(part2Count - 1 - localIndex, 0)) *
          baseDelayMs;

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

  useEffect(() => {
    const track = trackRef.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    const bottom = bottomRef.current;

    if (!track || !text1 || !text2 || !bottom) return;

    // Initialize character splitting only once
    if (!hasInitialized.current) {
      splitTextToChars(text1);
      hasInitialized.current = true;
    }

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

        // Background color transition
        const bgFactor = mapRange(
          progress,
          thresholds.bgTransitionStart,
          thresholds.bgTransitionEnd,
          0,
          1
        );
        track.style.backgroundColor = interpolateColor(darkBg, lightBg, bgFactor);

        // Text color transition (stage 1 text)
        // We want text to be dark when it appears (since bg is white),
        // but if it was visible during transition it would need to change.
        // Since we hide it until bg is white, we can just set it to dark or transition it quickly.
        // Here we keep the transition logic but sync it with bg for smoothness in case of fast scroll.
        const textFactor = mapRange(
          progress,
          thresholds.bgTransitionStart,
          thresholds.bgTransitionEnd,
          0,
          1
        );
        text1.style.color = interpolateColor(whiteText, darkText, textFactor);

        // Animation triggers based on scroll progress
        // Stage 1 Part 1
        if (progress > thresholds.stage1Start) {
          text1.classList.add("revealed-part-1");
          if (isScrollingDown) {
            text1.classList.remove("stage1-exiting");
          }
        } else {
          if (!isScrollingDown) {
            text1.classList.add("stage1-exiting");
          }
          text1.classList.remove("revealed-part-1");
        }

        // Stage 1 Part 2
        if (progress > thresholds.stage1Part2) {
          text1.classList.add("revealed-part-2");
          if (isScrollingDown) {
            text1.classList.remove("stage1-exiting");
          }
        } else {
          if (!isScrollingDown) {
            text1.classList.add("stage1-exiting");
          }
          text1.classList.remove("revealed-part-2");
        }

        if (progress > thresholds.stage2Start) {
          text2.classList.add("revealed");
        } else {
          text2.classList.remove("revealed");
        }

        if (progress > thresholds.gradientActive && stage2Gradient) {
          text2.classList.add("gradient-active");
        } else {
          text2.classList.remove("gradient-active");
        }

        if (progress > thresholds.bottomReveal) {
          bottom.classList.add("revealed");
        } else {
          bottom.classList.remove("revealed");
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
    };
  }, [
    splitTextToChars,
    mapRange,
    interpolateColor,
    hexToRgb,
    stage2Gradient,
    thresholds,
  ]);

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
          <span className="text-gray-800 font-medium">{descriptionHighlight}</span>
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <section
      ref={trackRef}
      className="relative z-10 bg-product-dark"
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
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight mb-6 text-white max-w-7xl"
            style={{ transition: "color 0.5s" }}
          >
            {stage1Text}
          </h2>

          {/* Stage 2: Block reveal with gradient overlay using data-text attribute */}
          <div
            ref={text2Ref}
            data-text={stage2Text}
            className={`product-block-anim product-stage2-text text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight pb-4 leading-[1.1] relative z-[1] max-w-7xl`}
            style={{ color: PRODUCT_TEMPLATE_COLORS.textMain }}
          >
            {stage2Text}
          </div>

          {/* Bottom: Description + Scroll prompt */}
          <div
            ref={bottomRef}
            className="product-block-anim mt-20 md:mt-28 flex flex-col items-center gap-8"
          >
            <p className="text-gray-600 text-sm sm:text-base md:text-lg font-normal max-w-lg mx-auto leading-relaxed text-center tracking-wide">
              {renderDescription()}
            </p>

            {/* Custom chevron scroll indicator */}
            <div className="flex flex-col items-center mt-4 animate-bounce-slow opacity-80 hover:opacity-100 transition-opacity duration-300">
              <span
                className="text-[10px] uppercase tracking-[0.25em] mb-3 font-medium"
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
