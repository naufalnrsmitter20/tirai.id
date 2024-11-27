import { buttonVariants } from "@/components/ui/button";
import { Body3, H2 } from "@/components/ui/text";
import { COLORS } from "@/constants/color";
import prisma from "@/lib/prisma";
import { ArrowLeft, Check, ShieldClose } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResendVerificationMailButton } from "./components/resend-button";

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token: tokenParam } = await searchParams;

  const token = await prisma.token.findUnique({
    where: { token: tokenParam },
    select: { user: true, expiry_date: true },
  });

  if (!token || !token.user) return notFound();

  const now = new Date();
  // Check if the token is invalid
  const isInvalid = now >= token.expiry_date;

  if (!isInvalid)
    await prisma.user.update({
      where: { id: token.user.id },
      data: { is_verified: true },
    });

  return (
    <section className="flex flex-col items-center text-black">
      <div className="mb-8 rounded-full bg-primary-100 p-[1.125rem]">
        {isInvalid ? (
          <ShieldClose color={COLORS.primary[900]} />
        ) : (
          <Check color={COLORS.primary[900]} />
        )}
      </div>
      <div className="flex flex-col items-center">
        <H2 className="mb-3">
          {isInvalid ? "Token Kadaluarsa" : "Berhasil Memverifikasi"}
        </H2>
        <Body3 className="mb-[3.375rem] text-center text-neutral-500">
          {isInvalid ? (
            "Token yang anda gunakan telah kadaluarsa, mohon untuk mencoba lagi dengan klik tombol dibawah"
          ) : (
            <>
              Berhasil memverifikasi akun dengan email <br />
              <span className="font-medium text-black">{token.user.email}</span>
            </>
          )}
        </Body3>
        {isInvalid ? (
          <ResendVerificationMailButton email={token.user.email} />
        ) : (
          <Link
            href={"/auth/login"}
            className={buttonVariants({ variant: "link", size: "link" })}
          >
            <ArrowLeft /> Kembali ke halaman masuk
          </Link>
        )}
      </div>
    </section>
  );
}
