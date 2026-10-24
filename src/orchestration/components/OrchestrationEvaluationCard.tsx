import ServiceLogo from "@/components/ServiceLogo";
import type { OrchestrationEvaluationRow } from "../orchestrationViewTypes";
import EvaluationResultPill from "./EvaluationResultPill";
import { formatPrice } from "./utils";

type OrchestrationEvaluationCardProps = {
  evaluation: OrchestrationEvaluationRow;
};

export default function OrchestrationEvaluationCard({
  evaluation,
}: OrchestrationEvaluationCardProps) {
  return (
    <article
      className={`rounded-lg border border-border/60 p-4 ${
        evaluation.isSelected
          ? "bg-orange-50/50 ring-1 ring-accent/20"
          : "bg-background"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <ServiceLogo serviceName={evaluation.providerLabel} className="h-8 w-8" />
          <div>
            <p className="font-semibold text-foreground">{evaluation.providerLabel}</p>
            <p className="text-caption text-muted-foreground">{evaluation.status}</p>
          </div>
        </div>
        <EvaluationResultPill
          label={evaluation.resultLabel}
          variant={evaluation.resultVariant}
        />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-small">
        <div>
          <dt className="text-caption text-muted-foreground">Quote</dt>
          <dd className="tabular-nums">{formatPrice(evaluation.price)}</dd>
        </div>
        <div>
          <dt className="text-caption text-muted-foreground">Score</dt>
          <dd className="tabular-nums">{evaluation.rowScore}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-caption text-muted-foreground">Availability</dt>
          <dd>{evaluation.availabilityLabel}</dd>
        </div>
      </dl>
    </article>
  );
}
