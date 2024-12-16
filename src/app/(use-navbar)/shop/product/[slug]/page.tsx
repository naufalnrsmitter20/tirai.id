import prisma from "@/lib/prisma";
import { PageContainer } from "@/components/layout/PageContainer";
import { Hero } from "./components/Hero";
import { notFound } from "next/navigation";
import { Keunggulan } from "./components/Keunggulan";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: true },
  });
  if (!product) return notFound();

  return (
    <PageContainer>
      <Hero product={product} />
      <Keunggulan />
    </PageContainer>
  );
}
