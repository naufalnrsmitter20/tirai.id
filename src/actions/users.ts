"use server";
import { ActionResponse, ActionResponses } from "@/lib/actions";
import { createUser, findUser, updateUser } from "@/utils/database/user.query";
import { encrypt } from "@/utils/encryption";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const upsertUser = async ({
  data,
}: {
  data: {
    id?: string;
    phone_number?: string;
    name: string;
    email: string;
    password: string;
  };
}): Promise<ActionResponse<{ message: string }>> => {
  const { id, name, email, password, phone_number } = data;

  try {
    if (!id) {
      const existingEmail = await findUser({ email });
      if (existingEmail) {
        return ActionResponses.badRequest("This email is already in use");
      }

      if (phone_number) {
        const existingPhone = await findUser({ phone_number });
        if (existingPhone) {
          return ActionResponses.badRequest(
            "This phone number is already in use",
          );
        }
      }
    }

    const userData: Prisma.UserCreateInput = {
      name,
      email,
      phone_number,
      password: encrypt(password),
      is_verified: false,
    };

    if (!id) {
      await createUser({
        ...userData,
      });
      return ActionResponses.success({
        message: "User registered successfully",
      });
    }

    await updateUser(
      { id },
      {
        ...userData,
      },
    );

    revalidatePath("/");
    return ActionResponses.success({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert user");
  }
};
