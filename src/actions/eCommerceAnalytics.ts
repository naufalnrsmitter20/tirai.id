"use server";
import prisma from "@/lib/prisma";

// Tipe untuk Monthly Revenue Trend
type MonthlyRevenueTrend = {
  month: Date;
  revenue: number;
}[];

export async function getMonthlyRevenueTrend(
  months: number = 6,
): Promise<MonthlyRevenueTrend> {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('month', created_at) as month,
      SUM(total_price) as revenue
    FROM "Order"
    WHERE 
      created_at >= ${startDate} AND
      status IN ('FINISHED', 'DELIVERED')
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY month DESC
  `;
}

// Tipe untuk Average Order Value
export async function getAverageOrderValue(
  startDate: Date,
  endDate: Date,
): Promise<number> {
  const result = await prisma.order.aggregate({
    _avg: {
      total_price: true,
    },
    where: {
      created_at: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        in: ["FINISHED", "DELIVERED"],
      },
    },
  });
  return result._avg.total_price || 0;
}

export async function getTopProducts(limit: number = 5) {
  return await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      _count: {
        select: {
          items: {
            where: {
              order: {
                status: {
                  in: ["FINISHED", "DELIVERED"],
                },
              },
            },
          },
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      items: {
        _count: "desc",
      },
    },
    take: limit,
  });
}

// Tipe untuk Top Customers
type TopCustomer = {
  id: string;
  name: string;
  email: string;
  totalPurchases: number;
  orderCount: number;
}[];

export async function getTopCustomers(
  limit: number = 10,
): Promise<TopCustomer> {
  try {
    const topCustomersWithTotalPurchases = await prisma.user.findMany({
      where: {
        orders: {
          some: {
            status: {
              in: ["FINISHED", "DELIVERED"],
            },
          },
        },
      },
      include: {
        _count: {
          select: {
            orders: {
              where: {
                status: {
                  in: ["FINISHED", "DELIVERED"],
                },
              },
            },
          },
        },
        orders: {
          where: {
            status: {
              in: ["FINISHED", "DELIVERED"],
            },
          },
          select: {
            total_price: true,
          },
        },
      },
      orderBy: {
        orders: {
          _count: "desc",
        },
      },
      take: limit,
    });

    // Transform data to sum total
    const enrichedTopCustomers = topCustomersWithTotalPurchases
      .map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        totalPurchases: customer.orders.reduce(
          (sum, order) => sum + order.total_price,
          0,
        ),
        orderCount: customer._count.orders,
      }))
      // Sort by purchases
      .sort((a, b) => b.totalPurchases - a.totalPurchases);

    return enrichedTopCustomers;
  } catch (error) {
    console.error("Error fetching top customers:", error);
    throw error;
  }
}

// Tipe untuk Top Customers Raw
type TopCustomerRaw = {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  totalPurchases: number;
}[];

export async function getTopCustomersRaw(
  limit: number = 10,
): Promise<TopCustomerRaw> {
  try {
    const topCustomers = await prisma.$queryRaw`  
      SELECT   
        u.id,   
        u.name,   
        u.email,   
        COUNT(o.id) as "orderCount",   
        COALESCE(SUM(o.total_price), 0) as "totalPurchases"  
      FROM   
        "User" u  
      LEFT JOIN   
        "Order" o ON u.id = o.user_id AND o.status IN ('FINISHED', 'DELIVERED')  
      GROUP BY   
        u.id, u.name, u.email  
      ORDER BY   
        "totalPurchases" DESC  
      LIMIT ${limit}  
    `;

    return topCustomers as TopCustomerRaw;
  } catch (error) {
    console.error("Error fetching top customers (raw):", error);
    throw error;
  }
}

// Tipe untuk Customer Retention Rate
type CustomerRetentionRate = {
  retention_rate: number;
}[];

export async function getCustomerRetentionRate(): Promise<CustomerRetentionRate> {
  const query = await prisma.$queryRaw`
  WITH RepeatCustomers AS (
    SELECT user_id
    FROM "Order"
    WHERE status IN ('FINISHED', 'DELIVERED')
    GROUP BY user_id
    HAVING COUNT(DISTINCT DATE_TRUNC('month', created_at)) > 1
  )
  SELECT 
    ROUND(
      (COUNT(DISTINCT rc.user_id)::FLOAT / 
      NULLIF(COUNT(DISTINCT o.user_id), 0) * 100)::numeric, 
      2
    ) as retention_rate
  FROM "Order" o
  LEFT JOIN RepeatCustomers rc ON o.user_id = rc.user_id
  WHERE o.status IN ('FINISHED', 'DELIVERED')
`;
  return (query as CustomerRetentionRate).map((item) => ({
    retention_rate: Number(item.retention_rate),
  }));
}

export async function getLowStockProducts(threshold: number = 10) {
  return await prisma.product.findMany({
    where: {
      OR: [
        {
          stock: {
            lte: threshold,
          },
        },
        {
          variants: {
            some: {
              stock: {
                lte: threshold,
              },
            },
          },
        },
      ],
      is_published: true,
    },
    select: {
      id: true,
      name: true,
      stock: true,
      variants: {
        select: {
          id: true,
          name: true,
          stock: true,
        },
        where: {
          stock: {
            lte: threshold,
          },
        },
      },
    },
  });
}

export async function getAverageRating(): Promise<number> {
  const result = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
  });

  return result._avg.rating || 0;
}

export async function getPaymentMethodDistribution() {
  return await prisma.payment.groupBy({
    by: ["method"],
    _count: {
      id: true,
    },
    where: {
      status: "COMPLETED",
    },
  });
}

type OrderCountByCategory = {
  category: string;
  orderCount: number;
}[];

export async function getOrderCountByCategory(): Promise<OrderCountByCategory> {
  const result = await prisma.productCategory.findMany({
    select: {
      name: true,
      products: {
        select: {
          items: {
            select: {
              order_id: true,
            },
          },
        },
      },
    },
  });

  return result.map((category) => ({
    category: category.name,
    orderCount: category.products.reduce(
      (acc, product) => acc + product.items.length,
      0,
    ),
  }));
}
