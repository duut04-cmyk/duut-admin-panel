import type {
  BookingStatus,
  DeliveryEventType,
  DeliveryRequestStatus,
  OrchestrationRecord,
  ScoreFactorKey,
  ServiceEvaluation,
} from "@/data/orchestrationTypes";

export const FACTOR_LABELS: Record<ScoreFactorKey, string> = {
  availability: "Availability",
  packageFit: "Package fit",
  requirementFit: "Requirement fit",
  price: "Price",
  eta: "ETA",
  serviceQuality: "Service quality",
};

export function formatRoute(record: OrchestrationRecord): string {
  const { pickup, drop } = record.deliveryRequest;
  return `${pickup.city} → ${drop.city}`;
}

export function countEligibleServices(evaluations: ServiceEvaluation[]): number {
  return evaluations.filter(
    (evaluation) =>
      evaluation.availability &&
      evaluation.packageCompatible &&
      evaluation.requirementCompatible,
  ).length;
}

export function deliveryStatusVariant(status: DeliveryRequestStatus) {
  switch (status) {
    case "delivered":
      return "success" as const;
    case "in_transit":
    case "booked":
      return "active" as const;
    case "cancelled":
      return "cancelled" as const;
    case "failed":
      return "failed" as const;
    default:
      return "pending" as const;
  }
}

export function deliveryStatusLabel(status: DeliveryRequestStatus): string {
  const labels: Record<DeliveryRequestStatus, string> = {
    pending_orchestration: "Pending",
    orchestrating: "Orchestrating",
    booking: "Booking",
    booked: "Booked",
    in_transit: "In transit",
    delivered: "Delivered",
    cancelled: "Cancelled",
    failed: "Failed",
  };
  return labels[status];
}

export function bookingStatusVariant(status: BookingStatus) {
  switch (status) {
    case "confirmed":
      return "success" as const;
    case "failed":
      return "failed" as const;
    case "cancelled":
      return "cancelled" as const;
    default:
      return "pending" as const;
  }
}

export function bookingStatusLabel(status: BookingStatus): string {
  const labels: Record<BookingStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    failed: "Failed",
    cancelled: "Cancelled",
  };
  return labels[status];
}

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTraceTimestamp(iso: string): string {
  const date = new Date(iso);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const ms = date.getMilliseconds().toString().padStart(3, "0");
  return `${hours}:${minutes}:${seconds}.${ms}`;
}

export const EVENT_LABELS: Record<DeliveryEventType, string> = {
  created: "Delivery request received",
  orchestration_started: "Orchestration started",
  orchestration_completed: "Decision calculated",
  booking_requested: "Booking attempted",
  booking_confirmed: "Booking confirmed",
  driver_assigned: "Driver assigned",
  picked_up: "Pickup",
  in_transit: "In transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
  failed: "Failed",
};

export const TRACE_EVENT_TYPES: DeliveryEventType[] = [
  "created",
  "orchestration_started",
  "orchestration_completed",
  "booking_requested",
  "booking_confirmed",
  "failed",
];

export function formatPrice(price: number | null): string {
  if (price === null) return "—";
  return `₹${price}`;
}

export function formatEta(minutes: number | null): string {
  if (minutes === null) return "—";
  return `${minutes} min`;
}

export function formatScore(score: number | null): string {
  if (score === null) return "—";
  return score.toFixed(0);
}

export type OutcomeFilter =
  | "all"
  | "booking_confirmed"
  | "booking_failed"
  | "delivered"
  | "delivery_failed"
  | "cancelled";

export function matchesOutcome(
  record: OrchestrationRecord,
  outcome: OutcomeFilter,
): boolean {
  if (outcome === "all") return true;
  if (outcome === "booking_confirmed") return record.booking.status === "confirmed";
  if (outcome === "booking_failed") return record.booking.status === "failed";
  if (outcome === "delivered") return record.deliveryRequest.status === "delivered";
  if (outcome === "delivery_failed") return record.deliveryRequest.status === "failed";
  if (outcome === "cancelled") return record.deliveryRequest.status === "cancelled";
  return true;
}
