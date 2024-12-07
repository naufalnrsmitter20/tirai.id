import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const findCategories = async (
  where: Prisma.ProductCategoryWhereInput,
) => {
  const categories = await prisma.productCategory.findMany({ where });

  return categories;
};
