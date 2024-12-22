"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import { findOrderById, updateOrder } from "@/utils/database/order.query";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export const ConfirmOrder = async (
  orderId: string,
): Promise<ActionResponse<{ message: string }>> => {
  try {
    await updateOrder({ id: orderId }, { status: "PACKING" });
    revalidatePath("/admin/order");
    return ActionResponses.success({ message: "Order updated successfully" });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert user");
  }
};

export const AddResi = async (
  orderId: string,
  courier: string,
  trackingId: string,
): Promise<ActionResponse<{ message: string }>> => {
  try {
    await updateOrder(
      { id: orderId },
      {
        shipment: {
          create: {
            carrier: courier,
            estimated_finish_time: "2-14 hari",
            status: "PENDING",
            tracking_id: trackingId,
          },
        },
        status: "SHIPPING",
      },
    );

    revalidatePath("/admin/order");
    return ActionResponses.success({ message: "Order updated successfully" });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert user");
  }
};

export const UpdateResi = async (
  orderId: string,
  trackingId: string,
): Promise<ActionResponse<{ message: string }>> => {
  try {
    await prisma.shipment.update({
      where: {
        order_id: orderId,
      },
      data: {
        tracking_id: trackingId,
      },
    });

    revalidatePath("/admin/order");
    return ActionResponses.success({ message: "Order updated successfully" });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert user");
  }
};
