import { Prisma } from "@prisma/client";

export type OrderWithPayment = Prisma.OrderGetPayload<{
  include: {
    payment: true;
    shipment: true;
    items: {
      include: {
        product: true;
        variant: true;
        custom_request: true;
        review: {
          include: {
            order: { include: { user: true } };
          };
        };
      };
    };
  };
}>;

export type OrderWithAffiliatePayment = Prisma.OrderGetPayload<{
  include: {
    payment: true;
    referal: true;
  };
}>;
