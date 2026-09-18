import type { CustomerSummary } from "@/data/customerTypes";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import {
  formatDecisionTime,
  getDeliveredCount,
  getPlatformMetrics,
  getServicePerformance,
  getTopFailureReasons,
} from "@/data/orchestrationMetrics";
import type { ProviderSummary } from "@/data/providerTypes";
import {
  FEEDBACK_ISSUE_LABELS,
  FEEDBACK_POSITIVE_LABELS,
  mockDeliveryFeedback,
  type FeedbackIssueTag,
  type MockDeliveryFeedback,
} from "./data/mockFeedback";

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
  status: OrchestrationRecord["deliveryRequest"]["status"];
  route: string;
  serviceName: string;
  bookingStatus: OrchestrationRecord["booking"]["status"];
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
  recentFeedback: MockDeliveryFeedback[];
};

function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function shortenAddress(value: string): string {
  return value.split(",")[0]?.trim() || value;
}

export function getAccountabilitySnapshot(
  records: OrchestrationRecord[],
  providers: ProviderSummary[],
  customers: CustomerSummary[],
  issues: IssueItem[],
): AccountabilitySnapshotMetrics {
  const total = records.length;
  const delivered = getDeliveredCount(records);
  const platform = getPlatformMetrics(records);
  const failedOrchestration = records.filter(
    (record) =>
      record.booking.status === "failed" ||
      record.deliveryRequest.status === "failed" ||
      record.deliveryRequest.status === "cancelled",
  ).length;

  const providersNeedingAttention = providers.filter(
    (provider) =>
      provider.health.status === "UNHEALTHY" ||
      provider.integrationStatus === "ERROR" ||
      (provider.enabled &&
        !provider.orchestrationEnabled &&
        provider.orchestrationEligible),
  ).length;

  const customerRiskCount = customers.filter(
    (customer) =>
      customer.status === "SUSPENDED" ||
      (!customer.emailVerified && customer.stats.totalDeliveries > 0),
  ).length;

  return {
    deliverySuccessRate: total === 0 ? 0 : round((delivered / total) * 100),
    bookingSuccessRate: platform.bookingSuccessRate,
    orchestrationFailureRate:
      total === 0 ? 0 : round((failedOrchestration / total) * 100),
    avgDecisionTimeMs: platform.averageDecisionTimeMs,
    providersNeedingAttention,
    customerRiskCount,
    openIssueCount: issues.length,
  };
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

export function getOrchestrationAccountabilityMetrics(
  records: OrchestrationRecord[],
): OrchestrationAccountabilityMetrics {
  const platform = getPlatformMetrics(records);
  const failures = getTopFailureReasons(records);
  const decisionTimes = records.map((record) => record.decision.durationMs);

  const topExclusions = failures.items
    .filter((item) => item.key !== "booking_failed")
    .slice(0, 5)
    .map((item) => ({ label: item.label, count: item.count }));

  const bookingFailed = failures.items.find((item) => item.key === "booking_failed");

  return {
    totalRuns: records.length,
    successfulBookings: platform.successfulBookings,
    failedBookings: platform.failedBookings,
    cancelledDeliveries: platform.cancelledDeliveries,
    avgDecisionTimeMs: platform.averageDecisionTimeMs,
    slowestDecisionTimeMs: decisionTimes.length === 0 ? 0 : Math.max(...decisionTimes),
    topExclusions,
    topBookingFailures: bookingFailed
      ? [{ label: bookingFailed.label, count: bookingFailed.count }]
      : [],
  };
}

export function getDeliveryAccountabilityRows(
  records: OrchestrationRecord[],
): DeliveryAccountabilityRow[] {
  return records
    .map((record) => {
      const { deliveryRequest, booking, decision } = record;
      let issue: string | null = null;

      if (deliveryRequest.status === "failed") {
        issue = "Delivery failed";
      } else if (deliveryRequest.status === "cancelled") {
        issue = "Delivery cancelled";
      } else if (booking.status === "failed") {
        issue = booking.failureReason ?? "Booking failed";
      }

      return {
        deliveryId: deliveryRequest.deliveryId,
        status: deliveryRequest.status,
        route: `${shortenAddress(deliveryRequest.pickup.address)} → ${shortenAddress(deliveryRequest.drop.address)}`,
        serviceName: decision.selectedServiceName,
        bookingStatus: booking.status,
        createdAt: deliveryRequest.createdAt,
        issue,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getProblemDeliveries(
  rows: DeliveryAccountabilityRow[],
): DeliveryAccountabilityRow[] {
  return rows.filter((row) => row.issue !== null).slice(0, 8);
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

function countTags<T extends string>(
  feedback: MockDeliveryFeedback[],
  selector: (item: MockDeliveryFeedback) => T[],
  labels: Record<T, string>,
): FeedbackTagCount[] {
  const counts = new Map<T, number>();

  for (const item of feedback) {
    for (const tag of selector(item)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({
      tag,
      label: labels[tag],
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getFeedbackQualityMetrics(
  records: OrchestrationRecord[],
): FeedbackQualityMetrics {
  const deliveryIds = new Set(
    records.map((record) => record.deliveryRequest.deliveryId),
  );
  const feedback = mockDeliveryFeedback.filter((item) =>
    deliveryIds.has(item.deliveryId),
  );

  const driverRatings = feedback.map((item) => item.driverRating);
  const deliveryRatings = feedback.map((item) => item.deliveryRating);

  return {
    feedbackCount: feedback.length,
    avgDriverRating:
      driverRatings.length === 0
        ? null
        : round(
            driverRatings.reduce((sum, value) => sum + value, 0) / driverRatings.length,
            1,
          ),
    avgDeliveryRating:
      deliveryRatings.length === 0
        ? null
        : round(
            deliveryRatings.reduce((sum, value) => sum + value, 0) /
              deliveryRatings.length,
            1,
          ),
    topPositiveTags: countTags(
      feedback,
      (item) => item.positiveTags,
      FEEDBACK_POSITIVE_LABELS,
    ).slice(0, 5),
    topIssueTags: countTags(
      feedback,
      (item) => item.issueTags,
      FEEDBACK_ISSUE_LABELS,
    ).slice(0, 5),
    recentFeedback: [...feedback]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
  };
}

export function getServicePerformanceForPeriod(records: OrchestrationRecord[]) {
  return getServicePerformance(records);
}

export function buildIssueQueue(input: {
  providers: ProviderSummary[];
  records: OrchestrationRecord[];
  customers: CustomerSummary[];
  feedback: MockDeliveryFeedback[];
}): IssueItem[] {
  const issues: IssueItem[] = [];

  for (const provider of input.providers) {
    if (provider.health.status === "UNHEALTHY") {
      issues.push({
        id: `provider-health-${provider.id}`,
        severity: "high",
        source: "Provider",
        issue: provider.health.lastError ?? "Health check failing",
        entityLabel: provider.name,
        href: "/providers",
      });
    }
    if (provider.integrationStatus === "ERROR") {
      issues.push({
        id: `provider-integration-${provider.id}`,
        severity: "high",
        source: "Provider",
        issue: "Integration error",
        entityLabel: provider.name,
        href: "/providers",
      });
    }
    if (
      provider.enabled &&
      !provider.orchestrationEnabled &&
      provider.orchestrationEligible
    ) {
      issues.push({
        id: `provider-orch-${provider.id}`,
        severity: "medium",
        source: "Provider",
        issue: "Eligible provider not in orchestration",
        entityLabel: provider.name,
        href: "/providers",
      });
    }
  }

  for (const record of input.records) {
    const deliveryId = record.deliveryRequest.deliveryId;

    if (record.booking.status === "failed") {
      issues.push({
        id: `booking-${deliveryId}`,
        severity: "high",
        source: "Booking",
        issue: record.booking.failureReason ?? "Booking failed after selection",
        entityLabel: deliveryId,
        href: `/deliveries/${deliveryId}`,
      });
    }

    if (record.deliveryRequest.status === "failed") {
      issues.push({
        id: `delivery-failed-${deliveryId}`,
        severity: "high",
        source: "Delivery",
        issue: "Delivery ended in failed state",
        entityLabel: deliveryId,
        href: `/deliveries/${deliveryId}`,
      });
    }

    if (record.deliveryRequest.status === "cancelled") {
      issues.push({
        id: `delivery-cancelled-${deliveryId}`,
        severity: "medium",
        source: "Delivery",
        issue: "Delivery was cancelled",
        entityLabel: deliveryId,
        href: `/deliveries/${deliveryId}`,
      });
    }

    const rejected = record.decision.evaluations.filter(
      (evaluation) => evaluation.rejectionReasons.length > 0,
    );
    if (rejected.length >= 3) {
      issues.push({
        id: `orch-exclusions-${deliveryId}`,
        severity: "medium",
        source: "Orchestration",
        issue: `${rejected.length} services excluded during evaluation`,
        entityLabel: deliveryId,
        href: `/orchestration/${deliveryId}`,
      });
    }
  }

  for (const customer of input.customers) {
    if (customer.status === "SUSPENDED") {
      issues.push({
        id: `customer-${customer.id}`,
        severity: "medium",
        source: "Customer",
        issue: "Customer account suspended",
        entityLabel: customer.name,
        href: `/customers/${customer.id}`,
      });
    }
  }

  for (const item of input.feedback) {
    if (item.issueTags.length === 0) continue;

    const primaryTag = item.issueTags[0] as FeedbackIssueTag;
    issues.push({
      id: `feedback-${item.deliveryId}`,
      severity: item.deliveryRating <= 2 ? "high" : "low",
      source: "Feedback",
      issue: FEEDBACK_ISSUE_LABELS[primaryTag],
      entityLabel: item.deliveryId,
      href: `/deliveries/${item.deliveryId}`,
    });
  }

  const severityOrder: Record<IssueSeverity, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

export function formatAccountabilityPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export { formatDecisionTime };
