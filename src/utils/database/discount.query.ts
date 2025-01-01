import prisma from "@/lib/prisma";
import { Prisma, Role } from "@prisma/client";

export const createDiscount = async (data: Prisma.DiscountCreateInput) => {
  return await prisma.discount.create({
    data,
  });
};

export const findDiscount = async (where: Prisma.DiscountWhereUniqueInput) => {
  return await prisma.discount.findUnique({ where });
};

export const findDiscountByRole = async (role: Role) => {
  return await prisma.discount.findUnique({
    where: {
      target_role: role,
    },
  });
};

export const findDiscounts = async (args?: Prisma.DiscountFindManyArgs) => {
  return await prisma.discount.findMany(args);
};

export const updateDiscount = async (
  where: Prisma.DiscountWhereUniqueInput,
  data: Prisma.DiscountUpdateInput,
) => {
  return await prisma.discount.update({
    where,
    data,
  });
};

export const deleteDiscount = async (
  where: Prisma.DiscountWhereUniqueInput,
) => {
  return await prisma.discount.delete({ where });
};
