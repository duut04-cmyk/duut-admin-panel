export type DeliveryRequestStatus =
  | "pending_orchestration"
  | "orchestrating"
  | "booking"
  | "booked"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "failed";

export type DeliveryType = "standard" | "express" | "scheduled";

export type BookingStatus = "pending" | "confirmed" | "failed" | "cancelled";

export type DeliveryEventType =
  | "created"
  | "orchestration_started"
  | "orchestration_completed"
  | "booking_requested"
  | "booking_confirmed"
  | "driver_assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "failed";

export type ScoreFactorKey =
  | "availability"
  | "packageFit"
  | "requirementFit"
  | "price"
  | "eta"
  | "serviceQuality";

export type DeliveryLocation = {
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  contactName: string;
  contactPhone: string;
};

export type DeliveryPackage = {
  type: string;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  volumeCm3: number;
};

export type DeliveryRequirements = {
  deliveryType: DeliveryType;
  requestedTime: string;
  specialRequirements: string[];
  instructions: string;
};

export type DeliveryRequest = {
  deliveryId: string;
  createdAt: string;
  pickup: DeliveryLocation;
  drop: DeliveryLocation;
  package: DeliveryPackage;
  requirements: DeliveryRequirements;
  status: DeliveryRequestStatus;
};

export type DeliveryService = {
  id: string;
  name: string;
  category: string;
  serviceLevel: string;
};

export type ServiceEvaluation = {
  serviceId: string;
  serviceName: string;
  availability: boolean;
  availabilityReason: string;
  price: number | null;
  estimatedPickupMinutes: number | null;
  estimatedDeliveryMinutes: number | null;
  totalEtaMinutes: number | null;
  packageCompatible: boolean;
  requirementCompatible: boolean;
  serviceQualityScore: number | null;
  responseTimeMs: number;
  evaluatedAt: string;
  rejectionReasons: string[];
  notSelectedReason?: string;
};

export type DecisionFactorScore = {
  weight: number;
  score: number;
  weightedScore: number;
};

export type DecisionScore = {
  factors: Record<ScoreFactorKey, DecisionFactorScore>;
  totalScore: number;
};

export type OrchestrationDecision = {
  deliveryId: string;
  orchestrationId: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  servicesEvaluated: number;
  availableOptions: number;
  selectedServiceId: string;
  selectedServiceName: string;
  selectionReason: string;
  decisionScore: DecisionScore;
  evaluations: ServiceEvaluation[];
};

export type BookingRecord = {
  bookingId: string;
  deliveryId: string;
  serviceId: string;
  serviceName: string;
  requestedAt: string;
  confirmedAt: string | null;
  status: BookingStatus;
  bookingResponseTimeMs: number | null;
  failureReason: string | null;
};

export type DeliveryEvent = {
  id: string;
  deliveryId: string;
  type: DeliveryEventType;
  timestamp: string;
  description: string;
};

export type OrchestrationRecord = {
  deliveryRequest: DeliveryRequest;
  evaluations: ServiceEvaluation[];
  decision: OrchestrationDecision;
  booking: BookingRecord;
  events: DeliveryEvent[];
};

export const SCORE_FACTOR_WEIGHTS: Record<ScoreFactorKey, number> = {
  availability: 25,
  packageFit: 15,
  requirementFit: 15,
  price: 20,
  eta: 15,
  serviceQuality: 10,
};

export const MOCK_DELIVERY_SERVICES: DeliveryService[] = [
  {
    id: "swiftgo",
    name: "SwiftGo",
    category: "urban_express",
    serviceLevel: "standard",
  },
  {
    id: "movex",
    name: "MoveX",
    category: "same_day",
    serviceLevel: "express",
  },
  {
    id: "flashdrop",
    name: "FlashDrop",
    category: "hyperlocal",
    serviceLevel: "express",
  },
  {
    id: "cityfleet",
    name: "CityFleet",
    category: "scheduled",
    serviceLevel: "standard",
  },
  {
    id: "quickroute",
    name: "QuickRoute",
    category: "regional",
    serviceLevel: "standard",
  },
];
