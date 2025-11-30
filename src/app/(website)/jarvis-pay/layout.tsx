/**
 * JARVIS Pay Product Page Layout
 *
 * Special layout for dark-themed product pages that need FooterDark instead of default Footer.
 * Follows the same pattern as services-products layout.
 */

import { FooterDark } from "@/components/layout/footer-dark";
import { HideDefaultFooter } from "@/components/services-products/hide-default-footer";

export default function JarvisPayLayout({
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
