import { Body3, H2 } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Discount } from "@prisma/client";
import { BadgePercent } from "lucide-react";
import Link from "next/link";

export const RoleCard = ({
  role,
  discount,
}: {
  role: string;
  discount?: Discount;
}) => {
  return (
    <Link
      href={`/admin/shop/discount/${role}`}
      key={role}
      className="flex w-full items-center gap-4 rounded-lg border border-neutral-100 px-3 py-2"
    >
      <div className="flex aspect-square w-[70px] items-center justify-center rounded-full bg-blue-500 p-3 text-white">
        <BadgePercent size={40} />
      </div>
      <div>
        <H2>{role}</H2>
        <Body3
          className={cn(discount && "text-red-500", discount && "font-bold")}
        >
          {discount
            ? `Diskon ${discount.discount_in_percent.toFixed(1)}%`
            : "Diskon Belum Diatur"}
        </Body3>
      </div>
    </Link>
  );
};
