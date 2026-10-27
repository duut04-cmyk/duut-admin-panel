import type {
  FeedbackReporting,
  OrchestrationReporting,
  ReportingSummary,
} from "@/data/reportingTypes";
import type { CustomerSummary } from "@/data/customerTypes";
import type { ProviderSummary } from "@/data/providerTypes";
import type {
  AccountabilitySnapshotMetrics,
  FeedbackQualityMetrics,
  OrchestrationAccountabilityMetrics,
  ProviderAccountabilityRow,
} from "./accountability";
import {
  countCustomersAtRisk,
  countProvidersNeedingAttention,
  getProviderAccountabilityRows,
} from "./accountability";

export type LiveSnapshotRiskSource = {
  providers: ProviderSummary[] | null;
  customers: CustomerSummary[] | null;
};

export type LiveSnapshotMetrics = AccountabilitySnapshotMetrics & {
  /** False when the provider list request failed (count is not a true zero). */
  providersNeedingAttentionKnown: boolean;
  /** False when the customer list request failed. */
  customerRiskCountKnown: boolean;
  /** True when customer risk is counted from the loaded sample only (not platform total). */
  customerRiskCountIsSample: boolean;
};

export function mapSnapshotMetrics(
  summary: ReportingSummary,
  openIssueCount = 0,
  riskSource?: LiveSnapshotRiskSource,
): LiveSnapshotMetrics {
  const deliverySuccessRate =
    summary.deliveriesCreated.total === 0
      ? 0
      : Math.round(
          (summary.deliveriesCreated.deliveredCurrentStatus /
            summary.deliveriesCreated.total) *
            1000,
        ) / 10;

  const providerList = riskSource?.providers;
  const customerList = riskSource?.customers;
  const providersKnown = providerList != null;
  const customersKnown = customerList != null;

  return {
    deliverySuccessRate,
    bookingSuccessRate: summary.booking.successRatePercent ?? 0,
    orchestrationFailureRate: summary.orchestrationRuns.failureRatePercent ?? 0,
    avgDecisionTimeMs: summary.orchestrationRuns.averageDurationMs ?? 0,
    providersNeedingAttention: providersKnown
      ? countProvidersNeedingAttention(providerList)
      : 0,
    customerRiskCount: customersKnown ? countCustomersAtRisk(customerList) : 0,
    openIssueCount,
    providersNeedingAttentionKnown: providersKnown,
    customerRiskCountKnown: customersKnown,
    customerRiskCountIsSample: customersKnown,
  };
}

export function mapOrchestrationMetrics(
  summary: ReportingSummary,
  orchestration: OrchestrationReporting,
): OrchestrationAccountabilityMetrics {
  return {
    totalRuns: summary.orchestrationRuns.totalRuns,
    successfulBookings: summary.booking.deliveriesWithConfirmedBooking,
    failedBookings: summary.deliveriesCreated.failed,
    cancelledDeliveries: summary.deliveriesCreated.cancelled,
    avgDecisionTimeMs: summary.orchestrationRuns.averageDurationMs ?? 0,
    slowestDecisionTimeMs: 0,
    topExclusions: [],
    topBookingFailures: orchestration.failureReasons.map((item) => ({
      label: item.reason,
      count: item.count,
    })),
  };
}

export function mapFeedbackMetrics(
  feedback: FeedbackReporting,
): FeedbackQualityMetrics {
  return {
    feedbackCount: feedback.feedbackCount,
    avgDriverRating: feedback.averageDriverRating,
    avgDeliveryRating: feedback.averageDeliveryRating,
    topPositiveTags: feedback.topPositiveTags.map((tag) => ({
      tag: tag.tag,
      label: tag.tag.replaceAll("_", " "),
      count: tag.count,
    })),
    topIssueTags: feedback.topIssueTags.map((tag) => ({
      tag: tag.tag,
      label: tag.tag.replaceAll("_", " "),
      count: tag.count,
    })),
    recentFeedback: feedback.recentSnippets.map((snippet) => ({
      deliveryId: snippet.deliveryId,
      deliveryReference: snippet.deliveryReference,
      driverRating: snippet.driverRating,
      deliveryRating: snippet.deliveryRating,
      submittedAt: snippet.submittedAt,
    })),
  };
}

export function mapProviderRows(
  providers: ProviderSummary[],
): ProviderAccountabilityRow[] {
  return getProviderAccountabilityRows(providers);
}
