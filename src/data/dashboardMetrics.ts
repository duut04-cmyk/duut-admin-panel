import type { PlatformMetrics } from "./orchestrationMetrics";
import { formatDecisionTime, formatPercent } from "./orchestrationMetrics";

export type MetricTrend = {
  value: string;
  direction: "positive" | "negative" | "neutral";
};

export type DashboardMetrics = PlatformMetrics & {
  deliveredCount: number;
  inProgressCount: number;
  trends: {
    totalDeliveries: MetricTrend;
    delivered: MetricTrend;
    inProgress: MetricTrend;
    bookingSuccessRate: MetricTrend;
    avgOrchestrationTime: MetricTrend;
  };
};

export type DeliveryFunnelMetrics = {
  totalRequests: number;
  matched: number;
  quoted: number;
  confirmed: number;
  delivered: number;
  matchRate: number;
  quoteRate: number;
  confirmationRate: number;
  deliveryRate: number;
};

export type PackageCategory = "Medicine" | "Food" | "Documents" | "Other";

export type TopServiceCategory = {
  category: PackageCategory;
  count: number;
  percent: number;
};

export { formatDecisionTime, formatPercent };
