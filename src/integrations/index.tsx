"use client";

import { useState } from "react";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import type { IntegrationsStatus } from "@/data/integrationTypes";
import AdminContainer from "@/components/AdminContainer";
import AdminShell from "@/components/AdminShell";
import AdminCallout from "@/ui/AdminCallout";
import AdminEmptyState from "@/ui/AdminEmptyState";
import { fetchIntegrationsStatus } from "./api";
import IntegrationsCategorySection from "./components/IntegrationsCategorySection";
import IntegrationsPageHeader from "./components/IntegrationsPageHeader";
import IntegrationsSummary from "./components/IntegrationsSummary";

export default function IntegrationsPage() {
  const [status, setStatus] = useState<IntegrationsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useLoadedAsync(async (isStale) => {
    const result = await fetchIntegrationsStatus();

    if (isStale()) return;

    setLoading(false);
    setLoadError(null);

    if (!result.success || !result.data) {
      setStatus(null);
      setLoadError(result.error ?? "Failed to load integrations.");
      return;
    }

    setStatus(result.data);
  }, []);

  return (
    <AdminShell mainClassName="bg-background" customHeader={<IntegrationsPageHeader />}>
      <AdminContainer flushTop className="space-y-8 pb-10">
        {loadError ? (
          <AdminCallout variant="warning" title="Unable to load integrations">
            {loadError}
          </AdminCallout>
        ) : null}

        {loading ? (
          <p className="text-small text-muted-foreground">Loading integrations…</p>
        ) : null}

        {!loading && status ? (
          <>
            <IntegrationsSummary
              summary={status.summary}
              checkedAt={status.checkedAt}
            />

            {status.summary.needsAttention > 0 ? (
              <AdminCallout variant="warning" title="Action recommended">
                {status.summary.needsAttention} integration
                {status.summary.needsAttention === 1 ? "" : "s"} need configuration or
                attention. Review the cards below and update server environment
                variables.
              </AdminCallout>
            ) : null}

            {status.categories.map((category) => (
              <IntegrationsCategorySection key={category.id} category={category} />
            ))}
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
