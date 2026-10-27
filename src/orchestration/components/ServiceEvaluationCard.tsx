import type {
  OrchestrationDecision,
  ServiceEvaluation,
} from "@/data/orchestrationTypes";
import ServiceLogo from "@/components/ServiceLogo";
import EvaluationResultPill from "./EvaluationResultPill";
import { formatEta, formatPrice, formatScore } from "./utils";

type ServiceEvaluationCardProps = {
  evaluation: ServiceEvaluation;
  decision: OrchestrationDecision;
};

function compatibilityLabel(evaluation: ServiceEvaluation): string {
  if (!evaluation.packageCompatible || !evaluation.requirementCompatible) {
    const issues: string[] = [];
    if (!evaluation.packageCompatible) issues.push("Package");
    if (!evaluation.requirementCompatible) issues.push("Requirements");
    return `Incompatible (${issues.join(", ")})`;
  }
  return "Compatible";
}

function resultLabel(
  evaluation: ServiceEvaluation,
  selectedServiceId: string,
): { label: string; variant: "accent" | "danger" | "neutral" } {
  if (!evaluation.availability) {
    const reason = evaluation.rejectionReasons[0] ?? evaluation.availabilityReason;
    return { label: reason || "Unavailable", variant: "danger" };
  }
  if (evaluation.serviceId === selectedServiceId) {
    return { label: "Selected", variant: "accent" };
  }
  return {
    label: evaluation.notSelectedReason ?? "Not selected",
    variant: "neutral",
  };
}

export default function ServiceEvaluationCard({
  evaluation,
  decision,
}: ServiceEvaluationCardProps) {
  const isSelected = evaluation.serviceId === decision.selectedServiceId;
  const result = resultLabel(evaluation, decision.selectedServiceId);
  const overallScore = isSelected ? decision.decisionScore.totalScore.toFixed(1) : "—";

  return (
    <article
      className={`rounded-lg border p-4 ${
        isSelected
          ? "border-accent/30 bg-orange-50/50"
          : "border-border/60 bg-background"
      }`}
      aria-label={`${evaluation.serviceName} evaluation${isSelected ? ", selected" : ""}`}
    >
      <div className="flex min-w-0 items-start gap-2.5">
        <ServiceLogo
          serviceName={evaluation.serviceName}
          className="mt-0.5 h-8 w-8 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground">{evaluation.serviceName}</h3>
          {isSelected && (
            <p className="mt-0.5 text-caption font-medium text-accent">✓ Selected</p>
          )}
          <EvaluationResultPill
            label={result.label}
            variant={result.variant}
            className="mt-2 max-w-full"
          />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-small">
        <div>
          <dt className="text-caption text-muted-foreground">Availability</dt>
          <dd className="mt-0.5 font-medium">
            {evaluation.availability ? "Available" : "Unavailable"}
          </dd>
        </div>
        <div className="text-right">
          <dt className="text-caption text-muted-foreground">Compatibility</dt>
          <dd className="mt-0.5">{compatibilityLabel(evaluation)}</dd>
        </div>
        <div>
          <dt className="text-caption text-muted-foreground">Price</dt>
          <dd className="mt-0.5 tabular-nums">{formatPrice(evaluation.price)}</dd>
        </div>
        <div className="text-right">
          <dt className="text-caption text-muted-foreground">ETA</dt>
          <dd className="mt-0.5 tabular-nums">
            {formatEta(evaluation.totalEtaMinutes)}
          </dd>
        </div>
        <div>
          <dt className="text-caption text-muted-foreground">Quality</dt>
          <dd className="mt-0.5 tabular-nums">
            {formatScore(evaluation.serviceQualityScore)}
          </dd>
        </div>
        <div className="text-right">
          <dt className="text-caption text-muted-foreground">Overall score</dt>
          <dd className="mt-0.5 tabular-nums font-medium">{overallScore}</dd>
        </div>
      </dl>
    </article>
  );
}
