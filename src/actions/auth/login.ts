"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import prisma from "@/lib/prisma";
import { compareHash } from "@/utils/encryption";

export const checkVerifiedStatus = async (
  email: string,
  password: string,
): Promise<ActionResponse<{ is_verified: boolean }>> => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return ActionResponses.notFound(`Email atau password salah`);

    if (user.password && !compareHash(password, user.password))
      return ActionResponses.notFound(`Email atau password salah`);

    if (!user.is_verified)
      return ActionResponses.unauthorized(`Akun anda belum diverifikasi`);

    return ActionResponses.success({ is_verified: user.is_verified });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Terjadi kesalahan");
  }
};
