import type {
  AdminOrchestrationPayload,
  AdminOrchestrationRunDetail,
} from "@/data/orchestrationApiTypes";
import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";

export function runDetailToAdminPayload(
  run: AdminOrchestrationRunDetail,
): AdminOrchestrationPayload {
  return {
    deliveryId: run.deliveryId,
    status: run.status,
    orchestration: {
      id: run.orchestration.id,
      attemptNumber: run.orchestration.attemptNumber,
      completedAt: run.orchestration.completedAt,
      selectedOption: run.orchestration.selectedOption,
      status: run.orchestration.status,
      failureReason: run.orchestration.failureReason,
      evaluations: run.orchestration.evaluations,
    },
  };
}

export function deliveryCompactFromRunDetail(run: AdminOrchestrationRunDetail) {
  return {
    deliveryId: run.deliveryId,
    reference: run.delivery.reference,
    pickupAddress: run.delivery.pickupAddressText,
    dropAddress: run.delivery.dropAddressText,
    pickupContact: "—",
    dropContact: "—",
    packageType: "—",
    packageWeightKg: 0,
    scheduleMode: "—",
    specialInstructions: null as string | null,
    requirements: [] as string[],
  };
}

export function historyBookingFromRunDetail(
  run: AdminOrchestrationRunDetail,
): DeliveryHistoryDetail["booking"] {
  if (!run.booking) return null;
  return {
    id: run.orchestration.id,
    providerCode: run.orchestration.selectedOption?.providerCode ?? "—",
    serviceCode: run.orchestration.selectedOption?.serviceCode ?? null,
    status: run.booking.status,
    providerReference: run.booking.providerReference,
    providerOrderId: run.booking.providerOrderId,
    quote: {
      amount: run.orchestration.selectedOption?.quote.amount ?? 0,
      currency: run.orchestration.selectedOption?.quote.currency ?? "INR",
    },
    bookedAt: run.orchestration.completedAt,
  };
}
