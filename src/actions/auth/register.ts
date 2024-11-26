"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import { EmailService } from "@/lib/nodemailer";
import prisma from "@/lib/prisma";
import { encrypt } from "@/utils/encryption";
import { verifyTemplate } from "@/utils/mail-template";
import { generateVerificationToken } from "@/utils/random-string";

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

    const generatedVerificationToken = generateVerificationToken();

    const mailService = new EmailService();
    await mailService.sendEmail({
      subject: "Verifikasi email anda untuk Tirai.id",
      to: email,
      html: verifyTemplate(
        name,
        `${process.env.APP_URL}/auth/verify?token=${generatedVerificationToken}`,
      ),
    });

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        is_verified: false,
        verification_token: generatedVerificationToken,
      },
    });

    return ActionResponses.success({ name, email });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Terjadi kesalahan");
  }
};
