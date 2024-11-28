import { Prisma } from "@prisma/client";

export type ArticlesWithUser = Prisma.ArticleGetPayload<{
  include: {
    author: { select: { name: true; role: true } };
  };
}>;
