"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ColorInput {
  id?: string;
  name: string;
  colorCode: string;
}

export const upsertColor = async (
  data: ColorInput,
): Promise<ActionResponse<{ message: string }>> => {
  const { id, name, colorCode } = data;

  // try {
  if (!id) {
    const existingName = await prisma.customColor.findFirst({
      where: { name },
    });

    if (existingName) {
      return ActionResponses.badRequest("The color name is already in use");
    }

    await prisma.customColor.create({
      data: {
        name,
        colorCode,
      },
    });

    revalidatePath("/", "layout");
    return ActionResponses.success({
      message: "Color created successfully",
    });
  }

  await prisma.customColor.update({
    where: { id: parseInt(id) },
    data: {
      name,
      colorCode,
    },
  });

  // revalidatePath("/admin/colors");
  // revalidatePath("/shop/custom-product");
  revalidatePath("/", "layout");
  return ActionResponses.success({
    message: "Color updated successfully",
  });
  // } catch (error) {
  //   console.error(error);
  //   return ActionResponses.serverError("Failed to upsert color");
  // }
};

export const deleteColor = async (
  id: number,
): Promise<ActionResponse<{ id: number }>> => {
  try {
    const color = await prisma.customColor.findUnique({
      where: { id },
    });

    if (!color) {
      return ActionResponses.notFound("Color not found.");
    }

    await prisma.customColor.delete({
      where: { id },
    });

    // revalidatePath("/admin/colors");
    // revalidatePath("/shop/custom-product");
    revalidatePath("/", "layout");
    return ActionResponses.success({ id });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to delete color");
  }
};
