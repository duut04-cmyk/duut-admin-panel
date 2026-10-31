"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminContainer from "@/components/AdminContainer";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import AdminShell from "@/components/AdminShell";
import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";
import type { PaymentDetail } from "@/data/financeTypes";
import {
  FINANCE_TIME_ZONE_LABEL,
  resolveFinanceWindow,
  type FinanceDateRangeKey,
} from "@/lib/financeDateRange";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import FinanceOverviewCards from "./components/FinanceOverviewCards";
import FinanceTimeseriesChart from "./components/FinanceTimeseriesChart";
import PaymentDetailPanel from "./components/PaymentDetailPanel";
import ReconciliationPanel from "./components/ReconciliationPanel";
import UnavailableFinanceMetrics from "./components/UnavailableFinanceMetrics";
import { fetchPaymentDetail } from "./api";
import {
  emptyPaginatedSection,
  emptySection,
  loadPaymentsSection,
  loadReconciliationSection,
  loadRefundsSection,
  loadSummarySection,
  loadTimeseriesSection,
  type PaginatedSectionState,
  type SectionState,
} from "./paymentsSectionLoad";
import type {
  FinanceReconciliation,
  FinanceSummary,
  FinanceTimeseries,
  PaymentListResponse,
  RefundListResponse,
} from "@/data/financeTypes";

const dateOptions: { value: FinanceDateRangeKey; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "month", label: "This month" },
  { value: "custom", label: "Custom" },
];

const LIST_LIMIT = 25;

export default function PaymentsPage() {
  const [dateRange, setDateRange] = useState<FinanceDateRangeKey>("30d");
  const [customStartYmd, setCustomStartYmd] = useState("");
  const [customEndYmdExclusive, setCustomEndYmdExclusive] = useState("");
  const financeWindow = useMemo(
    () =>
      resolveFinanceWindow(
        dateRange,
        dateRange === "custom" && customStartYmd && customEndYmdExclusive
          ? { startYmd: customStartYmd, endYmdExclusive: customEndYmdExclusive }
          : undefined,
      ),
    [dateRange, customStartYmd, customEndYmdExclusive],
  );

  const [summarySection, setSummarySection] =
    useState<SectionState<FinanceSummary>>(emptySection);
  const [timeseriesSection, setTimeseriesSection] =
    useState<SectionState<FinanceTimeseries>>(emptySection);
  const [paymentsSection, setPaymentsSection] =
    useState<PaginatedSectionState<PaymentListResponse>>(emptyPaginatedSection);
  const [refundsSection, setRefundsSection] =
    useState<PaginatedSectionState<RefundListResponse>>(emptyPaginatedSection);
  const [reconciliationSection, setReconciliationSection] =
    useState<SectionState<FinanceReconciliation>>(emptySection);

  const [paymentSearch, setPaymentSearch] = useState("");
  const [debouncedPaymentSearch, setDebouncedPaymentSearch] = useState("");
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [refundsPage, setRefundsPage] = useState(1);

  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedPaymentSearch(paymentSearch);
      setPaymentsPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [paymentSearch]);

  const refreshAllSections = useCallback(async () => {
    setSummarySection((s) => ({ ...s, loading: true, error: null }));
    setTimeseriesSection((s) => ({ ...s, loading: true, error: null }));
    setPaymentsSection((s) => ({ ...s, loading: true, error: null }));
    setRefundsSection((s) => ({ ...s, loading: true, error: null }));
    setReconciliationSection((s) => ({ ...s, loading: true, error: null, data: null }));

    const granularity = dateRange === "month" ? "week" : "day";
    const [summary, timeseries, payments, refunds, reconciliation] = await Promise.all([
      loadSummarySection({ from: financeWindow.from, to: financeWindow.to }),
      loadTimeseriesSection({
        from: financeWindow.from,
        to: financeWindow.to,
        granularity,
      }),
      loadPaymentsSection({
        from: financeWindow.from,
        to: financeWindow.to,
        page: paymentsPage,
        limit: LIST_LIMIT,
        search: debouncedPaymentSearch.trim() || undefined,
      }),
      loadRefundsSection({
        from: financeWindow.from,
        to: financeWindow.to,
        page: refundsPage,
        limit: LIST_LIMIT,
      }),
      loadReconciliationSection({
        from: financeWindow.from,
        to: financeWindow.to,
        limit: 100,
      }),
    ]);

    setSummarySection(summary);
    setTimeseriesSection(timeseries);
    setPaymentsSection(payments);
    setRefundsSection(refunds);
    setReconciliationSection(reconciliation);

    if (payments.page !== paymentsPage) {
      setPaymentsPage(payments.page);
    }
    if (refunds.page !== refundsPage) {
      setRefundsPage(refunds.page);
    }
  }, [
    financeWindow.from,
    financeWindow.to,
    dateRange,
    paymentsPage,
    refundsPage,
    debouncedPaymentSearch,
  ]);

  useLoadedAsync(refreshAllSections, [refreshAllSections]);

  const retrySummary = useCallback(async () => {
    setSummarySection((s) => ({ ...s, loading: true, error: null }));
    setSummarySection(
      await loadSummarySection({ from: financeWindow.from, to: financeWindow.to }),
    );
  }, [financeWindow.from, financeWindow.to]);

  const retryTimeseries = useCallback(async () => {
    setTimeseriesSection((s) => ({ ...s, loading: true, error: null }));
    const granularity = dateRange === "month" ? "week" : "day";
    setTimeseriesSection(
      await loadTimeseriesSection({
        from: financeWindow.from,
        to: financeWindow.to,
        granularity,
      }),
    );
  }, [financeWindow.from, financeWindow.to, dateRange]);

  const retryPayments = useCallback(async () => {
    setPaymentsSection((s) => ({ ...s, loading: true, error: null }));
    const next = await loadPaymentsSection({
      from: financeWindow.from,
      to: financeWindow.to,
      page: paymentsPage,
      limit: LIST_LIMIT,
      search: debouncedPaymentSearch.trim() || undefined,
    });
    setPaymentsSection(next);
    if (next.page !== paymentsPage) {
      setPaymentsPage(next.page);
    }
  }, [financeWindow.from, financeWindow.to, paymentsPage, debouncedPaymentSearch]);

  const retryRefunds = useCallback(async () => {
    setRefundsSection((s) => ({ ...s, loading: true, error: null }));
    const next = await loadRefundsSection({
      from: financeWindow.from,
      to: financeWindow.to,
      page: refundsPage,
      limit: LIST_LIMIT,
    });
    setRefundsSection(next);
    if (next.page !== refundsPage) {
      setRefundsPage(next.page);
    }
  }, [financeWindow.from, financeWindow.to, refundsPage]);

  const retryReconciliation = useCallback(async () => {
    setReconciliationSection({ loading: true, error: null, data: null });
    setReconciliationSection(
      await loadReconciliationSection({
        from: financeWindow.from,
        to: financeWindow.to,
        limit: 100,
      }),
    );
  }, [financeWindow.from, financeWindow.to]);

  const openPaymentDetail = useCallback(async (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setDetailLoading(true);
    setDetailError(null);
    setPaymentDetail(null);
    const result = await fetchPaymentDetail(paymentId);
    setDetailLoading(false);
    if (!result.success || !result.data) {
      setDetailError(result.error ?? "Failed to load payment.");
      return;
    }
    setPaymentDetail(result.data);
  }, []);

  const payments = paymentsSection.data?.items ?? [];
  const refunds = refundsSection.data?.items ?? [];

  return (
    <AdminShell>
      <header
        className={`bg-background pb-4 pt-4 lg:pb-5 lg:pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}
      >
        <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
          Payments
        </h1>
        <p className="mt-1.5 max-w-3xl text-small text-muted-foreground">
          Customer collections and refunds from existing payment data. Active period (
          {FINANCE_TIME_ZONE_LABEL}): {financeWindow.from} → {financeWindow.to}{" "}
          exclusive.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {dateOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setDateRange(option.value);
                setPaymentsPage(1);
                setRefundsPage(1);
              }}
              className={`rounded-lg border px-3 py-1.5 text-small ${
                dateRange === option.value
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {dateRange === "custom" ? (
          <div className="mt-3 flex flex-wrap gap-3">
            <label className="text-small text-muted-foreground">
              Start date (inclusive, IST midnight)
              <input
                type="date"
                value={customStartYmd}
                onChange={(event) => {
                  setCustomStartYmd(event.target.value);
                  setPaymentsPage(1);
                  setRefundsPage(1);
                }}
                className="ml-2 rounded border border-border bg-background px-2 py-1"
              />
            </label>
            <label className="text-small text-muted-foreground">
              End date (exclusive — period ends at IST midnight after this day)
              <input
                type="date"
                value={customEndYmdExclusive}
                onChange={(event) => {
                  setCustomEndYmdExclusive(event.target.value);
                  setPaymentsPage(1);
                  setRefundsPage(1);
                }}
                className="ml-2 rounded border border-border bg-background px-2 py-1"
              />
            </label>
          </div>
        ) : null}
      </header>

      <AdminContainer>
        <div className="space-y-6 pb-10">
          {summarySection.error ? (
            <AdminLoadErrorCallout
              title="Could not load summary"
              onRetry={retrySummary}
            >
              {summarySection.error}
            </AdminLoadErrorCallout>
          ) : (
            <FinanceOverviewCards
              summary={summarySection.loading ? null : summarySection.data}
            />
          )}

          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-base font-semibold">Collections & refunds</h2>
            {timeseriesSection.error ? (
              <AdminLoadErrorCallout
                title="Could not load chart"
                onRetry={retryTimeseries}
              >
                {timeseriesSection.error}
              </AdminLoadErrorCallout>
            ) : (
              <div className="mt-4">
                {timeseriesSection.loading ? (
                  <div className="h-48 animate-pulse rounded-lg bg-muted/40" />
                ) : (
                  <FinanceTimeseriesChart
                    points={timeseriesSection.data?.points ?? []}
                  />
                )}
              </div>
            )}
          </section>

          <UnavailableFinanceMetrics />

          <section className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Customer payments</h2>
              <input
                type="search"
                placeholder="Search reference, order id, payment id"
                value={paymentSearch}
                onChange={(event) => {
                  setPaymentSearch(event.target.value);
                  setPaymentsPage(1);
                }}
                className="h-10 min-w-[14rem] rounded-lg border border-border bg-background px-3 text-small"
              />
            </div>
            {paymentsSection.error ? (
              <AdminLoadErrorCallout
                title="Could not load payments"
                onRetry={retryPayments}
              >
                {paymentsSection.error}
              </AdminLoadErrorCallout>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-small">
                  <thead className="text-muted-foreground">
                    <tr>
                      <th className="pb-2 pr-3 font-medium">Delivery</th>
                      <th className="pb-2 pr-3 font-medium">Status</th>
                      <th className="pb-2 pr-3 font-medium">Amount</th>
                      <th className="pb-2 pr-3 font-medium">Paid at</th>
                      <th className="pb-2 font-medium">Gateway</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentsSection.loading ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-muted-foreground">
                          Loading…
                        </td>
                      </tr>
                    ) : payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-muted-foreground">
                          No records in this period.
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr key={payment.id} className="border-t border-border">
                          <td className="py-2 pr-3">
                            <button
                              type="button"
                              className="text-primary hover:underline"
                              onClick={() => openPaymentDetail(payment.id)}
                            >
                              {payment.deliveryReference}
                            </button>
                          </td>
                          <td className="py-2 pr-3">{payment.status}</td>
                          <td className="py-2 pr-3 tabular-nums">
                            {payment.currency} {payment.amount}
                          </td>
                          <td className="py-2 pr-3">{payment.paidAt ?? "—"}</td>
                          <td className="py-2">{payment.gateway}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {!paymentsSection.loading && payments.length > 0 ? (
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={paymentsPage <= 1}
                      className="rounded border border-border px-2 py-1 text-small disabled:opacity-40"
                      onClick={() => setPaymentsPage((page) => Math.max(1, page - 1))}
                    >
                      Previous
                    </button>
                    <span className="text-small text-muted-foreground">
                      Page {paymentsPage}
                      {paymentsSection.totalPages > 0
                        ? ` of ${paymentsSection.totalPages}`
                        : ""}
                    </span>
                    <button
                      type="button"
                      disabled={
                        paymentsSection.totalPages > 0 &&
                        paymentsPage >= paymentsSection.totalPages
                      }
                      className="rounded border border-border px-2 py-1 text-small disabled:opacity-40"
                      onClick={() => setPaymentsPage((page) => page + 1)}
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-base font-semibold">Refunds</h2>
            {refundsSection.error ? (
              <AdminLoadErrorCallout
                title="Could not load refunds"
                onRetry={retryRefunds}
              >
                {refundsSection.error}
              </AdminLoadErrorCallout>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-small">
                  <thead className="text-muted-foreground">
                    <tr>
                      <th className="pb-2 pr-3 font-medium">Delivery</th>
                      <th className="pb-2 pr-3 font-medium">Status</th>
                      <th className="pb-2 pr-3 font-medium">Amount</th>
                      <th className="pb-2 font-medium">Processed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refundsSection.loading ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-muted-foreground">
                          Loading…
                        </td>
                      </tr>
                    ) : refunds.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-muted-foreground">
                          No records in this period.
                        </td>
                      </tr>
                    ) : (
                      refunds.map((refund) => (
                        <tr key={refund.id} className="border-t border-border">
                          <td className="py-2 pr-3">{refund.deliveryReference}</td>
                          <td className="py-2 pr-3">{refund.status}</td>
                          <td className="py-2 pr-3 tabular-nums">
                            {refund.currency} {refund.amount}
                          </td>
                          <td className="py-2">{refund.processedAt ?? "—"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {!refundsSection.loading && refunds.length > 0 ? (
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={refundsPage <= 1}
                      className="rounded border border-border px-2 py-1 text-small disabled:opacity-40"
                      onClick={() => setRefundsPage((page) => Math.max(1, page - 1))}
                    >
                      Previous
                    </button>
                    <span className="text-small text-muted-foreground">
                      Page {refundsPage}
                      {refundsSection.totalPages > 0
                        ? ` of ${refundsSection.totalPages}`
                        : ""}
                    </span>
                    <button
                      type="button"
                      disabled={
                        refundsSection.totalPages > 0 &&
                        refundsPage >= refundsSection.totalPages
                      }
                      className="rounded border border-border px-2 py-1 text-small disabled:opacity-40"
                      onClick={() => setRefundsPage((page) => page + 1)}
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </section>

          <ReconciliationPanel
            data={reconciliationSection.data}
            loading={reconciliationSection.loading}
            error={reconciliationSection.error}
            onRetry={retryReconciliation}
          />
        </div>
      </AdminContainer>

      {selectedPaymentId ? (
        <PaymentDetailPanel
          detail={paymentDetail}
          loading={detailLoading}
          error={detailError}
          onClose={() => {
            setSelectedPaymentId(null);
            setPaymentDetail(null);
            setDetailError(null);
          }}
        />
      ) : null}
    </AdminShell>
  );
}
