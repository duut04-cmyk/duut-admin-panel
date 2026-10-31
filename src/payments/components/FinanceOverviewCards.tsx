import type { ReactNode } from "react";
import { MetricCardsSkeleton } from "@/components/loading/skeletonSections";
import OverviewMetricCard, {
  type MetricTheme,
} from "@/overview/components/OverviewMetricCard";
import type { MetricTrend } from "@/data/dashboardMetrics";
import type { FinanceSummary } from "@/data/financeTypes";
import { formatInrAmount } from "../lib/formatMoney";

type FinanceOverviewCardsProps = {
  summary: FinanceSummary | null;
  loading?: boolean;
  trends?: {
    collections?: MetricTrend;
    successfulRefunds?: MetricTrend;
    pendingRefunds?: MetricTrend;
    netActivity?: MetricTrend;
  };
  sparklines?: {
    collections?: number[];
    successfulRefunds?: number[];
    pendingRefunds?: number[];
    netActivity?: number[];
  };
};

function CreditCardIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <rect x="2.5" y="5" width="15" height="10" rx="1.5" />
      <path d="M2.5 8.5h15" strokeLinecap="round" />
      <path d="M5.5 12.5h3" strokeLinecap="round" />
    </svg>
  );
}

function RefundIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M7 7H4v3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 10a5.5 5.5 0 1 0 1.2-3.5" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6.5V10l2.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScalesIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M10 3v14M6 17h8" strokeLinecap="round" />
      <path d="M10 5l-5 2 1.5 4h7L15 7l-5-2z" strokeLinejoin="round" />
    </svg>
  );
}

type CardDef = {
  title: string;
  amount: string;
  theme: MetricTheme;
  icon: ReactNode;
  trend?: MetricTrend;
  sparklineValues?: number[];
  supportingText: string;
};

export default function FinanceOverviewCards({
  summary,
  loading = false,
  trends,
  sparklines,
}: FinanceOverviewCardsProps) {
  if (loading || !summary) {
    return <MetricCardsSkeleton count={4} />;
  }

  const cards: CardDef[] = [
    {
      title: "Gross Collections",
      amount: summary.collections.totalAmount,
      theme: "blue",
      icon: <CreditCardIcon />,
      trend: trends?.collections,
      sparklineValues: sparklines?.collections,
      supportingText: "Captured payments (paidAt) in selected period",
    },
    {
      title: "Successful Refunds",
      amount: summary.successfulRefunds.totalAmount,
      theme: "green",
      icon: <RefundIcon />,
      trend: trends?.successfulRefunds,
      sparklineValues: sparklines?.successfulRefunds,
      supportingText: "SUCCESS refunds by processedAt in period",
    },
    {
      title: "Pending Refunds",
      amount: summary.pendingRefunds.totalAmount,
      theme: "orange",
      icon: <ClockIcon />,
      trend: trends?.pendingRefunds,
      supportingText: "REQUESTED/PENDING by requestedAt in period",
    },
    {
      title: "Net Activity",
      amount: summary.netActivityInPeriod.amount,
      theme: "purple",
      icon: <ScalesIcon />,
      trend: trends?.netActivity,
      sparklineValues: sparklines?.netActivity,
      supportingText: "Gross collections minus successful refunds (period)",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <OverviewMetricCard
          key={card.title}
          title={card.title}
          value={formatInrAmount(card.amount)}
          supportingText={card.supportingText}
          theme={card.theme}
          icon={card.icon}
          trend={card.trend}
          sparklineValues={card.sparklineValues}
        />
      ))}
    </div>
  );
}
