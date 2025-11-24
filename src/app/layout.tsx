import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@inlang/paraglide-next";
import { sourceLanguageTag, setLanguageTag } from "@/paraglide/runtime";
import type { AvailableLanguageTag } from "@/paraglide/runtime";
import { AppProviders } from "@/providers/app-providers";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";
import { headers } from "next/headers";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Next.js 15 requires await headers() before use
  const headersList = await headers();
  const locale = (headersList.get("x-language-tag") ?? sourceLanguageTag) as AvailableLanguageTag;

  // Tell Paraglide runtime to use this locale (prevents it from reading headers synchronously)
  setLanguageTag(() => locale);

  return (
    <LanguageProvider>
      <html
        lang={locale}
        className={`${allianceNo1.variable} ${allianceNo2.variable}`}
        suppressHydrationWarning
      >
        <body
          className="antialiased bg-zinc-100 text-zinc-900 footer-alliance-font"
          suppressHydrationWarning
        >
          <LocaleProvider locale={locale}>
            <AppProviders>
              <Topbar />
              {children}
              <Footer />
            </AppProviders>
          </LocaleProvider>
        </body>
      </html>
    </LanguageProvider>
  );
}
