import { PageHeader } from "@/components/ui/page-header";
import CareersListClient from "./careers-list-client";
import { sanityFetch, REVALIDATE } from "@/sanity/lib/fetch";
import { CAREERS_QUERY } from "@/sanity/lib/queries";
import type { Career } from "@/sanity/lib/types";

export const revalidate = REVALIDATE.HOUR;

export default async function CareersPage() {
  type CareerQueryResult = Career & { isDraft?: boolean };
  const careers =
    (await sanityFetch<CareerQueryResult[]>({
      query: CAREERS_QUERY,
      tags: ["career"],
      revalidate,
    }).catch(() => [])) || [];

  const publishedCareers = careers.filter((career) => !career.isDraft);

  return (
    <main className="careers-page surface-noise-overlay min-h-screen">
      <div className="noise-grain" />

      <PageHeader
        title="Impact Us"
        subtitle="isBIM delivers nation-scale infrastructure that powers the global economy. From AI factories in APAC to smart cities in Africa, we build the backbone of emerging economies—faster, cheaper, safer, greener. Join a flat hierarchy where every hire owns their impact from day one."
      />

      <CareersListClient careers={publishedCareers} />
    </main>
  );
}
