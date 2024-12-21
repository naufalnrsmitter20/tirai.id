"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";

export const upsertAddress = async (
  data: {
    recipient_name: string;
    recipient_phone_number: string;
    street: string;
    city: string;
    village: string;
    district: string;
    province: string;
    postal_code: string;
    additional_info?: string;
  },
  id?: string,
): Promise<ActionResponse<{ message: string }>> => {
  try {
    const session = await getServerSession();

    if (!session?.user) return ActionResponses.unauthorized();

    if (id) {
      await prisma.shippingAddress.update({ where: { id }, data });
      return ActionResponses.success({ message: "Success" });
    }

    await prisma.shippingAddress.create({
      data: { ...data, user: { connect: { id: session.user.id } } },
    });
    return ActionResponses.success({ message: "Success" });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError();
  }
};
