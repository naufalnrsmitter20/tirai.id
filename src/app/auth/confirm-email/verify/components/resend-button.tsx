"use client";

import { requestVerificationMail } from "@/actions/mail";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { toast } from "sonner";

export const ResendVerificationMailButton: FC<{ email: string }> = ({
  email,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant={"default"}
      disabled={loading}
      className="w-full"
      onClick={async () => {
        setLoading(true);

        const loadingToast = toast.loading("Loading...");

        const { error } = await requestVerificationMail({
          userEmail: email,
        });

        if (error) {
          toast.error(error.message, { id: loadingToast });
          return setLoading(false);
        }

        toast.success("Berhasil mengirim ulang email verifikasi!", {
          id: loadingToast,
        });
        return setLoading(false);
      }}
    >
      Kirim ulang
    </Button>
  );
};
