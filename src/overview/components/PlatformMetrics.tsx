import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import type { DashboardMetrics } from "@/data/dashboardMetrics";
import { resolveOverviewTrend } from "@/data/overviewDisplay";
import { flatSparkline } from "@/overview/liveOverviewMappers";
import { formatDecisionTime, formatPercent } from "@/data/orchestrationMetrics";
import OverviewMetricCard, {
  DeliveredIcon,
  InProgressIcon,
  PackageIcon,
  StopwatchIcon,
  TicketIcon,
} from "./OverviewMetricCard";
import {
  getCumulativeDeliveredSparkline,
  getCumulativeDeliverySparkline,
  getDecisionTimeSparkline,
  getRollingBookingSuccessSparkline,
} from "./sparklineUtils";

type PlatformMetricsProps = {
  metrics: DashboardMetrics;
  records?: OrchestrationRecord[];
  className?: string;
  /** When true, use API-backed trends only (no demo KPI overrides). */
  liveTrends?: boolean;
};

export default function PlatformMetrics({
  metrics,
  records = [],
  className = "",
  liveTrends = false,
}: PlatformMetricsProps) {
  const trend = (key: keyof DashboardMetrics["trends"]) =>
    liveTrends ? metrics.trends[key] : resolveOverviewTrend(key, metrics.trends[key]);

  const sparklineOrFlat = (
    fromRecords: number[],
    cumulativeValue: number,
  ): number[] | undefined => {
    if (records.length > 0) return fromRecords;
    if (cumulativeValue <= 0) return undefined;
    return flatSparkline(cumulativeValue);
  };

  return (
    <section aria-labelledby="platform-metrics-heading" className={className}>
      <h2 id="platform-metrics-heading" className="sr-only">
        Platform metrics
      </h2>
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:[&>*:last-child]:col-span-1 xl:grid-cols-5 [&>*:last-child]:col-span-2">
        <OverviewMetricCard
          title="Total Deliveries"
          value={metrics.totalDeliveries.toLocaleString()}
          trend={trend("totalDeliveries")}
          theme="orange"
          icon={<PackageIcon />}
          sparklineValues={sparklineOrFlat(
            getCumulativeDeliverySparkline(records),
            metrics.totalDeliveries,
          )}
        />
        <OverviewMetricCard
          title="Delivered"
          value={metrics.deliveredCount.toLocaleString()}
          trend={trend("delivered")}
          theme="green"
          icon={<DeliveredIcon />}
          sparklineValues={sparklineOrFlat(
            getCumulativeDeliveredSparkline(records),
            metrics.deliveredCount,
          )}
        />
        <OverviewMetricCard
          title="In Progress"
          value={metrics.inProgressCount.toLocaleString()}
          trend={trend("inProgress")}
          theme="blue"
          icon={<InProgressIcon />}
          sparklineValues={sparklineOrFlat(
            getCumulativeDeliverySparkline(records),
            metrics.inProgressCount,
          )}
        />
        <OverviewMetricCard
          title="Booking Success Rate"
          value={formatPercent(metrics.bookingSuccessRate)}
          trend={trend("bookingSuccessRate")}
          theme="purple"
          icon={<TicketIcon />}
          sparklineValues={sparklineOrFlat(
            getRollingBookingSuccessSparkline(records),
            metrics.bookingSuccessRate,
          )}
        />
        <OverviewMetricCard
          title="Avg. Orchestration Time"
          value={formatDecisionTime(metrics.averageDecisionTimeMs)}
          trend={trend("avgOrchestrationTime")}
          theme="pink"
          icon={<StopwatchIcon />}
          sparklineValues={sparklineOrFlat(
            getDecisionTimeSparkline(records),
            metrics.averageDecisionTimeMs,
          )}
        />
      </div>
    </section>
  );
}
