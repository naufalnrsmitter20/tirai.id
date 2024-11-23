import ArticleCard from "./_components/ArticleCard";
import ArticleFilterLayout from "./_components/ArticleFilterLayout";
import { getArticles } from "@/actions/articles";
import { ArticlesWithUser } from "@/types/entityRelations";
export default async function page({
  searchParams,
}: {
  searchParams: { searchQuery: string };
}) {
  const response = await getArticles({ searchQuery: searchParams.searchQuery });
  const articles: ArticlesWithUser[] = response.data ?? [];
  return (
    <div className="w-full space-y-8">
      <div className="flex w-full justify-end">
        <ArticleFilterLayout searchData={searchParams.searchQuery} />
      </div>
      <div className="flex w-full flex-wrap gap-8 pb-16">
        {articles &&
          articles.map((article: ArticlesWithUser) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              imageUrl={article.cover_url}
              createdAt={article.created_at.toLocaleDateString()}
              tags={article.tags}
              slug={article.slug}
              author={article.author.name}
              author_role={article.author.role}
            />
          ))}
      </div>
    </div>
  );
}
