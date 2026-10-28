/** Shared reporting UI types and formatters (live API data only). */

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

export type DateRangeKey = "7d" | "30d" | "month" | "custom";

export function formatDecisionTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
