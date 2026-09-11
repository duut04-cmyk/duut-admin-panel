import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import type { DashboardMetrics } from "@/data/dashboardMetrics";
import { resolveOverviewTrend } from "@/data/overviewDisplay";
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
  records: OrchestrationRecord[];
  className?: string;
};

export default function PlatformMetrics({
  metrics,
  records,
  className = "",
}: PlatformMetricsProps) {
  return (
    <section
      aria-labelledby="platform-metrics-heading"
      className={className}
    >
      <h2 id="platform-metrics-heading" className="sr-only">
        Platform metrics
      </h2>
      <div className="grid min-w-0 grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <OverviewMetricCard
          title="Total Deliveries"
          value={metrics.totalDeliveries.toLocaleString()}
          trend={resolveOverviewTrend(
            "totalDeliveries",
            metrics.trends.totalDeliveries,
          )}
          theme="orange"
          icon={<PackageIcon />}
          sparklineValues={getCumulativeDeliverySparkline(records)}
        />
        <OverviewMetricCard
          title="Delivered"
          value={metrics.deliveredCount.toLocaleString()}
          trend={resolveOverviewTrend("delivered", metrics.trends.delivered)}
          theme="green"
          icon={<DeliveredIcon />}
          sparklineValues={getCumulativeDeliveredSparkline(records)}
        />
        <OverviewMetricCard
          title="In Progress"
          value={metrics.inProgressCount.toLocaleString()}
          trend={resolveOverviewTrend(
            "inProgress",
            metrics.trends.inProgress,
          )}
          theme="blue"
          icon={<InProgressIcon />}
          sparklineValues={getCumulativeDeliverySparkline(records)}
        />
        <OverviewMetricCard
          title="Booking Success Rate"
          value={formatPercent(metrics.bookingSuccessRate)}
          trend={resolveOverviewTrend(
            "bookingSuccessRate",
            metrics.trends.bookingSuccessRate,
          )}
          theme="purple"
          icon={<TicketIcon />}
          sparklineValues={getRollingBookingSuccessSparkline(records)}
        />
        <OverviewMetricCard
          title="Avg. Orchestration Time"
          value={formatDecisionTime(metrics.averageDecisionTimeMs)}
          trend={resolveOverviewTrend(
            "avgOrchestrationTime",
            metrics.trends.avgOrchestrationTime,
          )}
          theme="pink"
          icon={<StopwatchIcon />}
          sparklineValues={getDecisionTimeSparkline(records)}
        />
      </div>
    </section>
  );
}
