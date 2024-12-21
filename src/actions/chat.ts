"use server";

import { Message } from "@/hooks/use-message";
import { ActionResponse, ActionResponses } from "@/lib/actions";
import supabase from "@/lib/supabase";
import { uploadImageCloudinary } from "./fileUploader";
import { getServerSession } from "@/lib/next-auth";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { findUserInById } from "@/utils/database/user.query";
import { ChatUser } from "@/types/entityRelations";

export const findChatById = async (
  id: string,
  page = 1,
): Promise<ActionResponse<PostgrestSingleResponse<Message[]>>> => {
  try {
    const client = await supabase;
    const perPage = 15;
    let from = (page - 1) * perPage;
    const to = from + perPage;

    if (page > 1) from += 1;

    const res = await client
      .from("messages")
      .select("*", { count: "exact" })
      .eq("customer_id", id)
      .order("created_at", { ascending: false })
      .range(from, to);

    return ActionResponses.success(res);
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to delete category");
  }
};

export const sendMessage = async (
  formData: FormData,
  customerId: string,
): Promise<ActionResponse<PostgrestSingleResponse<null>>> => {
  const session = await getServerSession();
  const content = formData.get("message") as string;
  try {
    const client = await supabase;

    const res = await client.from("messages").insert({
      customer_id: customerId,
      sender_id: session?.user?.id!, // eslint-disable-line @typescript-eslint/no-non-null-asserted-optional-chain
      content,
      created_at: new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
      ).toISOString(),
    });
    if (res.error) throw new Error("Failed to send message");

    return ActionResponses.success(res);
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to send message");
  }
};

export const setReadMessage = async (
  customerId: string,
): Promise<ActionResponse<PostgrestSingleResponse<null>>> => {
  const session = await getServerSession();
  try {
    const client = await supabase;

    const res = await client
      .from("messages")
      .update({
        is_read: true,
      })
      .eq("customer_id", customerId)
      .neq("sender_id", session?.user?.id);
    if (res.error) throw new Error("Failed to send message");

    return ActionResponses.success(res);
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to send message");
  }
};

export const sendFile = async (
  formData: FormData,
  customerId: string,
): Promise<ActionResponse<PostgrestSingleResponse<null>>> => {
  const session = await getServerSession();
  if (!session?.user) return ActionResponses.unauthorized();

  const content = formData.get("message") as string | undefined;
  const file = formData.get("file") as File;
  const fileBuff = Buffer.from(await file.arrayBuffer());
  try {
    const client = await supabase;
    const uploadFile = await uploadImageCloudinary(fileBuff);

    const res = await client.from("messages").insert({
      customer_id: customerId,
      sender_id: session.user.id,
      content,
      created_at: new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
      ).toISOString(),
      file_url: uploadFile.data?.url,
    });
    if (res.error) throw new Error("Failed to send message");

    return ActionResponses.success(res);
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to send message");
  }
};

export const getChatUsers = async (
  userIds: string[],
): Promise<ActionResponse<ChatUser[]>> => {
  try {
    const res = await findUserInById(userIds);

    return ActionResponses.success(res);
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to send message");
  }
};
