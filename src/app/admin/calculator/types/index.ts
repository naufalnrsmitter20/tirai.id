import { Prisma } from "@prisma/client";

export type Model = Prisma.ModelGetPayload<{
  select: { id: true; description: true; image: true; name: true };
}>;

export type Material = Prisma.MaterialGetPayload<{
  select: {
    id: true;
    name: true;
    description: true;
    price: true;
    supplier_price: true;
    image: true;
  };
}>;

export interface Price {
  customer: { original: number; discounted: number };
  supplier: { original: number; discounted: number };
}

export interface Dimensions {
  length: number;
  width: number;
}
