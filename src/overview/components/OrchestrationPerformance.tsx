import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import {
  countEligibleEvaluations,
  type PlatformMetrics,
} from "@/data/orchestrationMetrics";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import { FlowArrow, FlowStep } from "./FlowSteps";

type OrchestrationPerformanceProps = {
  metrics: PlatformMetrics;
  records: OrchestrationRecord[];
};

export default function OrchestrationPerformance({
  metrics,
  records,
}: OrchestrationPerformanceProps) {
  const eligibleCount = countEligibleEvaluations(records);
  const selectedCount = metrics.totalDeliveries;

  return (
    <section aria-labelledby="orchestration-performance-heading">
      <AdminSectionHeader
        title="Orchestration performance"
        description="How Dutt evaluates, filters, scores, and books delivery services."
      />

      <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
        <FlowStep
          value={metrics.totalServicesEvaluated}
          label="Services evaluated"
        />
        <FlowArrow />
        <FlowStep value={metrics.totalAvailableOptions} label="Available" />
        <FlowArrow />
        <FlowStep value={eligibleCount} label="Eligible" />
        <FlowArrow />
        <FlowStep value={selectedCount} label="Selected" highlight />
      </div>

      <p className="mt-6 text-center text-small text-muted-foreground">
        Across {metrics.totalDeliveries} deliveries, Dutt evaluated{" "}
        {metrics.totalServicesEvaluated} service options and selected the best
        eligible option for each request.
      </p>
    </section>
  );
}
