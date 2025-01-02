import { PageContainer } from "@/components/layout/PageContainer";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { isCustomCart } from "@/lib/utils";
import { findDiscountByRole } from "@/utils/database/discount.query";
import { findReviews } from "@/utils/database/review.query";
import { notFound } from "next/navigation";
import { Hero } from "./components/Hero";
import { Keunggulan } from "./components/Keunggulan";
import { Others } from "./components/Others";
import { Reviews } from "./components/Reviews";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: true,
      category: { select: { name: true } },
      reviews: true,
    },
  });
  if (!product) return notFound();

  const [productsFromSameCategory, others, cart] = await prisma.$transaction([
    prisma.product.findMany({
      where: { id: { not: product.id }, category_id: product.category_id },
      include: { variants: true },
      take: 4,
    }),
    prisma.product.findMany({
      where: {
        id: { not: product.id },
        OR: [
          { stock: { gt: 0 } },
          { variants: { some: { stock: { gt: 0 } } } },
        ],
      },
      include: { variants: true },
      take: 4,
    }),
    prisma.cart.findUnique({ where: { user_id: session?.user?.id } }),
  ]);

  const ratingMean =
    product.reviews.reduce((sum, i) => (sum += i.rating), 0) /
      product.reviews.length >
    0
      ? product.reviews.reduce((sum, i) => (sum += i.rating), 0) /
        product.reviews.length
      : 0;

  const reviews = await findReviews({
    page: 1,
    perPage: 3,
    args: {
      where: {
        product: {
          slug,
        },
      },
    },
  });

  const hasCustomCart =
    cart !== null &&
    isCustomCart(cart.json_content) &&
    cart.json_content.item !== undefined;

  const discount =
    session && session.user
      ? await findDiscountByRole(session?.user?.role)
      : null;

  return (
    <PageContainer>
      <Hero
        product={product}
        hasCustomCart={hasCustomCart}
        session={session}
        discount={discount}
        productReview={ratingMean}
      />
      <Keunggulan />
      {others.length > 0 && (
        <Others title={"Mungkin Anda juga Suka"} products={others} />
      )}
      {productsFromSameCategory.length > 0 && (
        <Others
          title={`Lainnya dari Kategori ${product.category.name.replace(product.category.name[0], product.category.name[0].toUpperCase())}`}
          products={productsFromSameCategory}
        />
      )}
      <Reviews reviews={reviews.data} slug={slug} />
    </PageContainer>
  );
}
