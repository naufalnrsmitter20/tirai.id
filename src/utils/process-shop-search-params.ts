import { Prisma } from "@prisma/client";

interface ShopSearchParams {
  availability?: "in-stock" | "out-of-stock";
  categories?: string;
  sortBy?: string;
  term?: string;
  minPrice?: string;
  maxPrice?: string;
}

export const buildProductsQuery = (params: ShopSearchParams) => {
  const query: Prisma.ProductFindManyArgs = {};

  query.where = {};

  if (params.availability) {
    query.where.OR = [
      ...(query.where.OR ? query.where.OR : []),
      {
        variants: {
          some: {
            stock: params.availability === "out-of-stock" ? 0 : { gt: 0 },
          },
        },
      },
      {
        stock: params.availability === "out-of-stock" ? 0 : { gt: 0 },
      },
    ];
  }

  if (params.categories) {
    query.where.category_id = { in: params.categories.split(",") };
  }

  if (params.term) {
    query.where.OR = [
      ...(query.where.OR ? query.where.OR : []),
      { name: { contains: params.term, mode: "insensitive" } },
      { description: { contains: params.term, mode: "insensitive" } },
    ];
  }

  if (params.minPrice || params.maxPrice) {
    query.where.OR = [
      ...(query.where.OR ? query.where.OR : []),
      {
        price: {
          ...(params.minPrice ? { gte: Number(params.minPrice) } : {}),
          ...(params.maxPrice ? { lte: Number(params.maxPrice) } : {}),
        },
      },
      {
        variants: {
          some: {
            price: {
              ...(params.minPrice ? { gte: Number(params.minPrice) } : {}),
              ...(params.maxPrice ? { lte: Number(params.maxPrice) } : {}),
            },
          },
        },
      },
    ];
  }

  if (params.sortBy) {
    switch (params.sortBy) {
      case "Best Selling":
        query.orderBy = { reviews: { _count: "desc" } };
        break;
      case "Alphabetically, A-Z":
        query.orderBy = { name: "asc" };
        break;
      case "Alphabetically, Z-A":
        query.orderBy = { name: "desc" };
        break;
      case "Price, low-high":
      case "Price, high-low":
        break;
      case "Date, old-new":
        query.orderBy = { created_at: "asc" };
        break;
      case "Date, new-old":
        query.orderBy = { created_at: "desc" };
        break;
      default:
        break;
    }
  }

  return query;
};

export const sortProductsManually = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[],
  sortBy: "Price, low-high" | "Price, high-low",
) => {
  if (sortBy === "Price, low-high") {
    return products.sort((a, b) => {
      return (
        (a.price || a.variants[0].price) - (b.price || b.variants[0].price)
      );
    });
  } else if (sortBy === "Price, high-low") {
    return products.sort((a, b) => {
      return (
        (b.price || b.variants[0].price) - (a.price || a.variants[0].price)
      );
    });
  }

  return products;
};
