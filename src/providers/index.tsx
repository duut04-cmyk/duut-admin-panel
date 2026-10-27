"use client";

import { useCallback, useMemo, useState } from "react";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import { useExclusiveAsync } from "@/lib/useExclusiveAsync";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import type { CreateProviderInput, ProviderSummary } from "@/data/providerTypes";
import AdminContainer from "@/components/AdminContainer";
import { ADMIN_LIST_PAGE_FILTERS_SECTION } from "@/components/layout";
import AdminShell from "@/components/AdminShell";
import { ListRowsSkeleton } from "@/components/loading/skeletonSections";
import AddProviderModal from "./components/AddProviderModal";
import ProviderFilters, {
  DEFAULT_PROVIDER_FILTERS,
  type ProviderFilterState,
} from "./components/ProviderFilters";
import ProviderList from "./components/ProviderList";
import ProviderListSummary from "./components/ProviderListSummary";
import ProviderPageHeader from "./components/ProviderPageHeader";
import { getProviderMetrics } from "./components/utils";
import {
  createProvider,
  fetchProviders,
  updateProvider,
  updateProviderStatus,
} from "./api";
import {
  providerSummaryFromDetail,
  setProviderEnabledFromList,
} from "./providerListLifecycle";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [filters, setFilters] = useState<ProviderFilterState>(DEFAULT_PROVIDER_FILTERS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [togglingField, setTogglingField] = useState<
    "enabled" | "orchestrationEnabled" | null
  >(null);

  const loadProviders = useCallback(async (isStale: () => boolean = () => false) => {
    setLoading(true);
    setLoadError(null);

    const result = await fetchProviders();

    if (isStale()) return;

    setLoading(false);

    if (!result.success) {
      setLoadError(result.error ?? "Failed to load providers.");
      return;
    }

    setProviders(result.data ?? []);
  }, []);

  useLoadedAsync(
    async (isStale) => {
      await loadProviders(isStale);
    },
    [loadProviders],
  );

  const { run: retryLoad, busy: retrying } = useExclusiveAsync(async () => {
    await loadProviders();
  });

  const reloadProviders = useCallback(async () => {
    await loadProviders();
  }, [loadProviders]);

  const filteredProviders = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return providers
      .filter((provider) => {
        if (!query) return true;
        return (
          provider.code.toLowerCase().includes(query) ||
          provider.name.toLowerCase().includes(query) ||
          (provider.displayName?.toLowerCase().includes(query) ?? false)
        );
      })
      .filter((provider) => {
        if (filters.environment === "all") return true;
        return provider.environment === filters.environment;
      })
      .filter((provider) => {
        if (filters.status === "all") return true;
        return provider.status === filters.status;
      })
      .filter((provider) => {
        if (filters.enabled === "all") return true;
        return filters.enabled === "enabled" ? provider.enabled : !provider.enabled;
      })
      .sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }, [providers, filters]);

  const metrics = useMemo(
    () => getProviderMetrics(filteredProviders),
    [filteredProviders],
  );

  const handleCreateProvider = async (input: CreateProviderInput) => {
    const result = await createProvider(input);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    await reloadProviders();
    return { success: true };
  };

  const handleToggle = async (
    provider: ProviderSummary,
    field: "enabled" | "orchestrationEnabled",
    value: boolean,
  ) => {
    setTogglingId(provider.id);
    setTogglingField(field);

    const previous = providers;

    if (field === "enabled") {
      const result = await setProviderEnabledFromList(provider, value, {
        updateProviderStatus,
        updateProvider,
      });

      setTogglingId(null);
      setTogglingField(null);

      if (!result.success) {
        setLoadError(result.error ?? "Failed to update provider.");
        return;
      }

      const summary = providerSummaryFromDetail(result.data);
      setProviders((current) =>
        current.map((item) => (item.id === provider.id ? summary : item)),
      );
      return;
    }

    const result = await updateProvider(provider.id, { orchestrationEnabled: value });

    setTogglingId(null);
    setTogglingField(null);

    if (!result.success) {
      setProviders(previous);
      setLoadError(result.error ?? "Failed to update provider.");
      return;
    }

    if (result.data) {
      const summary = providerSummaryFromDetail(result.data);
      setProviders((current) =>
        current.map((item) => (item.id === provider.id ? summary : item)),
      );
    }
  };

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={<ProviderPageHeader onAddProvider={() => setModalOpen(true)} />}
    >
      <AdminContainer flushTop className="space-y-6 pb-10">
        {loadError ? (
          <AdminLoadErrorCallout
            title="Unable to load providers"
            onRetry={() => void retryLoad()}
            retrying={retrying}
          >
            <p>{loadError}</p>
          </AdminLoadErrorCallout>
        ) : null}

        <ProviderListSummary metrics={metrics} />

        <div className={ADMIN_LIST_PAGE_FILTERS_SECTION}>
          <ProviderFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filteredProviders.length}
          />

          {loading ? (
            <ListRowsSkeleton rows={8} />
          ) : (
            <ProviderList
              providers={filteredProviders}
              togglingId={togglingId}
              togglingField={togglingField}
              onToggleEnabled={(provider, enabled) =>
                void handleToggle(provider, "enabled", enabled)
              }
              onToggleOrchestration={(provider, enabled) =>
                void handleToggle(provider, "orchestrationEnabled", enabled)
              }
            />
          )}
        </div>
      </AdminContainer>

      <AddProviderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateProvider}
      />
    </AdminShell>
  );
}
