import { buttonVariants } from "@/components/ui/button";
import { Body3, H2 } from "@/components/ui/text";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RegisterForm } from "./forms/register-form";

export const metadata: Metadata = {
  title: "Buat akun anda",
};

export default function Register() {
  return (
    <section className="flex w-full max-w-[1104px] items-center justify-between p-6 sm:p-12">
      <div className="block w-full max-w-full text-black md:max-w-[440px]">
        <H2 className="mb-3">Daftarkan Akun Anda</H2>
        <Body3 className="mb-[3.375rem] text-neutral-500">
          Sudah mempunyai akun?{" "}
          <Link
            href={"/auth/login"}
            className={buttonVariants({ variant: "link", size: "link" })}
          >
            Masuk
          </Link>
        </Body3>

        <RegisterForm />
      </div>
      <Image
        src={"/assets/login.png"}
        alt="Registration Image"
        width={402}
        height={464}
        className="pointer-events-none hidden md:block"
      />
    </section>
  );
}
