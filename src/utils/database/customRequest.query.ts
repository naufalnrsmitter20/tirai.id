"use server";

import { paginator } from "@/lib/paginator";
import prisma from "@/lib/prisma";
import { CustomRequest, Prisma } from "@prisma/client";

export const createCustomRequest = async (
  data: Prisma.CustomRequestCreateInput,
) => {
  return await prisma.customRequest.create({ data });
};

export const updateCustomRequest = async (
  where: Prisma.CustomRequestWhereUniqueInput,
  data: Prisma.CustomRequestUpdateInput,
) => {
  return await prisma.customRequest.update({ where, data });
};

export const deleteCustomRequest = async (
  where: Prisma.CustomRequestWhereUniqueInput,
) => {
  return await prisma.customRequest.delete({ where });
};

export const findCustomRequest = async (
  where: Prisma.CustomRequestWhereUniqueInput,
) => {
  return await prisma.customRequest.findUnique({ where });
};

export const findCustomRequests = async (
  where: Prisma.CustomRequestWhereInput,
) => {
  return await prisma.customRequest.findMany({ where });
};

export const findCustomRequestEntries = async (
  perPage = 6,
  page = 1,
  args?: Prisma.CustomRequestFindManyArgs,
) => {
  const paginate = paginator({ perPage });

  return await paginate<CustomRequest, Prisma.CustomRequestFindManyArgs>(
    prisma.customRequest,
    { page },
    args,
  );
};
