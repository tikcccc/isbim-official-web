/**
 * JARVIS AI Suite Page Layout
 *
 * Special layout for dark-themed JARVIS AI Suite page.
 * Hides the default white Footer and renders FooterDark instead.
 */

import { Footer } from "@/components/layout/footer";
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
      <Footer />
    </>
  );
}
