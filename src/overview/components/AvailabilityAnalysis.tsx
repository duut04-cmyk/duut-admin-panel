import type { PlatformMetrics } from "@/data/orchestrationMetrics";
import { formatPercent } from "@/data/orchestrationMetrics";
import AdminCard from "@/ui/AdminCard";
import AdminProgress from "@/ui/AdminProgress";
import AdminSectionHeader from "@/ui/AdminSectionHeader";

type AvailabilityAnalysisProps = {
  metrics: PlatformMetrics;
};

export default function AvailabilityAnalysis({ metrics }: AvailabilityAnalysisProps) {
  const unavailable = metrics.totalServicesEvaluated - metrics.totalAvailableOptions;
  const unavailableRate =
    metrics.totalServicesEvaluated === 0
      ? 0
      : (unavailable / metrics.totalServicesEvaluated) * 100;

  return (
    <section aria-labelledby="availability-analysis-heading">
      <AdminSectionHeader
        title="Availability analysis"
        description="Doot checks service availability before selecting a provider — incompatible or unavailable options are filtered out."
      />

      <AdminCard className="mt-4 space-y-5 p-5 md:p-6">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-caption text-muted-foreground">Evaluations</dt>
            <dd className="mt-0.5 text-body font-semibold tabular-nums">
              {metrics.totalServicesEvaluated}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Available</dt>
            <dd className="mt-0.5 text-body font-semibold tabular-nums">
              {metrics.totalAvailableOptions}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Unavailable</dt>
            <dd className="mt-0.5 text-body font-semibold tabular-nums">
              {unavailable}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Availability rate</dt>
            <dd className="mt-0.5 text-body font-semibold tabular-nums">
              {formatPercent(metrics.availabilityRate)}
            </dd>
          </div>
        </dl>

        <AdminProgress
          label="Available evaluations"
          value={metrics.availabilityRate}
          tone="success"
        />
        <AdminProgress
          label="Unavailable evaluations"
          value={unavailableRate}
          tone="warning"
        />
      </AdminCard>
    </section>
  );
}
