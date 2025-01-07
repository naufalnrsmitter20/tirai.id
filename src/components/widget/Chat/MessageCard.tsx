import { Body5 } from "@/components/ui/text";
import { Message } from "@/hooks/use-message";
import { cn } from "@/lib/utils";
import { ChatUser } from "@/types/entityRelations";
import { CheckCheck } from "lucide-react";

export const MessageCard = ({
  message,
  isUser,
  participants,
}: {
  message: Message;
  isUser: boolean;
  participants?: ChatUser[];
}) => {
  return (
    <>
      {isUser ? (
        <figure
          key={message.id}
          className={cn(
            "relative ms-auto w-fit rounded-lg bg-primary-600 px-2 py-1 pe-6 text-white",
          )}
        >
          {message.content}
          <div className="absolute bottom-0 right-0 flex items-end gap-[2px] p-1">
            <CheckCheck
              size={12}
              className={cn(
                message.is_read
                  ? "text-white opacity-100"
                  : "text-neutral-400 opacity-85",
              )}
            />
          </div>
        </figure>
      ) : (
        <figure
          key={message.id}
          className={cn(
            "relative w-fit rounded-lg bg-neutral-100 px-2 py-1 pe-8 text-black",
            participants &&
              participants.findIndex((i) => i.id === message.sender_id) !==
                -1 &&
              (participants[
                participants.findIndex((i) => i.id === message.sender_id)
              ].role === "CUSTOMER"
                ? "!bg-neutral-100"
                : "!bg-green-500 text-white"),
          )}
        >
          {participants &&
            participants.findIndex((i) => i.id === message.sender_id) !==
              -1 && (
              <Body5 className="absolute -top-5 left-0 text-nowrap text-black">
                {participants &&
                  participants[
                    participants.findIndex((i) => i.id === message.sender_id)
                  ].name}
              </Body5>
            )}
          {message.content}
        </figure>
      )}
    </>
  );
};
