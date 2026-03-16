import { Metadata } from "next";
import { generateHreflangAlternates } from "@/lib/seo";
import { getSiteUrl } from "@/lib/env";
import { languageTag } from "@/paraglide/runtime";
import * as m from "@/paraglide/messages";
import CookiesClient from "./cookies-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag() as "en" | "zh";
  const title = `${m.cookies_meta_title({}, { languageTag: locale })} | isBIM`;
  const description = m.cookies_meta_description({}, { languageTag: locale });

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/${locale}/cookies`;
  const hreflangAlternates = generateHreflangAlternates("/cookies", locale);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates.languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "isBIM",
      locale: locale === "en" ? "en_US" : "zh_HK",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function CookiesPage() {
  return <CookiesClient />;
}
