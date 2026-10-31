import type { ReactNode } from "react";
import type { MetricTrend } from "@/data/dashboardMetrics";
import type { ReportingSummary } from "@/data/reportingTypes";
import OverviewMetricCard, {
  type MetricTheme,
} from "@/overview/components/OverviewMetricCard";
import { formatPercent, trendFromChangePercent } from "@/overview/reportingUi";

type ReportsKpiCardsProps = {
  summary: ReportingSummary;
};

function PackageIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M3.5 6.5 10 3l6.5 3.5v7L10 17l-6.5-3.5v-7Z" strokeLinejoin="round" />
      <path
        d="M10 10v7M3.5 6.5 10 10l6.5-3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="10" cy="10" r="7" />
      <path
        d="M6.5 10.2 8.8 12.5 13.5 7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CancelIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="10" cy="10" r="7" />
      <path d="M7 7l6 6M13 7l-6 6" strokeLinecap="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M10 3.5 17 16H3L10 3.5Z" strokeLinejoin="round" />
      <path d="M10 8v3.5M10 14h.01" strokeLinecap="round" />
    </svg>
  );
}

const NEUTRAL_TREND: MetricTrend = { value: "—", direction: "neutral" };

type Kpi = {
  title: string;
  value: ReactNode;
  supportingText: string;
  theme: MetricTheme;
  icon: ReactNode;
  trend: MetricTrend;
};

export function ReportsKpiCards({ summary }: ReportsKpiCardsProps) {
  const d = summary.deliveriesCreated;
  const o = summary.orchestrationRuns;
  const t = summary.trends;

  const successRate =
    d.total === 0 ? null : Math.round((d.deliveredCurrentStatus / d.total) * 1000) / 10;
  const cancelRate =
    d.total === 0 ? null : Math.round((d.cancelled / d.total) * 1000) / 10;

  const cards: Kpi[] = [
    {
      title: "Deliveries",
      value: d.total.toLocaleString(),
      supportingText: `${d.deliveredCurrentStatus} delivered · ${d.inProgress} active`,
      theme: "orange",
      icon: <PackageIcon />,
      trend: trendFromChangePercent(t.deliveriesCreated?.changePercent ?? null),
    },
    {
      title: "Success rate",
      value: formatPercent(successRate),
      supportingText: `${d.deliveredCurrentStatus} of ${d.total} currently delivered`,
      theme: "green",
      icon: <CheckIcon />,
      trend: trendFromChangePercent(t.deliveredCurrentStatus?.changePercent ?? null),
    },
    {
      title: "Cancel rate",
      value: formatPercent(cancelRate),
      supportingText: `${d.cancelled} cancelled · ${d.failed} failed`,
      theme: "red",
      icon: <CancelIcon />,
      trend: NEUTRAL_TREND,
    },
    {
      title: "Orch. fail rate",
      value: formatPercent(o.failureRatePercent),
      supportingText: `${o.failedRuns} failed · ${o.completedRuns} completed`,
      theme: "purple",
      icon: <AlertIcon />,
      trend: trendFromChangePercent(
        t.orchestrationFailureRatePercent?.changePercent ?? null,
        true,
      ),
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <OverviewMetricCard
          key={card.title}
          title={card.title}
          value={card.value}
          supportingText={card.supportingText}
          theme={card.theme}
          icon={card.icon}
          trend={card.trend}
        />
      ))}
    </div>
  );
}
