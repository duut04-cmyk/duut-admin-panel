import type { PlatformMetrics } from "@/data/orchestrationMetrics";
import { formatDecisionTime } from "@/data/orchestrationMetrics";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import AdminCard from "@/ui/AdminCard";
import AdminMetricCard from "@/ui/AdminMetricCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";

type OrchestrationSpeedProps = {
  metrics: PlatformMetrics;
  records: OrchestrationRecord[];
};

export default function OrchestrationSpeed({
  metrics,
  records,
}: OrchestrationSpeedProps) {
  const times = records.map((record) => record.decision.durationMs);
  const maxTime = Math.max(...times, 1);

  return (
    <section aria-labelledby="orchestration-speed-heading">
      <AdminSectionHeader
        title="Orchestration speed"
        description="How quickly Dutt evaluates services and reaches a booking decision."
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <AdminMetricCard
          label="Average"
          value={formatDecisionTime(metrics.averageDecisionTimeMs)}
          className="p-4 md:p-5"
        />
        <AdminMetricCard
          label="Fastest"
          value={formatDecisionTime(metrics.fastestDecisionTimeMs)}
          className="p-4 md:p-5"
        />
        <AdminMetricCard
          label="Slowest"
          value={formatDecisionTime(metrics.slowestDecisionTimeMs)}
          className="p-4 md:p-5"
        />
      </div>

      {records.length > 0 && (
        <AdminCard className="mt-4 space-y-3 p-5 md:p-6">
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Decision time by delivery
          </p>
          {records.map((record) => {
            const ms = record.decision.durationMs;
            const width = (ms / maxTime) * 100;
            return (
              <div key={record.deliveryRequest.deliveryId}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-small">
                  <span className="font-medium text-foreground">
                    {record.deliveryRequest.deliveryId}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatDecisionTime(ms)}
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-pill bg-surface"
                  role="progressbar"
                  aria-valuenow={Math.round(width)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${record.deliveryRequest.deliveryId} decision time ${formatDecisionTime(ms)}`}
                >
                  <div
                    className="h-full rounded-pill bg-accent/70"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </AdminCard>
      )}
    </section>
  );
}
