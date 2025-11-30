"use client";

import { useRef, useEffect, useCallback } from "react";
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
 * - Background color transition (dark → light)
 * - Text color transition (white → dark)
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

  // Responsive scroll height for better mobile UX
  const isMobile = useIsMobile();
  const scrollHeight = isMobile ? mobileScrollHeight : desktopScrollHeight;

  const { scrollThresholds } = PRODUCT_TEMPLATE_ANIMATIONS;

  /**
   * Split text into individual character spans for animation
   */
  const splitTextToChars = useCallback((element: HTMLElement) => {
    const text = element.textContent || "";
    element.innerHTML = "";
    const words = text.split(" ");

    let charIndex = 0;
    words.forEach((word, wordIdx) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.whiteSpace = "nowrap";

      word.split("").forEach((char) => {
        const charSpan = document.createElement("span");
        charSpan.className = "product-char";
        charSpan.textContent = char;
        charSpan.style.transitionDelay = `${charIndex * PRODUCT_TEMPLATE_ANIMATIONS.charReveal.stagger * 1000}ms`;
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

    const handleScroll = () => {
      const rect = track.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollDistance = rect.height - windowHeight;

      // Calculate scroll progress (0 to 1)
      let progress = -rect.top / scrollDistance;
      progress = Math.max(0, Math.min(1, progress));

      // Background color transition
      const bgFactor = mapRange(
        progress,
        scrollThresholds.bgTransitionStart,
        scrollThresholds.bgTransitionEnd,
        0,
        1
      );
      track.style.backgroundColor = interpolateColor(darkBg, lightBg, bgFactor);

      // Text color transition (stage 1 text)
      const textFactor = mapRange(
        progress,
        scrollThresholds.bgTransitionStart + 0.05,
        scrollThresholds.bgTransitionEnd,
        0,
        1
      );
      text1.style.color = interpolateColor(whiteText, darkText, textFactor);

      // Animation triggers based on scroll progress
      if (progress > scrollThresholds.stage1Start) {
        text1.classList.add("revealed");
      } else {
        text1.classList.remove("revealed");
      }

      if (progress > scrollThresholds.stage2Start) {
        text2.classList.add("revealed");
      } else {
        text2.classList.remove("revealed");
      }

      if (progress > scrollThresholds.gradientActive && stage2Gradient) {
        text2.classList.add("gradient-active");
      } else {
        text2.classList.remove("gradient-active");
      }

      if (progress > scrollThresholds.bottomReveal) {
        bottom.classList.add("revealed");
      } else {
        bottom.classList.remove("revealed");
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call to set correct state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    splitTextToChars,
    mapRange,
    interpolateColor,
    hexToRgb,
    stage2Gradient,
    scrollThresholds,
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
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        <div className="max-w-5xl mx-auto px-6 text-center z-10 flex flex-col items-center justify-center h-full">
          {/* Stage 1: Character reveal animation */}
          <h2
            ref={text1Ref}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-light leading-none tracking-tighter mb-4 text-white"
            style={{ transition: "color 0.5s" }}
          >
            {stage1Text}
          </h2>

          {/* Stage 2: Block reveal with gradient overlay using data-text attribute */}
          <div
            ref={text2Ref}
            data-text={stage2Text}
            className={`product-block-anim product-stage2-text text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-normal tracking-tighter pb-4 leading-none relative z-[1]`}
            style={{ color: PRODUCT_TEMPLATE_COLORS.textMain }}
          >
            {stage2Text}
          </div>

          {/* Bottom: Description + Scroll prompt */}
          <div
            ref={bottomRef}
            className="product-block-anim mt-24 md:mt-32 flex flex-col items-center gap-6"
          >
            <p className="text-gray-500 text-base sm:text-lg md:text-xl font-normal max-w-xl mx-auto leading-relaxed text-center">
              {renderDescription()}
            </p>

            {/* Custom chevron scroll indicator */}
            <div className="flex flex-col items-center mt-2">
              <div
                className="w-0.5 h-8 mb-[-5px]"
                style={{ backgroundColor: PRODUCT_TEMPLATE_COLORS.textMain }}
              />
              <div
                className="w-6 h-6 border-b-2 border-r-2 rotate-45 -mt-2"
                style={{ borderColor: PRODUCT_TEMPLATE_COLORS.textMain }}
              />
            </div>
            <span
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: PRODUCT_TEMPLATE_COLORS.textMain }}
            >
              {scrollPromptText}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
