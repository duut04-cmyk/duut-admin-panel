import type { MetricTrend } from "./dashboardMetrics";

export function formatFunnelPercent(value: number): string {
  return value % 1 === 0 ? `${value}%` : `${value.toFixed(1)}%`;
}

export function formatTopServicePercent(value: number): string {
  return value % 1 === 0 ? `${value}%` : `${value.toFixed(1)}%`;
}

export type DecisionSpeedChartPoint = {
  date: string;
  label: string;
  ms: number;
};

export function formatTrendDisplay(trend: MetricTrend): MetricTrend {
  const numeric = parseFloat(trend.value.replace(/[+%]/g, ""));
  if (Number.isNaN(numeric)) return trend;
  const formatted =
    numeric % 1 === 0 ? `${Math.abs(numeric)}%` : `${Math.abs(numeric).toFixed(1)}%`;
  return { ...trend, value: formatted };
}
