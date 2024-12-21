"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import {
  createModel,
  deleteModel as deleteModelQuery,
  findModel,
  updateModel,
} from "@/utils/database/model.query";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const upsertModel = async (data: {
  id?: string;
  model: string;
  description: string;
}): Promise<ActionResponse<{ message: string }>> => {
  const { id, model, description } = data;

  try {
    const payload: Prisma.ModelCreateInput = {
      model,
      description,
    };

    if (!id) {
      const existingName = await findModel({ model });

      if (existingName) {
        return ActionResponses.badRequest("The model name is already in use");
      }

      await createModel(payload);
      return ActionResponses.success({
        message: "Model created successfully",
      });
    }

    await updateModel({ id }, payload);

    revalidatePath("/admin/model");
    return ActionResponses.success({
      message: "Model updated successfully",
    });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert model");
  }
};

export const deleteModel = async (
  id: string,
): Promise<ActionResponse<{ id: string }>> => {
  try {
    const model = await findModel({ id });
    if (!model) return ActionResponses.notFound("Model not found.");

    await deleteModelQuery({ id });

    revalidatePath("/admin/model");
    revalidatePath("/", "layout");
    return ActionResponses.success({ id });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to delete model");
  }
};
