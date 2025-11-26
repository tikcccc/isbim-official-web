import type { Metadata, Viewport } from "next";
import "./globals.css";
import { headers } from "next/headers";
import { sourceLanguageTag } from "@/paraglide/runtime";
import { allianceNo1, allianceNo2 } from "./fonts";
import { JsonLd, createOrganizationSchema } from "@/components/seo/json-ld";
import { SITE_CONFIG } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "isBIM - Construction AI Platform",
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

  // Generate Organization schema for SEO
  const siteUrl = getSiteUrl();
  const organizationSchema = createOrganizationSchema({
    name: SITE_CONFIG.name,
    url: siteUrl,
    logo: `${siteUrl}/icons/isbim_black.svg`,
    description: SITE_CONFIG.description,
    sameAs: [
      SITE_CONFIG.social.linkedin,
      SITE_CONFIG.social.twitter,
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.youtube,
    ],
    contactPoint: {
      email: SITE_CONFIG.contact.email,
      telephone: SITE_CONFIG.contact.phone,
      contactType: "Customer Service",
    },
  });

  return (
    <html lang={languageTag} className={`${allianceNo1.variable} ${allianceNo2.variable}`}>
      <head>
        <JsonLd data={organizationSchema} id="organization-schema" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
