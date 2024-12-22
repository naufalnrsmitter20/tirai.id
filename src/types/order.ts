import { Prisma } from "@prisma/client";

export type OrderWithPayment = Prisma.OrderGetPayload<{
  include: { payment: true };
}>;
