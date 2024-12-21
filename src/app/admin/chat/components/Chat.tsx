"use client";

import { findChatById, getChatUsers, setReadMessage } from "@/actions/chat";
import { Button } from "@/components/ui/button";
import { Body2, Body3 } from "@/components/ui/text";
import { Message, useMessage } from "@/hooks/use-message";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { ChatUser } from "@/types/entityRelations";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { MessagesMap } from "@/components/widget/Chat/MessagesMap";
import { SendFileDialog } from "@/components/widget/Chat/dialog/SendFileDialog";
import { MessageForm } from "./MessageForm";
import { SearchBar } from "./SearchBar";

export const ChatInterface = ({
  conversation,
  recipients,
}: {
  conversation: Message[];
  recipients: ChatUser[];
}) => {
  const {
    addMessage,
    hasMore,
    messages,
    page,
    activeChat,
    setMessages,
    setActiveChat,
    setPage,
    setHasMore,
    participants,
    setParticipants,
    addParticipant,
  } = useMessage();

  const [filteredConvo, setFilteredConvo] = useState<Message[]>(conversation);
  const [, setFilterTerm] = useState<string | null>(null);
  const client = supabaseBrowser();
  const [file, setFile] = useState<File | undefined | null>(null);
  const { data: session } = useSession();
  const [isFocused, setFocus] = useState<boolean>();

  const { ref, inView } = useInView();
  const isMobile = useIsMobile(390);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReadMessage = async (activeChat: string) => {
    if (
      messages.filter((i) => !i.is_read && i.sender_id !== session?.user?.id)
        .length > 0
    ) {
      await setReadMessage(activeChat);
    }
  };

  useEffect(() => {
    if (activeChat) {
      setPage(2);
      setParticipants([]);
      setMessages([]);
      handleReadMessage(activeChat);
      findChatById(activeChat).then((i) => {
        const res = i.data?.data ?? [];
        const count = i.data?.count ?? 0;
        const userIds = [...new Set(res.map((item) => item.customer_id))];
        getChatUsers(userIds).then((i) => {
          setParticipants(i.data ?? []);
        });
        setMessages(res);
        if (messages.length < count) setHasMore(true);
        else setHasMore(false);
      });
      client
        .channel(activeChat)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            table: "messages",
            schema: "public",
          },
          (payload) => {
            const message = payload.new as Message;
            if (activeChat === message.customer_id) {
              if (
                participants.map((i) => i.id).indexOf(message.sender_id) === -1
              ) {
                getChatUsers([message.sender_id]).then((i) => {
                  addParticipant(i.data ?? []);
                });
              }
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
            if (activeChat === message.customer_id) {
              setMessages((prev) => {
                const list = prev;
                const index = list.findIndex((i) => i.id === message.id);
                list[index] = message;
                return list;
              });
            }
          },
        )
        .subscribe();
    }
  }, [activeChat]);

  useEffect(() => {
    client
      .channel("public:users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          setFilteredConvo((prev) => {
            const list = prev;
            const index = list.findIndex(
              (i) => i.customer_id === (payload.new as Message).customer_id,
            );
            if (index === -1) return [payload.new as Message, ...prev];
            list[index] = payload.new as Message;
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

  const handleFiltering: ChangeEventHandler<HTMLInputElement> = (e) => {
    const searchTerm = e.target.value ?? "";
    setFilterTerm(searchTerm);
    const filteredItems = conversation.filter((convo) =>
      recipients
        .find((j) => j.id === convo.customer_id)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );

    setFilteredConvo(filteredItems);
  };

  useEffect(() => {
    if (inView && activeChat) {
      findChatById(activeChat, page).then((res) => {
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

  const handleConversationClick = (customerId: string) => {
    if (activeChat) {
      client.removeChannel(client.channel(activeChat));
    }
    setActiveChat(customerId);
  };

  useEffect(() => {
    if (activeChat && isFocused) {
      handleReadMessage(activeChat);
    }
  }, [messages, isFocused]);

  if (session?.user === undefined) return <></>;

  return (
    <>
      <div className="hidden h-[600px] w-full grid-cols-[25%_75%] overflow-hidden rounded-lg border border-neutral-300 text-black sm:grid">
        <SearchBar
          activeChat={activeChat}
          filteredConvo={filteredConvo}
          handleConversationClick={handleConversationClick}
          handleFiltering={handleFiltering}
          recipients={recipients}
          session={session}
        />
        <div className="h-full w-full">
          {!activeChat && (
            <div className="flex h-full w-full items-center justify-center">
              <Body3>Buka Pesan</Body3>
            </div>
          )}
          {activeChat && (
            <div className="relative h-full w-full">
              <div className="inline-flex h-16 w-full items-center gap-2 border-b border-b-neutral-200 bg-white px-4 py-3">
                <div className="inline-flex aspect-square h-full items-center justify-center rounded-full bg-purple-400 text-white">
                  {recipients
                    .find((j) => j.id === activeChat)
                    ?.name[0].toUpperCase()}
                </div>
                <Body2 className="text-black">
                  {recipients.find((j) => j.id === activeChat)?.name}
                </Body2>
              </div>
              <div className="relative z-0 flex h-[455px] min-h-max w-full flex-col-reverse gap-y-1 overflow-y-scroll px-4 pt-5">
                <div ref={messagesEndRef} />
                <MessagesMap
                  messages={messages}
                  session={session}
                  participants={participants}
                />
                {messages.length > 0 && hasMore && (
                  <div className="w-full text-black" ref={ref}>
                    Loading...
                  </div>
                )}
              </div>
              <MessageForm
                activeChat={activeChat}
                session={session}
                file={file}
                setFile={setFile}
              />
            </div>
          )}
          {activeChat && (
            <SendFileDialog
              file={file}
              setFile={setFile}
              customerId={activeChat}
              senderId={session.user.id}
            />
          )}
        </div>
      </div>
      <div className="relative mb-0 flex h-[95vh] w-full overflow-hidden rounded-lg border border-neutral-200 sm:hidden">
        {!activeChat && (
          <SearchBar
            activeChat={activeChat}
            filteredConvo={filteredConvo}
            handleConversationClick={handleConversationClick}
            handleFiltering={handleFiltering}
            recipients={recipients}
            session={session}
          />
        )}
        {activeChat && (
          <div className="relative h-full w-full">
            <div className="flex h-16 w-full items-center gap-2 border-b border-b-neutral-200 bg-white px-4 py-3">
              <Button
                variant={"link"}
                className="py-1 pe-1 ps-0"
                onClick={() => setActiveChat(undefined)}
              >
                <ArrowLeft className="text-black" />
              </Button>
              <div className="inline-flex aspect-square h-full items-center justify-center rounded-full bg-purple-400 text-white">
                {recipients
                  .find((j) => j.id === activeChat)
                  ?.name[0].toUpperCase()}
              </div>
              <Body2 className="text-black">
                {recipients.find((j) => j.id === activeChat)?.name}
              </Body2>
            </div>
            <div className="relative z-0 flex h-[90%] min-h-max w-full flex-col-reverse gap-y-1 overflow-y-scroll px-4 pb-[72px] pt-5">
              <div ref={messagesEndRef} />
              <MessagesMap messages={messages} session={session} />
              {messages.length > 0 && isMobile && hasMore && (
                <div className="w-full text-black" ref={ref}>
                  Loading...
                </div>
              )}
            </div>
            <MessageForm
              activeChat={activeChat}
              session={session}
              file={file}
              setFile={setFile}
            />
          </div>
        )}
        {activeChat && (
          <SendFileDialog
            file={file}
            setFile={setFile}
            customerId={activeChat}
            senderId={session.user.id}
          />
        )}
      </div>
    </>
  );
};
