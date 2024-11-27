import { buttonVariants } from "@/components/ui/button";
import { Body3, Display } from "@/components/ui/text";
import { COLORS } from "@/constants/color";
import { ShieldClose } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for is not found.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <section className="flex w-full max-w-[380px] flex-col items-center">
        <div className="justify center mb-8 flex w-fit items-center rounded-full bg-primary-50 p-6">
          <ShieldClose color={COLORS.primary[900]} size={52} />
        </div>
        <div className="flex w-full flex-col items-center text-center text-black">
          <Display className="mb-3">404</Display>
          <Body3 className="mb-[3.375rem] text-neutral-500">
            Halaman yang anda cari tidak dapat ditemukan
          </Body3>
          <Link
            href={"/"}
            className={buttonVariants({
              variant: "default",
              className: "w-full",
            })}
          >
            Kembali ke beranda
          </Link>
        </div>
      </section>
    </main>
  );
}
