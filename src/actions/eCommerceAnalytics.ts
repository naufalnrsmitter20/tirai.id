"use server";
import prisma from "@/lib/prisma";

export async function getOrdersCountWithDateRange(
  startDate: Date,
  endDate: Date,
): Promise<number> {
  return await prisma.order.count({
    where: {
      created_at: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
}

export async function getTotalRevenueInDateRange(
  startDate: Date,
  endDate: Date,
): Promise<number> {
  const result = await prisma.order.aggregate({
    _sum: {
      total_price: true,
    },
    where: {
      created_at: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        in: ["FINISHED", "DELIVERED"], // Completed order
      },
    },
  });
  return result._sum.total_price || 0;
}

export async function getNewUsersCount(
  startDate: Date,
  endDate: Date,
): Promise<number> {
  return await prisma.user.count({
    where: {
      created_at: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
}

export async function getOrderStatusDistribution() {
  const result = await prisma.order.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });
  return result.map(({ status, _count }) => ({ status, count: _count.status }));
}

export async function getRevenueByDayOfWeek() {
  const result = await prisma.$queryRaw`
    SELECT 
      EXTRACT(DOW FROM "created_at") AS day_of_week,
      SUM("total_price") AS revenue
    FROM "Order"
    WHERE status IN ('FINISHED', 'DELIVERED')
    GROUP BY EXTRACT(DOW FROM "created_at")
    ORDER BY day_of_week;
  `;
  return result;
}

// export async function getTopCustomers(limit: number = 10) {
//   return await prisma.user.findMany({
//     take: limit,
//     orderBy: {
//       orders: {
//         _sum: {
//           total_price: 'desc',
//         },
//       },
//     },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       orders: {
//         _sum: {
//           total_price: true,
//         },
//       },
//     },
//   });
// }

// export async function getAverageOrderCompletionTime(): Promise<number> {
//   const result = await prisma.order.aggregate({
//     _avg: {
//       finished_at: true,
//     },
//     where: {
//       status: 'FINISHED',
//       finished_at: {
//         not: null,
//       },
//     },
//   });

//   return result._avg.finished_at ? result._avg.finished_at.getTime() : 0;
// }

// export async function getOrderCountByCategory() {
//   const result = await prisma.productCategory.findMany({
//     select: {
//       name: true,
//       products: {
//         select: {
//           items: {
//             select: {
//               order_id: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   return result.map(category => ({
//     category: category.name,
//     orderCount: category.products.reduce(
//       (acc, product) => acc + product.items.length,
//       0,
//     ),
//   }));
// }
