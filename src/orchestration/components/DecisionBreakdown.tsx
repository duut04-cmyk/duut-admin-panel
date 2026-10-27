import type { DecisionScore as DecisionScoreType } from "@/data/orchestrationTypes";
import { SCORE_FACTOR_WEIGHTS } from "@/data/orchestrationTypes";
import type { ScoreFactorKey } from "@/data/orchestrationTypes";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import OrchestrationDetailCard from "./OrchestrationDetailCard";
import { FACTOR_LABELS } from "./utils";

type DecisionBreakdownProps = {
  decisionScore: DecisionScoreType;
  selectedServiceName: string;
};

export default function DecisionBreakdown({
  decisionScore,
  selectedServiceName,
}: DecisionBreakdownProps) {
  const factorKeys = Object.keys(SCORE_FACTOR_WEIGHTS) as ScoreFactorKey[];
  const total = decisionScore.totalScore;

  const contributions = factorKeys.map((key) => {
    const factor = decisionScore.factors[key];
    const percent = total > 0 ? (factor.weightedScore / total) * 100 : 0;
    return { key, factor, percent };
  });

  const maxPercent = Math.max(...contributions.map((c) => c.percent), 1);

  return (
    <section aria-labelledby="decision-breakdown-heading" className="min-w-0">
      <AdminSectionHeader
        title="Decision breakdown"
        description={`Overall score and factor contributions for ${selectedServiceName}.`}
      />

      <OrchestrationDetailCard className="mt-4 p-5 md:p-6">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Overall score
          </p>
          <p
            className="mt-2 text-[2.5rem] font-bold tabular-nums leading-none tracking-tight text-foreground"
            aria-label={`Decision score ${decisionScore.totalScore} out of 100`}
          >
            {decisionScore.totalScore.toFixed(1)}
            <span className="text-body-lg font-medium text-muted-foreground">
              {" "}
              / 100
            </span>
          </p>
        </div>

        <div className="mt-6 space-y-4 border-t border-border/60 pt-5">
          {contributions.map(({ key, factor, percent }) => (
            <div key={key}>
              <div className="mb-2 flex items-center justify-between gap-3 text-small">
                <span className="font-medium text-foreground">
                  {FACTOR_LABELS[key]}
                </span>
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
                  className="h-full rounded-pill bg-orange-500/80"
                  style={{ width: `${(percent / maxPercent) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-caption text-muted-foreground">
                Score {factor.score.toFixed(0)} · weighted{" "}
                {factor.weightedScore.toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      </OrchestrationDetailCard>
    </section>
  );
}
