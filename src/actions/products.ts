"use server";

import prisma from "@/lib/prisma";
import { ActionResponse, ActionResponses } from "@/lib/actions";
import { PaginatedResult } from "@/lib/paginator";
import { ProductWithCategoryReviewsVariants } from "@/types/entityRelations";
import {
  createProduct,
  deleteProduct,
  findProductById,
  findProducts,
  updateProduct,
} from "@/utils/database/product.query";
import { revalidatePath } from "next/cache";
import { deleteImageCloudinary, uploadImageCloudinary } from "./fileUploader";
import { Prisma } from "@prisma/client";

interface UpsertProductData {
  id?: string;
  slug?: string;
  category?: string;
  name?: string;
  description?: string;
  stock?: number;
  price?: number;
  weight?: number;
  photos?: FormData;
}

export const getProducts = async (
  perPage = 6,
  page = 1,
  sort: "latest" | "popular",
): Promise<
  ActionResponse<PaginatedResult<ProductWithCategoryReviewsVariants>>
> => {
  const paginatedProducts = await findProducts(perPage, page, sort);
  return ActionResponses.success(paginatedProducts);
};

const handleImagesUpload = async (images: File[], productId?: string) => {
  if (images.length === 0) return null;

  if (productId) {
    const existingProduct = await findProductById(productId);
    if (existingProduct?.photos) {
      for (const photoUrl of existingProduct.photos) {
        await deleteImageCloudinary(photoUrl);
      }
    }
  }

  const photoUrls: string[] = [];

  for (const image of images) {
    const imageBuffer = await image.arrayBuffer();
    const uploadedImage = await uploadImageCloudinary(Buffer.from(imageBuffer));

    const url = uploadedImage.data?.url;
    if (url) {
      photoUrls.push(url);
    }
  }

  return photoUrls;
};

export const upsertProduct = async ({
  data,
}: {
  data: UpsertProductData;
}): Promise<ActionResponse<string>> => {
  try {
    const photos = data.photos?.getAll("photos") as File[] | undefined;

    if (!data.id && !photos)
      return ActionResponses.badRequest("Photos is required");

    const photoUrls = photos ? await handleImagesUpload(photos) : undefined;

    if (!data.id) {
      await createProduct({
        category: { connect: { id: data.category } },
        description: data.description!,
        name: data.name!,
        slug: data.slug!,
        photos: photoUrls!,
        price: data.price,
        stock: data.stock,
        weight: data.weight,
        is_published: true,
      });

      return ActionResponses.success("Success Create Product");
    }

    await updateProduct(
      { id: data.id },
      {
        category: data.category
          ? { connect: { id: data.category } }
          : undefined,
        description: data.description,
        name: data.name,
        slug: data.slug,
        photos: photoUrls as string[] | undefined,
        price: data.price,
        stock: data.stock,
        weight: data.weight,
      },
    );

    revalidatePath("/", "layout");
    return ActionResponses.success("Success Update Product");
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to upsert Product");
  }
};

export const getProductById = async (
  id: string,
): Promise<
  ActionResponse<{
    product: Prisma.ProductGetPayload<{ include: { variants: true } }>;
  }>
> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!product) return ActionResponses.notFound("Produk tidak ditemukan");

    return ActionResponses.success({ product });
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to get product by ID");
  }
};

export const changeProductPublishedStatus = async (
  id: string,
  status: boolean,
) => {
  try {
    await updateProduct(
      { id: id },
      {
        is_published: status,
      },
    );

    revalidatePath("/", "layout");
    return ActionResponses.success("Success Update Product");
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to upsert Product");
  }
};

export const removeProduct = async (id: string) => {
  try {
    await deleteProduct({ id });

    revalidatePath("/", "layout");
    return ActionResponses.success("Success delete Product");
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to delete Product");
  }
};
