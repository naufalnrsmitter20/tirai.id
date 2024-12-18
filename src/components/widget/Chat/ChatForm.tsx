import { sendMessage } from "@/actions/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { File, Send } from "lucide-react";
import { Session } from "next-auth";
import { Dispatch, SetStateAction, useRef } from "react";

export const ChatForm = ({
  session,
  activeChat,
  setFile,
}: {
  session: Session;
  activeChat: string;
  setFile: Dispatch<SetStateAction<File | null | undefined>>;
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSendMessage = async (data: FormData) => {
    if (activeChat && session && session.user) {
      const message = data.get("message") as string | null | undefined;
      if (message && message !== "") {
        await sendMessage(data, activeChat);
        formRef.current?.reset();
      }
    }
  };

  return (
    <div className="absolute bottom-0 left-0 z-10 flex h-[70px] w-full items-center gap-2 rounded-b-lg border border-t border-t-neutral-200 bg-white px-2 py-1">
      <div className="!aspect-square w-[50px]">
        <label
          htmlFor="fileUpload"
          className="inline-flex aspect-square w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-900 text-base font-medium text-white transition-colors duration-300 hover:cursor-pointer hover:bg-primary-950 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:border-neutral-400 disabled:bg-neutral-400 disabled:text-white"
        >
          <File />
        </label>
        <input
          type="file"
          id="fileUpload"
          className="absolute z-[-1] h-[0.1px] w-[0.1px] overflow-hidden opacity-0"
          accept="image/*,application/pdf"
          onChange={(e) => {
            e.preventDefault();
            setFile(e.target.files?.[0]);
          }}
        />
      </div>
      <form
        action={handleSendMessage}
        ref={formRef}
        className="flex w-full items-center gap-2"
      >
        <Input
          name="message"
          placeholder="Tulis pesan anda"
          autoComplete="off"
          className="!w-full !flex-grow"
        />
        <Button className="!aspect-square w-[50px] flex-shrink" type="submit">
          <Send />
        </Button>
      </form>
    </div>
  );
};
