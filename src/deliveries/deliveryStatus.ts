import type {
  BackendDeliveryStatus,
  BackendProviderBookingStatus,
} from "@/data/deliveryApiTypes";

export type DeliveryStatusPillKey =
  | "pending"
  | "orchestrating"
  | "booking"
  | "booked"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "failed";

const STATUS_TO_PILL: Record<BackendDeliveryStatus, DeliveryStatusPillKey> = {
  CREATED: "pending",
  ORCHESTRATING: "orchestrating",
  OPTION_READY: "orchestrating",
  BOOKING: "booking",
  BOOKED: "booked",
  DRIVER_ASSIGNED: "booked",
  PICKUP_OTP_PENDING: "in_transit",
  PICKED_UP: "in_transit",
  IN_TRANSIT: "in_transit",
  DELIVERY_OTP_PENDING: "in_transit",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  FAILED: "failed",
};

const STATUS_LABELS: Record<BackendDeliveryStatus, string> = {
  CREATED: "Created",
  ORCHESTRATING: "Orchestrating",
  OPTION_READY: "Option ready",
  BOOKING: "Booking",
  BOOKED: "Booked",
  DRIVER_ASSIGNED: "Driver assigned",
  PICKUP_OTP_PENDING: "Pickup OTP",
  PICKED_UP: "Picked up",
  IN_TRANSIT: "In transit",
  DELIVERY_OTP_PENDING: "Delivery OTP",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  FAILED: "Failed",
};

export const DELIVERY_STATUS_FILTER_OPTIONS: Array<{
  value: BackendDeliveryStatus | "all";
  label: string;
}> = [
  { value: "all", label: "All statuses" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "IN_TRANSIT", label: "In transit" },
  { value: "BOOKED", label: "Booked" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "ORCHESTRATING", label: "Orchestrating" },
  { value: "CREATED", label: "Created" },
];

export function deliveryStatusPillKey(status: string): DeliveryStatusPillKey {
  if (status in STATUS_TO_PILL) {
    return STATUS_TO_PILL[status as BackendDeliveryStatus];
  }
  return "pending";
}

export function deliveryStatusLabel(status: string): string {
  if (status in STATUS_LABELS) {
    return STATUS_LABELS[status as BackendDeliveryStatus];
  }
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

const BOOKING_STATUS_LABELS: Record<BackendProviderBookingStatus, string> = {
  PENDING: "Pending",
  BOOKING: "Booking",
  BOOKED: "Confirmed",
  FAILED: "Failed",
  UNKNOWN: "Unknown",
};

export function providerBookingStatusLabel(status: string): string {
  if (status in BOOKING_STATUS_LABELS) {
    return BOOKING_STATUS_LABELS[status as BackendProviderBookingStatus];
  }
  return status;
}

export function providerBookingStatusPillKey(
  status: string,
): "pending" | "confirmed" | "failed" | "cancelled" {
  switch (status) {
    case "BOOKED":
      return "confirmed";
    case "FAILED":
      return "failed";
    case "PENDING":
    case "BOOKING":
    case "UNKNOWN":
    default:
      return "pending";
  }
}
