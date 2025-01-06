import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReferalForm from "../components/ReferalForm";

export default async function UpdateUser({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  if (!id || isNaN(Number(id))) return notFound();

  const referal = await prisma.referal.findUnique({
    where: { id: Number(id) },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!referal) return notFound();

  const affiliators = await prisma.user.findMany({
    where: { role: "AFFILIATE" },
    select: { id: true, name: true, email: true },
  });

  return <ReferalForm updateData={referal} affiliators={affiliators} />;
}
