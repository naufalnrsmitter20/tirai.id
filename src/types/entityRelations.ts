import { Prisma } from "@prisma/client";

export type ArticleWithUser = Prisma.ArticleGetPayload<{
  include: {
    author: { select: { name: true; role: true } };
  };
}>;

export type ProductCategoryWithProductIds = Prisma.ProductCategoryGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    updated_at: true;
    products: { select: { id: true } };
  };
}>;

export type ProductWithCategoryReviewsVariants = Prisma.ProductGetPayload<{
  include: {
    category: {
      select: {
        name: true;
        id: true;
      };
    };
    reviews: {
      select: {
        rating: true;
      };
    };
    variants: {
      select: {
        _count: true;
      };
    };
  };
}>;

export type ProductCatalog = Prisma.ProductGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    description: true;
    is_published: true;
    stock: true;
    price: true;
    photos: true;
    created_at: true;
    updated_at: true;
    variants: {
      select: {
        stock: true;
        price: true;
      };
    };
    reviews: {
      select: {
        rating: true;
      };
    };
  };
}>;

export type ChatUser = Prisma.UserGetPayload<{
  select: {
    email: true;
    name: true;
    id: true;
  };
}>;
