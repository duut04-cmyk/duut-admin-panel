import type { DecisionScore as DecisionScoreType } from "@/data/orchestrationTypes";
import { SCORE_FACTOR_WEIGHTS } from "@/data/orchestrationTypes";
import type { ScoreFactorKey } from "@/data/orchestrationTypes";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import { FACTOR_LABELS } from "./utils";

type DecisionScoreProps = {
  decisionScore: DecisionScoreType;
  selectedServiceName: string;
};

export default function DecisionScore({
  decisionScore,
  selectedServiceName,
}: DecisionScoreProps) {
  const factorKeys = Object.keys(SCORE_FACTOR_WEIGHTS) as ScoreFactorKey[];

  return (
    <section aria-labelledby="decision-score-heading">
      <AdminSectionHeader
        title="Decision score"
        description={`Overall score for ${selectedServiceName}.`}
      />

      <AdminCard className="mt-4 p-5 md:p-6">
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          Overall score
        </p>
        <p
          className="mt-2 text-[2.5rem] font-bold tabular-nums leading-none tracking-tight text-foreground"
          aria-label={`Decision score ${decisionScore.totalScore} out of 100`}
        >
          {decisionScore.totalScore.toFixed(1)}
          <span className="text-body-lg font-medium text-muted-foreground"> / 100</span>
        </p>

        <dl className="mt-6 space-y-3 border-t border-border pt-5">
          {factorKeys.map((key) => {
            const factor = decisionScore.factors[key];
            return (
              <div
                key={key}
                className="flex items-center justify-between gap-4 text-small"
              >
                <dt className="text-muted-foreground">{FACTOR_LABELS[key]}</dt>
                <dd className="tabular-nums font-medium text-foreground">
                  {factor.score.toFixed(0)}
                  <span className="ml-2 text-caption font-normal text-muted-foreground">
                    (weight {factor.weight})
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
      </AdminCard>
    </section>
  );
}
