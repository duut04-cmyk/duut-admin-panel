"use client";

import Link from "next/link";
import { useCallback, useState, type ReactNode } from "react";
import type { ProviderDetail } from "@/data/providerTypes";
import { isValidProviderId } from "@/lib/bff/providers";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import { useExclusiveAsync } from "@/lib/useExclusiveAsync";
import AdminContainer from "@/components/AdminContainer";
import { ADMIN_DETAIL_RAIL_GRID } from "@/components/layout";
import AdminShell from "@/components/AdminShell";
import AdminLoadErrorCallout from "@/components/AdminLoadErrorCallout";
import { ProviderDetailSkeleton } from "@/components/loading/skeletonSections";
import AdminEmptyState from "@/ui/AdminEmptyState";
import AdminStatus from "@/ui/AdminStatus";
import { fetchProvider } from "../api";
import ProviderCapabilitiesSection from "../components/ProviderCapabilitiesSection";
import ProviderConfigurationSection from "../components/ProviderConfigurationSection";
import ProviderCredentialsSection from "../components/ProviderCredentialsSection";
import ProviderDiagnosticsSection from "../components/ProviderDiagnosticsSection";
import ProviderStatusSection from "../components/ProviderStatusSection";
import ProviderServicesSection from "../components/ProviderServicesSection";
import ProviderVehiclesSection from "../components/ProviderVehiclesSection";
import {
  formatBoolean,
  formatOptionalNumber,
  formatPackageTypes,
  formatProviderDateTime,
  isProviderNotFoundError,
} from "../components/detailFormatting";
import ProviderDetailPageHeader, {
  ProviderDetailErrorHeader,
  ProviderDetailLoadingHeader,
} from "../components/ProviderDetailPageHeader";
import { healthStatusLabel, healthStatusVariant } from "../components/utils";

type ProviderDetailPageProps = {
  providerId: string;
};

function DetailSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
      <div className="border-b border-border px-4 py-4 sm:px-5 lg:px-6">
        <h2 className="text-subheading font-semibold leading-snug text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-small text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="p-4 sm:p-5 lg:p-6">{children}</div>
    </section>
  );
}

function DefinitionGrid({ children }: { children: ReactNode }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">{children}</dl>
  );
}

function DefinitionItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-caption font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-small text-foreground">{value}</dd>
    </div>
  );
}

export default function ProviderDetailPage({ providerId }: ProviderDetailPageProps) {
  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const invalidId = !isValidProviderId(providerId);

  const loadProvider = useCallback(
    async (isStale: () => boolean = () => false) => {
      if (invalidId) {
        setLoading(false);
        setProvider(null);
        setLoadError(null);
        return;
      }

      setLoading(true);
      setLoadError(null);

      const result = await fetchProvider(providerId);

      if (isStale()) return;

      setLoading(false);

      if (!result.success || !result.data) {
        setProvider(null);
        setLoadError(result.error ?? "Failed to load provider.");
        return;
      }

      setProvider(result.data);
    },
    [invalidId, providerId],
  );

  useLoadedAsync(
    async (isStale) => {
      await loadProvider(isStale);
    },
    [loadProvider],
  );

  const { run: retryLoad, busy: retrying } = useExclusiveAsync(async () => {
    await loadProvider();
  });

  if (invalidId) {
    return (
      <AdminShell customHeader={<ProviderDetailErrorHeader />}>
        <AdminContainer flushTop className="pb-10">
          <AdminEmptyState
            title="Invalid provider id"
            description="Open a provider from the providers list."
            action={
              <Link
                href="/providers"
                className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Back to providers
              </Link>
            }
          />
        </AdminContainer>
      </AdminShell>
    );
  }

  if (loading) {
    return (
      <AdminShell customHeader={<ProviderDetailLoadingHeader />}>
        <AdminContainer flushTop className="pb-10">
          <ProviderDetailSkeleton />
        </AdminContainer>
      </AdminShell>
    );
  }

  if (!provider) {
    const notFound = isProviderNotFoundError(loadError ?? undefined);
    return (
      <AdminShell customHeader={<ProviderDetailErrorHeader notFound={notFound} />}>
        <AdminContainer flushTop className="pb-10">
          {loadError && !notFound ? (
            <AdminLoadErrorCallout
              title="Unable to load provider"
              onRetry={() => void retryLoad()}
              retrying={retrying}
            >
              <p>{loadError}</p>
            </AdminLoadErrorCallout>
          ) : (
            <AdminEmptyState
              title="Provider not found"
              description={
                notFound
                  ? `No provider exists for ID "${providerId}".`
                  : "This provider could not be loaded."
              }
              action={
                <Link
                  href="/providers"
                  className="text-small font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Back to providers
                </Link>
              }
            />
          )}
        </AdminContainer>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      mainClassName="bg-background"
      customHeader={<ProviderDetailPageHeader provider={provider} />}
    >
      <AdminContainer flushTop className="space-y-6 pb-10 lg:space-y-8">
        <div className={`grid min-w-0 gap-6 ${ADMIN_DETAIL_RAIL_GRID} xl:items-start`}>
          <div className="min-w-0 space-y-6 xl:order-1">
            <ProviderConfigurationSection
              provider={provider}
              onProviderUpdated={setProvider}
            />

            <ProviderStatusSection
              provider={provider}
              onProviderUpdated={setProvider}
            />

            <DetailSection
              title="Health"
              description="Latest connectivity check stored on the provider record."
            >
              <DefinitionGrid>
                <DefinitionItem
                  label="Health status"
                  value={
                    <AdminStatus
                      variant={healthStatusVariant(provider.health.status)}
                      label={healthStatusLabel(provider.health.status)}
                    />
                  }
                />
                <DefinitionItem
                  label="Last checked"
                  value={formatProviderDateTime(provider.health.lastCheckedAt)}
                />
                <DefinitionItem
                  label="Last error"
                  value={provider.health.lastError ?? "—"}
                />
              </DefinitionGrid>
            </DetailSection>

            <ProviderDiagnosticsSection
              provider={provider}
              onProviderUpdated={setProvider}
            />

            <ProviderCapabilitiesSection
              provider={provider}
              onProviderUpdated={setProvider}
            />

            <DetailSection title="HTTP settings">
              <DefinitionGrid>
                <DefinitionItem
                  label="Timeout"
                  value={`${provider.settings.timeoutMs} ms`}
                />
                <DefinitionItem
                  label="Connect timeout"
                  value={`${provider.settings.connectTimeoutMs} ms`}
                />
                <DefinitionItem
                  label="Max retries"
                  value={String(provider.settings.maxRetries)}
                />
                <DefinitionItem
                  label="Retry delay"
                  value={`${provider.settings.retryDelayMs} ms`}
                />
                <DefinitionItem
                  label="Webhooks enabled"
                  value={formatBoolean(provider.settings.webhookEnabled)}
                />
                <DefinitionItem
                  label="Health check enabled"
                  value={formatBoolean(provider.settings.healthCheckEnabled)}
                />
                <DefinitionItem
                  label="Health check interval"
                  value={`${provider.settings.healthCheckIntervalMs} ms`}
                />
              </DefinitionGrid>
            </DetailSection>

            <DetailSection title="Package limits">
              {provider.packageLimits ? (
                <DefinitionGrid>
                  <DefinitionItem
                    label="Min weight"
                    value={formatOptionalNumber(
                      provider.packageLimits.minWeightKg,
                      "kg",
                    )}
                  />
                  <DefinitionItem
                    label="Max weight"
                    value={formatOptionalNumber(
                      provider.packageLimits.maxWeightKg,
                      "kg",
                    )}
                  />
                  <DefinitionItem
                    label="Max length"
                    value={formatOptionalNumber(
                      provider.packageLimits.maxLengthCm,
                      "cm",
                    )}
                  />
                  <DefinitionItem
                    label="Max width"
                    value={formatOptionalNumber(
                      provider.packageLimits.maxWidthCm,
                      "cm",
                    )}
                  />
                  <DefinitionItem
                    label="Max height"
                    value={formatOptionalNumber(
                      provider.packageLimits.maxHeightCm,
                      "cm",
                    )}
                  />
                  <DefinitionItem
                    label="Max volume"
                    value={formatOptionalNumber(
                      provider.packageLimits.maxVolumeCm3,
                      "cm³",
                    )}
                  />
                  <DefinitionItem
                    label="Supported package types"
                    value={formatPackageTypes(
                      provider.packageLimits.supportedPackageTypes,
                    )}
                  />
                </DefinitionGrid>
              ) : (
                <p className="text-small text-muted-foreground">
                  No package limits configured.
                </p>
              )}
            </DetailSection>

            <ProviderServicesSection
              providerId={provider.id}
              onServicesChange={(services) =>
                setProvider((current) => (current ? { ...current, services } : current))
              }
            />

            <ProviderVehiclesSection
              providerId={provider.id}
              onVehiclesChange={(vehicles) =>
                setProvider((current) => (current ? { ...current, vehicles } : current))
              }
            />
          </div>

          <aside className="min-w-0 space-y-6 xl:order-2 xl:sticky xl:top-6 xl:self-start">
            <ProviderCredentialsSection
              provider={provider}
              onProviderUpdated={setProvider}
            />

            <DetailSection title="Record">
              <DefinitionGrid>
                <DefinitionItem
                  label="Provider ID"
                  value={
                    <span className="break-all font-mono text-caption">
                      {provider.id}
                    </span>
                  }
                />
                <DefinitionItem
                  label="Created"
                  value={formatProviderDateTime(provider.createdAt)}
                />
                <DefinitionItem
                  label="Updated"
                  value={formatProviderDateTime(provider.updatedAt)}
                />
              </DefinitionGrid>
            </DetailSection>
          </aside>
        </div>
      </AdminContainer>
    </AdminShell>
  );
}
