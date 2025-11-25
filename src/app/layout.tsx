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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Next.js 15 requires await headers() before use
  const headersList = await headers();
  const headerUrl =
    headersList.get("next-url") ||
    headersList.get("x-invoke-path") ||
    headersList.get("x-pathname") ||
    headersList.get("referer") ||
    "";
  const languageTag = headersList.get("x-language-tag");
  const isStudioRoute = headerUrl.includes("/studio") || !languageTag;
  const locale = (languageTag ?? sourceLanguageTag) as AvailableLanguageTag;


  
  // Studio route: no i18n middleware, no providers, no topbar/footer.
  if (isStudioRoute) {
    return (
      <html
        lang={sourceLanguageTag}
        className={`${allianceNo1.variable} ${allianceNo2.variable}`}
      >
        <body className="antialiased bg-white text-black">
          {children}
        </body>
      </html>
    );
  }

  // Public routes: normal i18n flow
  setLanguageTag(() => locale);

  return (
    <LanguageProvider>
      <html lang={locale} className={`${allianceNo1.variable} ${allianceNo2.variable}`}>
        <body className="antialiased bg-zinc-100 text-zinc-900 footer-alliance-font">
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
