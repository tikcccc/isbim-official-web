/**
 * JARVIS Air Product Page Layout
 *
 * Dedicated layout for product template pages using the dark FooterCharcoal.
 * Mirrors the services-products and jarvis-pay layouts.
 */

import { FooterCharcoal } from "@/components/layout/footer-charcoal";
import { HideDefaultFooter } from "@/components/services-products/hide-default-footer";

export default function JarvisAirLayout({
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
