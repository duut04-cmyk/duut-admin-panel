/** Backend Prisma delivery statuses (list/detail/history). */
export type BackendDeliveryStatus =
  | "CREATED"
  | "ORCHESTRATING"
  | "OPTION_READY"
  | "BOOKING"
  | "BOOKED"
  | "DRIVER_ASSIGNED"
  | "PICKUP_OTP_PENDING"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERY_OTP_PENDING"
  | "DELIVERED"
  | "CANCELLED"
  | "FAILED";

export type BackendProviderBookingStatus =
  "PENDING" | "BOOKING" | "BOOKED" | "FAILED" | "UNKNOWN";

export type DeliveryListItem = {
  id: string;
  reference: string;
  status: BackendDeliveryStatus;
  pickup: { addressText: string; contactName: string };
  drop: { addressText: string; contactName: string };
  packageType: string;
  weightKg: number;
  sizeTier: string;
  schedule: {
    mode: string;
    scheduledAt: string | null;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type PaginatedDeliveries = {
  items: DeliveryListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ListDeliveriesParams = {
  page?: number;
  limit?: number;
  status?: BackendDeliveryStatus;
  from?: string;
  to?: string;
  reference?: string;
};

export type DeliveryPhone = {
  countryCode?: string;
  nationalNumber?: string;
  e164?: string;
  formatted?: string;
};

export type DeliveryHistoryDetail = {
  delivery: {
    id: string;
    reference: string;
    status: BackendDeliveryStatus;
    specialInstructions: string | null;
    createdAt: string;
    updatedAt: string;
  };
  pickup: {
    addressText: string;
    contactName: string;
    contactPhone: DeliveryPhone;
    instructions: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  drop: {
    addressText: string;
    contactName: string;
    contactPhone: DeliveryPhone;
    instructions: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  package: {
    packageType: string;
    sizeTier: string;
    description: string | null;
    weightKg: number;
    lengthCm: number | null;
    widthCm: number | null;
    heightCm: number | null;
    quantity: number;
    requirements: string[];
    photos: Array<{
      objectKey: string;
      storageProvider: string;
      mimeType: string | null;
      fileSizeBytes: number | null;
      url?: string | null;
    }>;
  };
  schedule: {
    mode: string;
    timezone: string;
    scheduledAt: string | null;
    windowStart: string | null;
    windowEnd: string | null;
  };
  timeline: Array<{
    id: string;
    fromStatus: string | null;
    toStatus: string;
    source: string;
    reason: string | null;
    createdAt: string;
  }>;
  orchestration: {
    id: string;
    attemptNumber: number;
    completedAt: string | null;
    selectedOption: {
      providerCode: string;
      serviceCode: string | null;
      quote: { amount: number; currency: string };
      selectionReason: string | null;
    } | null;
  } | null;
  booking: {
    id: string;
    providerCode: string;
    serviceCode: string | null;
    status: BackendProviderBookingStatus;
    providerReference: string | null;
    providerOrderId: string | null;
    quote: { amount: number; currency: string };
    bookedAt: string | null;
  } | null;
  cancellation: {
    id: string;
    status: string;
    reasonCode: string;
    reasonMessage: string | null;
    requestedAt: string;
    cancelledAt: string | null;
    refund: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      gatewayRefundId: string | null;
      gatewayRefundReference: string | null;
      requestedAt: string;
      processedAt: string | null;
      policy: "FULL_REMAINING_PREPAID";
    } | null;
  } | null;
  payment: DeliveryHistoryPayment | null;
  tracking: {
    latest: {
      normalizedStatus: string | null;
      providerStatus: string | null;
      trackingUrl: string | null;
      lastUpdatedAt: string;
    } | null;
  };
  rating: {
    driverRating: number;
    platformRating: number | null;
    submittedAt: string;
  } | null;
  feedback: {
    comment: string | null;
  } | null;
};

export type DeliveryHistoryPricingBreakdown = {
  providerQuoteAmount: number;
  platformFeePercent: number;
  platformFeeAmount: number;
  subtotal: number;
  gstPercent: number;
  gstAmount: number;
  customerPayableAmount: number;
  currency: string;
};

export type DeliveryHistoryPayment = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  gateway: string;
  gatewayOrderId: string | null;
  gatewayPaymentSessionId: string | null;
  gatewayPaymentId: string | null;
  paidAt: string | null;
  failedAt: string | null;
  expiredAt: string | null;
  refundedAmount: number;
  pricingBreakdown: DeliveryHistoryPricingBreakdown;
  attempts: Array<{
    id: string;
    attemptNumber: number;
    status: string;
    amount: number;
    currency: string;
    gatewayPaymentId: string | null;
    gatewayOrderId: string | null;
    paymentMethod: string | null;
    failureCode: string | null;
    failureMessage: string | null;
    startedAt: string | null;
    completedAt: string | null;
  }>;
  refunds: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    reasonCode: string | null;
    reason: string | null;
    gatewayRefundId: string | null;
    gatewayRefundReference: string | null;
    idempotencyKey: string;
    requestedAt: string;
    processedAt: string | null;
  }>;
};

export type DeliveryTimelineEntry = {
  id: string;
  title: string;
  timestamp: string;
  description: string | null;
};
