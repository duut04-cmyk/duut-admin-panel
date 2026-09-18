export type FeedbackIssueTag =
  | "DRIVER_LATE"
  | "DRIVER_UNPROFESSIONAL"
  | "DELIVERY_DELAYED"
  | "COMMUNICATION_ISSUE"
  | "PACKAGE_HANDLING_ISSUE"
  | "TRACKING_ISSUE"
  | "OTHER";

export type FeedbackPositiveTag =
  | "DRIVER_POLITE"
  | "DRIVER_PROFESSIONAL"
  | "FAST_DELIVERY"
  | "EASY_BOOKING"
  | "GOOD_COMMUNICATION"
  | "PACKAGE_HANDLED_WELL";

export type MockDeliveryFeedback = {
  deliveryId: string;
  customerName: string;
  driverRating: number;
  deliveryRating: number;
  positiveTags: FeedbackPositiveTag[];
  issueTags: FeedbackIssueTag[];
  comment: string | null;
  createdAt: string;
};

export const FEEDBACK_ISSUE_LABELS: Record<FeedbackIssueTag, string> = {
  DRIVER_LATE: "Driver late",
  DRIVER_UNPROFESSIONAL: "Driver unprofessional",
  DELIVERY_DELAYED: "Delivery delayed",
  COMMUNICATION_ISSUE: "Communication issue",
  PACKAGE_HANDLING_ISSUE: "Package handling issue",
  TRACKING_ISSUE: "Tracking issue",
  OTHER: "Other",
};

export const FEEDBACK_POSITIVE_LABELS: Record<FeedbackPositiveTag, string> = {
  DRIVER_POLITE: "Driver polite",
  DRIVER_PROFESSIONAL: "Driver professional",
  FAST_DELIVERY: "Fast delivery",
  EASY_BOOKING: "Easy booking",
  GOOD_COMMUNICATION: "Good communication",
  PACKAGE_HANDLED_WELL: "Package handled well",
};

/** Sample feedback aligned with mock orchestration delivery IDs. */
export const mockDeliveryFeedback: MockDeliveryFeedback[] = [
  {
    deliveryId: "DLV-2024-001",
    customerName: "Priya Sharma",
    driverRating: 5,
    deliveryRating: 5,
    positiveTags: ["FAST_DELIVERY", "DRIVER_POLITE", "PACKAGE_HANDLED_WELL"],
    issueTags: [],
    comment: "Driver arrived quickly and handled the medicine package carefully.",
    createdAt: "2026-09-10T14:22:00.000Z",
  },
  {
    deliveryId: "DLV-2024-004",
    customerName: "Arjun Mehta",
    driverRating: 2,
    deliveryRating: 2,
    positiveTags: [],
    issueTags: ["DRIVER_LATE", "DELIVERY_DELAYED"],
    comment: "Delivery was over an hour late with no status updates.",
    createdAt: "2026-09-12T09:15:00.000Z",
  },
  {
    deliveryId: "DLV-2024-007",
    customerName: "Sneha Patel",
    driverRating: 4,
    deliveryRating: 4,
    positiveTags: ["EASY_BOOKING", "GOOD_COMMUNICATION"],
    issueTags: ["TRACKING_ISSUE"],
    comment: "Booking was smooth but live tracking stopped updating mid-route.",
    createdAt: "2026-09-14T18:40:00.000Z",
  },
  {
    deliveryId: "DLV-2024-009",
    customerName: "Rahul Verma",
    driverRating: 1,
    deliveryRating: 1,
    positiveTags: [],
    issueTags: ["PACKAGE_HANDLING_ISSUE", "DRIVER_UNPROFESSIONAL"],
    comment: "Package arrived damaged and driver was unresponsive.",
    createdAt: "2026-09-15T11:05:00.000Z",
  },
];
