"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminContainer from "@/components/AdminContainer";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import AdminShell from "@/components/AdminShell";
import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";
import type { PaymentDetail } from "@/data/financeTypes";
import { resolveFinanceWindow, type FinanceDateRangeKey } from "@/lib/financeDateRange";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import AdminCustomSelect from "@/ui/AdminCustomSelect";
import { parseMoneyNumber } from "./lib/formatMoney";
import { previousFinanceWindow, summaryTrends } from "./lib/periodComparison";
import FinanceChartLegend from "./components/FinanceChartLegend";
import FinanceOverviewCards from "./components/FinanceOverviewCards";
import FinanceTimeseriesChart from "./components/FinanceTimeseriesChart";
import PaymentDetailPanel from "./components/PaymentDetailPanel";
import RecentPaymentsTable from "./components/RecentPaymentsTable";
import ReconciliationPanel from "./components/ReconciliationPanel";
import RefundSummaryDonut from "./components/RefundSummaryDonut";
import { fetchPaymentDetail } from "./api";
import {
  initialPaginatedSection,
  initialSection,
  loadPaymentsSection,
  loadReconciliationSection,
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
} from "@/data/financeTypes";

const dateOptions: { value: FinanceDateRangeKey; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "month", label: "This month" },
  { value: "custom", label: "Custom" },
];

const LIST_LIMIT = 10;

function CalendarIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M2 6.5h12M5 1.5v2M11 1.5v2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PaymentsPage() {
  const searchParams = useSearchParams();
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
    useState<SectionState<FinanceSummary>>(initialSection);
  const [previousSummary, setPreviousSummary] = useState<FinanceSummary | null>(null);
  const [timeseriesSection, setTimeseriesSection] =
    useState<SectionState<FinanceTimeseries>>(initialSection);
  const [paymentsSection, setPaymentsSection] = useState<
    PaginatedSectionState<PaymentListResponse>
  >(initialPaginatedSection);
  const [reconciliationSection, setReconciliationSection] =
    useState<SectionState<FinanceReconciliation>>(initialSection);
  const [reconciliationCheckedAt, setReconciliationCheckedAt] = useState<Date | null>(
    null,
  );

  const initialSearch = searchParams.get("search")?.trim() ?? "";
  const [paymentSearch, setPaymentSearch] = useState(initialSearch);
  const [debouncedPaymentSearch, setDebouncedPaymentSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentsPage, setPaymentsPage] = useState(1);

  useEffect(() => {
    const fromUrl = searchParams.get("search")?.trim() ?? "";
    if (!fromUrl || fromUrl === paymentSearch) {
      return;
    }
    queueMicrotask(() => {
      setPaymentSearch(fromUrl);
      setDebouncedPaymentSearch(fromUrl);
      setPaymentsPage(1);
    });
    // Only sync when the URL search param changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional URL → state sync
  }, [searchParams]);

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

  const refreshFinanceSections = useCallback(
    async (isStale: () => boolean) => {
      setSummarySection((s) => ({ ...s, loading: true, error: null }));
      setTimeseriesSection((s) => ({ ...s, loading: true, error: null }));
      setReconciliationSection((s) => ({
        ...s,
        loading: true,
        error: null,
        data: null,
      }));

      const granularity = dateRange === "month" ? "week" : "day";
      const previousWindow = previousFinanceWindow(financeWindow);

      const [summary, previous, timeseries, reconciliation] = await Promise.all([
        loadSummarySection({ from: financeWindow.from, to: financeWindow.to }),
        loadSummarySection({
          from: previousWindow.from,
          to: previousWindow.to,
        }),
        loadTimeseriesSection({
          from: financeWindow.from,
          to: financeWindow.to,
          granularity,
        }),
        loadReconciliationSection({
          from: financeWindow.from,
          to: financeWindow.to,
          limit: 100,
        }),
      ]);

      if (isStale()) return;

      setSummarySection(summary);
      setPreviousSummary(previous.data);
      setTimeseriesSection(timeseries);
      setReconciliationSection(reconciliation);
      setReconciliationCheckedAt(new Date());
    },
    [financeWindow.from, financeWindow.to, dateRange],
  );

  const refreshPaymentsSection = useCallback(
    async (isStale: () => boolean) => {
      setPaymentsSection((s) => ({ ...s, loading: true, error: null }));

      const payments = await loadPaymentsSection({
        from: financeWindow.from,
        to: financeWindow.to,
        page: paymentsPage,
        limit: LIST_LIMIT,
        search: debouncedPaymentSearch.trim() || undefined,
        status: statusFilter || undefined,
      });

      if (isStale()) return;

      setPaymentsSection(payments);
      if (payments.page !== paymentsPage) {
        setPaymentsPage(payments.page);
      }
    },
    [
      financeWindow.from,
      financeWindow.to,
      paymentsPage,
      debouncedPaymentSearch,
      statusFilter,
    ],
  );

  useLoadedAsync(refreshFinanceSections, [refreshFinanceSections]);
  useLoadedAsync(refreshPaymentsSection, [refreshPaymentsSection]);

  const retrySummary = useCallback(async () => {
    setSummarySection((s) => ({ ...s, loading: true, error: null }));
    const previousWindow = previousFinanceWindow(financeWindow);
    const [summary, previous] = await Promise.all([
      loadSummarySection({ from: financeWindow.from, to: financeWindow.to }),
      loadSummarySection({
        from: previousWindow.from,
        to: previousWindow.to,
      }),
    ]);
    setSummarySection(summary);
    setPreviousSummary(previous.data);
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
      status: statusFilter || undefined,
    });
    setPaymentsSection(next);
    if (next.page !== paymentsPage) {
      setPaymentsPage(next.page);
    }
  }, [
    financeWindow.from,
    financeWindow.to,
    paymentsPage,
    debouncedPaymentSearch,
    statusFilter,
  ]);

  const retryReconciliation = useCallback(async () => {
    setReconciliationSection({ loading: true, error: null, data: null });
    const next = await loadReconciliationSection({
      from: financeWindow.from,
      to: financeWindow.to,
      limit: 100,
    });
    setReconciliationSection(next);
    setReconciliationCheckedAt(new Date());
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

  const trends = useMemo(
    () =>
      summarySection.data
        ? summaryTrends(summarySection.data, previousSummary)
        : undefined,
    [summarySection.data, previousSummary],
  );

  const sparklines = useMemo(() => {
    const points = timeseriesSection.data?.points ?? [];
    if (points.length === 0) {
      return undefined;
    }
    return {
      collections: points.map((p) => parseMoneyNumber(p.collections)),
      successfulRefunds: points.map((p) => parseMoneyNumber(p.successfulRefunds)),
      netActivity: points.map((p) => parseMoneyNumber(p.net)),
    };
  }, [timeseriesSection.data?.points]);

  return (
    <AdminShell>
      <header className={`pb-4 pt-4 lg:pb-5 lg:pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
              Payments
            </h1>
            <p className="mt-1.5 max-w-2xl text-small text-muted-foreground">
              Track customer payments, refunds and overall financial activity.
            </p>
          </div>
          <div className="relative w-full min-w-0 sm:w-auto sm:min-w-[11.5rem]">
            <div className="pointer-events-none absolute inset-y-0 left-2.5 z-10 flex items-center">
              <CalendarIcon />
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-2.5 z-10 flex items-center">
              <ChevronDownIcon />
            </div>
            <AdminCustomSelect
              value={dateRange}
              onChange={(next) => {
                setDateRange(next as FinanceDateRangeKey);
                setPaymentsPage(1);
              }}
              options={dateOptions}
              className="[&_button]:h-10 [&_button]:rounded-[4px] [&_button]:border-border [&_button]:bg-background [&_button]:pl-8 [&_button]:pr-8 [&_button]:shadow-sm [&_button]:text-small [&_button_span]:whitespace-nowrap [&_button_svg:last-child]:hidden [&_ul]:min-w-full [&_ul]:w-max [&_li_button]:whitespace-nowrap"
            />
          </div>
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
                }}
                className="ml-2 rounded border border-border bg-background px-2 py-1"
              />
            </label>
            <label className="text-small text-muted-foreground">
              End date (exclusive)
              <input
                type="date"
                value={customEndYmdExclusive}
                onChange={(event) => {
                  setCustomEndYmdExclusive(event.target.value);
                  setPaymentsPage(1);
                }}
                className="ml-2 rounded border border-border bg-background px-2 py-1"
              />
            </label>
          </div>
        ) : null}
      </header>

      <AdminContainer>
        <div className="space-y-5 pb-10">
          {summarySection.error ? (
            <AdminLoadErrorCallout
              title="Could not load summary"
              onRetry={retrySummary}
            >
              {summarySection.error}
            </AdminLoadErrorCallout>
          ) : (
            <FinanceOverviewCards
              summary={summarySection.data}
              loading={summarySection.loading}
              trends={trends}
              sparklines={sparklines}
            />
          )}

          <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
            <section className="rounded-card border border-border/60 bg-background p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-semibold text-foreground">
                  Financial Overview
                </h2>
                <FinanceChartLegend className="justify-end" />
              </div>
              {timeseriesSection.error ? (
                <div className="mt-3">
                  <AdminLoadErrorCallout
                    title="Could not load chart"
                    onRetry={retryTimeseries}
                  >
                    {timeseriesSection.error}
                  </AdminLoadErrorCallout>
                </div>
              ) : (
                <div className="mt-3 w-full min-w-0">
                  {timeseriesSection.loading ? (
                    <div className="h-56 animate-pulse rounded-lg bg-muted/40" />
                  ) : (
                    <FinanceTimeseriesChart
                      points={timeseriesSection.data?.points ?? []}
                    />
                  )}
                </div>
              )}
            </section>

            <section className="rounded-card border border-border/60 bg-background p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-semibold text-foreground">
                  Refund Summary
                </h2>
                <a
                  href="#recent-payments"
                  className="text-small font-medium text-link hover:underline"
                >
                  View All →
                </a>
              </div>
              <div className="mt-3">
                <RefundSummaryDonut
                  summary={summarySection.loading ? null : summarySection.data}
                  loading={summarySection.loading}
                />
              </div>
            </section>
          </div>

          <div
            id="recent-payments"
            className="grid scroll-mt-24 items-start gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)]"
          >
            <RecentPaymentsTable
              items={payments}
              loading={paymentsSection.loading}
              error={paymentsSection.error}
              onRetry={retryPayments}
              search={paymentSearch}
              onSearchChange={(value) => {
                setPaymentSearch(value);
                setPaymentsPage(1);
              }}
              statusFilter={statusFilter}
              onStatusFilterChange={(value) => {
                setStatusFilter(value);
                setPaymentsPage(1);
              }}
              page={paymentsPage}
              totalPages={paymentsSection.totalPages}
              total={paymentsSection.data?.total ?? 0}
              limit={LIST_LIMIT}
              onPageChange={setPaymentsPage}
              onViewDetails={openPaymentDetail}
            />

            <ReconciliationPanel
              data={reconciliationSection.data}
              loading={reconciliationSection.loading}
              error={reconciliationSection.error}
              onRetry={retryReconciliation}
              grossCollectionsAmount={
                summarySection.data?.collections.totalAmount ?? null
              }
              checkedAt={reconciliationCheckedAt}
              onViewDetails={() => {
                document
                  .getElementById("reconciliation-details")
                  ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
              }}
            />
          </div>

          <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-small text-blue-900">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-link"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p>
              <span className="font-semibold">Note:</span> This page shows customer
              payments and refunds. Provider accounting and payout data is available in
              the Provider Accounting section (Coming in R2.1B).
            </p>
          </div>
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
