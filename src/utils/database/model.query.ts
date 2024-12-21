import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const createModel = async (data: Prisma.ModelCreateInput) => {
  return await prisma.model.create({ data });
};

export const updateModel = async (
  where: Prisma.ModelWhereUniqueInput,
  data: Prisma.ModelUpdateInput,
) => {
  return await prisma.model.update({ where, data });
};

export const deleteModel = async (where: Prisma.ModelWhereUniqueInput) => {
  return await prisma.model.delete({ where });
};

export const findModel = async (where: Prisma.ModelWhereUniqueInput) => {
  return await prisma.model.findUnique({ where });
};

export const findModels = async (where?: Prisma.ModelWhereInput) => {
  return await prisma.model.findMany({ where });
};
