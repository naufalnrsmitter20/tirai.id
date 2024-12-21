import { H1 } from "@/components/ui/text";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { VariantTable } from "./components/VariantTable";

export default async function ProductVariantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return notFound();

  const variants = await prisma.productVariant.findMany({
    where: { product_id: id },
  });

  return (
    <div className="flex flex-col">
      <H1 className="mb-8 text-black">
        Manajemen Varian Produk{" "}
        <span className="text-primary-900">&quot;{product.name}&quot;</span>
      </H1>
      <div className="mb-2">
        <VariantTable productId={product.id} variants={variants} />
      </div>
    </div>
  );
}
