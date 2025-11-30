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
    // Find and hide the default footer (marked with .footer-default)
    const defaultFooter = document.querySelector<HTMLElement>("footer.footer-default");
    if (defaultFooter) {
      defaultFooter.style.display = "none";
    }

    // Cleanup: restore footer when component unmounts
    return () => {
      const defaultFooter = document.querySelector<HTMLElement>("footer.footer-default");
      if (defaultFooter) {
        defaultFooter.style.display = "";
      }
    };
  }, []);

  return null;
}
