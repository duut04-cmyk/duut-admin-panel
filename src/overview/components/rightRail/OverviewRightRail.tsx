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
    <div className="space-y-6">
      <LiveActivityFeed />
      <TopServicesWidget
        categories={topServices}
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
      />
    </div>
  );
}
