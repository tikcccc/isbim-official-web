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
    // If multiple footers exist (e.g., page-specific + global), hide the extra ones (keep the first)
    const footers = Array.from(
      document.querySelectorAll<HTMLElement>("footer.footer-default, footer.footer-charcoal")
    );
    const toHide = footers.length > 1 ? footers.slice(1) : [];

    toHide.forEach((footer) => {
      footer.dataset.prevDisplay = footer.style.display;
      footer.style.display = "none";
    });

    // Cleanup: restore footer when component unmounts
    return () => {
      toHide.forEach((footer) => {
        footer.style.display = footer.dataset.prevDisplay ?? "";
        delete footer.dataset.prevDisplay;
      });
    };
  }, []);

  return null;
}
