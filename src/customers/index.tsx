"use client";

import { useEffect, useMemo, useState } from "react";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import type { CustomerSummary } from "@/data/customerTypes";
import AdminContainer from "@/components/AdminContainer";
import { ADMIN_LIST_PAGE_FILTERS_SECTION } from "@/components/layout";
import AdminShell from "@/components/AdminShell";
import AdminCallout from "@/ui/AdminCallout";
import { fetchCustomers } from "./api";
import CustomerFilters, {
  DEFAULT_CUSTOMER_FILTERS,
  type CustomerFilterState,
} from "./components/CustomerFilters";
import CustomerList from "./components/CustomerList";
import CustomerListSummary from "./components/CustomerListSummary";
import CustomerPageHeader from "./components/CustomerPageHeader";
import { getCustomerMetrics } from "./components/utils";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [filters, setFilters] = useState<CustomerFilterState>(DEFAULT_CUSTOMER_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  useLoadedAsync(
    async (isStale) => {
      const result = await fetchCustomers({
        limit: 100,
        search: debouncedSearch.trim() || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        emailVerified:
          filters.emailVerified === "all"
            ? undefined
            : filters.emailVerified === "verified",
      });

      if (isStale()) return;

      setLoading(false);
      setLoadError(null);

      if (!result.success) {
        setLoadError(result.error ?? "Failed to load customers.");
        return;
      }

      setCustomers(result.data?.items ?? []);
    },
    [debouncedSearch, filters.emailVerified, filters.status],
  );

  const metrics = useMemo(() => getCustomerMetrics(customers), [customers]);

  return (
    <AdminShell mainClassName="bg-background" customHeader={<CustomerPageHeader />}>
      <AdminContainer flushTop className="space-y-6 pb-10">
        {loadError ? (
          <AdminCallout variant="warning" title="Unable to load customers">
            {loadError}
          </AdminCallout>
        ) : null}

        <CustomerListSummary metrics={metrics} />

        <div className={ADMIN_LIST_PAGE_FILTERS_SECTION}>
          <CustomerFilters
            filters={filters}
            onChange={setFilters}
            resultCount={customers.length}
          />

          {loading ? (
            <p className="text-small text-muted-foreground">Loading customers…</p>
          ) : (
            <CustomerList customers={customers} />
          )}
        </div>
      </AdminContainer>
    </AdminShell>
  );
}
