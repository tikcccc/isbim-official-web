import type { Metadata } from "next";
import "./globals.css";
import {
  assertIsLocale,
  baseLocale,
  getLocale,
  Locale,
  overwriteGetLocale,
} from "../../paraglide/runtime";
import React, { cache } from "react";
import { headers } from "next/headers";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "isBIM Official Web - Construction AI Platform",
  description: "Construction AI Powering the Backbone of Global Economies",
};

// SSR locale scoping
const ssrLocale = cache(() => ({ locale: baseLocale, origin: "http://localhost:3000" }));

// Overwrite the getLocale function to use the locale from the request
overwriteGetLocale(() => assertIsLocale(ssrLocale().locale));

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // @ts-expect-error - headers must be sync
  // https://github.com/opral/inlang-paraglide-js/issues/245#issuecomment-2608727658
  ssrLocale().locale = (await headers()).get("x-paraglide-locale") as Locale;
  // @ts-expect-error - headers must be sync
  ssrLocale().origin = new URL((await headers()).get("x-paraglide-request-url") || "").origin;

  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <body
        className="antialiased bg-zinc-100 text-zinc-900 footer-alliance-font"
        suppressHydrationWarning
      >
        <SmoothScrollProvider>
          <Topbar />
          {children}
          <Footer locale={getLocale()} />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
