import { getServerSession } from "@/lib/next-auth";
import { Form } from "./components/Form";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Page() {
  const session = await getServerSession();

  if (!session?.user) return;

  const [models, bahans, addresses] = await prisma.$transaction([
    prisma.model.findMany({
      select: {
        id: true,
        description: true,
        image: true,
        model: true,
      },
    }),
    prisma.material.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        supplier_price: true,
      },
    }),
    prisma.shippingAddress.findMany({
      where: { user_id: session.user.id },
      select: {
        id: true,
        recipient_name: true,
        recipient_phone_number: true,
        street: true,
        village: true,
        district: true,
        city: true,
        province: true,
        postal_code: true,
        additional_info: true,
        is_primary: true,
      },
    }),
  ]);

  if (models.length < 1 || bahans.length < 1) return notFound();

  return (
    <Form
      models={models}
      bahans={bahans}
      addresses={addresses}
      user={session.user}
    />
  );
}
