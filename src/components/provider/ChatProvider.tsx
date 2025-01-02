"use client";

import { findChatById, getChatUsers, setReadMessage } from "@/actions/chat";
import { Message, useMessage } from "@/hooks/use-message";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";
import { MessageSquareMore, X, MessageCircle } from "lucide-react";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ChatForm } from "../widget/Chat/ChatForm";
import { SendFileDialog } from "../widget/Chat/dialog/SendFileDialog";
import { MessagesMap } from "../widget/Chat/MessagesMap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { findProductByIds } from "@/actions/products";

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
    products,
    setProducts,
    addProduct,
    participants,
    setParticipants,
    addParticipant,
  } = useMessage();
  const { inView, ref } = useInView();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null | undefined>();
  const [isFocused, setFocus] = useState<boolean>();
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const sendNotification = () => {
    if (audioRef?.current) {
      audioRef.current.play();
    }
    if (Notification.permission === "granted") {
      new Notification("You have a new notification!", {
        body: "New incoming message",
        icon: "/assets/logo.png",
      });
    }
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
          filter: `customer_id=eq.${session.user?.id}`,
        },
        (payload) => {
          const message = payload.new as Message;

          if (message.sender_id !== session.user?.id) {
            sendNotification();
          }

          if (message.customer_id === session.user?.id) {
            if (
              !products.find((i) => i.id === message.product_id) &&
              message.product_id
            ) {
              findProductByIds([message.product_id]).then((product) => {
                addProduct(product.data ?? []);
              });
            }
            if (!participants.find((i) => i.id === message.sender_id)) {
              getChatUsers([message.sender_id]).then((user) => {
                addParticipant(user.data ?? []);
              });
            }
            addMessage(message);
            scrollToBottom();
            setOpen(true);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          table: "messages",
          schema: "public",
          filter: `customer_id=eq.${session.user?.id}`,
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

    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Permission granted");
        }
      });
    }
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
      const productIds =
        (
          res.map((i) => {
            if (i.product_id) return i.product_id;
          }) as string[]
        ).filter((i) => Boolean(i)) ?? [];

      const userIds = res.map((i) => i.sender_id);

      getChatUsers(userIds).then((users) => {
        console.log(users.data ?? []);
        setParticipants(users.data ?? []);
      });

      findProductByIds([...new Set(productIds)]).then((products) => {
        setProducts(products.data ?? []);
        setMessages(res);
        if (messages.length < count) setHasMore(true);
        else setHasMore(false);
      });
    });
  }, []);

  useEffect(() => {
    if (inView) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      findChatById(session.user?.id!, page).then((res) => {
        const messagesRes = res.data?.data ?? [];
        const count = res.data?.count ?? 0;
        const productIds = messagesRes.map((i) => {
          if (i.product_id && !products.find((j) => j.id === i.product_id))
            return i.product_id;
        }) as string[];
        const userIds = messagesRes.map((i) => {
          if (!participants.find((j) => j.id === i.sender_id))
            return i.sender_id;
        }) as string[];

        if (productIds.length > 0) {
          findProductByIds(productIds).then((product) => {
            addProduct(product.data ?? []);
          });
        }
        if (userIds.length > 0) {
          getChatUsers(userIds).then((user) => {
            addParticipant(user.data ?? []);
          });
        }
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
          "fixed bottom-[20px] right-[20px] z-30 inline-flex aspect-square h-12 items-center justify-center overflow-hidden rounded-full bg-primary-600 p-4 text-white transition-all duration-300 hover:bg-primary-700 sm:h-14",
        )}
      >
        {isOpen ? <X size={20} /> : <MessageSquareMore size={20} />}
      </button>
      {isOpen && (
        <div className="fixed !bottom-[10%] !right-[5%] z-30 !h-[80vh] !w-[90vw] sm:bottom-16 sm:right-20 sm:h-[70vh] sm:w-[40vw] sm:-translate-x-0 sm:-translate-y-0">
          <Card className="flex h-full w-full flex-col overflow-hidden">
            <CardHeader className="border-b px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-primary-100">
                  <AvatarFallback className="bg-primary-100 text-primary-600">
                    <MessageCircle className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm">Chat Admin</CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Senin - Jumat, 09.00 - 17.00 WIB
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="flex h-full w-full flex-col-reverse gap-1 overflow-y-scroll px-3 pb-[90px] pt-4">
                <div ref={messagesEndRef} />
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                    <MessageCircle className="mb-3 h-12 w-12 text-primary-600" />
                    <h3 className="mb-2 text-base font-semibold">
                      Chat dengan Admin
                    </h3>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Silakan kirim pesan kepada admin kami untuk mendapatkan
                      bantuan
                    </p>
                  </div>
                ) : (
                  <>
                    <MessagesMap
                      session={session}
                      messages={messages}
                      products={products}
                      participants={participants}
                    />
                    {hasMore && (
                      <div
                        className="w-full text-center text-sm text-muted-foreground"
                        ref={ref}
                      >
                        Loading...
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>

            <ChatForm
              activeChat={session.user.id}
              session={session}
              setFile={setFile}
            />
          </Card>
        </div>
      )}
      <audio ref={audioRef} src="/notification.mp3" preload="auto">
        <track kind="captions" />
      </audio>
    </>
  );
};
