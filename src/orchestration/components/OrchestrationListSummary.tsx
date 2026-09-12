import type { PlatformMetrics } from "@/data/orchestrationMetrics";
import { formatDecisionTime, formatPercent } from "@/data/orchestrationMetrics";
import AdminMetricCard from "@/ui/AdminMetricCard";

type OrchestrationListSummaryProps = {
  metrics: PlatformMetrics;
};

export default function OrchestrationListSummary({
  metrics,
}: OrchestrationListSummaryProps) {
  return (
    <section aria-labelledby="orchestration-summary-heading">
      <h2 id="orchestration-summary-heading" className="sr-only">
        Orchestration summary
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        <AdminMetricCard
          label="Total orchestrations"
          value={metrics.totalDeliveries}
          className="p-4 md:p-5"
        />
        <AdminMetricCard
          label="Services evaluated"
          value={metrics.totalServicesEvaluated}
          className="p-4 md:p-5"
        />
        <AdminMetricCard
          label="Available options"
          value={metrics.totalAvailableOptions}
          className="p-4 md:p-5"
        />
        <AdminMetricCard
          label="Booking success rate"
          value={formatPercent(metrics.bookingSuccessRate)}
          className="p-4 md:p-5"
        />
        <AdminMetricCard
          label="Avg. decision time"
          value={formatDecisionTime(metrics.averageDecisionTimeMs)}
          className="col-span-2 p-4 sm:col-span-1 md:p-5"
        />
      </div>
    </section>
  );
}
