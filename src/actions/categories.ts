"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import {
  createCategory,
  deleteCategory,
  findCategory,
  updateCategory,
} from "@/utils/database/category.query";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const upsertCategory = async (data: {
  id?: string;
  name: string;
  slug: string;
}): Promise<ActionResponse<{ message: string }>> => {
  const { id, name, slug } = data;

  try {
    if (!id) {
      const existingSlug = await findCategory({ slug });

      if (existingSlug) {
        return ActionResponses.badRequest("The slug is already in use");
      }

      const payload: Prisma.ProductCategoryCreateInput = {
        name,
        slug,
      };

      await createCategory({
        ...payload,
      });
      return ActionResponses.success({
        message: "Category created successfully",
      });
    }

    await updateCategory({ id }, { name, slug });

    revalidatePath("/", "layout");
    return ActionResponses.success({
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert category");
  }
};

export const removeCategory = async (id: string) => {
  try {
    const category = await findCategory({ id });
    if (!category)
      return ActionResponses.error({
        code: "NOT_FOUND",
        message: "Category not Found",
      });

    if (category.products.length > 0)
      return ActionResponses.error({
        code: "CONFLICT",
        message: "Category is not empty",
      });

    await deleteCategory({ id });
    revalidatePath("/", "layout");
    return ActionResponses.success({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to delete category");
  }
};
