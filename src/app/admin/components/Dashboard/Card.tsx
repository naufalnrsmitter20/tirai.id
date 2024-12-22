import { CalculateResult } from "@/actions/googleAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, LucideProps } from "lucide-react";
import { ClassNameValue } from "tailwind-merge";

const formatPercentage = (value: number) =>
  Math.abs(value)
    .toFixed(1)
    .replace(/[.,]0$/, "");

interface PercentageIndicatorProps {
  value: number;
  size?: number;
}

const PercentageIndicator = ({
  value,
  size = 12,
}: PercentageIndicatorProps) => {
  const isPositive = value > 0;
  const Icon = isPositive ? ArrowUp : ArrowDown;

  return (
    <span
      className={cn(
        "flex items-center font-medium px-1 py-0.5 rounded-sm",
        isPositive ? "text-emerald-500" : "text-red-500",
      )}
    >
      <Icon size={size} className="mr-0.5" />
      {formatPercentage(value)}%
    </span>
  );
};

export function Card({
  Icon,
  title,
  value,
  persentation,
  color,
}: Readonly<{
  value: number;
  persentation: number;
  title: string;
  color: ClassNameValue;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}>) {
  return (
    <div
      className={cn(
        "col-span-12 md:col-span-6 px-6 py-4 shadow-sm shadow-gray-400 rounded-xl",
      )}
    >
      <div className="flex justify-between mb-4">
        <div>
          <h5 className="font-semibold text-black text-3xl">
            {value.toFixed(1).replace(/[.,]0$/, "")}
          </h5>
          <p className="text-sm text-slate-800">{title}</p>
        </div>
        <div className={cn("rounded-full p-2 self-start", color)}>
          <Icon size={24} />
        </div>
      </div>
      <span className="text-xs flex items-center text-slate-700">
        <PercentageIndicator value={persentation} /> from last month
      </span>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Skeleton className="col-span-12 md:col-span-6 lg:col-span-3 px-6 py-4 shadow-gray-400 rounded-xl bg-white shadow-sm">
      <div className="flex justify-between mb-4">
        <div>
          <Skeleton className="h-9 w-24 mb-1 bg-gray-200" />
          <Skeleton className="h-4 w-20 bg-gray-200" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
      </div>
      <div className="flex items-center">
        <Skeleton className="h-4 w-32 bg-gray-200" />
      </div>
    </Skeleton>
  );
}

export function TopFiveData({
  title,
  label,
  labelValue,
  data,
  className,
}: {
  title: string;
  label: string;
  labelValue: string;
  data: CalculateResult[] | null;
  className?: string;
}) {
  if (data === null) return <TopFiveDataSkeleton className={className} />;

  return (
    <div
      className={cn(
        "col-span-12 md:col-span-5 shadow-sm my-1 shadow-gray-400 rounded-xl border border-slate-100 px-6 py-4",
        className,
      )}
    >
      <h5 className="text-black mb-4">{title}</h5>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <p className="text-gray-700">{label}</p>
          <p className="text-gray-700">{labelValue}</p>
        </div>
        {data.map((dataItem) => (
          <TopFiveDataItem key={dataItem.title} dataItem={dataItem} />
        ))}
      </div>
    </div>
  );
}

const TopFiveDataItem = ({ dataItem }: { dataItem: CalculateResult }) => (
  <div className="flex justify-between text-sm border-t border-solid border-gray-300 pt-2">
    <p className="text-gray-700 max-w-[80%] truncate text-sm">
      {dataItem.title}
    </p>
    <div className="flex items-center">
      <PercentageIndicator value={dataItem.data.percentageChange} size={10} />
      <p className="text-gray-700 ml-2">{dataItem.data.dateRange_0}</p>
    </div>
  </div>
);

function TopFiveDataSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "col-span-5 shadow-sm my-1 shadow-gray-400 rounded-xl border border-slate-100 px-6 py-4",
        className,
      )}
    >
      <Skeleton className="h-6 w-1/3 mb-4 bg-gray-200" />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <Skeleton className="h-4 w-1/4 bg-gray-200" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        {Array.from({ length: 5 }).map((_, skeletonIndex) => (
          <div
            key={skeletonIndex}
            className="flex justify-between text-sm border-t border-solid border-gray-300 pt-2"
          >
            <Skeleton className="h-4 w-3/4 max-w-[80%] truncate bg-gray-200" />
            <div className="flex items-center">
              <Skeleton className="h-4 w-12 mr-2 bg-gray-200" />
              <Skeleton className="h-4 w-8 bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
