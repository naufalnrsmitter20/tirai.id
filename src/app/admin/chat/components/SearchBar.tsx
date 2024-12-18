import { Input } from "@/components/ui/input";
import { Message } from "@/hooks/use-message";
import { cn } from "@/lib/utils";
import { ChatUser } from "@/types/entityRelations";
import { Session } from "next-auth";
import { ChangeEventHandler } from "react";

export const SearchBar = ({
  activeChat,
  recipients,
  filteredConvo,
  session,
  handleConversationClick,
  handleFiltering,
}: {
  activeChat: string | undefined;
  recipients: ChatUser[];
  filteredConvo: Message[];
  session: Session;
  handleConversationClick: (customerId: string) => void;
  handleFiltering: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <div className="relative h-full w-full px-2 py-2 sm:relative sm:border-e sm:border-e-black">
      <div className="relative left-0 top-0 h-[70px] w-full bg-white px-4 py-2 sm:absolute">
        <Input placeholder="Cari pesan..." onChange={handleFiltering} />
      </div>
      <div className="mt-[12px] flex h-full max-h-[100%] w-full flex-col gap-1 overflow-y-scroll sm:mt-[70px]">
        {filteredConvo.map((i) => (
          <figure
            key={i.id}
            onClick={() => {
              handleConversationClick(i.customer_id);
            }}
            className={cn(
              "relative flex aspect-[6/1] w-full items-center gap-2 rounded-lg px-3 py-1 transition-all duration-300 hover:bg-neutral-100 sm:grid sm:aspect-[5/1] sm:grid-cols-[15%_85%]",
              i.customer_id === activeChat ? "bg-neutral-100" : "bg-white",
            )}
          >
            <div className="inline-flex !aspect-square h-[30px] items-center justify-center rounded-full bg-purple-400 text-white">
              {recipients
                .find((j) => j.id === i.customer_id)
                ?.name[0].toUpperCase()}
            </div>
            <div className="text-black">
              {recipients.find((j) => j.id === i.customer_id)?.name}
            </div>
            {i.sender_id !== session?.user?.id && !i.is_read && (
              <div className="absolute right-0 top-1/2 me-6 aspect-square w-2 -translate-y-1/2 rounded-full bg-blue-700" />
            )}
          </figure>
        ))}
      </div>
    </div>
  );
};
