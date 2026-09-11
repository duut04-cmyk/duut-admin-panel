import type { DecisionFactorInfluence } from "@/data/orchestrationMetrics";
import { formatPercent } from "@/data/orchestrationMetrics";
import type { ScoreFactorKey } from "@/data/orchestrationTypes";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";

const FACTOR_LABELS: Record<ScoreFactorKey, string> = {
  availability: "Availability",
  packageFit: "Package fit",
  requirementFit: "Requirement fit",
  price: "Price",
  eta: "ETA",
  serviceQuality: "Service quality",
};

type DecisionFactorsProps = {
  factors: DecisionFactorInfluence[];
};

export default function DecisionFactors({ factors }: DecisionFactorsProps) {
  const maxContribution = Math.max(
    ...factors.map((f) => f.averageContributionPercent),
    1,
  );

  return (
    <section aria-labelledby="decision-factors-heading">
      <AdminSectionHeader
        title="Decision factor analysis"
        description="Average contribution of each factor across orchestration decisions. Weight reflects configured importance; contribution reflects actual scoring impact."
      />

      <AdminCard className="mt-4 space-y-5">
        {factors.map((factor) => (
          <div key={factor.factor}>
            <div className="mb-2 flex items-center justify-between gap-3 text-small">
              <span className="font-medium text-foreground">
                {FACTOR_LABELS[factor.factor]}
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {formatPercent(factor.averageContributionPercent)} · weight{" "}
                {factor.averageWeight}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-pill bg-surface">
              <div
                className="h-full rounded-pill bg-accent/80"
                style={{
                  width: `${(factor.averageContributionPercent / maxContribution) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}

        <p className="border-t border-border pt-4 text-small text-muted-foreground">
          Doot evaluates multiple parameters rather than selecting purely on price.
          Each orchestration decision combines availability, compatibility, price,
          ETA, and service quality into a weighted score.
        </p>
      </AdminCard>
    </section>
  );
}
