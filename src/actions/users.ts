"use server";
import { ActionResponse, ActionResponses } from "@/lib/actions";
import {
  createUser,
  deleteUser,
  findUser,
  updateUser,
} from "@/utils/database/user.query";
import { encrypt } from "@/utils/encryption";
import { Prisma, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const upsertUser = async ({
  data,
}: {
  data: {
    id?: string;
    phone_number?: string;
    name: string;
    email: string;
    password?: string;
    role?: Role;
  };
}): Promise<ActionResponse<{ message: string }>> => {
  const { id, name, email, password, phone_number, role = "CUSTOMER" } = data;

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
      password: password ? encrypt(password) : undefined,
      is_verified: false,
      role,
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

    revalidatePath("/admin/user");
    return ActionResponses.success({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert user");
  }
};

export const deleteUserAction = async ({
  data,
}: {
  data: {
    id: string;
  };
}): Promise<ActionResponse<{ message: string }>> => {
  const { id } = data;

  try {
    await deleteUser({ id });

    revalidatePath("/admin/user");
    return ActionResponses.success({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to delete user");
  }
};
