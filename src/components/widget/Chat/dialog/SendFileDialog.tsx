import { sendFile } from "@/actions/chat";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Body4 } from "@/components/ui/text";
import { File } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";

export const SendFileDialog = ({
  file,
  setFile,
  customerId,
}: {
  file: File | null | undefined;
  setFile: Dispatch<SetStateAction<File | null | undefined>>;
  customerId: string;
  senderId: string;
}) => {
  const [message, setMessage] = useState<string | null | undefined>();
  const [isSending, setSending] = useState(false);

  const handleSendFile = async () => {
    if (file) {
      setSending(true);
      const formData = new FormData();
      if (message) formData.append("message", message);
      formData.append("file", file);
      await sendFile(formData, customerId);
      setSending(false);
      setFile(undefined);
      setMessage(undefined);
    }
  };

  return (
    <Dialog
      open={Boolean(file)}
      onOpenChange={(open) => {
        if (!open) {
          setFile(undefined);
          setMessage(undefined);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kirim Pesan</DialogTitle>
        </DialogHeader>
        <div className="flex h-[30vh] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-neutral-100">
          {file?.type.startsWith("image/") ? (
            <Image
              src={URL.createObjectURL(file)}
              width={400}
              height={300}
              alt={"Image"}
              className="aspect-auto h-full max-w-full object-contain"
            />
          ) : (
            <>
              <File />
              <Body4>{file?.name}</Body4>
            </>
          )}
        </div>
        <Input
          placeholder="Tulis pesan anda"
          onChange={(e) => {
            e.preventDefault();
            setMessage(e.target.value);
          }}
          defaultValue={message ?? ""}
        />
        <div className="flex w-full justify-end gap-1">
          <Button
            variant={"destructive"}
            onClick={() => {
              setFile(undefined);
              setMessage(undefined);
            }}
          >
            Batalkan
          </Button>
          <Button disabled={isSending} onClick={handleSendFile}>
            Kirim
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
