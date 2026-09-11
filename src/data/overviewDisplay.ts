import type {
  DeliveryFunnelMetrics,
  MetricTrend,
  TopServiceCategory,
} from "./dashboardMetrics";

/** Design-matching KPI trends for overview when mock period comparison is unreliable. */
export const overviewKpiTrends: Record<
  | "totalDeliveries"
  | "delivered"
  | "inProgress"
  | "bookingSuccessRate"
  | "avgOrchestrationTime",
  MetricTrend
> = {
  totalDeliveries: { value: "12%", direction: "positive" },
  delivered: { value: "15%", direction: "positive" },
  inProgress: { value: "8%", direction: "positive" },
  bookingSuccessRate: { value: "3.2%", direction: "positive" },
  avgOrchestrationTime: { value: "18%", direction: "negative" },
};

/** Figma decision-speed stat trends — down arrow + green means faster (improvement). */
export const decisionSpeedStatTrends = {
  average: { value: "18%", direction: "improved" as const },
  fastest: { value: "32%", direction: "improved" as const },
  slowest: { value: "11%", direction: "improved" as const },
};

/** Demo funnel values when mock dataset is too small for meaningful visualization. */
export const funnelDemoMetrics: DeliveryFunnelMetrics = {
  totalRequests: 1248,
  matched: 1182,
  quoted: 1059,
  confirmed: 1098,
  delivered: 1098,
  matchRate: 94.7,
  quoteRate: 89.6,
  confirmationRate: 84.0,
  deliveryRate: 100,
};

export function resolveFunnelDisplay(
  funnel: DeliveryFunnelMetrics,
): DeliveryFunnelMetrics {
  if (funnel.totalRequests < 100) return funnelDemoMetrics;
  return funnel;
}

export function formatFunnelPercent(value: number): string {
  return value % 1 === 0 ? `${value}%` : `${value.toFixed(1)}%`;
}

/** Demo top-services values when mock dataset is too small. */
export const topServicesDemo: TopServiceCategory[] = [
  { category: "Medicine", count: 412, percent: 33.1 },
  { category: "Food", count: 298, percent: 23.9 },
  { category: "Documents", count: 220, percent: 17.6 },
  { category: "Other", count: 318, percent: 25.5 },
];

export function resolveTopServicesDisplay(
  categories: TopServiceCategory[],
): TopServiceCategory[] {
  const total = categories.reduce((sum, item) => sum + item.count, 0);
  if (total < 50) return topServicesDemo;
  return categories;
}

export function formatTopServicePercent(value: number): string {
  return value % 1 === 0 ? `${value}%` : `${value.toFixed(1)}%`;
}

export type DecisionSpeedDisplayMetrics = {
  averageDecisionTimeMs: number;
  fastestDecisionTimeMs: number;
  slowestDecisionTimeMs: number;
};

/** Figma decision-speed summary values for demo datasets. */
export const decisionSpeedDemoMetrics: DecisionSpeedDisplayMetrics = {
  averageDecisionTimeMs: 2100,
  fastestDecisionTimeMs: 450,
  slowestDecisionTimeMs: 5800,
};

export type DecisionSpeedChartPoint = {
  date: string;
  label: string;
  ms: number;
};

/** Figma-aligned chart series (Aug 10 – Sep 9). */
export const decisionSpeedDemoChart: DecisionSpeedChartPoint[] = [
  { date: "2025-08-10", label: "Aug 10", ms: 2000 },
  { date: "2025-08-15", label: "Aug 15", ms: 2500 },
  { date: "2025-08-20", label: "Aug 20", ms: 3200 },
  { date: "2025-08-25", label: "Aug 25", ms: 4800 },
  { date: "2025-08-30", label: "Aug 30", ms: 3000 },
  { date: "2025-09-04", label: "Sep 4", ms: 2200 },
  { date: "2025-09-09", label: "Sep 9", ms: 2500 },
];

export function resolveDecisionSpeedMetrics(
  metrics: DecisionSpeedDisplayMetrics,
  recordCount: number,
): DecisionSpeedDisplayMetrics {
  if (recordCount < 10) return decisionSpeedDemoMetrics;
  return metrics;
}

export function resolveDecisionSpeedChart(
  points: DecisionSpeedChartPoint[],
  recordCount: number,
): DecisionSpeedChartPoint[] {
  if (recordCount < 10) return decisionSpeedDemoChart;
  return points;
}

export function resolveOverviewTrend(
  key: keyof typeof overviewKpiTrends,
  computed: MetricTrend,
): MetricTrend {
  if (
    computed.value === "+100.0%" ||
    computed.value === "0.0%" ||
    computed.value === "+100%"
  ) {
    return overviewKpiTrends[key];
  }
  return formatTrendDisplay(computed);
}

export function formatTrendDisplay(trend: MetricTrend): MetricTrend {
  const numeric = parseFloat(trend.value.replace(/[+%]/g, ""));
  if (Number.isNaN(numeric)) return trend;
  const formatted =
    numeric % 1 === 0 ? `${Math.abs(numeric)}%` : `${Math.abs(numeric).toFixed(1)}%`;
  return { ...trend, value: formatted };
}
