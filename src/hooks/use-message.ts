import { Database } from "@/types/chat.types";
import { ChatUser } from "@/types/entityRelations";
import { useState } from "react";

export type Message = Database["public"]["Tables"]["messages"]["Row"];

const useMessage = () => {
  const [activeChat, setActiveChat] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(2);
  const [messages, setMessages] = useState<Message[]>([]);
  const [actionMessage, setActionmessage] = useState<Message | undefined>(
    undefined,
  );
  const [participants, setParticipants] = useState<ChatUser[]>([]);

  const states = {
    hasMore,
    activeChat,
    page,
    messages,
    actionMessage,
    setPage,
    setHasMore,
    participants,
    setParticipants,
    addParticipant: (user: ChatUser[]) => {
      setParticipants((prev) => [...prev, ...user]);
    },
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
