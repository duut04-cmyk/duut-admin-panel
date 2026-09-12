import { getAllOrchestrations } from "./mockOrchestration";
import type { OrchestrationRecord, ScoreFactorKey } from "./orchestrationTypes";
import { SCORE_FACTOR_WEIGHTS } from "./orchestrationTypes";

export type PlatformMetrics = {
  totalDeliveries: number;
  successfulBookings: number;
  failedBookings: number;
  cancelledDeliveries: number;
  bookingSuccessRate: number;
  totalServicesEvaluated: number;
  totalAvailableOptions: number;
  averageOptionsPerDelivery: number;
  averageAvailableOptionsPerDelivery: number;
  averageDecisionTimeMs: number;
  fastestDecisionTimeMs: number;
  slowestDecisionTimeMs: number;
  averageBookingResponseTimeMs: number;
  availabilityRate: number;
};

export type DecisionFactorInfluence = {
  factor: ScoreFactorKey;
  averageWeight: number;
  averageContributionPercent: number;
};

export type ServicePerformance = {
  serviceId: string;
  serviceName: string;
  timesEvaluated: number;
  timesAvailable: number;
  availabilityRate: number;
  timesSelected: number;
  selectionRate: number;
  bookingAttempts: number;
  bookingSuccessRate: number;
  averagePrice: number | null;
  averageEtaMinutes: number | null;
  averageResponseTimeMs: number;
};

function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function getPlatformMetrics(
  records: OrchestrationRecord[] = getAllOrchestrations(),
): PlatformMetrics {
  const totalDeliveries = records.length;
  const successfulBookings = records.filter(
    (r) => r.booking.status === "confirmed",
  ).length;
  const failedBookings = records.filter((r) => r.booking.status === "failed").length;
  const cancelledDeliveries = records.filter(
    (r) => r.deliveryRequest.status === "cancelled",
  ).length;

  const totalServicesEvaluated = records.reduce(
    (sum, r) => sum + r.evaluations.length,
    0,
  );
  const totalAvailableOptions = records.reduce(
    (sum, r) => sum + r.evaluations.filter((e) => e.availability).length,
    0,
  );

  const decisionTimes = records.map((r) => r.decision.durationMs);
  const bookingResponseTimes = records
    .map((r) => r.booking.bookingResponseTimeMs)
    .filter((ms): ms is number => ms !== null);

  const bookingAttempts = records.length;
  const bookingSuccessRate =
    bookingAttempts === 0 ? 0 : (successfulBookings / bookingAttempts) * 100;

  return {
    totalDeliveries,
    successfulBookings,
    failedBookings,
    cancelledDeliveries,
    bookingSuccessRate: round(bookingSuccessRate, 1),
    totalServicesEvaluated,
    totalAvailableOptions,
    averageOptionsPerDelivery: round(
      totalDeliveries === 0 ? 0 : totalServicesEvaluated / totalDeliveries,
      1,
    ),
    averageAvailableOptionsPerDelivery: round(
      totalDeliveries === 0 ? 0 : totalAvailableOptions / totalDeliveries,
      1,
    ),
    averageDecisionTimeMs: round(average(decisionTimes), 0),
    fastestDecisionTimeMs: decisionTimes.length === 0 ? 0 : Math.min(...decisionTimes),
    slowestDecisionTimeMs: decisionTimes.length === 0 ? 0 : Math.max(...decisionTimes),
    averageBookingResponseTimeMs: round(average(bookingResponseTimes), 0),
    availabilityRate: round(
      totalServicesEvaluated === 0
        ? 0
        : (totalAvailableOptions / totalServicesEvaluated) * 100,
      1,
    ),
  };
}

export function getDecisionFactorInfluence(
  records: OrchestrationRecord[] = getAllOrchestrations(),
): DecisionFactorInfluence[] {
  const factorKeys = Object.keys(SCORE_FACTOR_WEIGHTS) as ScoreFactorKey[];

  return factorKeys.map((factor) => {
    const contributions: number[] = [];
    const weights: number[] = [];

    records.forEach((record) => {
      const factorScore = record.decision.decisionScore.factors[factor];
      const total = record.decision.decisionScore.totalScore;
      weights.push(factorScore.weight);
      if (total > 0) {
        contributions.push((factorScore.weightedScore / total) * 100);
      }
    });

    return {
      factor,
      averageWeight: round(average(weights), 1),
      averageContributionPercent: round(average(contributions), 1),
    };
  });
}

export function getServicePerformance(
  records: OrchestrationRecord[] = getAllOrchestrations(),
): ServicePerformance[] {
  const serviceMap = new Map<
    string,
    {
      serviceName: string;
      timesEvaluated: number;
      timesAvailable: number;
      timesSelected: number;
      bookingAttempts: number;
      bookingSuccesses: number;
      prices: number[];
      etas: number[];
      responseTimes: number[];
    }
  >();

  records.forEach((record) => {
    record.evaluations.forEach((evaluation) => {
      const existing = serviceMap.get(evaluation.serviceId) ?? {
        serviceName: evaluation.serviceName,
        timesEvaluated: 0,
        timesAvailable: 0,
        timesSelected: 0,
        bookingAttempts: 0,
        bookingSuccesses: 0,
        prices: [],
        etas: [],
        responseTimes: [],
      };

      existing.timesEvaluated += 1;
      existing.responseTimes.push(evaluation.responseTimeMs);
      if (evaluation.availability) {
        existing.timesAvailable += 1;
        if (evaluation.price !== null) existing.prices.push(evaluation.price);
        if (evaluation.totalEtaMinutes !== null) {
          existing.etas.push(evaluation.totalEtaMinutes);
        }
      }

      serviceMap.set(evaluation.serviceId, existing);
    });

    const selectedId = record.decision.selectedServiceId;
    const selected = serviceMap.get(selectedId);
    if (selected) {
      selected.timesSelected += 1;
      selected.bookingAttempts += 1;
      if (record.booking.status === "confirmed") {
        selected.bookingSuccesses += 1;
      }
    }
  });

  return Array.from(serviceMap.entries())
    .map(([serviceId, stats]) => ({
      serviceId,
      serviceName: stats.serviceName,
      timesEvaluated: stats.timesEvaluated,
      timesAvailable: stats.timesAvailable,
      availabilityRate: round(
        stats.timesEvaluated === 0
          ? 0
          : (stats.timesAvailable / stats.timesEvaluated) * 100,
        1,
      ),
      timesSelected: stats.timesSelected,
      selectionRate: round(
        stats.timesAvailable === 0
          ? 0
          : (stats.timesSelected / stats.timesAvailable) * 100,
        1,
      ),
      bookingAttempts: stats.bookingAttempts,
      bookingSuccessRate: round(
        stats.bookingAttempts === 0
          ? 0
          : (stats.bookingSuccesses / stats.bookingAttempts) * 100,
        1,
      ),
      averagePrice: stats.prices.length === 0 ? null : round(average(stats.prices), 0),
      averageEtaMinutes: stats.etas.length === 0 ? null : round(average(stats.etas), 0),
      averageResponseTimeMs: round(average(stats.responseTimes), 0),
    }))
    .sort((a, b) => b.timesEvaluated - a.timesEvaluated);
}

export function getOrchestrationSummary(
  records: OrchestrationRecord[] = getAllOrchestrations(),
) {
  return {
    platform: getPlatformMetrics(records),
    decisionFactors: getDecisionFactorInfluence(records),
    services: getServicePerformance(records),
  };
}

export type DateRangeKey = "7d" | "30d" | "month" | "custom";

export type DeliveryVolumePoint = {
  date: string;
  label: string;
  count: number;
};

function getReferenceDate(records: OrchestrationRecord[]): Date {
  if (records.length === 0) return new Date();
  const latest = Math.max(
    ...records.map((r) => new Date(r.deliveryRequest.createdAt).getTime()),
  );
  return new Date(latest);
}

export function filterRecordsByDateRange(
  records: OrchestrationRecord[],
  range: DateRangeKey,
): OrchestrationRecord[] {
  if (records.length === 0 || range === "custom") return records;

  const reference = getReferenceDate(records);
  const start = new Date(reference);

  if (range === "7d") {
    start.setDate(start.getDate() - 6);
  } else if (range === "30d") {
    start.setDate(start.getDate() - 29);
  } else if (range === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }

  start.setHours(0, 0, 0, 0);

  return records.filter((record) => {
    const created = new Date(record.deliveryRequest.createdAt);
    return created >= start && created <= reference;
  });
}

export function getDeliveryVolumeByDate(
  records: OrchestrationRecord[],
): DeliveryVolumePoint[] {
  const counts = new Map<string, number>();

  records.forEach((record) => {
    const date = record.deliveryRequest.createdAt.slice(0, 10);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date,
      label: new Date(`${date}T12:00:00.000Z`).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
      count,
    }));
}

export function formatDecisionTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function countEligibleEvaluations(records: OrchestrationRecord[]): number {
  return records.reduce(
    (sum, record) =>
      sum +
      record.evaluations.filter(
        (evaluation) =>
          evaluation.availability &&
          evaluation.packageCompatible &&
          evaluation.requirementCompatible,
      ).length,
    0,
  );
}

export function getDeliveredCount(records: OrchestrationRecord[]): number {
  return records.filter((record) => record.deliveryRequest.status === "delivered")
    .length;
}

export type FailureAnalysisItem = {
  key: string;
  label: string;
  count: number;
  percent: number;
};

export type TopFailureReasons = {
  items: FailureAnalysisItem[];
  totalFailures: number;
};

const TOP_FAILURE_CATEGORIES: { key: string; label: string }[] = [
  { key: "no_eligible_driver", label: "No eligible driver available" },
  { key: "service_unavailable", label: "Service unavailable in area" },
  { key: "package_exceeds", label: "Package exceeds limits" },
  { key: "express_not_supported", label: "Express not supported" },
  { key: "booking_failed", label: "Booking failed (provider error)" },
  { key: "other", label: "Other" },
];

function categorizeFailureReason(reason: string): string {
  const normalized = reason.toLowerCase();

  if (normalized.includes("no eligible driver")) {
    return "no_eligible_driver";
  }
  if (
    normalized.includes("unavailable in") ||
    normalized.includes("service unavailable")
  ) {
    return "service_unavailable";
  }
  if (normalized.includes("package exceeds")) {
    return "package_exceeds";
  }
  if (normalized.includes("express")) {
    return "express_not_supported";
  }

  return "other";
}

export function getTopFailureReasons(
  records: OrchestrationRecord[],
): TopFailureReasons {
  const counts = Object.fromEntries(
    TOP_FAILURE_CATEGORIES.map((category) => [category.key, 0]),
  ) as Record<string, number>;

  for (const record of records) {
    for (const evaluation of record.decision.evaluations) {
      const reasons =
        evaluation.rejectionReasons.length > 0
          ? evaluation.rejectionReasons
          : !evaluation.availability && evaluation.availabilityReason
            ? [evaluation.availabilityReason]
            : [];

      for (const reason of reasons) {
        const key = categorizeFailureReason(reason);
        counts[key] += 1;
      }
    }

    if (record.booking.status === "failed") {
      counts.booking_failed += 1;
    }
  }

  const totalFailures = Object.values(counts).reduce((sum, count) => sum + count, 0);

  const items = TOP_FAILURE_CATEGORIES.map((category) => ({
    key: category.key,
    label: category.label,
    count: counts[category.key],
    percent:
      totalFailures === 0 ? 0 : round((counts[category.key] / totalFailures) * 100, 1),
  }));

  return { items, totalFailures };
}

/** @deprecated Use getTopFailureReasons instead */
export function getFailureAnalysis(
  records: OrchestrationRecord[],
): FailureAnalysisItem[] {
  return getTopFailureReasons(records).items.filter((item) => item.count > 0);
}

export function getShowcaseRecord(
  records: OrchestrationRecord[],
): OrchestrationRecord | undefined {
  if (records.length === 0) return undefined;
  return (
    records.find(
      (record) =>
        record.booking.status === "confirmed" &&
        record.deliveryRequest.status === "delivered",
    ) ?? records[0]
  );
}

export function getPendingBookingCount(records: OrchestrationRecord[]): number {
  return records.filter((record) => record.booking.status === "pending").length;
}

export function getCancelledBookingCount(records: OrchestrationRecord[]): number {
  return records.filter((record) => record.booking.status === "cancelled").length;
}
