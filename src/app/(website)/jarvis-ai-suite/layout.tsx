/**
 * JARVIS AI Suite Page Layout
 *
 * Special layout for dark-themed JARVIS AI Suite page.
 * Hides the default white Footer and renders FooterDark instead.
 */

import { FooterDark } from "@/components/layout/footer-dark";
import { HideDefaultFooter } from "@/components/services-products/hide-default-footer";

export default function JarvisAiSuiteLayout({
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
