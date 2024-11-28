import { PageContainer } from "@/components/layout/PageContainer";
import { findArticle } from "@/utils/database/article.query";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await findArticle({ slug });

  return (
    <PageContainer>
      <div></div>
    </PageContainer>
  );
}
