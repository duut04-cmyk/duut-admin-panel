import type { PlatformMetrics } from "@/data/orchestrationMetrics";
import { formatDecisionTime, formatPercent } from "@/data/orchestrationMetrics";
import AdminMetricCard from "@/ui/AdminMetricCard";

type OverviewMetricsProps = {
  metrics: PlatformMetrics;
};

export default function OverviewMetrics({ metrics }: OverviewMetricsProps) {
  return (
    <section aria-labelledby="overview-metrics-heading">
      <h2 id="overview-metrics-heading" className="sr-only">
        Platform metrics
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminMetricCard
          label="Total deliveries"
          value={metrics.totalDeliveries}
          supportingText="in selected period"
        />
        <AdminMetricCard
          label="Successful bookings"
          value={metrics.successfulBookings}
          supportingText={`${metrics.failedBookings} failed`}
        />
        <AdminMetricCard
          label="Booking success rate"
          value={formatPercent(metrics.bookingSuccessRate)}
          supportingText="of orchestrated deliveries"
        />
        <AdminMetricCard
          label="Services evaluated"
          value={metrics.totalServicesEvaluated}
          supportingText={`${metrics.totalAvailableOptions} available options`}
        />
        <AdminMetricCard
          label="Average options per delivery"
          value={metrics.averageOptionsPerDelivery}
          supportingText={`${metrics.averageAvailableOptionsPerDelivery} available avg.`}
        />
        <AdminMetricCard
          label="Average decision time"
          value={formatDecisionTime(metrics.averageDecisionTimeMs)}
          supportingText={`${formatDecisionTime(metrics.fastestDecisionTimeMs)} – ${formatDecisionTime(metrics.slowestDecisionTimeMs)} range`}
        />
      </div>
    </section>
  );
}
