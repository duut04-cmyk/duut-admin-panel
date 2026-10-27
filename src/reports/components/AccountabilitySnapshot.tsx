import type { LiveSnapshotMetrics } from "@/reports/liveReportMappers";
import {
  formatAccountabilityPercent,
  formatDecisionTime,
} from "@/reports/accountability";
import OverviewMetricCard, {
  DeliveredIcon,
  FailedIcon,
  InProgressIcon,
  PackageIcon,
  StopwatchIcon,
} from "@/overview/components/OverviewMetricCard";

type AccountabilitySnapshotProps = {
  metrics: LiveSnapshotMetrics;
};

export default function AccountabilitySnapshot({
  metrics,
}: AccountabilitySnapshotProps) {
  return (
    <section aria-labelledby="accountability-snapshot-heading">
      <h2 id="accountability-snapshot-heading" className="sr-only">
        Accountability snapshot
      </h2>
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-6">
        <OverviewMetricCard
          title="Delivery success"
          value={formatAccountabilityPercent(metrics.deliverySuccessRate)}
          theme="green"
          icon={<DeliveredIcon />}
          sparklineValues={[metrics.deliverySuccessRate]}
        />
        <OverviewMetricCard
          title="Booking success"
          value={formatAccountabilityPercent(metrics.bookingSuccessRate)}
          theme="blue"
          icon={<PackageIcon />}
          sparklineValues={[metrics.bookingSuccessRate]}
        />
        <OverviewMetricCard
          title="Failure rate"
          value={formatAccountabilityPercent(metrics.orchestrationFailureRate)}
          theme="red"
          icon={<FailedIcon />}
          sparklineValues={[metrics.orchestrationFailureRate]}
        />
        <OverviewMetricCard
          title="Avg decision"
          value={formatDecisionTime(metrics.avgDecisionTimeMs)}
          theme="orange"
          icon={<StopwatchIcon />}
          sparklineValues={[metrics.avgDecisionTimeMs]}
        />
        <OverviewMetricCard
          title="Providers at risk"
          value={
            metrics.providersNeedingAttentionKnown
              ? metrics.providersNeedingAttention.toLocaleString()
              : "—"
          }
          theme="slate"
          icon={<InProgressIcon />}
          sparklineValues={
            metrics.providersNeedingAttentionKnown
              ? [metrics.providersNeedingAttention]
              : undefined
          }
          supportingText={
            metrics.providersNeedingAttentionKnown
              ? "All configured providers"
              : "Provider list unavailable"
          }
        />
        <OverviewMetricCard
          title="Open issues"
          value={metrics.openIssueCount.toLocaleString()}
          theme="purple"
          icon={<FailedIcon />}
          sparklineValues={[metrics.openIssueCount]}
        />
      </div>
    </section>
  );
}
