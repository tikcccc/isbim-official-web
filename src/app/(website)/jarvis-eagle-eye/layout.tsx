/**
 * JARVIS Eagle Eye Product Page Layout
 *
 * Uses FooterCharcoal and hides the default footer for product template pages.
 * Mirrors jarvis-pay and jarvis-air layouts.
 */

import { FooterCharcoal } from "@/components/layout/footer-charcoal";
import { HideDefaultFooter } from "@/components/services-products/hide-default-footer";

export default function JarvisEagleEyeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HideDefaultFooter />
      {children}
      <FooterCharcoal />
    </>
  );
}
