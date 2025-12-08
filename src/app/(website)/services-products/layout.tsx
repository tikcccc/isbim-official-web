/**
 * Services & Products Page Layout
 *
 * Special layout for dark-themed pages that need FooterCharcoal instead of default Footer.
 * Hides the default white Footer and renders FooterCharcoal instead.
 */

import { FooterCharcoal } from "@/components/layout/footer-charcoal";
import { HideDefaultFooter } from "@/components/services-products/hide-default-footer";

export default function ServicesProductsLayout({
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
