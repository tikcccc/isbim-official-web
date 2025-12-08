import { Metadata } from "next";
import { languageTag } from "@/paraglide/runtime";
import { generateServicePageSEO } from "@/lib/seo-generators";
import { ServiceTemplateClient, SERVICE_META } from "@/components/service-template";

const META = SERVICE_META.FINANCE;

export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();
  return generateServicePageSEO(META.seoKey, META.title, META.description, locale);
}

export default function ProjectFinancePage() {
  return <ServiceTemplateClient initialService="FINANCE" />;
}
