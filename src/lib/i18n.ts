/**
 * i18n Configuration for Paraglide Next
 *
 * This file centralizes all i18n routing and navigation configuration.
 * Uses PrefixStrategy for URL-based locale routing (/en/*, /zh/*)
 *
 * @see https://inlang.com/m/osslbuzt/paraglide-next-i18n
 */

import { Navigation, Middleware, PrefixStrategy } from "@inlang/paraglide-next";
import type { AvailableLanguageTag } from "@/paraglide/runtime";

/**
 * Routing Strategy: Prefix Strategy
 * - English: / or /en/* (base locale)
 * - Chinese: /zh/*
 */
export const strategy = PrefixStrategy<AvailableLanguageTag>({
  prefixDefault: "always",
});

/**
 * Middleware for locale detection and routing
 * Automatically handles:
 * - URL prefix detection (/zh/*, /en/*)
 * - Locale cookie management
 * - Language negotiation via Accept-Language header
 */
export const middleware = Middleware({ strategy });

/**
 * Localized Navigation APIs
 * Use these instead of Next.js native navigation:
 * - Link: Automatically adds locale prefix
 * - useRouter: Locale-aware navigation
 * - usePathname: Returns canonical pathname without locale
 * - redirect/permanentRedirect: Server-side locale-aware redirects
 */
export const { Link, useRouter, usePathname, redirect, permanentRedirect } = Navigation({
  strategy
});
