import ArticleCard from "./_components/ArticleCard";
import { getArticles } from "@/actions/articles";
import { Article } from "@prisma/client";
export default async function page() {
  const response = await getArticles({});
  const articles: Article[] = response.data ?? [];
  return (
    <div className="flex w-full flex-wrap justify-center gap-8 pb-16">
      {articles &&
        articles.map((article: Article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            imageUrl={article.cover_url}
            createdAt={article.created_at.toLocaleDateString()}
            tags={article.tags}
            slug={article.slug}
          />
        ))}
    </div>
  );
}
