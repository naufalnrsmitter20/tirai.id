import { getArticles } from "@/actions/articles";
import { Body3 } from "@/components/ui/text";
import { ArticleWithUser } from "@/types/entityRelations";
import ArticleCard from "./components/ArticleCard";
import ArticleFilterLayout from "./components/ArticleFilterLayout";
import { PageSelector } from "./components/PageSelector";

export default async function Articles({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{
    title: string;
    tags: string;
    sort: "latest" | "popular";
    status: "all" | "published" | "archived";
    start: Date;
    end: Date;
    page: string;
  }>;
}) {
  const searchParams = await searchParamsPromise;
  let page = searchParams.page ? Number(searchParams.page) : 1;
  if (page < 0) page = 1;

  const response = (
    await getArticles({
      searchQuery: searchParams.title,
      tags: searchParams.tags,
      order: searchParams.sort,
      status:
        searchParams.status === "published"
          ? true
          : searchParams.status === "archived"
            ? false
            : undefined,
      startDate: searchParams.start,
      endDate: searchParams.end,
      page,
    })
  ).data;
  if (!response || page > response.meta.lastPage)
    return {
      title: "No Articles Found",
      description: "Articles you're looking for is not found in our website.",
    };
  const articles: ArticleWithUser[] = response.data;

  return (
    <div className="w-full space-y-8">
      <div className="flex w-full justify-end">
        <ArticleFilterLayout searchData={searchParams} />
      </div>
      <div className="grid w-full grid-cols-3 gap-6 pb-16">
        {articles.length > 0 &&
          articles.map((article: ArticleWithUser) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              imageUrl={article.cover_url}
              createdAt={article.created_at.toLocaleDateString()}
              tags={article.tags}
              slug={article.slug}
              author={article.author.name}
              author_role={article.author.role}
              views={article.views}
            />
          ))}
        {articles.length === 0 && <Body3>Belum ada artikel apa-apa...</Body3>}
      </div>
      <PageSelector meta={response.meta} />
    </div>
  );
}
