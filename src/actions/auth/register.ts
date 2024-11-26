"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import prisma from "@/lib/prisma";
import { encrypt } from "@/utils/encryption";
import { requestVerificationMail } from "../mail";

interface RegisterAccountPayload {
  name: string;
  email: string;
  password: string;
}

/***
 * This server action only works for CUSTOMER role
 */
export const registerAccount = async (
  payload: RegisterAccountPayload,
): Promise<ActionResponse<{ name: string; email: string }>> => {
  const { name, email, password } = payload;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return ActionResponses.badRequest(
        `Email ${email} telah digunakan`,
        "email",
      );
    }

    const hashedPassword = encrypt(password);

    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        is_verified: false,
      },
    });

    const sentMail = await requestVerificationMail({ userId: createdUser.id });

    if (!sentMail) {
      return ActionResponses.serverError("Terjadi kesalahan");
    }

    return ActionResponses.success({ name, email });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Terjadi kesalahan");
  }
};
