import { getArticleById } from "@/actions/articles";
import { notFound } from "next/navigation";
import { ArticleForm } from "../../components/ArticleForm";

export default async function UpdateArticle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getArticleById(id);
  const articleData = response.data;

  if (!articleData) return notFound();

  return (
    <section id="update-article-form" className="w-full pb-8">
      <ArticleForm updateData={articleData} />
    </section>
  );
}
