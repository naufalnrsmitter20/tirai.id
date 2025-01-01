"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import {
  createDiscount,
  findDiscountByRole,
  updateDiscount,
} from "@/utils/database/discount.query";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const upsertDiscount = async (data: {
  discount: number;
  role: Role;
}): Promise<ActionResponse<{ message: string }>> => {
  const { discount, role } = data;

  if (discount < 0 || discount > 100) {
    return ActionResponses.error({
      code: "BAD_REQUEST",
      message: "Invalid discount value",
    });
  }

  try {
    const existingDiscount = await findDiscountByRole(role);

    if (existingDiscount) {
      await updateDiscount(
        { target_role: role },
        { discount_in_percent: discount },
      );
      revalidatePath("/", "layout");
      return ActionResponses.success({
        message: "Discount updated successfully",
      });
    }

    await createDiscount({ discount_in_percent: discount, target_role: role });

    revalidatePath("/", "layout");
    return ActionResponses.success({
      message: "Discount created successfully",
    });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert discount");
  }
};
