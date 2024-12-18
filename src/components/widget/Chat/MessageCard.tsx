import { Body5 } from "@/components/ui/text";
import { Message } from "@/hooks/use-message";
import { cn } from "@/lib/utils";
import { CheckCheck } from "lucide-react";
import moment from "moment-timezone";

export const MessageCard = ({
  message,
  isUser,
}: {
  message: Message;
  isUser: boolean;
}) => {
  const date = moment(message.created_at + "Z").tz("Asia/Jakarta");
  const hour = date.hour().toString();
  const minute = date.minute().toString();

  return (
    <>
      {isUser ? (
        <figure
          key={message.id}
          className={cn(
            "relative ms-auto w-fit rounded-lg bg-green-500 px-2 py-1 pe-12 text-white",
          )}
        >
          {message.content}
          <div className="absolute bottom-0 right-0 flex items-end gap-[2px] p-1">
            <Body5 className="text-[10px]">{`${hour.length < 2 ? `0${hour}` : hour}:${minute.length < 2 ? `0${minute}` : minute}`}</Body5>
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
            "relative w-fit rounded-lg bg-neutral-400 px-2 py-1 pe-8 text-white",
          )}
        >
          {message.content}
          <div className="absolute bottom-0 right-0 flex items-end gap-[2px] p-1">
            <Body5 className="text-[9px]">{`${hour.length < 2 ? `0${hour}` : hour}:${minute.length < 2 ? `0${minute}` : minute}`}</Body5>
          </div>
        </figure>
      )}
    </>
  );
};
