/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H1 } from "@/components/ui/text";
import { Timer, User, AlertTriangle, LucideProps } from "lucide-react";
import * as googleAnalytics from "@/actions/googleAnalytics";
import * as dashboardData from "@/actions/eCommerceAnalytics";
import { CalculateResult } from "@/actions/googleAnalytics";
import { CardSkeleton, TopFiveData, Card as CardCustom } from "./Card";
import { formatRupiah } from "@/lib/utils";

interface GoogleAnalyticsData {
  newUsers: CalculateResult | null;
  avgTime: CalculateResult | null;
  topPageViewsByPath: CalculateResult[] | null;
  firstUserPrimaryChannelGroup: CalculateResult[] | null;
  topCity: CalculateResult[] | null;
}

interface PrismaData {
  monthlyRevenue: any[];
  topProducts: any[];
  topCustomers: any[];
  customerRetention: number;
  lowStockProducts: any[];
  paymentDistribution: any[];
  ordersByCategory: any[];
}

interface MetricCardProps {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  data: CalculateResult | null;
  title: string;
  color: string;
}

async function fetchGoogleAnalyticsData(): Promise<GoogleAnalyticsData> {
  try {
    const dataPromises = [
      googleAnalytics.newUsers(),
      googleAnalytics.sessionDuration(),
      googleAnalytics.topPageViewsByPath(),
      googleAnalytics.firstUserPrimaryChannelGroup(),
      googleAnalytics.activeUsersByCity(),
    ];

    const [
      newUsers,
      avgTime,
      topPageViewsByPath,
      firstUserPrimaryChannelGroup,
      topCity,
    ] = await Promise.all(dataPromises);

    return {
      newUsers: newUsers.data ? newUsers.data[0] : null,
      avgTime: avgTime.data ? avgTime.data[0] : null,
      topPageViewsByPath: topPageViewsByPath.data ?? [],
      firstUserPrimaryChannelGroup: firstUserPrimaryChannelGroup.data ?? [],
      topCity: topCity.data ?? [],
    };
  } catch (error) {
    console.error("Error fetching Google Analytics data:", error);
    return {
      newUsers: null,
      avgTime: null,
      topPageViewsByPath: [],
      firstUserPrimaryChannelGroup: [],
      topCity: [],
    };
  }
}

const MetricCard = ({ Icon, data, title, color }: MetricCardProps) => {
  if (!data) return <CardSkeleton />;

  return (
    <CardCustom
      Icon={Icon}
      persentation={data.data.percentageChange ?? 0}
      title={title}
      value={data.data.dateRange_0}
      color={color}
    />
  );
};

const ChartContainer = ({ children }: { children: JSX.Element }) => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex h-full items-center justify-center">
    <p className="text-muted-foreground">{message}</p>
  </div>
);

export default function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState<GoogleAnalyticsData>({
    newUsers: null,
    avgTime: null,
    topPageViewsByPath: null,
    firstUserPrimaryChannelGroup: null,
    topCity: null,
  });

  const [prismaData, setPrismaData] = useState<PrismaData>({
    monthlyRevenue: [],
    topProducts: [],
    topCustomers: [],
    customerRetention: 0,
    lowStockProducts: [],
    paymentDistribution: [],
    ordersByCategory: [],
  });

  const fetchAllData = useCallback(async () => {
    try {
      const [
        analyticsResult,
        monthlyRevenue,
        topProducts,
        topCustomers,
        getAverageRating,
        lowStockProducts,
        paymentDistribution,
        ordersByCategory,
      ] = await Promise.all([
        fetchGoogleAnalyticsData(),
        dashboardData.getMonthlyRevenueTrend(),
        dashboardData.getTopProducts(),
        dashboardData.getTopCustomers(),
        dashboardData.getAverageRating(),
        dashboardData.getLowStockProducts(),
        dashboardData.getPaymentMethodDistribution(),
        dashboardData.getOrderCountByCategory(),
      ]);

      setAnalyticsData(analyticsResult);
      setPrismaData({
        monthlyRevenue,
        topProducts,
        topCustomers,
        customerRetention: getAverageRating,
        lowStockProducts,
        paymentDistribution,
        ordersByCategory,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <div className="space-y-8 p-6">
      <H1 className="text-2xl font-bold text-black">Dashboard</H1>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            <MetricCard
              Icon={User}
              data={analyticsData.newUsers}
              title="New Users"
              color="bg-primary-400"
            />
            <MetricCard
              Icon={Timer}
              data={analyticsData.avgTime}
              title="Avg. Time per User"
              color="bg-yellow-400"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <TopFiveData
              data={analyticsData.topPageViewsByPath}
              label="Path"
              labelValue="Visitors"
              title="Page Visitors"
              className="lg:col-span-5"
            />
            <TopFiveData
              data={analyticsData.firstUserPrimaryChannelGroup}
              label="Channel"
              labelValue="Visitors"
              title="Top Referrer"
              className="lg:col-span-4"
            />
            <TopFiveData
              data={analyticsData.topCity}
              label="City"
              labelValue="Visitors"
              title="Top City"
              className="lg:col-span-3"
            />
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {prismaData.monthlyRevenue.length > 0 ? (
                  <ChartContainer>
                    <LineChart data={prismaData.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <EmptyState message="No revenue data available" />
                )}
              </CardContent>
            </Card>

            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {prismaData.topCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="mb-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.orderCount} orders
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {formatRupiah(customer.totalPurchases)}
                      </Badge>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-4xl font-bold">
                    {prismaData.customerRetention}/10
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                {prismaData.paymentDistribution.length > 0 ? (
                  <ChartContainer>
                    <BarChart data={prismaData.paymentDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="method" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="_count.id" fill="#8884d8" />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <EmptyState message="No payment data available" />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Low Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {prismaData.lowStockProducts.map((product) => (
                    <Alert key={product.id} className="mb-2">
                      <AlertDescription>
                        <div className="flex justify-between">
                          <span>{product.name}</span>
                          <Badge variant="destructive">
                            {product.stock} left
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orders by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {prismaData.ordersByCategory.length > 0 ? (
                  <ChartContainer>
                    <BarChart data={prismaData.ordersByCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orderCount" fill="#82ca9d" />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <EmptyState message="No category data available" />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
