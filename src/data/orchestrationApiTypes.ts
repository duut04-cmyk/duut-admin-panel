export type OrchestrationEvaluationStatus =
  "EVALUATED" | "ELIGIBLE" | "INELIGIBLE" | "ERROR" | "SKIPPED";

export type OrchestrationRequestStatus = "RUNNING" | "COMPLETED" | "FAILED";

export type BackendScoreBreakdown = {
  price: number | null;
  eta: number | null;
  availability: number | null;
  providerPriority: number | null;
  serviceQuality: number | null;
  applicableWeightSum: number;
  rawWeightedScore: number;
};

export type AdminOrchestrationEvaluation = {
  id: string;
  providerCode: string;
  providerServiceCode: string | null;
  status: OrchestrationEvaluationStatus;
  serviceable: boolean | null;
  availabilityKnown: boolean | null;
  available: boolean | null;
  availableDriverCount: number | null;
  quoteAvailable: boolean | null;
  quoteAmount: number | null;
  quoteCurrency: string | null;
  estimatedDeliveryAt: string | null;
  exclusionReasons: string[];
  eligibilityReasons: string[];
  warnings: string[];
  score: number | null;
  scoreBreakdown: BackendScoreBreakdown | null;
  errorCategory: string | null;
};

export type AdminSelectedOption = {
  providerCode: string;
  serviceCode: string | null;
  quote: {
    amount: number;
    currency: string;
    customerPayableAmount?: number;
    platformFeeAmount?: number;
    gstAmount?: number;
  };
  estimatedDeliveryAt: string | null;
  selectionReason: string;
};

export type AdminOrchestrationPayload = {
  deliveryId: string;
  status: string;
  orchestration: {
    id: string;
    attemptNumber: number;
    completedAt: string | null;
    selectedOption: AdminSelectedOption | null;
    status: OrchestrationRequestStatus;
    failureReason: string | null;
    evaluations: AdminOrchestrationEvaluation[];
  };
};

export type AdminOrchestrationRunDetail = AdminOrchestrationPayload & {
  durationMs: number | null;
  delivery: {
    reference: string;
    pickupAddressText: string;
    dropAddressText: string;
  };
  booking: {
    status: import("./deliveryApiTypes").BackendProviderBookingStatus;
    providerReference: string | null;
    providerOrderId: string | null;
  } | null;
  orchestration: AdminOrchestrationPayload["orchestration"] & {
    startedAt: string;
    createdAt: string;
  };
};
