import {
  findArticles,
  findLatestArticle,
} from "@/utils/database/article.query";
import { Hero } from "./components/Hero";
import { MostRead } from "./components/MostRead";
import { Recent } from "./components/Recent";
import { paginator } from "@/lib/paginator";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

const paginate = paginator({ perPage: 6 });

export default async function Article({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: paramPage } = await searchParams;
  let page = paramPage ? Number(paramPage) : 1;
  if (page < 0) page = 1;

  const paginatedArticles = await paginate<
    Prisma.ArticleGetPayload<{
      include: {
        author: true;
      };
    }>,
    Prisma.ArticleFindManyArgs
  >(
    prisma.article,
    { page },
    {
      where: {
        is_published: true,
      },
      orderBy: {
        views: "desc",
      },
      include: {
        author: true,
      },
    },
  );
  if (page > paginatedArticles.meta.lastPage) return notFound();
  const latestArticle = await findLatestArticle();

  return (
    <>
      <Hero />
      <Recent
        cover={latestArticle.cover_url}
        title={latestArticle.title}
        content={latestArticle.content}
        slug={latestArticle.slug}
        authorName={latestArticle.author.name}
        published_at={latestArticle.published_at}
      />
      <MostRead
        articles={paginatedArticles.data}
        meta={paginatedArticles.meta}
      />
    </>
  );
}
