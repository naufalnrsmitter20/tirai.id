import { buttonVariants } from "@/components/ui/button";
import { Body3, H2 } from "@/components/ui/text";
import { COLORS } from "@/constants/color";
import prisma from "@/lib/prisma";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token: tokenParam } = await searchParams;

  const token = await prisma.token.findUnique({
    where: { token: tokenParam },
    select: { user: true },
  });

  if (!token || !token.user) return notFound();

  await prisma.user.update({
    where: { id: token.user.id },
    data: { is_verified: true },
  });

  return (
    <section className="flex flex-col items-center text-black">
      <div className="mb-8 rounded-full bg-primary-100 p-[1.125rem]">
        <Check color={COLORS.primary[900]} />
      </div>
      <div className="flex flex-col">
        <H2 className="mb-3">Cek Email Anda</H2>
        <Body3 className="mb-[3.375rem] text-center text-neutral-500">
          Berhasil memverifikasi akun dengan email <br />
          <span className="font-medium text-black">{token.user.email}</span>
        </Body3>
        <Link
          href={"/auth/login"}
          className={buttonVariants({ variant: "link", size: "link" })}
        >
          <ArrowLeft /> Kembali ke halaman masuk
        </Link>
      </div>
    </section>
  );
}
