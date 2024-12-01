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
        created_at: (() => {
          if (startDate && endDate) {
            return { gte: startDate, lte: endDate };
          }
          if (startDate) {
            return { gte: startDate };
          }
          if (endDate) {
            return { lte: endDate };
          }
          return undefined;
        })(),
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
  return await prisma.article.findFirst({
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
  });
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

export const findTags = async (searchTerm?: string) => {
  const articles = await prisma.article.findMany({ select: { tags: true } });
  const uniqueTags = new Set(articles.flatMap(({ tags }) => tags));
  const tags = Array.from(uniqueTags);

  if (searchTerm) {
    return tags.filter((tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  return tags;
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
