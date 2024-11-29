import { getArticleById } from "@/actions/articles";
import { ArticlesWithUser } from "@/types/entityRelations";
import ArticleForm from "../../_components/ArticleForm";
export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getArticleById(id, "edit");
  const articleData: ArticlesWithUser | undefined = response.data;
  return (
    <div className="h-full w-full pb-8">
      <ArticleForm updateData={articleData} />
    </div>
  );
}
