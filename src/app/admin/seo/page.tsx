import { PageSelector } from "@/components/ui/PageSelector";
import { Body3, H1 } from "@/components/ui/text";
import { findSEOEntries } from "@/utils/database/seo.query";
import { SEOTable } from "./_components/SeoTable";

export default async function SEOPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ page?: string }>;
}>) {
  const { page: queryPage } = await searchParams;
  const page = parseInt(queryPage || "1");
  const response = await findSEOEntries(6, page);
  const seoEntries = response.data;

  return (
    <div className="flex flex-col">
      <H1 className="mb-8 text-black">Manajemen SEO Pages</H1>
      <div className="mb-2">
        <SEOTable meta={response.meta} seoData={seoEntries} />
      </div>
      {seoEntries.length > 0 && <PageSelector meta={response.meta} />}
    </div>
  );
}
