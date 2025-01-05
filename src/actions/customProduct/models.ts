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
import { uploadSeoImage } from "../seo";

export const upsertModel = async (
  data: {
    id?: string;
    model: string;
    description?: string;
  },
  imageFormData: FormData,
): Promise<ActionResponse<{ message: string }>> => {
  const { id, model, description } = data;

  const image = imageFormData.get("image");
  const imageUrl = image ? await uploadSeoImage(image) : undefined;

  try {
    const payload: Prisma.ModelCreateInput = {
      model,
      description,
      image: imageUrl,
    };

    if (!id) {
      const existingName = await findModel({ model });

      if (existingName) {
        return ActionResponses.badRequest("Nama model sudah digunakan");
      }

      await createModel(payload);
      return ActionResponses.success({
        message: "Model berhasil dibuat",
      });
    }

    await updateModel({ id }, payload);

    revalidatePath("/", "layout");
    return ActionResponses.success({
      message: "Model berhasil diperbarui",
    });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Gagal membuat atau memperbarui model");
  }
};

export const deleteModel = async (
  id: string,
): Promise<ActionResponse<{ id: string }>> => {
  try {
    const model = await findModel({ id });
    if (!model) return ActionResponses.notFound("Model tidak ditemukan");

    await deleteModelQuery({ id });

    revalidatePath("/", "layout");
    return ActionResponses.success({
      id,
      message: "Model berhasil dihapus",
    });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Gagal menghapus model");
  }
};
