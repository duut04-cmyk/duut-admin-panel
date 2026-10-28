import type {
  DashboardMetrics,
  DeliveryFunnelMetrics,
  TopServiceCategory,
  PackageCategory,
} from "@/data/dashboardMetrics";
import type { MetricTrend } from "@/data/dashboardMetrics";
import type { DecisionSpeedChartPoint } from "@/data/overviewDisplay";
import type { RecentDeliveryItem, ReportingSummary } from "@/data/reportingTypes";
import {
  formatDecisionChartDate,
  trendFromChangePercent,
} from "@/overview/reportingUi";

function reportingWindowEndDate(toExclusive: string): string {
  const end = new Date(toExclusive);
  end.setUTCDate(end.getUTCDate() - 1);
  return end.toISOString().slice(0, 10);
}

/** Period trend line from summary (prior vs current average duration). */
export function mapSummaryToDecisionSpeedChartPoints(
  summary: ReportingSummary,
): DecisionSpeedChartPoint[] {
  const { window, orchestrationRuns, trends } = summary;
  if (orchestrationRuns.durationSampleSize === 0) return [];
  const averageMs = orchestrationRuns.averageDurationMs;
  if (averageMs == null) return [];

  const trend = trends.averageOrchestrationDurationMs;
  const fromDate = window.from.slice(0, 10);
  const toDate = reportingWindowEndDate(window.toExclusive);
  const previousMs = trend.previous > 0 ? trend.previous : averageMs;

  if (fromDate >= toDate) {
    return [
      {
        date: fromDate,
        label: formatDecisionChartDate(fromDate),
        ms: averageMs,
      },
    ];
  }

  return [
    {
      date: fromDate,
      label: formatDecisionChartDate(fromDate),
      ms: previousMs,
    },
    {
      date: toDate,
      label: formatDecisionChartDate(toDate),
      ms: averageMs,
    },
  ];
}

function packageTypeToCategory(packageType: string | null): PackageCategory {
  const type = (packageType ?? "").toLowerCase();
  if (
    type.includes("medicine") ||
    type.includes("medical") ||
    type.includes("pharma")
  ) {
    return "Medicine";
  }
  if (type.includes("food")) return "Food";
  if (type.includes("document")) return "Documents";
  return "Other";
}

export function mapSummaryToDashboardMetrics(
  summary: ReportingSummary,
): DashboardMetrics {
  const { deliveriesCreated, booking, orchestrationRuns, trends } = summary;
  const bookingRate = booking.successRatePercent ?? 0;

  return {
    totalDeliveries: deliveriesCreated.total,
    successfulBookings: booking.deliveriesWithConfirmedBooking,
    failedBookings: 0,
    cancelledDeliveries: deliveriesCreated.cancelled,
    bookingSuccessRate: bookingRate,
    totalServicesEvaluated: 0,
    totalAvailableOptions: 0,
    averageOptionsPerDelivery: 0,
    averageAvailableOptionsPerDelivery: 0,
    averageDecisionTimeMs: orchestrationRuns.averageDurationMs ?? 0,
    fastestDecisionTimeMs: orchestrationRuns.averageDurationMs ?? 0,
    slowestDecisionTimeMs: orchestrationRuns.averageDurationMs ?? 0,
    averageBookingResponseTimeMs: 0,
    availabilityRate: 0,
    deliveredCount: deliveriesCreated.deliveredCurrentStatus,
    inProgressCount: deliveriesCreated.inProgress,
    trends: {
      totalDeliveries: trendFromChangePercent(trends.deliveriesCreated.changePercent),
      delivered: trendFromChangePercent(trends.deliveredCurrentStatus.changePercent),
      inProgress: neutralTrend(),
      bookingSuccessRate: trendFromChangePercent(
        trends.bookingSuccessRatePercent.changePercent,
      ),
      avgOrchestrationTime: trendFromChangePercent(
        trends.averageOrchestrationDurationMs.changePercent,
        true,
      ),
    },
  };
}

function neutralTrend(): MetricTrend {
  return { value: "—", direction: "neutral" };
}

export function mapSummaryToFunnelMetrics(
  summary: ReportingSummary,
): DeliveryFunnelMetrics {
  const { funnel } = summary;
  const totalRequests = funnel.deliveriesCreated;
  const matched = funnel.withEligibleEvaluation;
  const quoted = funnel.withQuote;
  const confirmed = funnel.withConfirmedBooking;
  const delivered = funnel.currentlyDelivered;

  const matchRate = totalRequests === 0 ? 0 : (matched / totalRequests) * 100;
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

export function mapPackageDistributionToTopServices(
  summary: ReportingSummary,
): TopServiceCategory[] {
  const categories: PackageCategory[] = ["Medicine", "Food", "Documents", "Other"];
  const counts = new Map<PackageCategory, number>();
  categories.forEach((category) => counts.set(category, 0));

  for (const item of summary.packageTypeDistribution) {
    const category = packageTypeToCategory(item.packageType);
    counts.set(category, (counts.get(category) ?? 0) + item.count);
  }

  const total = summary.deliveriesCreated.total || 1;
  return categories.map((category) => {
    const count = counts.get(category) ?? 0;
    return {
      category,
      count,
      percent: Math.round((count / total) * 1000) / 10,
    };
  });
}

export function mapReportingDateRangeToDateRangeKey(
  range: "7d" | "30d" | "month",
): "7d" | "30d" | "month" {
  return range;
}

/** Minimal sparkline from a single cumulative value (no mock time series). */
export function flatSparkline(value: number): number[] {
  if (value <= 0) return [];
  const steps = Math.min(8, Math.max(2, value));
  return Array.from({ length: steps }, (_, index) =>
    Math.round((value * (index + 1)) / steps),
  );
}

export type OverviewRecentDeliveryRow = {
  deliveryId: string;
  reference: string;
  status: string;
  packageType: string | null;
  routeLabel: string | null;
  createdAt: string;
};

export function mapRecentDeliveryItems(
  items: RecentDeliveryItem[],
): OverviewRecentDeliveryRow[] {
  return items.map((item) => ({
    deliveryId: item.deliveryId,
    reference: item.reference,
    status: item.status,
    packageType: item.packageType,
    routeLabel: item.routeLabel,
    createdAt: item.createdAt,
  }));
}
