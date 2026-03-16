import type { Metadata } from "next";
import { languageTag } from "@/paraglide/runtime";
import { generateHreflangAlternates } from "@/lib/seo";
import { getSiteUrl } from "@/lib/env";
import * as m from "@/paraglide/messages";
import PrivacyCookiePolicyClient from "./privacy-cookie-policy-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag() as "en" | "zh";
  const title = `${m.privacy_cookie_title({}, { languageTag: locale })} | isBIM`;
  const description = m.privacy_cookie_meta_description({}, { languageTag: locale });

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/${locale}/privacy-cookie-policy`;
  const hreflangAlternates = generateHreflangAlternates(
    "/privacy-cookie-policy",
    locale
  );

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
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function PrivacyCookiePolicyPage() {
  return <PrivacyCookiePolicyClient />;
}
