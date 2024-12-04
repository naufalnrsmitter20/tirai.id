import { paginator } from "@/lib/paginator";
import prisma from "@/lib/prisma";
import { Prisma, User } from "@prisma/client";

export const createUser = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data,
  });
};

export const findUser = async (where: Prisma.UserWhereUniqueInput) => {
  return await prisma.user.findUnique({ where });
};

export const findUsers = async (
  args?: Prisma.UserFindManyArgs,
  perPage = 6,
  page = 1,
) => {
  const paginate = paginator({ perPage });

  return await paginate<User, Prisma.UserFindManyArgs>(
    prisma.user,
    { page },
    args,
  );
};

export const updateUser = async (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput,
) => {
  return await prisma.user.update({
    where,
    data,
  });
};

export const deleteUser = async (where: Prisma.UserWhereUniqueInput) => {
  return await prisma.user.delete({ where });
};
