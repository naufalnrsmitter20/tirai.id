"use client";

import { requestResetPasswordMail } from "@/actions/mail";
import { Button } from "@/components/ui/button";
import { Body3, H2 } from "@/components/ui/text";
import { COLORS } from "@/constants/color";
import { Mail } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";
import { toast } from "sonner";

export const HasSentWarning: FC<{
  email: string;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}> = ({ email, loading, setLoading }) => {
  return (
    <>
      <div className="justify center mb-8 flex max-w-[68px] items-center rounded-full bg-primary-50 p-[1.125rem]">
        <Mail color={COLORS.primary[900]} />
      </div>
      <div className="flex flex-col text-black">
        <H2 className="mb-3 w-full text-center">Cek Email Anda</H2>
        <Body3 className="mb-[3.375rem] text-center text-neutral-500">
          Kami telah mengirimkan email untuk reset kata sandi ke <br />
          <span className="font-medium text-black">{email}</span>
        </Body3>
        <Body3 className="mb-[3.375rem] text-center text-neutral-500">
          Belum menerima email?{" "}
          <Button
            variant={"link"}
            size={"link"}
            disabled={loading}
            onClick={async () => {
              setLoading(true);

              const loadingToast = toast.loading("Loading...");

              const { error } = await requestResetPasswordMail(email);

              if (error) {
                toast.error(error.message, { id: loadingToast });
                return setLoading(false);
              }

              toast.success("Berhasil mengirim ulang email reset kata sandi", {
                id: loadingToast,
              });
              return setLoading(false);
            }}
          >
            Kirim ulang
          </Button>
        </Body3>
      </div>
    </>
  );
};
