"use client";

/**
 * Typewriter Animation Component
 *
 * A reusable typewriter effect component with character-level animation.
 * Uses GSAP for smooth, performant animations.
 *
 * Features:
 * - Character-by-character reveal (true typewriter effect)
 * - Configurable speed and delay
 * - Optional cursor animation
 * - Completion callback support
 * - Full className customization
 *
 * @example
 * ```tsx
 * <TypewriterText text="Hello World" speed={50} />
 * <TypewriterText
 *   text="AI Products"
 *   className="text-emerald-400 font-bold"
 *   delay={0.5}
 *   onComplete={() => console.log('Done!')}
 * />
 * ```
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface TypewriterTextProps {
  /** Text to animate */
  text: string;
  /** Custom className for styling */
  className?: string;
  /** Speed in milliseconds per character (default: 50) */
  speed?: number;
  /** Delay before animation starts in seconds (default: 0) */
  delay?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Show blinking cursor (default: false) */
  cursorVisible?: boolean;
  /** Cursor character (default: "|") */
  cursorChar?: string;
  /** Cursor color (default: currentColor) */
  cursorColor?: string;
  /** Reverse animation (characters disappear) */
  reverse?: boolean;
  /** Allow wrapping during typing (keeps words intact) */
  wrapDuringTyping?: boolean;
}

export function TypewriterText({
  text,
  className = "",
  speed,
  delay,
  onComplete,
  cursorVisible = false,
  cursorChar = "|",
  cursorColor = "currentColor",
  reverse = false,
  wrapDuringTyping = false,
}: TypewriterTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const onCompleteRef = useRef(onComplete);

  // Update onComplete ref without triggering re-animation
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const readMotion = (name: string, fallback: number) => {
    if (typeof window === "undefined") return fallback;
    const val = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(val) ? val : fallback;
  };
  const charSpeed = speed ?? readMotion("--motion-typewriter-char-ms", 50);
  const baseDelay = delay ?? readMotion("--motion-typewriter-delay", 0);
  const blinkDuration = readMotion("--motion-typewriter-blink", 0.5);

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    if (!container) return;

    let started = false;
    let timeline: gsap.core.Timeline | null = null;
    let cursorAnim: gsap.core.Tween | null = null;
    let revertWidth: (() => void) | null = null;

    const startAnimation = () => {
      if (started) return;
      started = true;

      // Clear container and create character spans (word-grouped when wrapping is allowed)
      container.innerHTML = "";
      const charElements: HTMLElement[] = [];

      const tokens = wrapDuringTyping ? text.split(/(\s+)/) : [text];
      tokens.forEach((token) => {
        const isWhitespace = token.trim() === "";

        if (wrapDuringTyping && isWhitespace) {
          const spaceSpan = document.createElement("span");
          // Preserve whitespace width by using non-breaking spaces
          spaceSpan.textContent = token.replace(/ /g, "\u00A0");
          spaceSpan.style.opacity = reverse ? "1" : "0";
          spaceSpan.style.display = "inline";
          spaceSpan.style.transition = "none";
          container.appendChild(spaceSpan);
          charElements.push(spaceSpan);
          return;
        }

        const wordSpan = document.createElement("span");
        wordSpan.style.display = wrapDuringTyping ? "inline-block" : "inline";
        if (wrapDuringTyping) {
          wordSpan.style.whiteSpace = "nowrap";
        }

        token.split("").forEach((char) => {
          const span = document.createElement("span");
          span.textContent = char === " " ? "\u00A0" : char;
          span.style.opacity = reverse ? "1" : "0";
          span.style.display = "inline-block";
          span.style.transition = "none";
          wordSpan.appendChild(span);
          charElements.push(span);
        });

        container.appendChild(wordSpan);
      });

      // Prevent layout reflow flicker when reversing by freezing the current width via minWidth
      if (reverse && container) {
        const originalMinWidth = container.style.minWidth;
        const measuredWidth = container.getBoundingClientRect().width;
        container.style.minWidth = `${measuredWidth}px`;
        revertWidth = () => {
          container.style.minWidth = originalMinWidth;
        };
      }

      // Calculate stagger time (convert ms to seconds)
      const staggerTime = charSpeed / 1000;

      // Create timeline
      timeline = gsap.timeline({
        delay: baseDelay,
        onComplete: () => {
          if (reverse && revertWidth) {
            revertWidth();
          }
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        },
      });

      // Animate characters based on direction
      if (reverse) {
        // For reverse: animate from last to first, opacity 1 to 0
        const reversedElements = [...charElements].reverse();
        timeline.to(reversedElements, {
          opacity: 0,
          duration: 0,
          stagger: staggerTime,
          ease: "none",
        });
      } else {
        // For forward: animate from first to last, opacity 0 to 1
        timeline.to(charElements, {
          opacity: 1,
          duration: 0,
          stagger: staggerTime,
          ease: "none",
        });
      }

      if (cursorVisible && cursor) {
        cursorAnim = gsap.to(cursor, {
          opacity: 0,
          repeat: -1,
          yoyo: true,
          duration: blinkDuration,
          ease: "steps(1)",
        });
      }
    };

    // Start animation with appropriate delay
    const timeoutId = setTimeout(startAnimation, reverse ? 0 : 50);

    return () => {
      clearTimeout(timeoutId);
      timeline?.kill();
      cursorAnim?.kill();
      if (reverse && revertWidth) {
        revertWidth();
      }

      // Don't show text on cleanup - keep container empty
      // This prevents flash of full text during React StrictMode double-invoke
      if (!started && container && !reverse) {
        container.textContent = "";
      }
    };
    // Only run once on mount with initial text
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className="inline-block">
      <span ref={containerRef} className={className} />
      {cursorVisible && (
        <span
          ref={cursorRef}
          className="inline-block ml-1"
          style={{ color: cursorColor }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
}

/**
 * TypewriterWidth Component
 *
 * Width-based typewriter effect (similar to about-us page).
 * Uses width animation from 0% to 100% with steps easing.
 * Supports ScrollTrigger integration and cursor animation.
 *
 * @example
 * ```tsx
 * <TypewriterWidth
 *   text="WHY WE'RE HERE"
 *   className="text-5xl font-bold"
 *   duration={1.5}
 *   steps={40}
 *   cursorVisible
 *   scrollTrigger={{ trigger: "#section-1", start: "top 70%" }}
 * />
 * ```
 */

export interface TypewriterWidthProps {
  /** Text to animate */
  text: string;
  /** Custom className for styling */
  className?: string;
  /** Animation duration in seconds (default: 1.5) */
  duration?: number;
  /** Number of steps for typewriter effect (default: 40) */
  steps?: number;
  /** Show blinking cursor (default: false) */
  cursorVisible?: boolean;
  /** Cursor className for styling */
  cursorClassName?: string;
  /** ScrollTrigger configuration (optional) */
  scrollTrigger?: ScrollTrigger.Vars;
  /** Callback when animation completes */
  onComplete?: () => void;
}

export function TypewriterWidth({
  text,
  className = "",
  duration,
  steps,
  cursorVisible = false,
  cursorClassName = "",
  scrollTrigger,
  onComplete,
}: TypewriterWidthProps) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const onCompleteRef = useRef(onComplete);

  // Update onComplete ref without triggering re-animation
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const titleEl = titleRef.current;
    const cursorEl = cursorRef.current;
    if (!titleEl || hasAnimated.current) return;

    // Mark as animated to prevent re-execution
    hasAnimated.current = true;

    // Set initial state
    gsap.set(titleEl, { width: "0%" });
    if (cursorEl) {
      gsap.set(cursorEl, { left: "0%" });
    }

    // Create timeline with optional ScrollTrigger
    const readMotion = (name: string, fallback: number) => {
      if (typeof window === "undefined") return fallback;
      const val = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
      return Number.isFinite(val) ? val : fallback;
    };
    const widthDuration = duration ?? readMotion("--motion-typewriter-width-duration", 1.5);
    const widthSteps = steps ?? readMotion("--motion-typewriter-width-steps", 40);
    const blinkDuration = readMotion("--motion-typewriter-blink", 0.5);

    const tl = gsap.timeline({
      scrollTrigger: scrollTrigger
        ? {
            ...scrollTrigger,
            once: true,
          }
        : undefined,
      onComplete: () => {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      },
    });

    // Animate title width
    tl.to(titleEl, {
      width: "100%",
      duration: widthDuration,
      ease: `steps(${widthSteps})`,
    });

    // Animate cursor position
    if (cursorEl) {
      tl.to(
        cursorEl,
        {
          left: "100%",
          duration: widthDuration,
          ease: `steps(${widthSteps})`,
        },
        "<"
      );
    }

    // Cursor blinking animation
    let blinkAnim: gsap.core.Tween | null = null;
    if (cursorVisible && cursorEl) {
      blinkAnim = gsap.to(cursorEl, {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: blinkDuration,
        ease: "steps(1)",
      });
    }

    return () => {
      tl.kill();
      if (blinkAnim) blinkAnim.kill();
      // Allow re-init in React StrictMode double-invocation
      hasAnimated.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative inline-block">
      {/* Invisible placeholder for layout */}
      <span className={cn("select-none invisible", className)}>{text}</span>

      {/* Animated text */}
      <span
        ref={titleRef}
        className={cn(
          "absolute top-0 left-0 whitespace-nowrap overflow-hidden",
          className
        )}
        style={{ width: "0%" }}
      >
        {text}
      </span>

      {/* Cursor */}
      {cursorVisible && (
        <span
          ref={cursorRef}
          className={cn("absolute block", cursorClassName)}
          style={{ left: "0%" }}
        />
      )}
    </div>
  );
}

/**
 * TypewriterLines Component
 *
 * Animates multiple lines of text in sequence.
 * Perfect for multi-line titles with typewriter effects.
 *
 * @example
 * ```tsx
 * <TypewriterLines
 *   lines={[
 *     { text: "Services &", className: "text-white" },
 *     { text: "AI Products", className: "text-emerald-400 font-bold" }
 *   ]}
 *   speed={40}
 * />
 * ```
 */

export interface TypewriterLine {
  text: string;
  className?: string;
  delay?: number;
}

export interface TypewriterLinesProps {
  /** Array of lines to animate */
  lines: TypewriterLine[];
  /** Speed in milliseconds per character (default: 50) */
  speed?: number;
  /** Delay before first line starts (default: 0) */
  initialDelay?: number;
  /** Gap between lines in seconds (default: 0.1) */
  lineGap?: number;
  /** Container className */
  className?: string;
  /** Callback when all lines complete */
  onComplete?: () => void;
  /** Reverse animation (characters disappear) */
  reverse?: boolean;
  /** Allow wrapping during typing (keeps words intact) */
  wrapDuringTyping?: boolean;
}

export function TypewriterLines({
  lines,
  speed,
  initialDelay,
  lineGap,
  className = "",
  onComplete,
  wrapDuringTyping = false,
}: TypewriterLinesProps) {
  const completedCount = useRef(0);
  const [allLinesComplete, setAllLinesComplete] = useState(false);

  const readMotion = (name: string, fallback: number) => {
    if (typeof window === "undefined") return fallback;
    const val = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(val) ? val : fallback;
  };
  const charSpeed = speed ?? readMotion("--motion-typewriter-char-ms", 50);
  const baseDelay = initialDelay ?? readMotion("--motion-typewriter-delay", 0);
  const gap = lineGap ?? readMotion("--motion-typewriter-line-gap", 0.1);

  const handleLineComplete = () => {
    completedCount.current += 1;
    if (completedCount.current === lines.length) {
      setAllLinesComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  };

  return (
    <span className={className}>
      {lines.map((line, index) => {
        // Calculate cumulative delay
        const lineDelay = lines
          .slice(0, index)
          .reduce((acc, prevLine) => {
            const charCount = prevLine.text.length;
            return acc + (charCount * charSpeed) / 1000 + gap;
      }, baseDelay);

        return (
          <span key={index} className="block">
            <TypewriterText
              text={line.text}
              className={`${line.className} ${!wrapDuringTyping && !allLinesComplete ? "whitespace-nowrap" : ""}`}
              speed={speed}
              delay={lineDelay}
              onComplete={handleLineComplete}
              wrapDuringTyping={wrapDuringTyping}
            />
          </span>
        );
      })}
    </span>
  );
}

/**
 * TypewriterLinesReverse Component
 *
 * Animates multiple lines of text with reverse typewriter effect (characters disappear).
 * Lines animate from last to first, but display order remains correct.
 * Each line's characters disappear from end to start.
 *
 * @example
 * ```tsx
 * <TypewriterLinesReverse
 *   lines={[
 *     { text: "Services &", className: "text-white" },
 *     { text: "AI Products", className: "text-emerald-400 font-bold" }
 *   ]}
 *   speed={30}
 * />
 * // Result: "AI Products" disappears first, then "Services &"
 * ```
 */
export function TypewriterLinesReverse({
  lines,
  speed,
  initialDelay,
  lineGap,
  className = "",
  onComplete,
  wrapDuringTyping = false,
}: TypewriterLinesProps) {
  const completedCount = useRef(0);
  const [allLinesComplete, setAllLinesComplete] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const readMotion = (name: string, fallback: number) => {
    if (typeof window === "undefined") return fallback;
    const val = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(val) ? val : fallback;
  };
  const charSpeed = speed ?? readMotion("--motion-typewriter-char-ms", 50);
  const baseDelay = initialDelay ?? readMotion("--motion-typewriter-delay", 0);
  const gap = lineGap ?? readMotion("--motion-typewriter-line-gap", 0.1);

  const handleLineComplete = () => {
    completedCount.current += 1;
    if (completedCount.current === lines.length) {
      setAllLinesComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  };

  // Freeze container dimensions on mount to prevent layout shift during reverse animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Measure and freeze dimensions before animation starts
    const rect = container.getBoundingClientRect();
    container.style.minWidth = `${rect.width}px`;
    container.style.minHeight = `${rect.height}px`;

    return () => {
      // Clean up on unmount
      container.style.minWidth = "";
      container.style.minHeight = "";
    };
  }, []);

  return (
    <span ref={containerRef} className={className}>
      {/* Map through original lines to maintain visual order */}
      {lines.map((line, visualIndex) => {
        // Calculate cumulative delay: sum of all lines that should disappear before this one
        // Lines that appear later visually (higher index) should disappear first
        let cumulativeDelay = baseDelay;

        // For the last line (visualIndex === lines.length - 1), delay = initialDelay
        // For the second to last line, delay = initialDelay + last line's duration
        // And so on...
        for (let i = lines.length - 1; i > visualIndex; i--) {
          const lineChars = lines[i].text.length;
          cumulativeDelay += (lineChars * charSpeed) / 1000 + gap;
        }

        return (
          <span key={visualIndex} className="block">
            <TypewriterText
              text={line.text}
              className={`${line.className} ${!wrapDuringTyping && !allLinesComplete ? "whitespace-nowrap" : ""}`}
              speed={speed}
              delay={cumulativeDelay}
              reverse={true}
              onComplete={handleLineComplete}
              wrapDuringTyping={wrapDuringTyping}
            />
          </span>
        );
      })}
    </span>
  );
}
