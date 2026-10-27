import type { BackendScoreBreakdown } from "@/data/orchestrationApiTypes";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import OrchestrationDetailCard from "./OrchestrationDetailCard";

const FACTOR_KEYS: Array<
  keyof Pick<
    BackendScoreBreakdown,
    "price" | "eta" | "availability" | "providerPriority" | "serviceQuality"
  >
> = ["price", "eta", "availability", "providerPriority", "serviceQuality"];

const FACTOR_LABELS: Record<(typeof FACTOR_KEYS)[number], string> = {
  price: "Price",
  eta: "ETA",
  availability: "Availability",
  providerPriority: "Provider priority",
  serviceQuality: "Service quality",
};

type OrchestrationScoreBreakdownProps = {
  selectedProviderLabel: string;
  totalScore: number | null;
  breakdown: BackendScoreBreakdown | null;
};

export default function OrchestrationScoreBreakdown({
  selectedProviderLabel,
  totalScore,
  breakdown,
}: OrchestrationScoreBreakdownProps) {
  if (totalScore === null && !breakdown) {
    return (
      <section aria-labelledby="decision-breakdown-heading" className="min-w-0">
        <AdminSectionHeader
          title="Decision breakdown"
          description="Persisted scoring for the selected provider evaluation."
        />
        <OrchestrationDetailCard className="mt-4 p-5 md:p-6">
          <p className="text-small text-muted-foreground">
            No score breakdown is stored for the selected provider.
          </p>
        </OrchestrationDetailCard>
      </section>
    );
  }

  const displayTotal =
    totalScore ?? breakdown?.rawWeightedScore ?? breakdown?.applicableWeightSum ?? null;

  const contributions = breakdown
    ? FACTOR_KEYS.map((key) => ({
        key,
        value: breakdown[key],
      })).filter((entry) => entry.value !== null)
    : [];

  const maxValue = Math.max(...contributions.map((c) => c.value ?? 0), 1);

  return (
    <section aria-labelledby="decision-breakdown-heading" className="min-w-0">
      <AdminSectionHeader
        title="Decision breakdown"
        description={`Persisted score components for ${selectedProviderLabel}.`}
      />

      <OrchestrationDetailCard className="mt-4 p-5 md:p-6">
        {displayTotal !== null ? (
          <div>
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Weighted score
            </p>
            <p className="mt-2 text-[2rem] font-bold tabular-nums leading-none text-foreground">
              {displayTotal.toFixed(2)}
            </p>
            {breakdown ? (
              <p className="mt-1 text-caption text-muted-foreground">
                Raw weighted {breakdown.rawWeightedScore.toFixed(2)} · applicable weight
                sum {breakdown.applicableWeightSum.toFixed(2)}
              </p>
            ) : null}
          </div>
        ) : null}

        {contributions.length > 0 ? (
          <div className="mt-6 space-y-4 border-t border-border/60 pt-5">
            {contributions.map(({ key, value }) => {
              const percent = value !== null ? (value / maxValue) * 100 : 0;
              return (
                <div key={key}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-small">
                    <span className="font-medium text-foreground">
                      {FACTOR_LABELS[key]}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {value?.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-pill bg-surface">
                    <div
                      className="h-full rounded-pill bg-orange-500/80"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-small text-muted-foreground">
            Factor-level breakdown is not available for this evaluation.
          </p>
        )}
      </OrchestrationDetailCard>
    </section>
  );
}
