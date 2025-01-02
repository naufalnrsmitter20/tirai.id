import { Body3, Body5 } from "@/components/ui/text";
import { Message } from "@/hooks/use-message";
import { cn } from "@/lib/utils";
import { ChatUser } from "@/types/entityRelations";
import { CheckCheck, FileText } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

export const FileMessageCard = ({
  message,
  isUser,
  participants,
  className,
}: {
  message: Message;
  isUser: boolean;
  participants?: ChatUser[];
  className?: string;
}) => {
  return (
    <>
      {isUser ? (
        <figure
          key={message.id}
          className={cn(
            "relative ms-auto min-w-[20%] max-w-[70%] rounded-lg bg-green-500 px-2 py-1 text-white",
            className,
          )}
        >
          {message.file_url?.endsWith("pdf") ? (
            <div
              onClick={() => window.open(message.file_url!, "_blank")}
              className="flex h-[120px] w-full flex-col items-center justify-center gap-1 hover:cursor-pointer"
            >
              <FileText className="text-white" size={40} />
              <Body5>PDF</Body5>
            </div>
          ) : (
            <Image
              width={300}
              height={200}
              alt={message.file_url ?? ""}
              unoptimized
              src={message.file_url!}
              onClick={() => window.open(message.file_url!, "_blank")}
              className="h-[200px] w-full rounded-lg object-cover pt-1 hover:cursor-pointer"
            />
          )}
          <div>
            <Body3 className="mb-4 mt-1 text-wrap break-words">
              {message.content}
            </Body3>
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
          </div>
        </figure>
      ) : (
        <figure
          key={message.id}
          className={cn(
            "relative mt-5 max-w-[70%] rounded-lg bg-neutral-400 px-2 py-1 text-white",
            participants &&
              participants.findIndex((i) => i.id === message.sender_id) !==
                -1 &&
              (participants[
                participants.findIndex((i) => i.id === message.sender_id)
              ].role === "CUSTOMER"
                ? "!bg-neutral-400"
                : "!bg-[#6099FF]"),
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
          {message.file_url?.endsWith("pdf") ? (
            <div
              onClick={() => window.open(message.file_url!, "_blank")}
              className="flex h-[120px] w-full flex-col items-center justify-center gap-1 hover:cursor-pointer"
            >
              <FileText className="text-white" size={40} />
              <Body5>PDF</Body5>
            </div>
          ) : (
            <Image
              width={300}
              height={200}
              alt={message.file_url ?? ""}
              unoptimized
              src={message.file_url!}
              onClick={() => window.open(message.file_url!, "_blank")}
              className="h-[200px] w-full rounded-lg object-cover pt-1 hover:cursor-pointer"
            />
          )}
          <div>
            <Body3 className="mb-4 mt-1 text-wrap break-words">
              {message.content}
            </Body3>
          </div>
        </figure>
      )}
    </>
  );
};
