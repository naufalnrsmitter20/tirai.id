import { paginator } from "@/lib/paginator";
import prisma from "@/lib/prisma";
import { Prisma, SEO } from "@prisma/client";

export async function getSeo() {
  try {
    const getAllSeo = await prisma.sEO.findMany();
    if (!getAllSeo) {
      throw new Error("Data not found");
    }
    return getAllSeo;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export const findSEOEntries = async (
  perPage = 6,
  page = 1,
  args?: Prisma.SEOFindManyArgs,
) => {
  const paginate = paginator({ perPage });

  return await paginate<SEO, Prisma.SEOFindManyArgs>(
    prisma.sEO,
    { page },
    args,
  );
};

export async function getSeoPageById(id: number) {
  try {
    const getSeoPageById = await prisma.sEO.findUnique({
      where: {
        id: id,
      },
    });
    if (!getSeoPageById) {
      throw new Error("Data not found");
    }
    return getSeoPageById;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
export async function createSeoPage(data: Prisma.SEOCreateInput) {
  try {
    const createSeoPage = await prisma.sEO.create({
      data: data,
    });
    if (!createSeoPage) {
      throw new Error("Data not found");
    }
    return createSeoPage;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function updateSeoPage(id: number, data: Prisma.SEOUpdateInput) {
  try {
    const updateSeoPage = await prisma.sEO.update({
      where: {
        id: id,
      },
      data: data,
    });
    if (!updateSeoPage) {
      throw new Error("Data not found");
    }
    return updateSeoPage;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function deleteSeoPage(id: number) {
  try {
    const deleteSeoPage = await prisma.sEO.delete({
      where: {
        id: id,
      },
    });
    if (!deleteSeoPage) {
      throw new Error("Data not found");
    }
    return deleteSeoPage;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
