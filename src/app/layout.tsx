import type { Metadata, Viewport } from "next";
import "./globals.css";
import { headers } from "next/headers";
import { sourceLanguageTag } from "@/paraglide/runtime";
import { allianceNo1, allianceNo2 } from "./fonts";

export const metadata: Metadata = {
  title: "isBIM Official Web - Construction AI Platform",
  description: "Construction AI Powering the Backbone of Global Economies",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use middleware-provided locale when available to keep <html lang> accurate.
  const headersList = await headers();
  const languageTag = headersList.get("x-language-tag") || sourceLanguageTag;

  return (
    <html lang={languageTag} className={`${allianceNo1.variable} ${allianceNo2.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
