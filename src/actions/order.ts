"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import prisma from "@/lib/prisma";
import { updateOrder } from "@/utils/database/order.query";
import { revalidatePath } from "next/cache";

export const confirmOrder = async (
  orderId: string,
): Promise<ActionResponse<{ message: string }>> => {
  try {
    await updateOrder({ id: orderId }, { status: "PACKING" });

    revalidatePath("/admin/order");
    revalidatePath("/account/order-history");
    return ActionResponses.success({ message: "Order updated successfully" });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert user");
  }
};

export const finishOrder = async (
  orderId: string,
): Promise<ActionResponse<{ message: string }>> => {
  try {
    await updateOrder({ id: orderId }, { status: "FINISHED" });

    revalidatePath("/admin/order");
    revalidatePath("/account/order-history");
    return ActionResponses.success({ message: "Order updated successfully" });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert user");
  }
};

export const addResi = async (
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
    revalidatePath("/account/order-history");
    return ActionResponses.success({ message: "Order updated successfully" });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert user");
  }
};

export const updateResi = async (
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
        status: "PENDING",
      },
    });

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "SHIPPING",
      },
    });

    revalidatePath("/admin/order");
    revalidatePath("/account/order-history");
    return ActionResponses.success({ message: "Order updated successfully" });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert user");
  }
};
