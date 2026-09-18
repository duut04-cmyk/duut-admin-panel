import type {
  CustomerDetail,
  CustomerMetrics,
  CustomerSummary,
  DeliveryStatus,
  UserStatus,
} from "@/data/customerTypes";
type AdminStatusVariant =
  "operational" | "active" | "pending" | "success" | "failed" | "cancelled" | "warning";

export function getCustomerMetrics(customers: CustomerSummary[]): CustomerMetrics {
  return {
    total: customers.length,
    active: customers.filter((customer) => customer.status === "ACTIVE").length,
    verified: customers.filter((customer) => customer.emailVerified).length,
    withDeliveries: customers.filter((customer) => customer.stats.totalDeliveries > 0)
      .length,
  };
}

export function formatCustomerDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatPhone(phone: CustomerSummary["phone"]): string {
  if (!phone) return "—";
  return phone.e164 || `${phone.countryCode} ${phone.number}`;
}

export function customerStatusVariant(status: UserStatus): AdminStatusVariant {
  switch (status) {
    case "ACTIVE":
      return "operational";
    case "SUSPENDED":
      return "warning";
    case "DELETED":
    default:
      return "cancelled";
  }
}

export function customerStatusLabel(status: UserStatus): string {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "SUSPENDED":
      return "Suspended";
    case "DELETED":
      return "Deleted";
    default:
      return status;
  }
}

export function deliveryStatusLabel(status: DeliveryStatus): string {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function deliveryStatusVariant(status: DeliveryStatus): AdminStatusVariant {
  switch (status) {
    case "DELIVERED":
      return "success";
    case "FAILED":
      return "failed";
    case "CANCELLED":
      return "cancelled";
    case "IN_TRANSIT":
    case "PICKED_UP":
    case "BOOKED":
    case "DRIVER_ASSIGNED":
      return "active";
    case "ORCHESTRATING":
    case "BOOKING":
    case "OPTION_READY":
      return "pending";
    default:
      return "operational";
  }
}

export function formatRoute(
  pickup: { addressText: string },
  drop: { addressText: string },
): string {
  const shorten = (value: string) => {
    const parts = value.split(",");
    return parts[0]?.trim() || value;
  };
  return `${shorten(pickup.addressText)} → ${shorten(drop.addressText)}`;
}

export function signInMethods(customer: CustomerDetail | CustomerSummary): string {
  const methods = ["Email & password"];
  if (customer.oauthProviders.includes("GOOGLE")) {
    methods.push("Google");
  }
  return methods.join(", ");
}
