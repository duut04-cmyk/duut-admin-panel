import type {
  BackendDeliveryStatus,
  BackendProviderBookingStatus,
} from "./deliveryApiTypes";

export type BackendOrchestrationRequestStatus = "RUNNING" | "COMPLETED" | "FAILED";

export type OrchestrationListItem = {
  orchestrationId: string;
  attemptNumber: number;
  orchestrationStatus: BackendOrchestrationRequestStatus;
  failureReason: string | null;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  durationMs: number | null;
  deliveryId: string;
  deliveryReference: string;
  deliveryStatus: BackendDeliveryStatus;
  pickupAddressText: string;
  dropAddressText: string;
  evaluationCount: number;
  eligibleCount: number;
  availableOptionCount: number;
  selectedProviderCode: string | null;
  selectedServiceCode: string | null;
  selectedScore: number | null;
  selectionReason: string | null;
  booking: {
    status: BackendProviderBookingStatus;
    providerReference: string | null;
    providerOrderId: string | null;
  } | null;
};

export type PaginatedOrchestrations = {
  items: OrchestrationListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ListOrchestrationsParams = {
  page: number;
  limit: number;
  reference?: string;
  deliveryId?: string;
  from?: string;
  to?: string;
  orchestrationStatus?: BackendOrchestrationRequestStatus;
  deliveryStatus?: BackendDeliveryStatus;
  bookingStatus?: BackendProviderBookingStatus;
};
