"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const upsertReferal = async ({
  data,
}: {
  data: {
    id?: number;
    user_id: string;
    code: string;
    fee_in_percent: number;
    discount_in_percent: number;
  };
}): Promise<ActionResponse<{ message: string }>> => {
  const { id, user_id, code, fee_in_percent, discount_in_percent } = data;
  try {
    if (!id) {
      const existingCode = await prisma.referal.findUnique({ where: { code } });
      if (existingCode) {
        return ActionResponses.badRequest(
          "This referral code is already in use",
        );
      }
    }

    const payload: Prisma.ReferalCreateInput = {
      user: {
        connect: { id: user_id },
      },
      code,
      fee_in_percent,
      discount_in_percent,
    };

    if (!id) {
      await prisma.referal.create({ data: payload });
      return ActionResponses.success({
        message: "Referral created successfully",
      });
    }

    await prisma.referal.update({
      where: { id },
      data: {
        ...payload,
      },
    });
    revalidatePath("/admin/referal");
    return ActionResponses.success({
      message: "Referral updated successfully",
    });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert referral");
  }
};

export const deleteReferalAction = async ({
  data,
}: {
  data: {
    id: number;
  };
}): Promise<ActionResponse<{ message: string }>> => {
  const { id } = data;
  try {
    await prisma.referal.delete({ where: { id } });
    revalidatePath("/", "layout");
    return ActionResponses.success({
      message: "Referral deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to delete referral");
  }
};
