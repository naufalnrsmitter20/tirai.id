import { notFound } from "next/navigation";
import CustomRequestForm from "../_components/CustomRequestForm";
import prisma from "@/lib/prisma";

export default async function UpdateCustomRequest({
  params,
}: Readonly<{
  params: Promise<{ id?: string }>;
}>) {
  const { id } = await params;

  const customRequest = await prisma.customRequest.findUnique({
    where: { id },
    include: { user: { select: { email: true } } },
  });
  if (!customRequest) return notFound();

  return <CustomRequestForm updateData={customRequest} />;
}
