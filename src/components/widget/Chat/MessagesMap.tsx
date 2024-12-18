import { FileMessageCard } from "@/components/widget/Chat/FileMessageCard";
import { MessageCard } from "@/components/widget/Chat/MessageCard";
import { Message } from "@/hooks/use-message";
import { strDateToEpoch } from "@/lib/utils";
import { Session } from "next-auth";
import React from "react";
import { DateSeparator } from "./DateSpearator";

export const MessagesMap = ({
  messages,
  session,
}: {
  messages: Message[];
  session: Session;
}) => {
  return (
    <>
      {messages.map((i, idx) =>
        idx + 1 < messages.length ? (
          strDateToEpoch(messages[idx + 1].created_at) ===
          strDateToEpoch(i.created_at) ? (
            i.file_url ? (
              <FileMessageCard
                message={i}
                key={i.id}
                isUser={session?.user?.id === i.sender_id}
              />
            ) : (
              <MessageCard
                message={i}
                key={i.id}
                isUser={session?.user?.id === i.sender_id}
              />
            )
          ) : i.file_url ? (
            <React.Fragment key={i.id}>
              <FileMessageCard
                message={i}
                isUser={session?.user?.id === i.sender_id}
              />
              <DateSeparator
                messageDate={i.created_at}
                key={`${i.id}-${i.created_at}`}
              />
            </React.Fragment>
          ) : (
            <React.Fragment key={i.id}>
              <MessageCard
                message={i}
                isUser={session?.user?.id === i.sender_id}
              />
              <DateSeparator
                messageDate={i.created_at}
                key={`${i.id}-${i.created_at}`}
              />
            </React.Fragment>
          )
        ) : i.file_url ? (
          <React.Fragment key={i.id}>
            <FileMessageCard
              message={i}
              isUser={session?.user?.id === i.sender_id}
            />
            <DateSeparator
              messageDate={i.created_at}
              key={`${i.id}-${i.created_at}`}
            />
          </React.Fragment>
        ) : (
          <React.Fragment key={i.id}>
            <MessageCard
              message={i}
              isUser={session?.user?.id === i.sender_id}
            />
            <DateSeparator
              messageDate={i.created_at}
              key={`${i.id}-${i.created_at}`}
            />
          </React.Fragment>
        ),
      )}
    </>
  );
};
