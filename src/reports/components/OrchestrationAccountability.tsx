import type { OrchestrationAccountabilityMetrics } from "@/reports/accountability";
import {
  formatAccountabilityPercent,
  formatDecisionTime,
} from "@/reports/accountability";
import AdminEmptyState from "@/ui/AdminEmptyState";

type OrchestrationAccountabilityProps = {
  metrics: OrchestrationAccountabilityMetrics;
};

function MetricBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-border/60 bg-background p-4">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="mt-1 text-body font-semibold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  );
}

function ReasonList({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number }[];
}) {
  return (
    <div className="rounded-card border border-border/60 bg-background p-4 sm:p-5">
      <h3 className="text-small font-semibold text-foreground">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-small text-muted-foreground">
          No issues in this period.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-3 text-small"
            >
              <span className="min-w-0 text-foreground">{item.label}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {item.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function OrchestrationAccountability({
  metrics,
}: OrchestrationAccountabilityProps) {
  if (metrics.totalRuns === 0) {
    return (
      <AdminEmptyState
        title="No orchestration activity"
        description="No orchestration runs in the selected period."
      />
    );
  }

  const failureRate =
    metrics.totalRuns === 0 ? 0 : (metrics.failedBookings / metrics.totalRuns) * 100;

  return (
    <div className="space-y-4">
      <div className="grid min-w-0 grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricBlock
          label="Orchestration runs"
          value={metrics.totalRuns.toLocaleString()}
        />
        <MetricBlock
          label="Booking success"
          value={formatAccountabilityPercent(
            metrics.totalRuns === 0
              ? 0
              : (metrics.successfulBookings / metrics.totalRuns) * 100,
          )}
        />
        <MetricBlock
          label="Booking failure rate"
          value={formatAccountabilityPercent(failureRate)}
        />
        <MetricBlock
          label="Avg decision time"
          value={formatDecisionTime(metrics.avgDecisionTimeMs)}
        />
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <ReasonList title="Top exclusion reasons" items={metrics.topExclusions} />
        <ReasonList title="Booking failures" items={metrics.topBookingFailures} />
      </div>

      <p className="text-caption text-muted-foreground">
        Slowest decision in period: {formatDecisionTime(metrics.slowestDecisionTimeMs)}{" "}
        · {metrics.cancelledDeliveries} cancelled deliveries
      </p>
    </div>
  );
}
