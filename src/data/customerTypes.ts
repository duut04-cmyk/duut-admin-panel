export type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

export type OAuthProvider = "GOOGLE";

export type DeliveryStatus =
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

export type PhoneResponse = {
  countryCode: string;
  number: string;
  e164: string;
};

export type CustomerStats = {
  totalDeliveries: number;
  activeDeliveries: number;
  completedDeliveries: number;
  failedDeliveries: number;
  cancelledDeliveries: number;
  lastDeliveryAt: string | null;
};

export type CustomerSummary = {
  id: string;
  name: string;
  email: string;
  phone: PhoneResponse | null;
  emailVerified: boolean;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  oauthProviders: OAuthProvider[];
  stats: Pick<CustomerStats, "totalDeliveries" | "lastDeliveryAt">;
};

export type CustomerDetail = CustomerSummary & {
  stats: CustomerStats;
  averageRating: number | null;
  recentDeliveries: CustomerDeliverySummary[];
};

export type CustomerDeliverySummary = {
  id: string;
  reference: string;
  status: DeliveryStatus;
  pickup: { addressText: string; contactName: string };
  drop: { addressText: string; contactName: string };
  createdAt: string;
  updatedAt: string;
};

export type PaginatedCustomers = {
  items: CustomerSummary[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CustomerMetrics = {
  total: number;
  active: number;
  verified: number;
  withDeliveries: number;
};

export type UpdateCustomerInput = {
  status?: "ACTIVE" | "SUSPENDED";
};

export type ListCustomersParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  emailVerified?: boolean;
};
