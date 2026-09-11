import type { OrchestrationRecord } from "./orchestrationTypes";
import {
  filterRecordsByDateRange,
  formatDecisionTime,
  formatPercent,
  getDeliveredCount,
  getPlatformMetrics,
  type DateRangeKey,
  type PlatformMetrics,
} from "./orchestrationMetrics";

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

const IN_PROGRESS_STATUSES = new Set([
  "in_transit",
  "booked",
  "orchestrating",
  "booking",
]);

function getPreviousPeriodRecords(
  allRecords: OrchestrationRecord[],
  range: DateRangeKey,
): OrchestrationRecord[] {
  const current = filterRecordsByDateRange(allRecords, range);
  if (current.length === 0 || range === "custom") return [];

  const currentStart = Math.min(
    ...current.map((r) => new Date(r.deliveryRequest.createdAt).getTime()),
  );
  const currentEnd = Math.max(
    ...current.map((r) => new Date(r.deliveryRequest.createdAt).getTime()),
  );
  const durationMs = currentEnd - currentStart + 86_400_000;
  const previousStart = currentStart - durationMs;

  return allRecords.filter((record) => {
    const created = new Date(record.deliveryRequest.createdAt).getTime();
    return created >= previousStart && created < currentStart;
  });
}

function buildTrend(current: number, previous: number, invert = false): MetricTrend {
  if (previous === 0) {
    if (current === 0) return { value: "0.0%", direction: "neutral" };
    const direction = invert ? "negative" : "positive";
    return { value: "+100.0%", direction };
  }
  const change = ((current - previous) / previous) * 100;
  const rounded = Math.round(change * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  let direction: MetricTrend["direction"] = "neutral";
  if (rounded > 0) direction = invert ? "negative" : "positive";
  if (rounded < 0) direction = invert ? "positive" : "negative";
  return { value: `${sign}${rounded.toFixed(1)}%`, direction };
}

export function getInProgressCount(records: OrchestrationRecord[]): number {
  return records.filter((record) =>
    IN_PROGRESS_STATUSES.has(record.deliveryRequest.status),
  ).length;
}

export function getDashboardMetrics(
  allRecords: OrchestrationRecord[],
  range: DateRangeKey,
): DashboardMetrics {
  const records = filterRecordsByDateRange(allRecords, range);
  const previousRecords = getPreviousPeriodRecords(allRecords, range);
  const metrics = getPlatformMetrics(records);
  const previousMetrics = getPlatformMetrics(previousRecords);
  const deliveredCount = getDeliveredCount(records);
  const previousDelivered = getDeliveredCount(previousRecords);
  const inProgressCount = getInProgressCount(records);
  const previousInProgress = getInProgressCount(previousRecords);

  return {
    ...metrics,
    deliveredCount,
    inProgressCount,
    trends: {
      totalDeliveries: buildTrend(
        metrics.totalDeliveries,
        previousMetrics.totalDeliveries,
      ),
      delivered: buildTrend(deliveredCount, previousDelivered),
      inProgress: buildTrend(inProgressCount, previousInProgress),
      bookingSuccessRate: buildTrend(
        metrics.bookingSuccessRate,
        previousMetrics.bookingSuccessRate,
      ),
      avgOrchestrationTime: buildTrend(
        metrics.averageDecisionTimeMs,
        previousMetrics.averageDecisionTimeMs,
        true,
      ),
    },
  };
}

/** Approximates delivery funnel stages from orchestration mock data. */
export function getDeliveryFunnelMetrics(
  records: OrchestrationRecord[],
): DeliveryFunnelMetrics {
  const totalRequests = records.length;
  const matched = records.filter((record) =>
    record.evaluations.some((evaluation) => evaluation.availability),
  ).length;
  const quoted = records.filter((record) =>
    record.evaluations.some(
      (evaluation) => evaluation.availability && evaluation.price !== null,
    ),
  ).length;
  const confirmed = records.filter(
    (record) => record.booking.status === "confirmed",
  ).length;
  const delivered = getDeliveredCount(records);

  const matchRate =
    totalRequests === 0 ? 0 : (matched / totalRequests) * 100;
  const quoteRate = matched === 0 ? 0 : (quoted / matched) * 100;
  const confirmationRate = quoted === 0 ? 0 : (confirmed / quoted) * 100;
  const deliveryRate = confirmed === 0 ? 0 : (delivered / confirmed) * 100;

  return {
    totalRequests,
    matched,
    quoted,
    confirmed,
    delivered,
    matchRate: Math.round(matchRate * 10) / 10,
    quoteRate: Math.round(quoteRate * 10) / 10,
    confirmationRate: Math.round(confirmationRate * 10) / 10,
    deliveryRate: Math.round(deliveryRate * 10) / 10,
  };
}

export function getRecordAmount(record: OrchestrationRecord): number {
  const selected = record.evaluations.find(
    (evaluation) => evaluation.serviceId === record.decision.selectedServiceId,
  );
  if (selected?.price != null) return selected.price;
  const priced = record.evaluations.find(
    (evaluation) => evaluation.price !== null,
  );
  return priced?.price ?? 0;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export type PackageCategory = "Medicine" | "Food" | "Documents" | "Other";

export function getPackageCategory(record: OrchestrationRecord): PackageCategory {
  const type = record.deliveryRequest.package.type.toLowerCase();
  if (type.includes("medicine") || type.includes("medical")) return "Medicine";
  if (type.includes("food") || type.includes("meal")) return "Food";
  if (type.includes("document") || type.includes("paper")) return "Documents";
  return "Other";
}

export type TopServiceCategory = {
  category: PackageCategory;
  count: number;
  percent: number;
};

export function getTopServiceCategories(
  records: OrchestrationRecord[],
): TopServiceCategory[] {
  const categories: PackageCategory[] = [
    "Medicine",
    "Food",
    "Documents",
    "Other",
  ];
  const counts = new Map<PackageCategory, number>();
  categories.forEach((category) => counts.set(category, 0));

  records.forEach((record) => {
    const category = getPackageCategory(record);
    counts.set(category, (counts.get(category) ?? 0) + 1);
  });

  const total = records.length || 1;
  return categories.map((category) => {
    const count = counts.get(category) ?? 0;
    return {
      category,
      count,
      percent: Math.round((count / total) * 1000) / 10,
    };
  });
}

export { formatDecisionTime, formatPercent };
