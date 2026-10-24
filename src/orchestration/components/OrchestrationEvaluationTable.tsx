import ServiceLogo from "@/components/ServiceLogo";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import type { OrchestrationEvaluationRow } from "../orchestrationViewTypes";
import EvaluationResultPill from "./EvaluationResultPill";
import OrchestrationDetailCard from "./OrchestrationDetailCard";
import OrchestrationEvaluationCard from "./OrchestrationEvaluationCard";
import { formatPrice } from "./utils";

type OrchestrationEvaluationTableProps = {
  evaluations: OrchestrationEvaluationRow[];
};

export default function OrchestrationEvaluationTable({
  evaluations,
}: OrchestrationEvaluationTableProps) {
  return (
    <section aria-labelledby="service-evaluation-heading">
      <AdminSectionHeader
        title="Provider evaluation"
        description="Persisted provider evaluations for this orchestration attempt."
      />

      <OrchestrationDetailCard className="mt-4 min-w-0 overflow-hidden">
        <div className="space-y-3 p-4 lg:hidden">
          {evaluations.map((evaluation) => (
            <OrchestrationEvaluationCard key={evaluation.id} evaluation={evaluation} />
          ))}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[880px] text-left text-small">
            <caption className="sr-only">Provider evaluations</caption>
            <thead>
              <tr className="border-b border-border/60 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-5 py-3 font-semibold">
                  Provider
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Availability
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Serviceability
                </th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">
                  Quote
                </th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">
                  ETA
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
              {evaluations.map((evaluation) => (
                <tr
                  key={evaluation.id}
                  className={`border-b border-border/60 transition-colors last:border-b-0 hover:bg-surface/30 ${
                    evaluation.isSelected ? "bg-orange-50/50" : ""
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <ServiceLogo serviceName={evaluation.providerLabel} />
                      <span className="font-medium text-foreground">
                        {evaluation.providerLabel}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {evaluation.status}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {evaluation.availabilityLabel}
                  </td>
                  <td className="px-5 py-3.5">{evaluation.compatibilityLabel}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums">
                    {formatPrice(evaluation.price)}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                    {evaluation.etaDisplay}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums font-medium">
                    {evaluation.rowScore}
                  </td>
                  <td className="px-5 py-3.5">
                    <EvaluationResultPill
                      label={evaluation.resultLabel}
                      variant={evaluation.resultVariant}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </OrchestrationDetailCard>
    </section>
  );
}
