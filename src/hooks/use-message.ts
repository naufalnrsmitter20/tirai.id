import { Database } from "@/types/chat.types";
import { useState } from "react";

export type Message = Database["public"]["Tables"]["messages"]["Row"];
const LIMIT_MESSAGES = 20;

const useMessage = () => {
  const [activeChat, setActiveChat] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(2);
  const [messages, setMessages] = useState<Message[]>([]);
  const [actionMessage, setActionmessage] = useState<Message | undefined>(
    undefined,
  );

  const states = {
    hasMore,
    activeChat,
    page,
    messages,
    actionMessage,
    setPage,
    setHasMore,
    setActiveChat: (id: string | undefined) => {
      setActiveChat(id);
    },
    setActionMessage: (message: Message) => {
      setActionmessage(message);
    },
    addMessage: (message: Message) => {
      setMessages((prev) => {
        if (!prev.find((i) => i.id === message.id)) return [message, ...prev];
        return prev;
      });
    },
    setMessages,
  };
  return states;
};

export { useMessage };
