import { paginator } from "@/lib/paginator";
import prisma from "@/lib/prisma";
import { ReviewWithOrderUser } from "@/types/entityRelations";
import { Prisma } from "@prisma/client";

export const createReview = async (data: Prisma.ReviewCreateInput) => {
  return await prisma.review.create({
    data,
  });
};

export const findReview = async (where: Prisma.ReviewWhereUniqueInput) => {
  return await prisma.review.findUnique({ where });
};

export const findReviews = async ({
  perPage = 6,
  page = 1,
  args,
}: {
  perPage: number;
  page: number;
  args?: Prisma.ReviewFindManyArgs;
}) => {
  const paginate = paginator({ perPage });

  return await paginate<ReviewWithOrderUser, Prisma.ReviewFindManyArgs>(
    prisma.review,
    { page },
    { ...args, include: { order: { include: { user: true } } } },
  );
};

export const updateReview = async (
  where: Prisma.ReviewWhereUniqueInput,
  data: Prisma.ReviewUpdateInput,
) => {
  return await prisma.review.update({
    where,
    data,
  });
};

export const deleteReview = async (where: Prisma.ReviewWhereUniqueInput) => {
  return await prisma.review.delete({ where });
};
