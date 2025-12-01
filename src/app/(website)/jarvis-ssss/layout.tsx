/**
 * JARVIS SSSS Product Page Layout
 *
 * Uses FooterCharcoal and hides the default footer for product template pages.
 * Mirrors other JARVIS product layouts.
 */

import { FooterCharcoal } from "@/components/layout/footer-charcoal";
import { HideDefaultFooter } from "@/components/services-products/hide-default-footer";

export default function JarvisSsssLayout({
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
