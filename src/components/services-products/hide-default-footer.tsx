"use client";

/**
 * Hide Default Footer Component
 *
 * Client component that hides the already-rendered global footer for dark-themed pages.
 * This allows pages like Services & Products to render their own footer.
 */

import { useEffect } from "react";

export function HideDefaultFooter() {
  useEffect(() => {
    const charcoalFooters = Array.from(
      document.querySelectorAll<HTMLElement>("footer.footer-charcoal")
    );
    const defaultFooters = Array.from(
      document.querySelectorAll<HTMLElement>("footer.footer-default")
    );

    // Prefer keeping the charcoal footer for service pages. If it exists, hide every default footer.
    const toHide = new Set<HTMLElement>();

    if (charcoalFooters.length && defaultFooters.length) {
      defaultFooters.forEach((footer) => toHide.add(footer));
      // Also hide any extra charcoal footers beyond the first, if present.
      charcoalFooters.slice(1).forEach((footer) => toHide.add(footer));
    } else {
      // Fallback: if only one style is present but duplicated, hide all but the first.
      const combined = [...charcoalFooters, ...defaultFooters];
      combined.slice(1).forEach((footer) => toHide.add(footer));
    }

    const hidden = Array.from(toHide);

    hidden.forEach((footer) => {
      footer.dataset.prevDisplay = footer.style.display;
      footer.style.display = "none";
    });

    // Cleanup: restore footer when component unmounts
    return () => {
      hidden.forEach((footer) => {
        footer.style.display = footer.dataset.prevDisplay ?? "";
        delete footer.dataset.prevDisplay;
      });
    };
  }, []);

  return null;
}
