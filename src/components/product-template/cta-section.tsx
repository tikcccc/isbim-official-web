"use client";

import Link from "next/link";

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
    <section className="relative z-10 bg-product-dark py-24 md:py-32 lg:py-40">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col items-center text-center">
          {/* Title with gradient effect */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight mb-6">
            <span className="text-product-gradient">{title}</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed max-w-3xl mb-12">
            {subtitle}
          </p>

          {/* CTA Button */}
          <Link
            href={buttonHref}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[#1E1F2B] font-medium text-sm uppercase tracking-wider rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-[#9881F3] hover:to-[#13C9BA] hover:text-white hover:scale-105"
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
          <div className="mt-16 flex items-center gap-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="w-2 h-2 rounded-full bg-[#9881F3]/50" />
            <div className="w-2 h-2 rounded-full bg-[#13C9BA]/50" />
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
