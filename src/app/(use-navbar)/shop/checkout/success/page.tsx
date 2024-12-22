import { buttonVariants } from "@/components/ui/button";
import { H2 } from "@/components/ui/text";
import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link";

export default async function SuccessPage() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-2 text-black">
      <CheckCircle2Icon
        className="text-green-500"
        size={124}
        strokeWidth={0.75}
      />
      <H2>Berhasil checkout</H2>
      <Link
        href={"/account/order-history"}
        className={buttonVariants({ variant: "default" })}
      >
        Lihat riwayat
      </Link>
    </div>
  );
}
