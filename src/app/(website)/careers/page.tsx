import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import CareersListClient from "./careers-list-client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CAREERS_QUERY } from "@/sanity/lib/queries";
import type { Career } from "@/sanity/lib/types";
import { generateCareersPageSEO } from "@/lib/seo-generators";
import { languageTag } from "@/paraglide/runtime";
import { JsonLd, createJobPostingSchema } from "@/components/seo/json-ld";
import { getSiteUrl } from "@/lib/env";
import { buildHref } from "@/lib/i18n/route-builder";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();
  return generateCareersPageSEO(locale);
}

export default async function CareersPage() {
  type CareerQueryResult = Career & { isDraft?: boolean };
  const careers =
    (await sanityFetch<CareerQueryResult[]>({
      query: CAREERS_QUERY,
      tags: ["career"],
      revalidate,
    }).catch(() => [])) || [];

  const publishedCareers = careers.filter((career) => !career.isDraft);
  const locale = languageTag();
  const siteUrl = getSiteUrl();

  const employmentTypeMap: Record<string, string> = {
    "full-time": "FULL_TIME",
    "part-time": "PART_TIME",
    "contract": "CONTRACTOR",
    "internship": "INTERN",
    "temporary": "TEMPORARY",
  };

  const jobPostings = publishedCareers.map((career) => {
    const employmentType = career.employmentType
      ? employmentTypeMap[career.employmentType] || career.employmentType
      : undefined;
    const location = career.locations?.[0]?.title || "Hong Kong";
    const descriptionParts = [
      career.team?.description,
      career.team?.pillar?.description,
    ].filter(Boolean) as string[];
    const description = descriptionParts.length > 0
      ? descriptionParts.join(" ")
      : `Join isBIM as a ${career.title}.`;
    const jobUrl = `${siteUrl}${buildHref(`/careers/${career.slug.current}`, locale)}`;

    const baseSchema = createJobPostingSchema({
      title: career.title,
      description,
      datePosted: career.postedAt || career._createdAt,
      employmentType,
      hiringOrganization: {
        name: "isBIM",
        url: siteUrl,
        logo: `${siteUrl}/icons/isbim_black.svg`,
      },
      jobLocation: {
        city: location,
        country: "Hong Kong",
        address: location,
      },
    });

    return {
      ...baseSchema,
      url: jobUrl,
      ...(career.applicationUrl && { applicationUrl: career.applicationUrl }),
      ...(career.expiresAt && { validThrough: career.expiresAt }),
    };
  });

  return (
    <main className="careers-page surface-noise-overlay min-h-screen">
      <div className="noise-grain" />
      {jobPostings.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": jobPostings,
          }}
          id="careers-jobpostings"
        />
      )}

      <PageHeader
        title="Impact Us"
        subtitle="isBIM delivers nation-scale infrastructure that powers the global economy. From AI factories in APAC to smart cities in Africa, we build the backbone of emerging economies—faster, cheaper, safer, greener. Join a flat hierarchy where every hire owns their impact from day one."
      />

      <CareersListClient careers={publishedCareers} />
    </main>
  );
}
