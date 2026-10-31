import type { OrchestrationReporting, ReportingSummary } from "@/data/reportingTypes";
import {
  formatDecisionTime,
  formatPercent,
  trendFromChangePercent,
} from "@/overview/reportingUi";

type ReportsOpsSignalsProps = {
  summary: ReportingSummary;
  orchestration: OrchestrationReporting | null;
};

function TrendHint({ trend }: { trend: ReturnType<typeof trendFromChangePercent> }) {
  if (trend.direction === "neutral") {
    return <span className="text-caption text-muted-foreground">{trend.value}</span>;
  }
  const good = trend.direction === "positive";
  return (
    <span
      className={`text-caption font-medium ${good ? "text-emerald-600" : "text-red-600"}`}
    >
      {trend.value} vs prior
    </span>
  );
}

export function ReportsOpsSignals({ summary, orchestration }: ReportsOpsSignalsProps) {
  const d = summary.deliveriesCreated;
  const o = summary.orchestrationRuns;
  const t = summary.trends;

  const cancelRate =
    d.total === 0 ? null : Math.round((d.cancelled / d.total) * 1000) / 10;
  const failRate = o.failureRatePercent;
  const previousMs = t.averageOrchestrationDurationMs?.previous ?? null;
  const failureReasons = (orchestration?.failureReasons ?? [])
    .filter((row) => row.count > 0)
    .slice(0, 5);

  const outcomeBars = [
    {
      key: "delivered",
      label: "Delivered",
      value: d.deliveredCurrentStatus,
      color: "bg-emerald-500",
    },
    {
      key: "inProgress",
      label: "In progress",
      value: d.inProgress,
      color: "bg-blue-500",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      value: d.cancelled,
      color: "bg-orange-400",
    },
    {
      key: "failed",
      label: "Failed",
      value: d.failed,
      color: "bg-red-500",
    },
  ];
  const barTotal = Math.max(1, d.total);

  return (
    <section
      aria-labelledby="reports-ops-signals-heading"
      className="rounded-card border border-border/60 bg-background p-4 shadow-sm"
    >
      <h2
        id="reports-ops-signals-heading"
        className="text-base font-semibold text-foreground"
      >
        Period signals
      </h2>
      <p className="mt-1 text-small text-muted-foreground">
        Where volume went, how matching performed, and what blocked runs
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-3">
          <p className="text-caption font-medium text-muted-foreground">Cancel rate</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
            {formatPercent(cancelRate)}
          </p>
          <p className="mt-1 text-caption text-muted-foreground">
            {d.cancelled} of {d.total} deliveries
          </p>
        </div>
        <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-3">
          <p className="text-caption font-medium text-muted-foreground">
            Orchestration fail
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
            {formatPercent(failRate)}
          </p>
          <p className="mt-1 text-caption text-muted-foreground">
            {o.failedRuns} of {o.totalRuns} runs
          </p>
        </div>
        <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-3">
          <p className="text-caption font-medium text-muted-foreground">Avg decision</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
            {formatDecisionTime(o.averageDurationMs)}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-1.5">
            {previousMs != null && previousMs > 0 ? (
              <span className="text-caption text-muted-foreground">
                was {formatDecisionTime(previousMs)}
              </span>
            ) : null}
            <TrendHint
              trend={trendFromChangePercent(
                t.averageOrchestrationDurationMs?.changePercent ?? null,
                true,
              )}
            />
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
          Outcome mix
        </p>
        <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-muted/50">
          {outcomeBars.map((bar) =>
            bar.value > 0 ? (
              <div
                key={bar.key}
                className={`${bar.color} h-full`}
                style={{ width: `${(bar.value / barTotal) * 100}%` }}
                title={`${bar.label}: ${bar.value}`}
              />
            ) : null,
          )}
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {outcomeBars.map((bar) => (
            <li
              key={bar.key}
              className="flex items-center gap-1.5 text-caption text-muted-foreground"
            >
              <span className={`size-2 rounded-full ${bar.color}`} aria-hidden />
              {bar.label}{" "}
              <span className="font-medium tabular-nums text-foreground">
                {bar.value}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
          Top orchestration failures
        </p>
        {failureReasons.length === 0 ? (
          <p className="mt-2 text-small text-muted-foreground">
            No orchestration failures in this period.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-border">
            {failureReasons.map((row) => (
              <li
                key={row.reason}
                className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
              >
                <span className="min-w-0 truncate text-small text-foreground">
                  {row.reason.replaceAll("_", " ")}
                </span>
                <span className="shrink-0 text-small font-medium tabular-nums text-foreground">
                  {row.count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
