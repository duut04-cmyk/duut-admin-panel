import type { ReportingSummary } from "@/data/reportingTypes";
import { formatPackageTypeLabel } from "../reportingUi";
import type { ReportingDateRangeKey } from "@/lib/reportingDateRange";
import type { DateRangeKey } from "@/data/orchestrationMetrics";
import DashboardCardDateRange from "./DashboardCardDateRange";

type LiveTopPackagesWidgetProps = {
  distribution: ReportingSummary["packageTypeDistribution"];
  dateRange: ReportingDateRangeKey;
  onDateRangeChange: (value: ReportingDateRangeKey) => void;
};

export default function LiveTopPackagesWidget({
  distribution,
  dateRange,
  onDateRangeChange,
}: LiveTopPackagesWidgetProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-small font-semibold text-foreground">Package types</h3>
        <DashboardCardDateRange
          value={dateRange}
          onChange={(value: DateRangeKey) => {
            if (value === "7d" || value === "30d" || value === "month") {
              onDateRangeChange(value);
            }
          }}
        />
      </div>
      {distribution.length === 0 ? (
        <p className="text-small text-muted-foreground">
          No deliveries in this period.
        </p>
      ) : (
        <ul className="space-y-2">
          {distribution.map((item) => (
            <li
              key={item.packageType}
              className="flex items-center justify-between text-small"
            >
              <span>{formatPackageTypeLabel(item.packageType)}</span>
              <span className="font-semibold">
                {item.count} ({item.percent}%)
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
