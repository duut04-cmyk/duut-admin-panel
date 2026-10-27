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
  } | null;
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

export type DeliveryTimelineEntry = {
  id: string;
  title: string;
  timestamp: string;
  description: string | null;
};
