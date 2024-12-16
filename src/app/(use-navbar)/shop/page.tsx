import { paginator } from "@/lib/paginator";
import prisma from "@/lib/prisma";
import { ProductCatalog } from "@/types/entityRelations";
import { findCategories } from "@/utils/database/category.query";
import { Prisma } from "@prisma/client";
import { Hero } from "./components/Hero";
import { ProductList } from "./components/ProductList";
import {
  buildProductsQuery,
  sortProductsManually,
} from "@/utils/process-shop-search-params";

const paginate = paginator({ perPage: 10 });

export default async function Shop({
  searchParams: searchParamsRaw,
}: {
  searchParams: Promise<{
    page?: string;
    availability?: "in-stock" | "out-of-stock";
    categories?: string;
    sortBy?: string;
    term?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const searchParams = await searchParamsRaw;

  const { page: queryPage } = searchParams;
  const page = parseInt(queryPage || "1");

  const paginatedProducts = await paginate<
    ProductCatalog,
    Prisma.ProductFindManyArgs
  >(
    prisma.product,
    { page },
    {
      ...buildProductsQuery(searchParams),
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        photos: true,
        stock: true,
        price: true,
        is_published: true,
        created_at: true,
        updated_at: true,
        variants: {
          select: {
            stock: true,
            price: true,
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

  const categories = await findCategories();

  const { sortBy } = searchParams;
  if (sortBy === "Price, low-high" || sortBy === "Price, high-low") {
    paginatedProducts.data = sortProductsManually(
      paginatedProducts.data,
      sortBy,
    );
  }

  return (
    <>
      <Hero />
      <ProductList
        categories={categories}
        paginatedProducts={paginatedProducts}
      />
    </>
  );
}
