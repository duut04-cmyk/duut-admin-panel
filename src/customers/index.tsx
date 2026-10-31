"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import { useExclusiveAsync } from "@/lib/useExclusiveAsync";
import type { CustomerSummary } from "@/data/customerTypes";
import AdminContainer from "@/components/AdminContainer";
import { ADMIN_LIST_PAGE_FILTERS_SECTION } from "@/components/layout";
import AdminShell from "@/components/AdminShell";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import {
  ListRowsSkeleton,
  MetricCardsSkeleton,
} from "@/components/loading/skeletonSections";
import { fetchCustomers } from "./api";
import CustomerFilters, {
  DEFAULT_CUSTOMER_FILTERS,
  type CustomerFilterState,
} from "./components/CustomerFilters";
import CustomerList from "./components/CustomerList";
import CustomerListSummary from "./components/CustomerListSummary";
import CustomerPageHeader from "./components/CustomerPageHeader";
import { buildCustomerListSummaryMetrics } from "./components/utils";

const PAGE_SIZE = 10;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [matchingTotal, setMatchingTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CustomerFilterState>(DEFAULT_CUSTOMER_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  const loadCustomers = useCallback(
    async (isStale: () => boolean = () => false) => {
      setLoading(true);
      setLoadError(null);

      const result = await fetchCustomers({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        emailVerified:
          filters.emailVerified === "all"
            ? undefined
            : filters.emailVerified === "verified",
      });

      if (isStale()) return;

      setLoading(false);

      if (!result.success || !result.data) {
        setCustomers([]);
        setMatchingTotal(0);
        setLoadError(result.error ?? "Failed to load customers.");
        return;
      }

      setCustomers(result.data.items);
      setMatchingTotal(result.data.total);
    },
    [debouncedSearch, filters.emailVerified, filters.status, page],
  );

  useLoadedAsync(
    async (isStale) => {
      await loadCustomers(isStale);
    },
    [loadCustomers],
  );

  const { run: retryLoad, busy: retrying } = useExclusiveAsync(async () => {
    await loadCustomers();
  });

  const summaryMetrics = useMemo(
    () => buildCustomerListSummaryMetrics(loadError ? null : matchingTotal, customers),
    [customers, loadError, matchingTotal],
  );

  const handleFiltersChange = (next: CustomerFilterState) => {
    setPage(1);
    setFilters(next);
  };

  return (
    <AdminShell mainClassName="bg-background" customHeader={<CustomerPageHeader />}>
      <AdminContainer flushTop className="space-y-6 pb-10">
        {loadError ? (
          <AdminLoadErrorCallout
            title="Unable to load customers"
            onRetry={() => void retryLoad()}
            retrying={retrying}
          >
            <p>{loadError}</p>
          </AdminLoadErrorCallout>
        ) : null}

        {loading ? (
          <MetricCardsSkeleton count={4} />
        ) : (
          <CustomerListSummary metrics={summaryMetrics} />
        )}

        <div className={ADMIN_LIST_PAGE_FILTERS_SECTION}>
          <CustomerFilters
            filters={filters}
            onChange={handleFiltersChange}
            resultCount={matchingTotal}
          />

          {loading ? (
            <ListRowsSkeleton rows={10} />
          ) : (
            <CustomerList
              customers={customers}
              page={page}
              pageSize={PAGE_SIZE}
              total={matchingTotal}
              onPageChange={setPage}
            />
          )}
        </div>
      </AdminContainer>
    </AdminShell>
  );
}
