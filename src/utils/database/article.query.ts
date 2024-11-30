import { paginator } from "@/lib/paginator";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const createArticle = async (data: Prisma.ArticleCreateInput) => {
  return await prisma.article.create({ data });
};

export const findArticles = async (
  filter?: Prisma.ArticleWhereInput,
  sort?: "latest" | "popular",
  status?: boolean,
  startDate?: Date,
  endDate?: Date,
  perPage = 6,
  page = 1,
) => {
  const paginate = paginator({ perPage });

  return await paginate<
    Prisma.ArticleGetPayload<{
      include: {
        author: {
          select: {
            name: true;
            role: true;
          };
        };
      };
    }>,
    Prisma.ArticleFindManyArgs
  >(
    prisma.article,
    { page },
    {
      where: {
        ...filter,
        is_published: status !== undefined ? status : undefined,
        created_at:
          startDate && endDate
            ? { gte: startDate, lte: endDate }
            : startDate
              ? { gte: startDate }
              : undefined,
      },
      orderBy:
        sort === "latest"
          ? { created_at: "desc" }
          : sort === "popular"
            ? { views: "desc" }
            : undefined,
      include: {
        author: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    },
  );
};

export const findLatestArticle = async () => {
  return (
    (
      await prisma.article.findMany({
        where: {
          is_published: true,
        },
        include: {
          author: true,
        },
        orderBy: {
          published_at: "desc",
        },
        take: 1,
      })
    )?.[0] ?? null
  );
};

export const findArticle = async (where: Prisma.ArticleWhereUniqueInput) => {
  return await prisma.article.findUnique({
    where,
    include: {
      author: {
        select: {
          name: true,
          role: true,
        },
      },
    },
  });
};

export const findTags = async () => {
  const articles = await prisma.article.findMany({ select: { tags: true } });
  return articles.map(({ tags }) => tags).flat();
};

export const updateArticle = async (
  where: Prisma.ArticleWhereUniqueInput,
  data: Prisma.ArticleUpdateInput,
) => {
  return await prisma.article.update({
    where,
    data,
  });
};

export const hardDeleteArticle = async (
  where: Prisma.ArticleWhereUniqueInput,
) => {
  return await prisma.article.delete({ where });
};
