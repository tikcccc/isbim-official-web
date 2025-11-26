/**
 * StatisticsSection Component
 *
 * 用途：
 * - 展示數據指標、統計數字、成果展示
 * - 用數字說話，增強說服力
 *
 * 使用場景：
 * - JPM頁面的"By the Numbers"
 * - About Us頁的公司數據
 * - 產品頁的效能指標
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { m } from "@/components/motion/lazy-motion";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks";
import { staggerContainer, fadeInUp } from "@/lib/animation-variants";

export interface Statistic {
  /** Display value (e.g., "70%", "$1.2B", "24 months") */
  value: string;
  /** Label for the statistic */
  label: string;
  /** Optional description */
  description?: string;
  /** Whether to highlight this statistic */
  highlight?: boolean;
}

export interface StatisticsSectionProps {
  /** Array of statistics to display */
  stats: Statistic[];
  /** Layout style */
  layout?: "grid" | "horizontal";
  /** Section title */
  title?: string;
  /** Additional CSS classes */
  className?: string;
  /** Enable count-up animation for numeric values */
  animate?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
}

/**
 * Parse numeric value from string for count-up animation
 * Returns null if not a simple number/percentage
 */
function parseNumericValue(value: string): { num: number; suffix: string } | null {
  const match = value.match(/^([\d.]+)(.*)$/);
  if (match) {
    const num = parseFloat(match[1]);
    if (!isNaN(num)) {
      return { num, suffix: match[2] || "" };
    }
  }
  return null;
}

/**
 * CountUpValue - Animated number counter
 */
function CountUpValue({
  value,
  duration = 2000,
  inView,
}: {
  value: string;
  duration: number;
  inView: boolean;
}) {
  const [displayValue, setDisplayValue] = useState("0");
  const parsed = parseNumericValue(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current || !parsed) return;

    hasAnimated.current = true;
    const { num, suffix } = parsed;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;

      // Format based on original value
      if (value.includes(".")) {
        setDisplayValue(current.toFixed(1) + suffix);
      } else {
        setDisplayValue(Math.floor(current) + suffix);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, value, duration, parsed]);

  // If not a number, just display the value
  if (!parsed) {
    return <>{value}</>;
  }

  return <>{displayValue}</>;
}

/**
 * StatisticsSection - Display metrics and statistics with count-up animation
 *
 * @example
 * ```tsx
 * const stats = [
 *   { value: "70%", label: "Cost Savings", description: "Average reduction in project costs" },
 *   { value: "45%", label: "Faster Delivery", highlight: true },
 *   { value: "5%", label: "Defect Rate" },
 * ];
 *
 * <StatisticsSection
 *   title="By the Numbers"
 *   stats={stats}
 *   layout="grid"
 * />
 * ```
 */
export function StatisticsSection({
  stats,
  layout = "grid",
  title,
  className,
  animate = true,
  animationDuration = 2000,
}: StatisticsSectionProps) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className={cn("py-16 md:py-24", className)}
    >
      <div className="container mx-auto px-4">
        {/* Title */}
        {title && (
          <m.h2
            variants={fadeInUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-3xl md:text-4xl font-light text-center mb-12"
          >
            {title}
          </m.h2>
        )}

        {/* Stats Grid/Horizontal */}
        <m.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className={cn(
            layout === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              : "flex flex-wrap justify-center gap-8 md:gap-12"
          )}
        >
          {stats.map((stat, index) => (
            <m.div
              key={index}
              variants={fadeInUp}
              className={cn(
                "text-center p-6",
                layout === "horizontal" && "min-w-[150px]",
                stat.highlight && "relative"
              )}
            >
              {/* Highlight indicator */}
              {stat.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
              )}

              {/* Value */}
              <div
                className={cn(
                  "text-4xl md:text-5xl font-bold mb-2",
                  stat.highlight ? "text-primary" : "text-foreground"
                )}
              >
                {animate ? (
                  <CountUpValue
                    value={stat.value}
                    duration={animationDuration}
                    inView={inView}
                  />
                ) : (
                  stat.value
                )}
              </div>

              {/* Label */}
              <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {stat.label}
              </div>

              {/* Description */}
              {stat.description && (
                <p className="text-xs md:text-sm text-muted-foreground/70">
                  {stat.description}
                </p>
              )}
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}

export default StatisticsSection;
