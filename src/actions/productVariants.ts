"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import {
  createProductVariant,
  deleteProductVariant,
  updateProductVariant,
} from "@/utils/database/productVariant.query";
import { revalidatePath } from "next/cache";

interface UpsertProductData {
  id?: string;
  name?: string;
  width?: number;
  height?: number;
  price?: number;
  stock?: number;
  weight?: number;
  productId?: string;
}

export const upsertVariant = async ({
  data,
}: {
  data: UpsertProductData;
}): Promise<ActionResponse<string>> => {
  try {
    const { id, name, width, height, price, stock, weight, productId } = data;

    if (!id) {
      if (
        !name ||
        !width ||
        !height ||
        !price ||
        !stock ||
        !weight ||
        !productId
      ) {
        return ActionResponses.badRequest(
          "name, width, height, price, weight, and stock is required.",
        );
      }

      await createProductVariant({
        product: { connect: { id: productId } },
        name,
        width,
        height,
        price,
        stock,
        weight,
      });

      return ActionResponses.success("Success create product variant");
    }

    await updateProductVariant(
      { id: data.id },
      {
        product: productId ? { connect: { id: productId } } : undefined,
        name,
        width,
        height,
        price,
        stock,
      },
    );

    revalidatePath("/", "layout");
    return ActionResponses.success("Success update product variant");
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to upsert product variant");
  }
};

export const deleteVariant = async (id: string) => {
  try {
    await deleteProductVariant({ id });
    revalidatePath("/", "layout");
    return ActionResponses.success("Success delete product variant");
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to delete product variant");
  }
};
