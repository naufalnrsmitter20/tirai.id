import { PageContainer } from "@/components/layout/PageContainer";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Hero } from "./components/Hero";
import { Keunggulan } from "./components/Keunggulan";
import { Others } from "./components/Others";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: true, category: { select: { name: true } } },
  });
  if (!product) return notFound();

  const others = await prisma.product.findMany({
    where: { id: { not: product.id }, category_id: product.category_id },
    include: { variants: true },
    take: 4,
  });

  return (
    <PageContainer>
      <Hero product={product} />
      <Keunggulan />
      {others.length > 0 && (
        <Others category={product.category.name} products={others} />
      )}
    </PageContainer>
  );
}
