"use client";

import { requestVerificationMail } from "@/actions/mail";
import { Button } from "@/components/ui/button";
import { Body3, H2 } from "@/components/ui/text";
import { COLORS } from "@/constants/color";
import { Mail } from "lucide-react";
import { notFound, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function ConfirmEmail() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  if (!email || !z.string().email().safeParse(email).success) return notFound();

  return (
    <section className="flex flex-col items-center">
      <div className="justify center mb-8 flex max-w-[68px] items-center rounded-full bg-primary-50 p-[1.125rem]">
        <Mail color={COLORS.primary[900]} />
      </div>
      <div className="flex flex-col text-black">
        <H2 className="mb-3 w-full text-center">Cek Email Anda</H2>
        <Body3 className="mb-[3.375rem] text-center text-neutral-500">
          Konfirmasi email anda melalui email yang terkirim melalui <br />
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
        </Body3>
      </div>
    </section>
  );
}
