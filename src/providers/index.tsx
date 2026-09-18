"use client";

import { useCallback, useMemo, useState } from "react";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import type { CreateProviderInput, ProviderSummary } from "@/data/providerTypes";
import AdminContainer from "@/components/AdminContainer";
import { ADMIN_LIST_PAGE_FILTERS_SECTION } from "@/components/layout";
import AdminShell from "@/components/AdminShell";
import AdminCallout from "@/ui/AdminCallout";
import AddProviderModal from "./components/AddProviderModal";
import ProviderFilters, {
  DEFAULT_PROVIDER_FILTERS,
  type ProviderFilterState,
} from "./components/ProviderFilters";
import ProviderList from "./components/ProviderList";
import ProviderListSummary from "./components/ProviderListSummary";
import ProviderPageHeader from "./components/ProviderPageHeader";
import { getProviderMetrics } from "./components/utils";
import { createProvider, fetchProviders, updateProvider } from "./api";

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

  const reloadProviders = useCallback(async () => {
    const result = await fetchProviders();

    if (!result.success) {
      setLoadError(result.error ?? "Failed to load providers.");
      return;
    }

    setLoadError(null);
    setProviders(result.data ?? []);
  }, []);

  useLoadedAsync(async (isStale) => {
    const result = await fetchProviders();

    if (isStale()) return;

    setLoading(false);

    if (!result.success) {
      setLoadError(result.error ?? "Failed to load providers.");
      return;
    }

    setLoadError(null);
    setProviders(result.data ?? []);
  }, []);

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

    const patch =
      field === "enabled"
        ? {
            enabled: value,
            ...(value ? {} : { orchestrationEnabled: false }),
          }
        : { orchestrationEnabled: value };

    const previous = providers;
    setProviders((current) =>
      current.map((item) => {
        if (item.id !== provider.id) return item;

        const next = { ...item, ...patch };
        if (field === "enabled" && !value) {
          next.status = "INACTIVE";
        }
        return next;
      }),
    );

    const result = await updateProvider(provider.id, patch);

    setTogglingId(null);
    setTogglingField(null);

    if (!result.success) {
      setProviders(previous);
      setLoadError(result.error ?? "Failed to update provider.");
      return;
    }

    if (result.data) {
      setProviders((current) =>
        current.map((item) => (item.id === provider.id ? result.data! : item)),
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
          <AdminCallout variant="warning" title="Unable to load providers">
            {loadError}
          </AdminCallout>
        ) : null}

        <ProviderListSummary metrics={metrics} />

        <div className={ADMIN_LIST_PAGE_FILTERS_SECTION}>
          <ProviderFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filteredProviders.length}
          />

          {loading ? (
            <p className="text-small text-muted-foreground">Loading providers…</p>
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
