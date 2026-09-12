import type { DecisionScore as DecisionScoreType } from "@/data/orchestrationTypes";
import { SCORE_FACTOR_WEIGHTS } from "@/data/orchestrationTypes";
import type { ScoreFactorKey } from "@/data/orchestrationTypes";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import { FACTOR_LABELS } from "./utils";

type DecisionFactorsProps = {
  decisionScore: DecisionScoreType;
};

export default function DecisionFactors({ decisionScore }: DecisionFactorsProps) {
  const factorKeys = Object.keys(SCORE_FACTOR_WEIGHTS) as ScoreFactorKey[];
  const total = decisionScore.totalScore;

  const contributions = factorKeys.map((key) => {
    const factor = decisionScore.factors[key];
    const percent = total > 0 ? (factor.weightedScore / total) * 100 : 0;
    return { key, factor, percent };
  });

  const maxPercent = Math.max(...contributions.map((c) => c.percent), 1);

  return (
    <section aria-labelledby="decision-factors-detail-heading">
      <AdminSectionHeader
        title="Decision factors"
        description="How each criterion contributed to the winning score."
      />

      <AdminCard className="mt-4 space-y-5 p-5 md:p-6">
        {contributions.map(({ key, factor, percent }) => (
          <div key={key}>
            <div className="mb-2 flex items-center justify-between gap-3 text-small">
              <span className="font-medium text-foreground">{FACTOR_LABELS[key]}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {percent.toFixed(1)}%
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-pill bg-surface"
              role="progressbar"
              aria-valuenow={Math.round(percent)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${FACTOR_LABELS[key]} contribution ${percent.toFixed(1)} percent`}
            >
              <div
                className="h-full rounded-pill bg-accent/80"
                style={{ width: `${(percent / maxPercent) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-caption text-muted-foreground">
              Score {factor.score.toFixed(0)} · weighted{" "}
              {factor.weightedScore.toFixed(1)}
            </p>
          </div>
        ))}
      </AdminCard>
    </section>
  );
}
