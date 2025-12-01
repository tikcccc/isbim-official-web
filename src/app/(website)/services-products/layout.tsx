/**
 * Services & Products Page Layout
 *
 * Special layout for dark-themed pages that need FooterDark instead of default Footer.
 * Hides the default white Footer and renders FooterDark instead.
 */

import { FooterCharcoal } from "@/components/layout/footer-charcoal";
import { FooterDark } from "@/components/layout/footer-dark";
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
      <FooterDark />
    </>
  );
}
