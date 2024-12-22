"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { Cart } from "@/types/cart";

export const getCart = async (): Promise<ActionResponse<{ cart?: Cart }>> => {
  try {
    const session = await getServerSession();

    if (!session) return ActionResponses.unauthorized();

    const userId = session?.user?.id;

    const cart = await prisma.cart.findUnique({ where: { user_id: userId } });

    if (!cart) return ActionResponses.success({ cart: undefined });

    return ActionResponses.success({ cart: cart.json_content as Cart });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError();
  }
};

export const updateCart = async (
  cart_data: Cart,
): Promise<ActionResponse<{ message: string }>> => {
  try {
    const session = await getServerSession();

    if (!session) return ActionResponses.unauthorized();

    const userId = session?.user?.id;

    const cart = await prisma.cart.findUnique({ where: { user_id: userId } });
    if (!cart) {
      await prisma.cart.create({
        data: { user: { connect: { id: userId } }, json_content: cart_data },
      });
      return ActionResponses.success({
        message: `Successfully created ${session.user?.name.split(" ")[0]}'s cart`,
      });
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: { json_content: cart_data },
    });
    return ActionResponses.success({
      message: `Successfully updated ${session.user?.name.split(" ")[0]}'s cart`,
    });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError();
  }
};
