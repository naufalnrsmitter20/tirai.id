import prisma from "@/lib/prisma";
import { Prisma, Referal } from "@prisma/client";
import { paginator } from "@/lib/paginator";

export const findReferals = async (
  perPage = 6,
  page = 1,
  args?: Prisma.ReferalFindManyArgs,
) => {
  const paginate = paginator({ perPage });

  return await paginate<Referal, Prisma.ReferalFindManyArgs>(
    prisma.referal,
    { page },
    args,
  );
};
