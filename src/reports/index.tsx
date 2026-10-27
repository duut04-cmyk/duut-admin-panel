"use client";

import { useCallback, useMemo, useState } from "react";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import { useExclusiveAsync } from "@/lib/useExclusiveAsync";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import {
  resolveReportingWindow,
  type ReportingDateRangeKey,
} from "@/lib/reportingDateRange";
import type {
  FeedbackReporting,
  OrchestrationReporting,
  ReportingSummary,
} from "@/data/reportingTypes";
import type { CustomerSummary } from "@/data/customerTypes";
import type { ProviderSummary } from "@/data/providerTypes";
import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
import {
  ReportsPageSkeleton,
  TableCardSkeleton,
} from "@/components/loading/skeletonSections";
import { fetchCustomers } from "@/customers/api";
import { fetchProviders } from "@/providers/api";
import {
  fetchFeedbackReporting,
  fetchOrchestrationReporting,
  fetchReportingSummary,
} from "@/reporting/api";
import { getAtRiskCustomers, getCustomerAccountabilityRows } from "./accountability";
import { buildLiveIssueQueue } from "./liveIssueQueue";
import AccountabilitySnapshot from "./components/AccountabilitySnapshot";
import CustomerAccountability from "./components/CustomerAccountability";
import FeedbackQualitySection from "./components/FeedbackQualitySection";
import IssueQueue from "./components/IssueQueue";
import OrchestrationAccountability from "./components/OrchestrationAccountability";
import ProviderAccountabilityTable from "./components/ProviderAccountabilityTable";
import ReportsPageHeader from "./components/ReportsPageHeader";
import ReportsSection from "./components/ReportsSection";
import ServiceOrchestrationTable from "./components/ServiceOrchestrationTable";
import {
  mapFeedbackMetrics,
  mapOrchestrationMetrics,
  mapProviderRows,
  mapSnapshotMetrics,
} from "./liveReportMappers";
import {
  assembleReportsLoadResult,
  reportsPartialFailureMessage,
  type ReportsSectionKey,
} from "./reportsLoad";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<ReportingDateRangeKey>("30d");
  const window = useMemo(() => resolveReportingWindow(dateRange), [dateRange]);

  const [summary, setSummary] = useState<ReportingSummary | null>(null);
  const [orchestration, setOrchestration] = useState<OrchestrationReporting | null>(
    null,
  );
  const [feedback, setFeedback] = useState<FeedbackReporting | null>(null);
  const [providers, setProviders] = useState<ProviderSummary[] | null>(null);
  const [customerItems, setCustomerItems] = useState<CustomerSummary[] | null>(null);
  const [customerTotal, setCustomerTotal] = useState<number | null>(null);
  const [failedSections, setFailedSections] = useState<ReportsSectionKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    const [
      summaryResult,
      orchestrationResult,
      feedbackResult,
      providersResult,
      customersResult,
    ] = await Promise.all([
      fetchReportingSummary({ from: window.from, to: window.to }),
      fetchOrchestrationReporting({ from: window.from, to: window.to }),
      fetchFeedbackReporting({ from: window.from, to: window.to, recentLimit: 5 }),
      fetchProviders(),
      fetchCustomers({ limit: 100 }),
    ]);

    return assembleReportsLoadResult({
      summaryResult,
      orchestrationResult,
      feedbackResult,
      providersResult,
      customersResult: {
        success: customersResult.success,
        error: customersResult.error,
        data: customersResult.success
          ? {
              items: customersResult.data?.items ?? [],
              total: customersResult.data?.total,
            }
          : undefined,
      },
    });
  }, [window.from, window.to]);

  const applyLoadResult = useCallback(
    (result: Awaited<ReturnType<typeof loadReports>>) => {
      if (!result.success) {
        setSummary(null);
        setOrchestration(null);
        setFeedback(null);
        setProviders(null);
        setCustomerItems(null);
        setCustomerTotal(null);
        setFailedSections([]);
        setError(result.error);
        return;
      }
      setSummary(result.summary);
      setOrchestration(result.orchestration);
      setFeedback(result.feedback);
      setProviders(result.providers);
      setCustomerItems(result.customers);
      setCustomerTotal(result.customerTotal);
      setFailedSections(result.failedSections);
      setError(null);
    },
    [],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await loadReports();
    setLoading(false);
    applyLoadResult(result);
  }, [applyLoadResult, loadReports]);

  const { run: retryReports, busy: retryingReports } = useExclusiveAsync(refresh);

  useLoadedAsync(
    async (isStale) => {
      const result = await loadReports();
      if (isStale()) return;
      setLoading(false);
      applyLoadResult(result);
    },
    [applyLoadResult, loadReports],
  );

  const partialFailureMessage = reportsPartialFailureMessage(failedSections);

  const issues = summary
    ? buildLiveIssueQueue({
        summary,
        orchestration,
        providers: providers ?? [],
        feedback,
      })
    : [];

  const snapshot = summary
    ? mapSnapshotMetrics(summary, issues.length, {
        providers,
        customers: customerItems,
      })
    : null;

  const orchestrationMetrics = orchestration
    ? mapOrchestrationMetrics(summary!, orchestration)
    : null;
  const feedbackMetrics = feedback ? mapFeedbackMetrics(feedback) : null;
  const providerRows = providers ? mapProviderRows(providers) : [];
  const customerRows = customerItems
    ? getCustomerAccountabilityRows(customerItems)
    : [];
  const atRiskRows = getAtRiskCustomers(customerRows);

  const customersSectionFailed = failedSections.includes("customers");
  const providersSectionFailed = failedSections.includes("providers");
  const orchestrationSectionFailed = failedSections.includes("orchestration");
  const feedbackSectionFailed = failedSections.includes("feedback");

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={
        <ReportsPageHeader dateRange={dateRange} onDateRangeChange={setDateRange} />
      }
    >
      <AdminContainer flushTop className="space-y-8 pb-10">
        {error ? (
          <AdminLoadErrorCallout
            title="Unable to load reports"
            onRetry={() => void retryReports()}
            retrying={retryingReports}
          >
            <p>{error}</p>
          </AdminLoadErrorCallout>
        ) : null}

        {partialFailureMessage ? (
          <AdminLoadErrorCallout
            title="Some report sections unavailable"
            onRetry={() => void retryReports()}
            retrying={retryingReports}
          >
            <p>{partialFailureMessage}</p>
          </AdminLoadErrorCallout>
        ) : null}

        {loading && !summary ? <ReportsPageSkeleton /> : null}

        {summary ? (
          <>
            {snapshot ? <AccountabilitySnapshot metrics={snapshot} /> : null}

            <ReportsSection
              id="issue-queue-heading"
              title="Issue queue"
              description="Actionable problems from live orchestration, delivery, provider, and feedback signals."
            >
              <IssueQueue issues={issues} />
            </ReportsSection>

            <ReportsSection
              id="provider-accountability-heading"
              title="Provider accountability"
              description="Configured providers and integration health from live provider records."
            >
              <ProviderAccountabilityTable
                rows={providerRows}
                loading={loading && providers === null && !providersSectionFailed}
                unavailable={providersSectionFailed}
              />
            </ReportsSection>

            <ReportsSection
              id="orchestration-accountability-heading"
              title="Orchestration accountability"
              description="Orchestration runs created in the selected reporting window."
            >
              {loading && !orchestrationMetrics && !orchestrationSectionFailed ? (
                <TableCardSkeleton rows={4} />
              ) : orchestrationSectionFailed ? (
                <p className="text-small text-muted-foreground" role="status">
                  Orchestration accountability could not be loaded. Try refreshing the
                  page.
                </p>
              ) : orchestrationMetrics ? (
                <>
                  <OrchestrationAccountability metrics={orchestrationMetrics} />
                  <div className="mt-4">
                    <h3 className="mb-3 text-small font-semibold text-foreground">
                      Service evaluation scorecard
                    </h3>
                    <ServiceOrchestrationTable
                      services={
                        orchestration?.serviceScorecard.map((row) => ({
                          serviceId: row.providerServiceCode,
                          serviceName: row.providerServiceCode,
                          timesEvaluated: row.evaluatedCount,
                          timesAvailable: row.eligibleCount,
                          availabilityRate:
                            row.evaluatedCount === 0
                              ? 0
                              : Math.round(
                                  (row.eligibleCount / row.evaluatedCount) * 1000,
                                ) / 10,
                          timesSelected: row.selectedCount,
                          selectionRate:
                            row.eligibleCount === 0
                              ? 0
                              : Math.round(
                                  (row.selectedCount / row.eligibleCount) * 1000,
                                ) / 10,
                          bookingAttempts: row.bookingAttemptCount,
                          bookingSuccessRate: row.bookingSuccessRatePercent ?? 0,
                          averagePrice: row.averageProviderQuoteAmountInr,
                          averageEtaMinutes: null,
                          averageResponseTimeMs: 0,
                        })) ?? []
                      }
                    />
                  </div>
                </>
              ) : (
                <p className="text-small text-muted-foreground">
                  No orchestration activity in this period.
                </p>
              )}
            </ReportsSection>

            <ReportsSection
              id="customer-accountability-heading"
              title="Customer accountability"
              description={
                customerTotal != null
                  ? `Showing up to 100 of ${customerTotal.toLocaleString()} customers from the admin API. At-risk counts apply to this sample only, not the full platform.`
                  : "Customer list loaded from the admin API. At-risk counts apply to the loaded sample only."
              }
            >
              <CustomerAccountability
                rows={customerRows}
                atRiskRows={atRiskRows}
                loading={loading && customerItems === null && !customersSectionFailed}
                unavailable={customersSectionFailed}
                sampleAtRiskKnown={customerItems != null}
                sampleAtRiskCount={customerItems != null ? atRiskRows.length : null}
                platformTotal={customerTotal}
              />
            </ReportsSection>

            <ReportsSection
              id="feedback-quality-heading"
              title="Feedback & quality"
              description="Customer ratings and feedback tags submitted in the selected period."
            >
              {loading && !feedbackMetrics && !feedbackSectionFailed ? (
                <TableCardSkeleton titleWidth="w-36" rows={3} />
              ) : feedbackSectionFailed ? (
                <p className="text-small text-muted-foreground" role="status">
                  Feedback reporting could not be loaded. Try refreshing the page.
                </p>
              ) : feedbackMetrics ? (
                <FeedbackQualitySection metrics={feedbackMetrics} />
              ) : (
                <p className="text-small text-muted-foreground">
                  No feedback submitted in this period.
                </p>
              )}
            </ReportsSection>
          </>
        ) : null}
      </AdminContainer>
    </AdminShell>
  );
}
