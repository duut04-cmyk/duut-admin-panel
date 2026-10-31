import type { FinanceSummary } from "@/data/financeTypes";
import type { MetricTrend } from "@/data/dashboardMetrics";
import { parseMoneyNumber } from "./formatMoney";

/** Previous window of equal duration ending at the current window start. */
export function previousFinanceWindow(input: { from: string; to: string }): {
  from: string;
  to: string;
} {
  const fromMs = new Date(input.from).getTime();
  const toMs = new Date(input.to).getTime();
  const duration = Math.max(toMs - fromMs, 0);
  return {
    from: new Date(fromMs - duration).toISOString(),
    to: input.from,
  };
}

/** Value is percentage only (e.g. "+12%"); OverviewMetricCard appends period copy. */
export function percentChangeTrend(
  currentAmount: string,
  previousAmount: string,
): MetricTrend {
  const current = parseMoneyNumber(currentAmount);
  const previous = parseMoneyNumber(previousAmount);
  if (previous === 0 && current === 0) {
    return { value: "0%", direction: "neutral" };
  }
  if (previous === 0) {
    return {
      value: "+100%",
      direction: current >= 0 ? "positive" : "negative",
    };
  }
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  const rounded = Math.round(pct);
  const sign = rounded > 0 ? "+" : "";
  return {
    value: `${sign}${rounded}%`,
    direction: rounded > 0 ? "positive" : rounded < 0 ? "negative" : "neutral",
  };
}

export function summaryTrends(
  current: FinanceSummary,
  previous: FinanceSummary | null,
): {
  collections: MetricTrend | undefined;
  successfulRefunds: MetricTrend | undefined;
  pendingRefunds: MetricTrend | undefined;
  netActivity: MetricTrend | undefined;
} {
  if (!previous) {
    return {
      collections: undefined,
      successfulRefunds: undefined,
      pendingRefunds: undefined,
      netActivity: undefined,
    };
  }
  return {
    collections: percentChangeTrend(
      current.collections.totalAmount,
      previous.collections.totalAmount,
    ),
    successfulRefunds: percentChangeTrend(
      current.successfulRefunds.totalAmount,
      previous.successfulRefunds.totalAmount,
    ),
    pendingRefunds: percentChangeTrend(
      current.pendingRefunds.totalAmount,
      previous.pendingRefunds.totalAmount,
    ),
    netActivity: percentChangeTrend(
      current.netActivityInPeriod.amount,
      previous.netActivityInPeriod.amount,
    ),
  };
}
