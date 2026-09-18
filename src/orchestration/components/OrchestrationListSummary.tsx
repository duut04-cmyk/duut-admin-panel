import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import type { MetricTrend } from "@/data/dashboardMetrics";
import type { PlatformMetrics } from "@/data/orchestrationMetrics";
import { formatDecisionTime, formatPercent } from "@/data/orchestrationMetrics";
import OverviewMetricCard, {
  InProgressIcon,
  PackageIcon,
  StopwatchIcon,
  TicketIcon,
} from "@/overview/components/OverviewMetricCard";
import {
  getCumulativeAvailableOptionsSparkline,
  getCumulativeDeliverySparkline,
  getCumulativeServicesEvaluatedSparkline,
  getDecisionTimeSparkline,
  getRollingBookingSuccessSparkline,
} from "@/overview/components/sparklineUtils";

function LayersIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        d="M10 3l7 3.5-7 3.5L3 6.5 10 3zM3 10.5L10 14l7-3.5M3 13.5L10 17l7-3.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const orchestrationTrends = {
  total: { value: "12%", direction: "positive" },
  servicesEvaluated: { value: "9%", direction: "positive" },
  availableOptions: { value: "6%", direction: "positive" },
  bookingSuccessRate: { value: "3.2%", direction: "positive" },
  avgDecisionTime: { value: "18%", direction: "negative" },
} as const satisfies Record<string, MetricTrend>;

type OrchestrationListSummaryProps = {
  metrics: PlatformMetrics;
  records: OrchestrationRecord[];
  className?: string;
};

export default function OrchestrationListSummary({
  metrics,
  records,
  className = "",
}: OrchestrationListSummaryProps) {
  return (
    <section aria-labelledby="orchestration-summary-heading" className={className}>
      <h2 id="orchestration-summary-heading" className="sr-only">
        Orchestration summary
      </h2>
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:[&>*:last-child]:col-span-1 xl:grid-cols-5 [&>*:last-child]:col-span-2">
        <OverviewMetricCard
          title="Total Orchestrations"
          value={metrics.totalDeliveries.toLocaleString()}
          trend={orchestrationTrends.total}
          theme="orange"
          icon={<PackageIcon />}
          sparklineValues={getCumulativeDeliverySparkline(records)}
        />
        <OverviewMetricCard
          title="Services Evaluated"
          value={metrics.totalServicesEvaluated.toLocaleString()}
          trend={orchestrationTrends.servicesEvaluated}
          theme="purple"
          icon={<LayersIcon />}
          sparklineValues={getCumulativeServicesEvaluatedSparkline(records)}
        />
        <OverviewMetricCard
          title="Available Options"
          value={metrics.totalAvailableOptions.toLocaleString()}
          trend={orchestrationTrends.availableOptions}
          theme="blue"
          icon={<InProgressIcon />}
          sparklineValues={getCumulativeAvailableOptionsSparkline(records)}
        />
        <OverviewMetricCard
          title="Booking Success Rate"
          value={formatPercent(metrics.bookingSuccessRate)}
          trend={orchestrationTrends.bookingSuccessRate}
          theme="green"
          icon={<TicketIcon />}
          sparklineValues={getRollingBookingSuccessSparkline(records)}
        />
        <OverviewMetricCard
          title="Avg. Decision Time"
          value={formatDecisionTime(metrics.averageDecisionTimeMs)}
          trend={orchestrationTrends.avgDecisionTime}
          theme="pink"
          icon={<StopwatchIcon />}
          sparklineValues={getDecisionTimeSparkline(records)}
        />
      </div>
    </section>
  );
}
