"use client";

/**
 * Hide Default Footer Component
 *
 * Client component that hides the default white footer for dark-themed pages.
 * This allows pages like Services & Products to use FooterDark instead.
 */

import { useEffect } from "react";

export function HideDefaultFooter() {
  useEffect(() => {
    // Find and hide the default footer (not footer-dark)
    const defaultFooter = document.querySelector("footer:not(.footer-dark)");
    if (defaultFooter) {
      (defaultFooter as HTMLElement).style.display = "none";
    }

    // Cleanup: restore footer when component unmounts
    return () => {
      const defaultFooter = document.querySelector("footer:not(.footer-dark)");
      if (defaultFooter) {
        (defaultFooter as HTMLElement).style.display = "";
      }
    };
  }, []);

  return null;
}
