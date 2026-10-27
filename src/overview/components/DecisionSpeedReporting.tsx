"use client";

import type { ReportingSummary } from "@/data/reportingTypes";
import { formatDecisionTime, trendFromChangePercent } from "@/overview/reportingUi";

type DecisionSpeedReportingProps = {
  summary: ReportingSummary;
};

function StatTrendFromReporting({
  trend,
}: {
  trend: ReturnType<typeof trendFromChangePercent>;
}) {
  if (trend.direction === "neutral") {
    return <p className="mt-1 text-caption text-muted-foreground">{trend.value}</p>;
  }
  const isUp = trend.direction === "positive";
  return (
    <p
      className={`mt-1 flex items-center justify-center gap-0.5 text-caption font-medium ${isUp ? "text-emerald-600" : "text-red-600"}`}
    >
      <svg
        className="h-3 w-3 shrink-0"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        {isUp ? (
          <path
            d="M6 9V3M6 3L3 6M6 3l3 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 3v6M6 9L3 6M6 9l3-3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      <span>{trend.value}</span>
    </p>
  );
}

export default function DecisionSpeedReporting({
  summary,
}: DecisionSpeedReportingProps) {
  const { orchestrationRuns, trends } = summary;
  const averageMs = orchestrationRuns.averageDurationMs;
  const trend = trendFromChangePercent(
    trends.averageOrchestrationDurationMs.changePercent,
    true,
  );

  return (
    <article
      className="min-w-0 rounded-card border border-border/60 bg-background p-4 font-sans shadow-sm sm:p-5"
      aria-labelledby="decision-speed-heading"
    >
      <h2
        id="decision-speed-heading"
        className="text-subheading font-semibold leading-snug text-foreground"
      >
        Decision Speed
      </h2>
      <p className="mt-1 text-small text-muted-foreground">
        Average orchestration run duration for runs created in the selected period (
        {orchestrationRuns.durationSampleSize.toLocaleString()} completed with timing).
      </p>

      <div className="mt-5 rounded-lg border border-border px-4 py-6 text-center">
        <p className="text-small font-medium text-muted-foreground">Average duration</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
          {formatDecisionTime(averageMs)}
        </p>
        <StatTrendFromReporting trend={trend} />
      </div>

      {orchestrationRuns.durationSampleSize === 0 ? (
        <p className="mt-4 text-center text-small text-muted-foreground">
          No completed runs with timing in this period.
        </p>
      ) : null}
    </article>
  );
}
