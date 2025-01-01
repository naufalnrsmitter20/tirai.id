import { FileMessageCard } from "@/components/widget/Chat/FileMessageCard";
import { MessageCard } from "@/components/widget/Chat/MessageCard";
import { Message } from "@/hooks/use-message";
import { strDateToEpoch, cn } from "@/lib/utils";
import { Session } from "next-auth";
import React from "react";
import { DateSeparator } from "./DateSpearator";
import { ChatProduct, ChatUser } from "@/types/entityRelations";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProductMessageCard } from "./ProductMessage";
import moment from "moment-timezone";

export const MessagesMap = ({
  messages,
  session,
  participants,
  products,
}: {
  messages: Message[];
  session: Session;
  participants?: ChatUser[];
  products: ChatProduct[];
}) => {
  const renderMessage = (message: Message, isUser: boolean) => {
    const baseClasses = "flex w-full gap-2 px-2 py-1";
    const messageWrapperClasses = cn(
      baseClasses,
      isUser ? "flex-row-reverse" : "flex-row",
    );
    const date = moment(message.created_at + "Z")
      .tz("Asia/Jakarta")
      .toDate();

    const product = products.find((i) => i.id === message.product_id);

    return (
      <div className={messageWrapperClasses}>
        {/* Avatar */}
        <Avatar className="h-8 w-8">
          {isUser ? (
            <AvatarFallback className="bg-primary-100 text-primary-600">
              {session.user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          ) : (
            <AvatarFallback className="bg-secondary-100 text-secondary-600">
              A
            </AvatarFallback>
          )}
        </Avatar>

        {/* Message Content */}
        <div
          className={cn(
            "min-w-[35%] max-w-[70%] sm:min-w-[25%] sm:max-w-[50%]",
            isUser ? "items-end" : "items-start",
          )}
        >
          {/* Message with file */}
          {(message.file_url || (message.file_url && message.content)) && (
            <FileMessageCard
              message={message}
              participants={participants}
              isUser={isUser}
              className={cn(
                "rounded-xl p-3",
                isUser
                  ? "bg-primary-600 text-white"
                  : "bg-secondary-100 text-gray-900",
              )}
            />
          )}

          {/* Message with text only */}
          {message.content && !(message.file_url || message.product_id) && (
            <MessageCard
              message={message}
              participants={participants}
              isUser={isUser}
            />
          )}

          {/* Message with product */}
          {product &&
            message.product_id &&
            !(message.file_url || message.content) && (
              <ProductMessageCard
                isUser={isUser}
                message={message}
                product={product}
                participants={participants}
              />
            )}
          <div
            className={cn(
              "mt-1 text-xs text-gray-500",
              isUser ? "text-right" : "text-left",
            )}
          >
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDateSeparator = (date: string) => (
    <div className="relative py-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-sm text-gray-500">
          <DateSeparator messageDate={date} />
        </span>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "flex flex-col-reverse",
        window.location.pathname.includes("admin") ? "gap-4" : "gap-2",
      )}
    >
      {messages.map((message, idx) => {
        const isUser = session?.user?.id === message.sender_id;
        const nextMessage = messages[idx + 1];
        const showDateSeparator =
          !nextMessage ||
          strDateToEpoch(nextMessage.created_at) !==
            strDateToEpoch(message.created_at);

        return (
          <React.Fragment key={message.id}>
            {renderMessage(message, isUser)}
            {showDateSeparator && renderDateSeparator(message.created_at)}
          </React.Fragment>
        );
      })}
    </div>
  );
};
