import { PageContainer } from "@/components/layout/PageContainer";

export default async function SearchArticles({
  searchParams,
}: {
  searchParams: Promise<{ term?: string }>;
}) {
  const { term } = await searchParams;

  console.log(term);

  return <PageContainer></PageContainer>;
}
