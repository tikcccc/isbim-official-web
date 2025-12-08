/**
 * JARVIS Agent Product Page Layout
 *
 * Hides the global light footer and renders the charcoal footer for this dark-themed page.
 */

import { FooterCharcoal } from "@/components/layout/footer-charcoal";
import { HideDefaultFooter } from "@/components/services-products/hide-default-footer";

export default function JarvisAgentLayout({
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
