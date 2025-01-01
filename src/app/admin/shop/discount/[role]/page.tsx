import { findDiscountByRole } from "@/utils/database/discount.query";
import { Role } from "@prisma/client";
import { notFound } from "next/navigation";
import { DiscountForm } from "./components/DiscountForm";

export default async function DiscountEdit({
  params,
}: {
  params: Promise<{ role: Role }>;
}) {
  const { role } = await params;
  if (!Object.keys(Role).includes(role)) return notFound();
  const discount = await findDiscountByRole(role);

  return <DiscountForm discount={discount} role={role} />;
}
