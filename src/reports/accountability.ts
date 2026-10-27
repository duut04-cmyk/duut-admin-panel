import type { CustomerSummary } from "@/data/customerTypes";
import { formatDecisionTime } from "@/data/orchestrationMetrics";
import type { ProviderSummary } from "@/data/providerTypes";

export type IssueSeverity = "high" | "medium" | "low";

export type IssueItem = {
  id: string;
  severity: IssueSeverity;
  source:
    "Provider" | "Booking" | "Delivery" | "Orchestration" | "Customer" | "Feedback";
  issue: string;
  entityLabel: string;
  href: string;
};

export type AccountabilitySnapshotMetrics = {
  deliverySuccessRate: number;
  bookingSuccessRate: number;
  orchestrationFailureRate: number;
  avgDecisionTimeMs: number;
  providersNeedingAttention: number;
  customerRiskCount: number;
  openIssueCount: number;
};

export type ProviderAccountabilityRow = {
  id: string;
  code: string;
  name: string;
  environment: ProviderSummary["environment"];
  healthStatus: ProviderSummary["health"]["status"];
  integrationStatus: ProviderSummary["integrationStatus"];
  enabled: boolean;
  orchestrationEnabled: boolean;
  orchestrationEligible: boolean;
  issueSummary: string | null;
};

export type OrchestrationAccountabilityMetrics = {
  totalRuns: number;
  successfulBookings: number;
  failedBookings: number;
  cancelledDeliveries: number;
  avgDecisionTimeMs: number;
  slowestDecisionTimeMs: number;
  topExclusions: { label: string; count: number }[];
  topBookingFailures: { label: string; count: number }[];
};

export type DeliveryAccountabilityRow = {
  deliveryId: string;
  status: string;
  route: string;
  serviceName: string;
  bookingStatus: string;
  createdAt: string;
  issue: string | null;
};

export type CustomerAccountabilityRow = {
  id: string;
  name: string;
  email: string;
  status: CustomerSummary["status"];
  emailVerified: boolean;
  totalDeliveries: number;
  lastDeliveryAt: string | null;
  riskNote: string | null;
};

export type FeedbackTagCount = {
  tag: string;
  label: string;
  count: number;
};

export type FeedbackQualityMetrics = {
  feedbackCount: number;
  avgDriverRating: number | null;
  avgDeliveryRating: number | null;
  topPositiveTags: FeedbackTagCount[];
  topIssueTags: FeedbackTagCount[];
  recentFeedback: Array<{
    deliveryId: string;
    deliveryReference: string;
    driverRating: number;
    deliveryRating: number;
    submittedAt: string;
  }>;
};

export function providerNeedsAttention(provider: ProviderSummary): boolean {
  return (
    provider.health.status === "UNHEALTHY" ||
    provider.integrationStatus === "ERROR" ||
    (provider.enabled &&
      !provider.orchestrationEnabled &&
      provider.orchestrationEligible)
  );
}

export function countProvidersNeedingAttention(providers: ProviderSummary[]): number {
  return providers.filter(providerNeedsAttention).length;
}

/** At-risk: suspended, or unverified email with prior delivery activity. */
export function customerAtRisk(customer: CustomerSummary): boolean {
  return (
    customer.status === "SUSPENDED" ||
    (!customer.emailVerified && customer.stats.totalDeliveries > 0)
  );
}

export function countCustomersAtRisk(customers: CustomerSummary[]): number {
  return customers.filter(customerAtRisk).length;
}

export function getProviderAccountabilityRows(
  providers: ProviderSummary[],
): ProviderAccountabilityRow[] {
  return providers.map((provider) => {
    let issueSummary: string | null = null;

    if (provider.health.status === "UNHEALTHY") {
      issueSummary = provider.health.lastError ?? "Provider health check failing";
    } else if (provider.integrationStatus === "ERROR") {
      issueSummary = "Integration error";
    } else if (provider.integrationStatus === "NOT_CONFIGURED") {
      issueSummary = "Credentials not configured";
    } else if (provider.enabled && !provider.orchestrationEnabled) {
      issueSummary = "Enabled but not in orchestration";
    } else if (!provider.enabled && provider.orchestrationEnabled) {
      issueSummary = "Orchestration on while disabled";
    }

    return {
      id: provider.id,
      code: provider.code,
      name: provider.name,
      environment: provider.environment,
      healthStatus: provider.health.status,
      integrationStatus: provider.integrationStatus,
      enabled: provider.enabled,
      orchestrationEnabled: provider.orchestrationEnabled,
      orchestrationEligible: provider.orchestrationEligible,
      issueSummary,
    };
  });
}

export function getCustomerAccountabilityRows(
  customers: CustomerSummary[],
): CustomerAccountabilityRow[] {
  return customers
    .map((customer) => {
      let riskNote: string | null = null;

      if (customer.status === "SUSPENDED") {
        riskNote = "Account suspended";
      } else if (!customer.emailVerified && customer.stats.totalDeliveries > 0) {
        riskNote = "Active deliveries but email unverified";
      } else if (customer.stats.totalDeliveries === 0) {
        riskNote = "No deliveries yet";
      }

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        status: customer.status,
        emailVerified: customer.emailVerified,
        totalDeliveries: customer.stats.totalDeliveries,
        lastDeliveryAt: customer.stats.lastDeliveryAt,
        riskNote,
      };
    })
    .sort((a, b) => b.totalDeliveries - a.totalDeliveries);
}

export function getAtRiskCustomers(
  rows: CustomerAccountabilityRow[],
): CustomerAccountabilityRow[] {
  return rows
    .filter(
      (row) =>
        row.riskNote === "Account suspended" ||
        row.riskNote === "Active deliveries but email unverified",
    )
    .slice(0, 6);
}

export function formatAccountabilityPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export { formatDecisionTime };
