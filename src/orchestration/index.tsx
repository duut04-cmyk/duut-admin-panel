"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { OrchestrationListItem } from "@/data/orchestrationListApiTypes";
import { isValidDeliveryId } from "@/lib/bff/deliveries";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import AdminContainer from "@/components/AdminContainer";
import { ADMIN_LIST_PAGE_FILTERS_SECTION } from "@/components/layout";
import AdminShell from "@/components/AdminShell";
import AdminCallout from "@/ui/AdminCallout";
import { fetchProviders } from "@/providers/api";
import type { ProviderSummary } from "@/data/providerTypes";
import { fetchOrchestrations } from "./listApi";
import {
  listParamsFromOrchestrationFilters,
  mapOrchestrationListRow,
  metricsFromOrchestrationListPage,
} from "./orchestrationListMappers";
import OrchestrationFilters, {
  DEFAULT_ORCHESTRATION_FILTERS,
  type OrchestrationFilterState,
} from "./components/OrchestrationFilters";
import OrchestrationList from "./components/OrchestrationList";
import OrchestrationListSummary from "./components/OrchestrationListSummary";
import OrchestrationPageHeader from "./components/OrchestrationPageHeader";
import OrchestrationPagination from "./components/OrchestrationPagination";

const PAGE_SIZE = 20;

function buildProviderNameMap(providers: ProviderSummary[]): Map<string, string> {
  return new Map(
    providers.map((provider) => [
      provider.code,
      provider.displayName?.trim() || provider.name,
    ]),
  );
}

export default function OrchestrationPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<OrchestrationFilterState>(
    DEFAULT_ORCHESTRATION_FILTERS,
  );
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<OrchestrationListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [providerNames, setProviderNames] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = filters.search.trim();
      if (trimmed && isValidDeliveryId(trimmed)) {
        router.replace(`/orchestration/${trimmed}`);
        return;
      }
      setDebouncedSearch(trimmed);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [filters.search, router]);

  const listParams = useMemo(() => {
    const trimmed = debouncedSearch.trim();
    const asUuid = trimmed && isValidDeliveryId(trimmed) ? trimmed : undefined;
    const reference = asUuid ? undefined : trimmed || undefined;
    return listParamsFromOrchestrationFilters(
      filters,
      page,
      PAGE_SIZE,
      reference ?? "",
      asUuid,
    );
  }, [debouncedSearch, filters, page]);

  useLoadedAsync(
    async (isStale) => {
      setLoading(true);
      setLoadError(null);

      const [listResult, providersResult] = await Promise.all([
        fetchOrchestrations(listParams),
        fetchProviders(),
      ]);

      if (isStale()) return;

      setLoading(false);

      if (providersResult.success && providersResult.data) {
        setProviderNames(buildProviderNameMap(providersResult.data));
      }

      if (!listResult.success || !listResult.data) {
        setItems([]);
        setTotal(0);
        setTotalPages(1);
        setLoadError(listResult.error ?? "Failed to load orchestrations.");
        return;
      }

      setItems(listResult.data.items);
      setTotal(listResult.data.total);
      setTotalPages(Math.max(1, listResult.data.totalPages));
    },
    [listParams],
  );

  const rows = useMemo(
    () => items.map((item) => mapOrchestrationListRow(item, providerNames)),
    [items, providerNames],
  );

  const metrics = useMemo(
    () => metricsFromOrchestrationListPage(items, total),
    [items, total],
  );

  const handleFiltersChange = (next: OrchestrationFilterState) => {
    setPage(1);
    setFilters(next);
  };

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={
        <OrchestrationPageHeader
          dateRange={filters.dateRange}
          onDateRangeChange={(dateRange) =>
            setFilters((current) => ({ ...current, dateRange }))
          }
        />
      }
    >
      <AdminContainer flushTop className="space-y-6 pb-10">
        <OrchestrationListSummary metrics={metrics} />
        {loadError ? (
          <AdminCallout variant="warning" title="Unable to load orchestrations">
            {loadError}
          </AdminCallout>
        ) : null}
        <div className={ADMIN_LIST_PAGE_FILTERS_SECTION}>
          <OrchestrationFilters
            filters={filters}
            onChange={handleFiltersChange}
            resultCount={total}
            periodInHeader
          />
          <OrchestrationList rows={rows} loading={loading && items.length === 0} />
          <OrchestrationPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </AdminContainer>
    </AdminShell>
  );
}
