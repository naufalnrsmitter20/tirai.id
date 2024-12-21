import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
