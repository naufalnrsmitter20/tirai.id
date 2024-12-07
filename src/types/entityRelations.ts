import { Prisma } from "@prisma/client";

export type ArticleWithUser = Prisma.ArticleGetPayload<{
  include: {
    author: { select: { name: true; role: true } };
  };
}>;
