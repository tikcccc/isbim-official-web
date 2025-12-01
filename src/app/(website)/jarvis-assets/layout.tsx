/**
 * JARVIS Assets Product Page Layout
 *
 * Uses FooterCharcoal and hides the default footer for product template pages.
 */

import { FooterCharcoal } from "@/components/layout/footer-charcoal";
import { HideDefaultFooter } from "@/components/services-products/hide-default-footer";

export default function JarvisAssetsLayout({
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
