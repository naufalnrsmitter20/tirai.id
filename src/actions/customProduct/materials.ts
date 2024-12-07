"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import {
  createMaterial,
  findMaterial,
  updateMaterial,
  deleteMaterial as deleteMaterialQuery,
} from "@/utils/database/material.query";
import { parsePrice } from "@/utils/format-price";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const upsertMaterial = async (data: {
  id?: string;
  name: string;
  price: string;
  supplier_price: string;
}): Promise<ActionResponse<{ message: string }>> => {
  const { id, name, price, supplier_price } = data;

  try {
    const payload: Prisma.MaterialCreateInput = {
      name,
      price: parsePrice(price),
      supplier_price: parsePrice(supplier_price),
    };

    if (!id) {
      const existingName = await findMaterial({ name });

      if (existingName) {
        return ActionResponses.badRequest("The name is already in use");
      }

      await createMaterial(payload);
      return ActionResponses.success({
        message: "Material created successfully",
      });
    }

    await updateMaterial({ id }, payload);

    revalidatePath("/admin/material");
    return ActionResponses.success({
      message: "Material updated successfully",
    });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert material");
  }
};

export const deleteMaterial = async (
  id: string,
): Promise<ActionResponse<{ id: string }>> => {
  try {
    const material = await findMaterial({ id });
    if (!material) return ActionResponses.notFound("Material not found.");

    await deleteMaterialQuery({ id });

    revalidatePath("/admin/material");
    revalidatePath("/", "layout");
    return ActionResponses.success({ id });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to delete material");
  }
};
