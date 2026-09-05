import type { DeliveryRequestStatus } from "@/data/orchestrationTypes";

export {
  bookingStatusLabel,
  bookingStatusVariant,
} from "@/orchestration/components/utils";

export function deliveryStatusVariant(status: DeliveryRequestStatus) {
  switch (status) {
    case "delivered":
      return "success";
    case "in_transit":
    case "booked":
      return "active";
    case "cancelled":
      return "cancelled";
    case "failed":
      return "failed";
    default:
      return "pending";
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

export function formatCreatedTime(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
