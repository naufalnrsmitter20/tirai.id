import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const createMaterial = async (data: Prisma.MaterialCreateInput) => {
  return await prisma.material.create({ data });
};

export const updateMaterial = async (
  where: Prisma.MaterialWhereUniqueInput,
  data: Prisma.MaterialUpdateInput,
) => {
  return await prisma.material.update({ where, data });
};

export const deleteMaterial = async (
  where: Prisma.MaterialWhereUniqueInput,
) => {
  return await prisma.material.delete({ where });
};

export const findMaterial = async (where: Prisma.MaterialWhereUniqueInput) => {
  return await prisma.material.findUnique({ where });
};

export const findMaterials = async (where?: Prisma.MaterialWhereInput) => {
  return await prisma.material.findMany({ where });
};
