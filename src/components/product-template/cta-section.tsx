"use client";

import { Link } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import styles from "./cta-section.module.css";

/**
 * ProductCTASection Props
 * @param title - CTA section title (e.g., "Call to Action")
 * @param subtitle - CTA subtitle/description
 * @param buttonText - Button label text
 * @param buttonHref - Button link destination
 */
interface ProductCTASectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref?: string;
}

/**
 * ProductCTASection Component
 *
 * A call-to-action section following the product template design language.
 * Features:
 * - Full-width dark background matching the product template palette
 * - Centered content with gradient text accents
 * - Primary action button with hover animation
 * - Consistent typography with product pages
 *
 * Design based on the Palantir-inspired product template.
 */
export function ProductCTASection({
  title,
  subtitle,
  buttonText,
  buttonHref = "/contact",
}: ProductCTASectionProps) {
  return (
    <section className={cn("relative z-10 product-section-padding", styles.section)}>
      <div className="product-container">
        <div className="flex flex-col items-center text-center">
          {/* Title with gradient effect */}
          <h2 className={cn("product-cta-title product-text-inverse mb-6", styles.title)}>
            <span className="product-text-gradient">{title}</span>
          </h2>

          {/* Subtitle */}
          <p className={cn("product-cta-subtitle max-w-3xl mb-12", styles.subtitle)}>
            {subtitle}
          </p>

          {/* CTA Button */}
          <Link
            href={buttonHref}
            className={cn(
              "group inline-flex items-center product-gap-sm product-cta-button product-cta-button-strong transition-all product-transition-fast hover:scale-105",
              styles.ctaButton
            )}
          >
            {buttonText}
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>

          {/* Decorative elements */}
          <div className="mt-16 flex items-center product-gap-sm">
            <div className={styles.decorLine} />
            <div className={cn("product-accent-dot", styles.decorDot)} />
            <div className={cn("product-accent-dot", styles.decorDot)} />
            <div className={styles.decorLine} />
          </div>
        </div>
      </div>
    </section>
  );
}
