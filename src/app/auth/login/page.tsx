import { buttonVariants } from "@/components/ui/button";
import { Body3, H2 } from "@/components/ui/text";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./forms/login-form";

export const metadata: Metadata = {
  title: "Login ke Akun Tirai.id",
};

export default function Login() {
  return (
    <section className="flex w-full max-w-[1104px] items-center justify-between p-6 sm:p-12">
      <div className="block w-full max-w-full text-black md:max-w-[440px]">
        <H2 className="mb-3">Masuk ke Akun Anda</H2>
        <Body3 className="mb-[3.375rem] text-neutral-500">
          Belum mempunyai akun?{" "}
          <Link
            href={"/auth/register"}
            className={buttonVariants({ variant: "link", size: "link" })}
          >
            Daftar
          </Link>
        </Body3>

        <LoginForm />
      </div>
      <Image
        src={"/assets/login.png"}
        alt="Login Image"
        width={502}
        height={648}
        className="pointer-events-none hidden md:block"
      />
    </section>
  );
}
