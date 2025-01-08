import { PageContainer } from "@/components/layout/PageContainer";
import prisma from "@/lib/prisma";
import { findDiscountByRole } from "@/utils/database/discount.query";
import { notFound } from "next/navigation";
import { Form } from "./components/Form";

export default async function Calculator() {
  const [models, materials] = await prisma.$transaction([
    prisma.model.findMany({
      select: {
        id: true,
        description: true,
        image: true,
        name: true,
      },
    }),
    prisma.material.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        supplier_price: true,
        image: true,
      },
    }),
  ]);

  const customerDiscount = await findDiscountByRole("CUSTOMER");
  const supplierDiscount = await findDiscountByRole("SUPPLIER");

  if (models.length < 1 || materials.length < 1) return notFound();

  return (
    <PageContainer>
      <Form
        models={models}
        materials={materials}
        customerDiscount={customerDiscount}
        supplierDiscount={supplierDiscount}
      />
    </PageContainer>
  );
}
