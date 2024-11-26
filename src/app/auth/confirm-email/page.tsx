import { Button } from "@/components/ui/button";
import { Body3, H2 } from "@/components/ui/text";
import { COLORS } from "@/constants/color";
import { Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { z } from "zod";

export default async function ConfirmEmail({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  if (!email || !z.string().email().safeParse(email).success) return notFound();

  return (
    <section className="flex flex-col items-center">
      <div className="justify center mb-8 flex max-w-[68px] items-center rounded-full bg-primary-50 p-[1.125rem]">
        <Mail color={COLORS.primary[900]} />
      </div>
      <div className="flex flex-col">
        <H2 className="mb-3 w-full text-center text-black">Cek Email Anda</H2>
        <Body3 className="mb-[3.375rem] text-center text-neutral-500">
          Konfirmasi email anda melalui email yang terkirim melalui <br />
          <span className="font-medium text-black">{email}</span>
        </Body3>
        <Body3 className="mb-[3.375rem] text-center text-neutral-500">
          Belum menerima email?{" "}
          <Button variant={"link"} size={"link"}>
            Kirim ulang
          </Button>
        </Body3>
      </div>
    </section>
  );
}
