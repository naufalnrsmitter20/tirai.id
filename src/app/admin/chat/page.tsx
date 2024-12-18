import { H1 } from "@/components/ui/text";
import supabase from "@/lib/supabase";
import { ChatInterface } from "./components/Chat";
import { Message } from "@/hooks/use-message";
import { findUserInById } from "@/utils/database/user.query";

export default async function AdminChatPage() {
  const database = await supabase;
  const data = await database.rpc("get_customers");
  const conversations = (data.data ?? []) as Message[];
  const customers = await findUserInById(
    conversations.map((i) => i.customer_id),
  );

  return (
    <div className="w-full space-y-0 sm:space-y-8">
      <H1 className="mb-8 hidden text-black sm:block">Chat Customer</H1>
      <div className="flex w-full justify-end">
        <ChatInterface conversation={conversations} recipients={customers} />
      </div>
    </div>
  );
}
