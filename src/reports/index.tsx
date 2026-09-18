"use client";

import { useMemo, useState } from "react";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import { getAllOrchestrations } from "@/data";
import type { CustomerSummary } from "@/data/customerTypes";
import {
  filterRecordsByDateRange,
  type DateRangeKey,
} from "@/data/orchestrationMetrics";
import type { ProviderSummary } from "@/data/providerTypes";
import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
import AdminCallout from "@/ui/AdminCallout";
import { fetchCustomers } from "@/customers/api";
import { fetchProviders } from "@/providers/api";
import {
  buildIssueQueue,
  getAccountabilitySnapshot,
  getAtRiskCustomers,
  getCustomerAccountabilityRows,
  getDeliveryAccountabilityRows,
  getFeedbackQualityMetrics,
  getOrchestrationAccountabilityMetrics,
  getProblemDeliveries,
  getProviderAccountabilityRows,
  getServicePerformanceForPeriod,
} from "./accountability";
import { mockDeliveryFeedback } from "./data/mockFeedback";
import AccountabilitySnapshot from "./components/AccountabilitySnapshot";
import CustomerAccountability from "./components/CustomerAccountability";
import DeliveryAccountability from "./components/DeliveryAccountability";
import FeedbackQualitySection from "./components/FeedbackQualitySection";
import IssueQueue from "./components/IssueQueue";
import OrchestrationAccountability from "./components/OrchestrationAccountability";
import ProviderAccountabilityTable from "./components/ProviderAccountabilityTable";
import ReportsPageHeader from "./components/ReportsPageHeader";
import ReportsSection from "./components/ReportsSection";
import ServiceOrchestrationTable from "./components/ServiceOrchestrationTable";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRangeKey>("30d");
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [platformLoading, setPlatformLoading] = useState(true);
  const [platformError, setPlatformError] = useState<string | null>(null);

  const allRecords = useMemo(() => getAllOrchestrations(), []);

  const records = useMemo(
    () => filterRecordsByDateRange(allRecords, dateRange),
    [allRecords, dateRange],
  );

  const periodFeedback = useMemo(() => {
    const deliveryIds = new Set(
      records.map((record) => record.deliveryRequest.deliveryId),
    );
    return mockDeliveryFeedback.filter((item) => deliveryIds.has(item.deliveryId));
  }, [records]);

  const issues = useMemo(
    () =>
      buildIssueQueue({
        providers,
        records,
        customers,
        feedback: periodFeedback,
      }),
    [providers, records, customers, periodFeedback],
  );

  const snapshot = useMemo(
    () => getAccountabilitySnapshot(records, providers, customers, issues),
    [records, providers, customers, issues],
  );

  const providerRows = useMemo(
    () => getProviderAccountabilityRows(providers),
    [providers],
  );

  const orchestrationMetrics = useMemo(
    () => getOrchestrationAccountabilityMetrics(records),
    [records],
  );

  const servicePerformance = useMemo(
    () => getServicePerformanceForPeriod(records),
    [records],
  );

  const deliveryRows = useMemo(() => getDeliveryAccountabilityRows(records), [records]);

  const problemDeliveries = useMemo(
    () => getProblemDeliveries(deliveryRows),
    [deliveryRows],
  );

  const customerRows = useMemo(
    () => getCustomerAccountabilityRows(customers),
    [customers],
  );

  const atRiskCustomers = useMemo(
    () => getAtRiskCustomers(customerRows),
    [customerRows],
  );

  const feedbackMetrics = useMemo(() => getFeedbackQualityMetrics(records), [records]);

  useLoadedAsync(async (isStale) => {
    const [providersResult, customersResult] = await Promise.all([
      fetchProviders(),
      fetchCustomers({ limit: 100 }),
    ]);

    if (isStale()) return;

    setPlatformLoading(false);

    if (!providersResult.success && !customersResult.success) {
      setPlatformError(
        providersResult.error ??
          customersResult.error ??
          "Failed to load provider and customer data.",
      );
      return;
    }

    if (!providersResult.success) {
      setPlatformError(providersResult.error ?? "Failed to load providers.");
    } else if (!customersResult.success) {
      setPlatformError(customersResult.error ?? "Failed to load customers.");
    } else {
      setPlatformError(null);
    }

    setProviders(providersResult.data ?? []);
    setCustomers(customersResult.data?.items ?? []);
  }, []);

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={
        <ReportsPageHeader dateRange={dateRange} onDateRangeChange={setDateRange} />
      }
    >
      <AdminContainer flushTop className="space-y-8 pb-10">
        {platformError ? (
          <AdminCallout variant="warning" title="Partial data unavailable">
            {platformError}
          </AdminCallout>
        ) : null}

        <AccountabilitySnapshot metrics={snapshot} />

        <ReportsSection
          id="issue-queue-heading"
          title="Issue queue"
          description="Actionable problems across providers, deliveries, orchestration, customers, and feedback."
        >
          <IssueQueue issues={issues} />
        </ReportsSection>

        <ReportsSection
          id="provider-accountability-heading"
          title="Provider accountability"
          description="How each provider is configured, integrated, and performing operationally."
        >
          <ProviderAccountabilityTable rows={providerRows} loading={platformLoading} />
        </ReportsSection>

        <ReportsSection
          id="orchestration-accountability-heading"
          title="Orchestration accountability"
          description="Whether the decision engine is selecting and booking services reliably."
        >
          <OrchestrationAccountability metrics={orchestrationMetrics} />
          <div className="mt-4">
            <h3 className="mb-3 text-small font-semibold text-foreground">
              Service evaluation scorecard
            </h3>
            <ServiceOrchestrationTable services={servicePerformance} />
          </div>
        </ReportsSection>

        <div className="grid min-w-0 gap-8 xl:grid-cols-2 xl:items-start">
          <ReportsSection
            id="delivery-accountability-heading"
            title="Delivery accountability"
            description="Completion outcomes and deliveries that need follow-up."
          >
            <DeliveryAccountability
              rows={deliveryRows}
              problemRows={problemDeliveries}
            />
          </ReportsSection>

          <ReportsSection
            id="customer-accountability-heading"
            title="Customer accountability"
            description="User health, verification, and accounts that need attention."
          >
            <CustomerAccountability
              rows={customerRows}
              atRiskRows={atRiskCustomers}
              loading={platformLoading}
            />
          </ReportsSection>
        </div>

        <ReportsSection
          id="feedback-quality-heading"
          title="Feedback & quality"
          description="Customer ratings, issue themes, and recent comments for accountability."
        >
          <FeedbackQualitySection metrics={feedbackMetrics} />
        </ReportsSection>
      </AdminContainer>
    </AdminShell>
  );
}
