import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import type { PlatformMetrics as PlatformMetricsType } from "@/data/orchestrationMetrics";
import {
  formatDecisionTime,
  formatPercent,
  getDeliveredCount,
} from "@/data/orchestrationMetrics";
import OverviewMetricCard, {
  BookingIcon,
  ClockIcon,
  DeliveredIcon,
  DeliveriesIcon,
} from "./OverviewMetricCard";
import {
  getCumulativeDeliveredSparkline,
  getCumulativeDeliverySparkline,
  getDecisionTimeSparkline,
  getRollingBookingSuccessSparkline,
} from "./sparklineUtils";

type PlatformMetricsProps = {
  metrics: PlatformMetricsType;
  records: OrchestrationRecord[];
};

export default function PlatformMetrics({
  metrics,
  records,
}: PlatformMetricsProps) {
  const deliveredCount = getDeliveredCount(records);
  const deliveredRate =
    metrics.totalDeliveries === 0
      ? 0
      : (deliveredCount / metrics.totalDeliveries) * 100;

  return (
    <section aria-labelledby="platform-metrics-heading">
      <h2 id="platform-metrics-heading" className="sr-only">
        Platform metrics
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewMetricCard
          title="Total Deliveries"
          value={metrics.totalDeliveries}
          supportingText="All delivery requests"
          theme="orange"
          icon={<DeliveriesIcon />}
          sparklineValues={getCumulativeDeliverySparkline(records)}
        />
        <OverviewMetricCard
          title="Delivered"
          value={deliveredCount}
          supportingText={`${formatPercent(deliveredRate)} of total`}
          theme="green"
          icon={<DeliveredIcon />}
          sparklineValues={getCumulativeDeliveredSparkline(records)}
        />
        <OverviewMetricCard
          title="Booking Success Rate"
          value={formatPercent(metrics.bookingSuccessRate)}
          supportingText={`${metrics.successfulBookings} successful bookings`}
          theme="blue"
          icon={<BookingIcon />}
          sparklineValues={getRollingBookingSuccessSparkline(records)}
        />
        <OverviewMetricCard
          title="Avg. Orchestration Time"
          value={formatDecisionTime(metrics.averageDecisionTimeMs)}
          supportingText={`${formatDecisionTime(metrics.fastestDecisionTimeMs)} – ${formatDecisionTime(metrics.slowestDecisionTimeMs)} range`}
          theme="purple"
          icon={<ClockIcon />}
          sparklineValues={getDecisionTimeSparkline(records)}
        />
      </div>
    </section>
  );
}
