import { buttonVariants } from "@/components/ui/button";
import { Body3, H1, H2 } from "@/components/ui/text";
import { findDiscounts } from "@/utils/database/discount.query";
import { Role } from "@prisma/client";
import { BadgePercent, Plus } from "lucide-react";
import Link from "next/link";
import { RoleCard } from "./components/RoleCard";

export default async function DiscountManagement() {
  const discounts = await findDiscounts();
  const roles = Object.keys(Role);

  return (
    <div className="flex flex-col">
      <H1 className="mb-8 text-black">Manajemen Diskon</H1>
      <div className="mb-2 grid grid-cols-2 gap-2 text-black">
        {roles.map((i) => (
          <RoleCard
            role={i}
            discount={discounts.find((j) => j.target_role === i)}
          />
        ))}
      </div>
      {discounts.length === 0 && (
        <Body3 className="text-neutral-500">Belum ada diskon apapun...</Body3>
      )}
    </div>
  );
}
