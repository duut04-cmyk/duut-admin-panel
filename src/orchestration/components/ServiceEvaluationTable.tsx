import type {
  OrchestrationDecision,
  ServiceEvaluation,
} from "@/data/orchestrationTypes";
import AdminBadge from "@/ui/AdminBadge";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import ServiceEvaluationCard from "./ServiceEvaluationCard";
import { formatEta, formatPrice, formatScore } from "./utils";

type ServiceEvaluationTableProps = {
  evaluations: ServiceEvaluation[];
  decision: OrchestrationDecision;
};

function compatibilityLabel(evaluation: ServiceEvaluation): string {
  if (!evaluation.packageCompatible || !evaluation.requirementCompatible) {
    const issues: string[] = [];
    if (!evaluation.packageCompatible) issues.push("Package");
    if (!evaluation.requirementCompatible) issues.push("Requirements");
    return `No (${issues.join(", ")})`;
  }
  return "Yes";
}

function availabilityLabel(evaluation: ServiceEvaluation): string {
  if (evaluation.availability) return "Available";
  return (
    evaluation.rejectionReasons[0] ?? evaluation.availabilityReason ?? "Unavailable"
  );
}

function resultContent(
  evaluation: ServiceEvaluation,
  selectedServiceId: string,
): { text: string; variant: "accent" | "danger" | "neutral" } {
  if (!evaluation.availability) {
    return {
      text: evaluation.rejectionReasons[0] ?? "Unavailable",
      variant: "danger",
    };
  }
  if (evaluation.serviceId === selectedServiceId) {
    return { text: "Selected", variant: "accent" };
  }
  return {
    text: evaluation.notSelectedReason ?? "Not selected",
    variant: "neutral",
  };
}

export default function ServiceEvaluationTable({
  evaluations,
  decision,
}: ServiceEvaluationTableProps) {
  return (
    <section aria-labelledby="service-evaluation-heading">
      <AdminSectionHeader
        title="Service evaluation"
        description="Every service Doot evaluated for this delivery."
      />

      <div className="mt-4 space-y-3 md:hidden">
        {evaluations.map((evaluation) => (
          <ServiceEvaluationCard
            key={evaluation.serviceId}
            evaluation={evaluation}
            decision={decision}
          />
        ))}
      </div>

      <AdminCard className="mt-4 hidden overflow-x-auto px-4 md:block md:px-5">
        <table className="w-full min-w-[880px] text-left text-small">
          <caption className="sr-only">Service evaluations</caption>
          <thead>
            <tr className="border-b border-border text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="py-3 pr-4 font-semibold">
                Service
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Availability
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Compatibility
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-semibold">
                Price
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-semibold">
                ETA
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-semibold">
                Quality
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-semibold">
                Score
              </th>
              <th scope="col" className="py-3 font-semibold">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((evaluation) => {
              const isSelected = evaluation.serviceId === decision.selectedServiceId;
              const result = resultContent(evaluation, decision.selectedServiceId);
              const overallScore = isSelected
                ? decision.decisionScore.totalScore.toFixed(1)
                : "—";

              return (
                <tr
                  key={evaluation.serviceId}
                  className={`border-b border-border last:border-b-0 ${
                    isSelected ? "bg-surface-accent/40" : ""
                  }`}
                >
                  <td className="py-3.5 pr-4">
                    <span className="font-medium text-foreground">
                      {evaluation.serviceName}
                    </span>
                    {isSelected && (
                      <span className="ml-2 text-caption font-medium text-accent">
                        ✓ Selected
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 pr-4 text-muted-foreground">
                    {availabilityLabel(evaluation)}
                  </td>
                  <td className="py-3.5 pr-4">{compatibilityLabel(evaluation)}</td>
                  <td className="py-3.5 pr-4 text-right tabular-nums">
                    {formatPrice(evaluation.price)}
                  </td>
                  <td className="py-3.5 pr-4 text-right tabular-nums">
                    {formatEta(evaluation.totalEtaMinutes)}
                  </td>
                  <td className="py-3.5 pr-4 text-right tabular-nums">
                    {formatScore(evaluation.serviceQualityScore)}
                  </td>
                  <td className="py-3.5 pr-4 text-right tabular-nums font-medium">
                    {overallScore}
                  </td>
                  <td className="py-3.5">
                    <AdminBadge variant={result.variant}>{result.text}</AdminBadge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </AdminCard>
    </section>
  );
}
