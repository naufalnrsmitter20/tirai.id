import { PageContainer } from "@/components/layout/PageContainer";

export default async function ArticlesByTag({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;

  console.log(tag);

  return <PageContainer></PageContainer>;
}
