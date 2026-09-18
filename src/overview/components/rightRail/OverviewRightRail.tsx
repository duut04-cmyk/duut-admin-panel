import type { DateRangeKey } from "@/data/orchestrationMetrics";
import type { TopServiceCategory } from "@/data/dashboardMetrics";
import LiveActivityFeed from "./LiveActivityFeed";
import TopServicesWidget from "./TopServicesWidget";

type OverviewRightRailProps = {
  topServices: TopServiceCategory[];
  dateRange: DateRangeKey;
  onDateRangeChange: (value: DateRangeKey) => void;
};

export default function OverviewRightRail({
  topServices,
  dateRange,
  onDateRangeChange,
}: OverviewRightRailProps) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1 xl:flex xl:flex-col xl:gap-6">
      <div className="min-w-0">
        <LiveActivityFeed />
      </div>
      <div className="min-w-0">
        <TopServicesWidget
          categories={topServices}
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
      </div>
    </div>
  );
}
