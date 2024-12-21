"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import analyticsDataClient, {
  GOOGLE_ANALYTICS_ID,
} from "@/lib/google-analytics";
import { google } from "@google-analytics/data/build/protos/protos";

interface MetricData {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}

interface ReportData {
  dimensionHeaders: { name: string }[];
  metricHeaders: { name: string; type: string }[];
  rows: MetricData[];
}

export interface CalculateResult {
  title: string;
  data: {
    dateRange_0: number;
    dateRange_1: number;
    percentageChange: number;
  };
}

const dateRanges: google.analytics.data.v1beta.IDateRange[] = [
  { startDate: "30daysAgo", endDate: "today" },
  { startDate: "60daysAgo", endDate: "31daysAgo" },
];

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0 && current === 0) return 0; // Avoid division by zero
  if (previous === 0) return 100; // Avoid division by zero
  return ((current - previous) / previous) * 100;
}

async function calculatePercentageChangeByDimension(
  data: ReportData,
): Promise<CalculateResult[]> {
  const result: Record<
    string,
    { dateRange_0: number; dateRange_1: number; percentageChange: number }
  > = {};

  // Group data by the specified dimension
  data.rows.forEach((row) => {
    let dimensionValue = row.dimensionValues[0]?.value ?? ""; // Directly access the first dimension value
    dimensionValue = dimensionValue.startsWith("date")
      ? "date"
      : dimensionValue;
    const dateRange = dimensionValue.startsWith("date")
      ? row.dimensionValues[0]?.value
      : row.dimensionValues[1]?.value ?? ""; // Use the first dimension as dateRange if second is missing
    const metricValue = parseInt(row.metricValues[0]?.value || "0", 10); // Default to 0 if NaN

    if (!dimensionValue || !dateRange) return; // Skip rows that don't have valid data

    if (!result[dimensionValue]) {
      result[dimensionValue] = {
        dateRange_0: 0,
        dateRange_1: 0,
        percentageChange: 0,
      };
    }

    // Check for date range values and assign appropriately
    if (dateRange === "date_range_0") {
      result[dimensionValue].dateRange_0 = metricValue;
    } else if (dateRange === "date_range_1") {
      result[dimensionValue].dateRange_1 = metricValue;
    }
  });

  // Calculate percentage change for each dimension
  const sortedResult = Object.entries(result)
    .map(([title, { dateRange_0, dateRange_1 }]) => ({
      title,
      data: {
        dateRange_0,
        dateRange_1,
        percentageChange: calculatePercentageChange(dateRange_0, dateRange_1),
      },
    }))
    .sort((a, b) => b.data.percentageChange - a.data.percentageChange); // Sort by percentageChange

  return sortedResult;
}

async function runReport(
  request: google.analytics.data.v1beta.IRunReportRequest,
): Promise<CalculateResult[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [response] = (await analyticsDataClient.runReport(request)) as any;

    return await calculatePercentageChangeByDimension(response);
  } catch (error) {
    console.error(error);
    throw new Error("Error while fetching report data");
  }
}

export async function topPageViewsByPath(): Promise<
  ActionResponse<CalculateResult[]>
> {
  const request: google.analytics.data.v1beta.IRunReportRequest = {
    property: `properties/${GOOGLE_ANALYTICS_ID}`,
    dateRanges,
    metrics: [{ name: "screenPageViews" }],
    dimensions: [{ name: "pagePath" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    dimensionFilter: {
      notExpression: {
        filter: {
          fieldName: "pagePath",
          stringFilter: {
            matchType: "FULL_REGEXP",
            value: ".*/(admin|api).*",
          },
        },
      },
    },
    limit: 5,
  };
  const data = await runReport(request);
  return ActionResponses.success(data);
}

export async function sessionDuration(): Promise<
  ActionResponse<CalculateResult[]>
> {
  const request: google.analytics.data.v1beta.IRunReportRequest = {
    property: `properties/${GOOGLE_ANALYTICS_ID}`,
    dateRanges,
    metrics: [{ name: "averageSessionDuration" }],
  };
  const data = await runReport(request);
  return ActionResponses.success(data);
}

export async function firstUserPrimaryChannelGroup(): Promise<
  ActionResponse<CalculateResult[]>
> {
  const request: google.analytics.data.v1beta.IRunReportRequest = {
    property: `properties/${GOOGLE_ANALYTICS_ID}`,
    dateRanges,
    metrics: [{ name: "newUsers" }],
    dimensions: [{ name: "firstUserPrimaryChannelGroup" }],
    orderBys: [{ metric: { metricName: "newUsers" }, desc: true }],
  };
  const data = await runReport(request);
  return ActionResponses.success(data);
}

export async function newUsers(): Promise<ActionResponse<CalculateResult[]>> {
  const request: google.analytics.data.v1beta.IRunReportRequest = {
    property: `properties/${GOOGLE_ANALYTICS_ID}`,
    dateRanges,
    metrics: [{ name: "newUsers" }],
  };
  const data = await runReport(request);
  return ActionResponses.success(data);
}

export async function activeUsersByCity(): Promise<
  ActionResponse<CalculateResult[]>
> {
  const request: google.analytics.data.v1beta.IRunReportRequest = {
    property: `properties/${GOOGLE_ANALYTICS_ID}`,
    dateRanges,
    metrics: [{ name: "activeUsers" }],
    dimensions: [{ name: "city" }],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    limit: 5,
  };
  const data = await runReport(request);
  return ActionResponses.success(data);
}

export async function topSearchQuery(): Promise<
  ActionResponse<CalculateResult[]>
> {
  const request: google.analytics.data.v1beta.IRunReportRequest = {
    property: `properties/${GOOGLE_ANALYTICS_ID}`,
    dateRanges,
    metrics: [{ name: "organicGoogleSearchClicks" }],
    dimensions: [{ name: "firstUserGoogleAdsKeyword" }],
    orderBys: [
      { metric: { metricName: "organicGoogleSearchClicks" }, desc: true },
    ],
    limit: 5,
  };
  const data = await runReport(request);
  return ActionResponses.success(data);
}
