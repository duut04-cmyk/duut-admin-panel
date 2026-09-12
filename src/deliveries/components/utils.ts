import type { OrchestrationRecord } from "@/data/orchestrationTypes";

export type DeliveryMetrics = {
  total: number;
  inTransit: number;
  delivered: number;
  failed: number;
  cancelled: number;
};

export function getDeliveryMetrics(records: OrchestrationRecord[]): DeliveryMetrics {
  return {
    total: records.length,
    inTransit: records.filter(
      (record) => record.deliveryRequest.status === "in_transit",
    ).length,
    delivered: records.filter((record) => record.deliveryRequest.status === "delivered")
      .length,
    failed: records.filter((record) => record.deliveryRequest.status === "failed")
      .length,
    cancelled: records.filter((record) => record.deliveryRequest.status === "cancelled")
      .length,
  };
}

export {
  bookingStatusLabel,
  bookingStatusVariant,
  deliveryStatusLabel,
  deliveryStatusVariant,
  formatRoute,
  formatTimestamp,
  matchesOutcome,
  type OutcomeFilter,
} from "@/orchestration/components/utils";
