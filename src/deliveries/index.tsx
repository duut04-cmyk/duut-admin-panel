"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { DeliveryListItem } from "@/data/deliveryApiTypes";
import { isValidDeliveryId } from "@/lib/bff/deliveries";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import { useExclusiveAsync } from "@/lib/useExclusiveAsync";
import AdminContainer from "@/components/AdminContainer";
import { ADMIN_LIST_PAGE_FILTERS_SECTION } from "@/components/layout";
import AdminShell from "@/components/AdminShell";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import {
  ListRowsSkeleton,
  MetricCardsSkeleton,
} from "@/components/loading/skeletonSections";
import type { BackendDeliveryStatus } from "@/data/deliveryApiTypes";
import { fetchDeliveries } from "./api";
import { listParamsFromFilters } from "./deliveryMappers";
import { DELIVERY_STATUS_FILTER_OPTIONS } from "./deliveryStatus";
import DeliveryFilters, {
  DEFAULT_DELIVERY_FILTERS,
  type DeliveryFilterState,
} from "./components/DeliveryFilters";
import DeliveryList from "./components/DeliveryList";
import DeliveryListSummary from "./components/DeliveryListSummary";
import DeliveryPageHeader from "./components/DeliveryPageHeader";

const PAGE_SIZE = 10;

function parseStatusParam(value: string | null): BackendDeliveryStatus | "all" {
  if (!value || value === "all") return "all";
  const allowed = DELIVERY_STATUS_FILTER_OPTIONS.some(
    (option) => option.value === value,
  );
  return allowed ? (value as BackendDeliveryStatus) : "all";
}

export default function DeliveriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const initialStatus = parseStatusParam(searchParams.get("status"));

  const statusFromUrl = parseStatusParam(searchParams.get("status"));
  const [filters, setFilters] = useState<DeliveryFilterState>({
    ...DEFAULT_DELIVERY_FILTERS,
    search: initialSearch,
    deliveryStatus: initialStatus,
  });
  const [debouncedReference, setDebouncedReference] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<DeliveryListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [syncedStatus, setSyncedStatus] = useState(statusFromUrl);

  // Keep filter status aligned with ?status= deep links (e.g. from Reports).
  if (statusFromUrl !== syncedStatus) {
    setSyncedStatus(statusFromUrl);
    setPage(1);
    setFilters((prev) =>
      prev.deliveryStatus === statusFromUrl
        ? prev
        : { ...prev, deliveryStatus: statusFromUrl },
    );
  }

  useEffect(() => {
    const trimmed = initialSearch.trim();
    if (trimmed && isValidDeliveryId(trimmed)) {
      router.replace(`/deliveries/${trimmed}`);
    }
  }, [initialSearch, router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedReference(filters.search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  const loadDeliveries = useCallback(
    async (isStale: () => boolean = () => false) => {
      setLoading(true);
      setLoadError(null);

      const result = await fetchDeliveries(
        listParamsFromFilters(filters, page, PAGE_SIZE, debouncedReference),
      );

      if (isStale()) return;

      setLoading(false);

      if (!result.success || !result.data) {
        setItems([]);
        setTotal(0);
        setLoadError(result.error ?? "Failed to load deliveries.");
        return;
      }

      setItems(result.data.items);
      setTotal(result.data.total);
    },
    [debouncedReference, filters, page],
  );

  useLoadedAsync(
    async (isStale) => {
      await loadDeliveries(isStale);
    },
    [loadDeliveries],
  );

  const { run: retryLoad, busy: retrying } = useExclusiveAsync(async () => {
    await loadDeliveries();
  });

  const handleFiltersChange = (next: DeliveryFilterState) => {
    setPage(1);
    setFilters(next);
  };

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={
        <DeliveryPageHeader
          dateRange={filters.dateRange}
          onDateRangeChange={(dateRange) => {
            setPage(1);
            setFilters((current) => ({ ...current, dateRange }));
          }}
        />
      }
    >
      <AdminContainer flushTop className="space-y-6 pb-10">
        {loadError ? (
          <AdminLoadErrorCallout
            title="Unable to load deliveries"
            onRetry={() => void retryLoad()}
            retrying={retrying}
          >
            <p>{loadError}</p>
          </AdminLoadErrorCallout>
        ) : null}

        {loading ? (
          <MetricCardsSkeleton count={5} />
        ) : (
          <DeliveryListSummary items={items} totalMatching={total} />
        )}

        <div className={ADMIN_LIST_PAGE_FILTERS_SECTION}>
          <DeliveryFilters
            filters={filters}
            onChange={handleFiltersChange}
            resultCount={total}
            periodInHeader
          />

          {loading ? (
            <ListRowsSkeleton rows={10} />
          ) : (
            <DeliveryList
              items={items}
              page={page}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          )}
        </div>
      </AdminContainer>
    </AdminShell>
  );
}
