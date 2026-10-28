import type { MetricTrend } from "@/data/dashboardMetrics";

export function formatPercent(value: number | null): string {
  if (value == null) return "—";
  return value % 1 === 0 ? `${value}%` : `${value.toFixed(1)}%`;
}

export function formatDecisionTime(ms: number | null): string {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

export function formatDecisionChartDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function trendFromChangePercent(
  changePercent: number | null,
  invert = false,
): MetricTrend {
  if (changePercent == null) {
    return { value: "—", direction: "neutral" };
  }
  if (changePercent === 0) {
    return { value: "0%", direction: "neutral" };
  }
  const direction =
    changePercent > 0
      ? invert
        ? "negative"
        : "positive"
      : invert
        ? "positive"
        : "negative";
  const formatted =
    Math.abs(changePercent) % 1 === 0
      ? `${Math.abs(changePercent)}%`
      : `${Math.abs(changePercent).toFixed(1)}%`;
  return { value: formatted, direction };
}

export function formatPackageTypeLabel(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
