import { paginator } from "@/lib/paginator";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const paginate = paginator({ perPage: 10 });

export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: queryPage } = await searchParams;
  const page = parseInt(queryPage || "1");
  const paginatedProducts = await paginate<
    Prisma.ProductGetPayload<{
      select: {
        id: true;
        name: true;
        slug: true;
        description: true;
        is_published: true;
        created_at: true;
        updated_at: true;
        variants: {
          select: {
            stock: true;
            price: true;
            photo: true;
          };
        };
        reviews: {
          select: {
            rating: true;
          };
        };
      };
    }>,
    Prisma.ProductFindManyArgs
  >(
    prisma.product,
    { page },
    {
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        is_published: true,
        created_at: true,
        updated_at: true,
        variants: {
          select: {
            stock: true,
            price: true,
            photo: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    },
  );

  const productsCatalog = paginatedProducts.data.map((product) => {
    // Calculate cumulative stock
    const cumulativeStock = product.variants.reduce(
      (sum, variant) => sum + variant.stock,
      0,
    );

    // Find the cheapest price
    const cheapestPrice = Math.min(
      ...product.variants.map((variant) => variant.price),
    );

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      created_at: product.created_at,
      updated_at: product.updated_at,
      image: product.variants[0]?.photo || null, // Use the first available photo or null if none
      stock: cumulativeStock, // Total stock from all variants
      price: Number.isFinite(cheapestPrice) ? cheapestPrice : null, // Cheapest price among variants
      rating: product.reviews.length
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          product.reviews.length
        : null, // Calculate average rating or null if no reviews
    };
  });

  console.log(productsCatalog);

  return <></>;
}
