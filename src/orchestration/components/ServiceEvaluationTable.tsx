import type {
  OrchestrationDecision,
  ServiceEvaluation,
} from "@/data/orchestrationTypes";
import ServiceLogo from "@/components/ServiceLogo";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import EvaluationResultPill from "./EvaluationResultPill";
import OrchestrationDetailCard from "./OrchestrationDetailCard";
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

      <OrchestrationDetailCard className="mt-4 min-w-0 overflow-hidden">
        <div className="space-y-3 p-4 lg:hidden">
          {evaluations.map((evaluation) => (
            <ServiceEvaluationCard
              key={evaluation.serviceId}
              evaluation={evaluation}
              decision={decision}
            />
          ))}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[880px] text-left text-small">
            <caption className="sr-only">Service evaluations</caption>
            <thead>
              <tr className="border-b border-border/60 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-5 py-3 font-semibold">
                  Service
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Availability
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Compatibility
                </th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">
                  Price
                </th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">
                  ETA
                </th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">
                  Quality
                </th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">
                  Score
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
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
                    className={`border-b border-border/60 transition-colors last:border-b-0 hover:bg-surface/30 ${
                      isSelected ? "bg-orange-50/50" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <ServiceLogo serviceName={evaluation.serviceName} />
                        <span className="font-medium text-foreground">
                          {evaluation.serviceName}
                        </span>
                        {isSelected && (
                          <span className="text-caption font-medium text-accent">
                            ✓ Selected
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {availabilityLabel(evaluation)}
                    </td>
                    <td className="px-5 py-3.5">{compatibilityLabel(evaluation)}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums">
                      {formatPrice(evaluation.price)}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums">
                      {formatEta(evaluation.totalEtaMinutes)}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums">
                      {formatScore(evaluation.serviceQualityScore)}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums font-medium">
                      {overallScore}
                    </td>
                    <td className="px-5 py-3.5">
                      <EvaluationResultPill
                        label={result.text}
                        variant={result.variant}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </OrchestrationDetailCard>
    </section>
  );
}
