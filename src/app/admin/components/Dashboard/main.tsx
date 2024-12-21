"use client";

import { H1 } from "@/components/ui/text";
import { LucideProps, Timer, User } from "lucide-react";
import { Card, CardSkeleton, TopFiveData } from "./Card";
import { useCallback, useEffect, useState } from "react";
import * as googleAnalytics from "@/actions/googleAnalytics";
import { CalculateResult } from "@/actions/googleAnalytics";

interface GoogleAnalyticsData {
  newUsers: CalculateResult | null;
  avgTime: CalculateResult | null;
  topPageViewsByPath: CalculateResult[] | null;
  firstUserPrimaryChannelGroup: CalculateResult[] | null;
  topCity: CalculateResult[] | null;
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

const MemoizedCard = ({
  Icon,
  data,
  title,
  color,
}: {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  data: CalculateResult | null;
  title: string;
  color: string;
}) => {
  if (data === null) {
    return <CardSkeleton />;
  }

  return (
    <Card
      Icon={Icon}
      persentation={data?.data.percentageChange ?? 0}
      title={title}
      value={data.data.dateRange_0}
      color={color}
    />
  );
};

export default function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState<GoogleAnalyticsData>({
    newUsers: null,
    avgTime: null,
    topPageViewsByPath: null,
    firstUserPrimaryChannelGroup: null,
    topCity: null,
  });

  const fetchData = useCallback(async () => {
    const data = await fetchGoogleAnalyticsData();
    setAnalyticsData(data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <H1 className="mb-8 text-black">Dashboard</H1>
      <div className="grid grid-cols-12 gap-7">
        <MemoizedCard
          Icon={User}
          data={analyticsData.newUsers}
          title="New Users"
          color="bg-primary-400"
        />
        <MemoizedCard
          Icon={Timer}
          data={analyticsData.avgTime}
          title="Avg. Time per Active User"
          color="bg-yellow-400"
        />
        <CardSkeleton />
        <CardSkeleton />

        <TopFiveData
          data={analyticsData.topPageViewsByPath}
          label="Path"
          labelValue="Visitors"
          title="Page Visitors"
          className="md:col-span-12 lg:col-span-5"
        />

        <TopFiveData
          data={analyticsData.firstUserPrimaryChannelGroup}
          label="Channel"
          labelValue="Visitors"
          title="Top Referrer"
          className="md:col-span-6 lg:col-span-4"
        />

        <TopFiveData
          data={analyticsData.topCity}
          label="City"
          labelValue="Visitors"
          title="Top City"
          className="md:col-span-6 lg:col-span-3"
        />
      </div>
    </div>
  );
}
