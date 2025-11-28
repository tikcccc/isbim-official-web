"use client";

import { Link } from "@/lib/i18n";
import type { ComponentProps } from "react";

/**
 * LocalizedLink Component
 *
 * A wrapper around Paraglide's Link component with enhanced features:
 * - Automatic locale-aware navigation (no need to use buildHref)
 * - Automatic prefetching enabled by default
 * - Type-safe route paths
 * - Supports all Next.js Link props
 *
 * Usage:
 * ```tsx
 * import { LocalizedLink } from "@/components/ui/localized-link";
 * import { ROUTES } from "@/lib/constants";
 *
 * // Simple usage
 * <LocalizedLink href={ROUTES.HOME}>Home</LocalizedLink>
 *
 * // With custom className
 * <LocalizedLink href={ROUTES.ABOUT} className="text-blue-500">
 *   About Us
 * </LocalizedLink>
 *
 * // Disable prefetch if needed
 * <LocalizedLink href={ROUTES.CONTACT} prefetch={false}>
 *   Contact
 * </LocalizedLink>
 * ```
 */

export interface LocalizedLinkProps extends Omit<ComponentProps<typeof Link>, "locale"> {
  /**
   * The route path. Use ROUTES constants for type safety.
   * @example href={ROUTES.HOME}
   * @example href="/about-us"
   */
  href: string;
  /**
   * Enable/disable prefetching. Default: true
   * Set to false for less important links to save bandwidth
   */
  prefetch?: boolean;
}

export function LocalizedLink({
  href,
  prefetch = true,
  children,
  ...props
}: LocalizedLinkProps) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      {...props}
    >
      {children}
    </Link>
  );
}
