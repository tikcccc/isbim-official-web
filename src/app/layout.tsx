import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@inlang/paraglide-next";
import { languageTag } from "@/paraglide/runtime";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";

const allianceNo1 = localFont({
  variable: "--font-alliance-1",
  display: "swap",
  src: [
    { path: "../../public/fonts/Alliance/AllianceNo1-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Alliance/AllianceNo1-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/Alliance/AllianceNo1-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/Alliance/AllianceNo1-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
});

const allianceNo2 = localFont({
  variable: "--font-alliance-2",
  display: "swap",
  src: [
    { path: "../../public/fonts/Alliance/AllianceNo2-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Alliance/AllianceNo2-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/Alliance/AllianceNo2-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/Alliance/AllianceNo2-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
});

export const metadata: Metadata = {
  title: "isBIM Official Web - Construction AI Platform",
  description: "Construction AI Powering the Backbone of Global Economies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html
        lang={languageTag()}
        className={`${allianceNo1.variable} ${allianceNo2.variable}`}
        suppressHydrationWarning
      >
        <body
          className="antialiased bg-zinc-100 text-zinc-900 footer-alliance-font"
          suppressHydrationWarning
        >
          <QueryProvider>
            <SmoothScrollProvider>
              <Topbar />
              {children}
              <Footer locale={languageTag()} />
            </SmoothScrollProvider>
          </QueryProvider>
        </body>
      </html>
    </LanguageProvider>
  );
}
