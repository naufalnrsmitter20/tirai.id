import { getArticles } from "@/actions/articles";
import { Body3 } from "@/components/ui/text";
import { ArticleWithUser } from "@/types/entityRelations";
import { notFound } from "next/navigation";
import ArticleCard from "./components/ArticleCard";
import { ArticleFilter } from "./components/ArticleFilter";
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
  if (
    !response ||
    (response.meta.lastPage !== 0 && page > response.meta.lastPage)
  )
    return notFound();

  const articles: ArticleWithUser[] = response.data;

  return (
    <div className="w-full space-y-8">
      <div className="flex w-full justify-end">
        <ArticleFilter searchData={searchParams} />
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
        {articles.length === 0 && (
          <Body3 className="text-neutral-500">
            Tidak ada artikel yang ditemukan...
          </Body3>
        )}
      </div>
      {articles.length > 0 && <PageSelector meta={response.meta} />}
    </div>
  );
}
