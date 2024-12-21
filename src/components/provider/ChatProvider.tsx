"use client";

import { findChatById, setReadMessage } from "@/actions/chat";
import { Message, useMessage } from "@/hooks/use-message";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";
import { MessageSquareMore, X } from "lucide-react";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ChatForm } from "../widget/Chat/ChatForm";
import { SendFileDialog } from "../widget/Chat/dialog/SendFileDialog";
import { MessagesMap } from "../widget/Chat/MessagesMap";

export const ChatProvider = ({ session }: { session: Session }) => {
  const [isOpen, setOpen] = useState(false);
  const client = supabaseBrowser();
  const {
    messages,
    setMessages,
    addMessage,
    page,
    setPage,
    setHasMore,
    hasMore,
  } = useMessage();
  const { inView, ref } = useInView();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null | undefined>();
  const [isFocused, setFocus] = useState<boolean>();

  const handleReadMessage = async (activeChat: string) => {
    if (
      messages.filter((i) => !i.is_read && i.sender_id !== session?.user?.id)
        .length > 0
    ) {
      await setReadMessage(activeChat);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    client
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          table: "messages",
          schema: "public",
        },
        (payload) => {
          const message = payload.new as Message;
          if (message.customer_id === session.user?.id) {
            addMessage(message);
            scrollToBottom();
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          table: "messages",
          schema: "public",
        },
        (payload) => {
          const message = payload.new as Message;
          if (message.customer_id === session.user?.id)
            setMessages((prev) => {
              const list = prev;
              const index = list.findIndex((i) => i.id === message.id);
              list[index] = message;
              return list;
            });
        },
      )
      .subscribe();
    window.addEventListener("focus", () => {
      setFocus(true);
    });
    window.addEventListener("blur", () => {
      setFocus(false);
    });
    return () => {
      window.removeEventListener("focus", () => {
        setFocus(true);
      });
      window.removeEventListener("blur", () => {
        setFocus(false);
      });
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    findChatById(session?.user?.id!).then((i) => {
      const res = i.data?.data ?? [];
      const count = i.data?.count ?? 0;
      setMessages(res);
      if (messages.length < count) setHasMore(true);
      else setHasMore(false);
    });
  }, []);

  useEffect(() => {
    if (inView) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      findChatById(session.user?.id!, page).then((res) => {
        const messagesRes = res.data?.data ?? [];
        const count = res.data?.count ?? 0;
        setMessages((prev) => [...prev, ...messagesRes]);
        if (messages.length < count) {
          setHasMore(true);
          setPage((prev) => prev + 1);
        } else setHasMore(false);
      });
    }
  }, [inView]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    if (isOpen && isFocused) handleReadMessage(session.user?.id!);
  }, [messages, isFocused]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    if (isOpen && isFocused) handleReadMessage(session.user?.id!);
  }, [isOpen, isFocused]);

  if (session.user === undefined) return <></>;

  return (
    <>
      {file && isOpen && (
        <div className="relative z-[9999999999] h-full w-full">
          <SendFileDialog
            customerId={session.user.id}
            file={file}
            senderId={session.user.id}
            setFile={setFile}
          />
        </div>
      )}
      <button
        onClick={() => setOpen(!isOpen)}
        className={cn(
          "fixed bottom-[20px] right-[20px] z-30 inline-flex aspect-square h-12 items-center justify-center overflow-hidden rounded-full bg-primary-600 p-4 text-white transition-all duration-300 sm:h-14",
        )}
      >
        {isOpen ? <X size={20} /> : <MessageSquareMore size={20} />}
      </button>
      {isOpen && (
        <div className="fixed !bottom-[10%] !right-[5%] z-30 !h-[80vh] !w-[90vw] sm:bottom-16 sm:right-20 sm:h-[70vh] sm:w-[40vw] sm:-translate-x-0 sm:-translate-y-0">
          <div className="h-full w-full overflow-hidden rounded-lg border border-neutral-200 bg-blue-50">
            <div className="flex h-[100%] w-full flex-col-reverse gap-1 overflow-y-scroll px-3 pb-[90px] pt-4">
              <div ref={messagesEndRef} />
              <MessagesMap session={session} messages={messages} />
              {messages.length > 0 && hasMore && (
                <div className="w-full text-black" ref={ref}>
                  Loading...
                </div>
              )}
            </div>
          </div>
          <ChatForm
            activeChat={session.user.id}
            session={session}
            setFile={setFile}
          />
        </div>
      )}
    </>
  );
};
