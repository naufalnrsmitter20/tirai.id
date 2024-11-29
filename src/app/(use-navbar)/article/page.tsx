import { paginator } from "@/lib/paginator";
import prisma from "@/lib/prisma";
import { findLatestArticle } from "@/utils/database/article.query";
import { Prisma } from "@prisma/client";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "./components/Hero";
import { Articles } from "./components/Articles";
import { Recent } from "./components/Recent";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
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
  if (page > paginatedArticles.meta.lastPage)
    return {
      title: "No Articles Found",
      description: "Articles you're looking for is not found in our website.",
    };

  const articles = paginatedArticles.data;

  const titles = articles.map((article) => article.title).join(", ");

  return {
    title: "Articles from Tirai.id",
    description: `Explore our articles collection: ${titles}`,
    alternates: {
      canonical: `${process.env.APP_URL}/article`,
    },
    keywords: titles,
    openGraph: {
      type: "article",
      description: `Explore our articles collection: ${titles}`,
    },
  };
}

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
      <Articles
        articles={paginatedArticles.data}
        meta={paginatedArticles.meta}
      />
    </>
  );
}
