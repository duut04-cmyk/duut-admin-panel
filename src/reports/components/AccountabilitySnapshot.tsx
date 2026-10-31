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
    <section aria-labelledby="health-snapshot-heading" className="space-y-4">
      <div>
        <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-accent">
          Snapshot
        </p>
        <h2
          id="health-snapshot-heading"
          className="mt-0.5 text-body-lg font-bold tracking-tight text-foreground"
        >
          Period health
        </h2>
        <p className="mt-0.5 text-small text-muted-foreground">
          Outcomes first, then operational pressure signals for this date range.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          Outcomes
        </p>
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
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
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          Ops signals
        </p>
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
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
                ? "From configured providers"
                : "Provider list unavailable"
            }
          />
          <OverviewMetricCard
            title="Open issues"
            value={metrics.openIssueCount.toLocaleString()}
            theme="purple"
            icon={<FailedIcon />}
            sparklineValues={[metrics.openIssueCount]}
            supportingText="See issue queue above"
          />
        </div>
      </div>
    </section>
  );
}
