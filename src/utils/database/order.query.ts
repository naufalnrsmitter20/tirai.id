import { paginator } from "@/lib/paginator";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const createOrder = async (data: Prisma.OrderCreateInput) => {
  return await prisma.order.create({ data });
};

export const updateOrder = async (
  where: Prisma.OrderWhereUniqueInput,
  data: Prisma.OrderUpdateInput,
) => {
  return await prisma.order.update({ where, data });
};

export const deleteOrder = async (where: Prisma.OrderWhereUniqueInput) => {
  return await prisma.order.delete({ where });
};

export const findOrders = async (
  perPage = 6,
  page = 1,
  sort: "latest" | "popular",
  filter?: Prisma.OrderWhereInput,
) => {
  const paginate = paginator({ perPage });
  return await paginate<
    Prisma.OrderGetPayload<{
      include: {
        items: true;
        payment: true;
        shipment: true;
      };
    }>,
    Prisma.OrderFindManyArgs
  >(
    prisma.order,
    { page },
    {
      where: {
        ...filter,
      },
      orderBy:
        sort === "latest"
          ? { created_at: "desc" }
          : sort === "popular"
            ? { reviews: { _count: "desc" } }
            : undefined,
      include: {
        items: true,
        payment: true,
        shipment: true,
      },
    },
  );
};

export const findOrderById = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          custom_request: true,
          product: true,
          variant: true,
        },
      },
      payment: true,
      shipment: true,
    },
  });
};

export const findOrdersCustom = async (
  perPage = 6,
  page = 1,
  sort: "latest" | "popular",
  filter?: Prisma.OrderWhereUniqueInput,
) => {
  const paginate = paginator({ perPage });
  return await paginate<
    Prisma.OrderGetPayload<{
      include: {
        items: { include: { custom_request: true } };
        payment: true;
        shipment: true;
      };
    }>,
    Prisma.OrderFindManyArgs
  >(
    prisma.order,
    { page },
    {
      where: {
        ...filter,
      },
      orderBy:
        sort === "latest"
          ? { created_at: "desc" }
          : sort === "popular"
            ? { reviews: { _count: "desc" } }
            : undefined,
      include: {
        items: { include: { custom_request: true } },
        payment: true,
        shipment: true,
      },
    },
  );
};
