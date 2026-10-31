"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
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
import { ReportsPageSkeleton } from "@/components/loading/skeletonSections";
import { fetchCustomers } from "@/customers/api";
import { fetchProviders } from "@/providers/api";
import {
  fetchFeedbackReporting,
  fetchOrchestrationReporting,
  fetchReportingSummary,
} from "@/reporting/api";
import { getAtRiskCustomers, getCustomerAccountabilityRows } from "./accountability";
import { buildLiveIssueQueue } from "./liveIssueQueue";
import ReportsPageHeader from "./components/ReportsPageHeader";
import { ReportsKpiCards } from "./ReportsKpiCards";
import { ReportsDeliveryDonut } from "./ReportsDeliveryDonut";
import { ReportsAttentionPanel } from "./ReportsAttentionPanel";
import { ReportsFeedbackPanel } from "./ReportsFeedbackPanel";
import { ReportsOpsSignals } from "./ReportsOpsSignals";
import {
  assembleReportsLoadResult,
  reportsPartialFailureMessage,
  type ReportsSectionKey,
} from "./reportsLoad";

const DEEP_LINKS = [
  { href: "/deliveries?status=CANCELLED", label: "Cancelled" },
  { href: "/deliveries?status=FAILED", label: "Failed" },
  { href: "/deliveries", label: "All deliveries" },
  { href: "/providers", label: "Providers" },
  { href: "/customers", label: "Customers" },
  { href: "/payments", label: "Payments" },
] as const;

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
      fetchFeedbackReporting({ from: window.from, to: window.to, recentLimit: 20 }),
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
        setFailedSections([]);
        setError(result.error);
        return;
      }
      setSummary(result.summary);
      setOrchestration(result.orchestration);
      setFeedback(result.feedback);
      setProviders(result.providers);
      setCustomerItems(result.customers);
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

  const atRiskRows = customerItems
    ? getAtRiskCustomers(getCustomerAccountabilityRows(customerItems))
    : [];

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={
        <ReportsPageHeader dateRange={dateRange} onDateRangeChange={setDateRange} />
      }
    >
      <AdminContainer flushTop className="space-y-5 pb-10">
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
            title="Some report data unavailable"
            onRetry={() => void retryReports()}
            retrying={retryingReports}
          >
            <p>{partialFailureMessage}</p>
          </AdminLoadErrorCallout>
        ) : null}

        {loading && !summary ? <ReportsPageSkeleton /> : null}

        {summary ? (
          <>
            <ReportsKpiCards summary={summary} />

            <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
              <ReportsOpsSignals summary={summary} orchestration={orchestration} />

              <section className="rounded-card border border-border/60 bg-background p-4 shadow-sm">
                <h2 className="text-base font-semibold text-foreground">
                  Delivery outcomes
                </h2>
                <p className="mt-1 text-small text-muted-foreground">
                  Status mix for deliveries created in this period
                </p>
                <div className="mt-3">
                  <ReportsDeliveryDonut summary={summary} />
                </div>
              </section>
            </div>

            <div className="grid items-start gap-4 xl:grid-cols-2">
              <ReportsAttentionPanel issues={issues} atRiskCustomers={atRiskRows} />
              <ReportsFeedbackPanel feedback={feedback} />
            </div>

            <nav
              aria-label="Related pages"
              className="flex flex-wrap items-center gap-2 border-t border-border pt-4"
            >
              <span className="mr-1 text-caption font-medium text-muted-foreground">
                Dig deeper
              </span>
              {DEEP_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-border bg-background px-3 py-1 text-caption font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </>
        ) : null}
      </AdminContainer>
    </AdminShell>
  );
}
