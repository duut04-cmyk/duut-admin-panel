"use client";

import { useCallback, useState } from "react";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import { useExclusiveAsync } from "@/lib/useExclusiveAsync";
import type { IntegrationsStatus } from "@/data/integrationTypes";
import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import { IntegrationStatusSkeleton } from "@/components/loading/skeletonSections";
import AdminEmptyState from "@/ui/AdminEmptyState";
import { fetchIntegrationsStatus } from "./api";
import IntegrationsCategorySection from "./components/IntegrationsCategorySection";
import IntegrationsPageHeader from "./components/IntegrationsPageHeader";
import IntegrationsSummary from "./components/IntegrationsSummary";

export default function IntegrationsPage() {
  const [status, setStatus] = useState<IntegrationsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadIntegrations = useCallback(async (isStale: () => boolean = () => false) => {
    setLoading(true);
    setLoadError(null);

    const result = await fetchIntegrationsStatus();

    if (isStale()) return;

    setLoading(false);

    if (!result.success || !result.data) {
      setStatus(null);
      setLoadError(result.error ?? "Failed to load integrations.");
      return;
    }

    setStatus(result.data);
  }, []);

  useLoadedAsync(
    async (isStale) => {
      await loadIntegrations(isStale);
    },
    [loadIntegrations],
  );

  const { run: retryLoad, busy: retrying } = useExclusiveAsync(async () => {
    await loadIntegrations();
  });

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={<IntegrationsPageHeader checkedAt={status?.checkedAt ?? null} />}
    >
      <AdminContainer flushTop className="space-y-6 pb-10">
        {loadError ? (
          <AdminLoadErrorCallout
            title="Unable to load integrations"
            onRetry={() => void retryLoad()}
            retrying={retrying}
          >
            <p>{loadError}</p>
          </AdminLoadErrorCallout>
        ) : null}

        {loading ? <IntegrationStatusSkeleton /> : null}

        {!loading && status ? (
          <>
            <IntegrationsSummary summary={status.summary} />

            <div className="space-y-7">
              {status.categories.map((category) => (
                <IntegrationsCategorySection key={category.id} category={category} />
              ))}
            </div>
          </>
        ) : null}

        {!loading && !status && !loadError ? (
          <AdminEmptyState
            title="No integration data"
            description="Integration status could not be loaded."
          />
        ) : null}
      </AdminContainer>
    </AdminShell>
  );
}
