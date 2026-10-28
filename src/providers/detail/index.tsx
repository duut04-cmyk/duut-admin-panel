"use client";

import type { ReactNode } from "react";
import type { ProviderDetail } from "@/data/providerTypes";
import { ADMIN_DETAIL_RAIL_GRID } from "@/components/layout";
import AdminStatus from "@/ui/AdminStatus";
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
} from "../components/detailFormatting";
import ProviderDetailPageHeader from "../components/ProviderDetailPageHeader";
import { healthStatusLabel, healthStatusVariant } from "../components/utils";
import ProviderDetailRouteShell from "./ProviderDetailRouteShell";
import { useProviderDetail } from "./useProviderDetail";

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

function ProviderDetailContent({
  provider,
  onProviderUpdated,
}: {
  provider: ProviderDetail;
  onProviderUpdated: (provider: ProviderDetail) => void;
}) {
  return (
    <div className={`grid min-w-0 gap-6 ${ADMIN_DETAIL_RAIL_GRID} xl:items-start`}>
      <div className="min-w-0 space-y-6 xl:order-1">
        <ProviderConfigurationSection
          mode="view"
          provider={provider}
          onProviderUpdated={onProviderUpdated}
        />

        <ProviderStatusSection
          provider={provider}
          onProviderUpdated={onProviderUpdated}
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
          onProviderUpdated={onProviderUpdated}
        />

        <ProviderCapabilitiesSection
          provider={provider}
          onProviderUpdated={onProviderUpdated}
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
                value={formatOptionalNumber(provider.packageLimits.minWeightKg, "kg")}
              />
              <DefinitionItem
                label="Max weight"
                value={formatOptionalNumber(provider.packageLimits.maxWeightKg, "kg")}
              />
              <DefinitionItem
                label="Max length"
                value={formatOptionalNumber(provider.packageLimits.maxLengthCm, "cm")}
              />
              <DefinitionItem
                label="Max width"
                value={formatOptionalNumber(provider.packageLimits.maxWidthCm, "cm")}
              />
              <DefinitionItem
                label="Max height"
                value={formatOptionalNumber(provider.packageLimits.maxHeightCm, "cm")}
              />
              <DefinitionItem
                label="Max volume"
                value={formatOptionalNumber(provider.packageLimits.maxVolumeCm3, "cm³")}
              />
              <DefinitionItem
                label="Supported package types"
                value={formatPackageTypes(provider.packageLimits.supportedPackageTypes)}
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
          onServicesChange={(services) => onProviderUpdated({ ...provider, services })}
        />

        <ProviderVehiclesSection
          providerId={provider.id}
          onVehiclesChange={(vehicles) => onProviderUpdated({ ...provider, vehicles })}
        />
      </div>

      <aside className="min-w-0 space-y-6 xl:order-2 xl:sticky xl:top-6 xl:self-start">
        <ProviderCredentialsSection
          mode="view"
          provider={provider}
          onProviderUpdated={onProviderUpdated}
        />

        <DetailSection title="Record">
          <DefinitionGrid>
            <DefinitionItem
              label="Provider ID"
              value={
                <span className="break-all font-mono text-caption">{provider.id}</span>
              }
            />
            <DefinitionItem
              label="Code"
              value={<span className="font-mono text-caption">{provider.code}</span>}
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
  );
}

export default function ProviderDetailPage({ providerId }: ProviderDetailPageProps) {
  const { provider, setProvider, loading, loadError, invalidId, retryLoad, retrying } =
    useProviderDetail(providerId);

  return (
    <ProviderDetailRouteShell
      providerId={providerId}
      invalidId={invalidId}
      loading={loading}
      provider={provider}
      loadError={loadError}
      retryLoad={() => void retryLoad()}
      retrying={retrying}
      mainClassName="bg-background"
      containerClassName="space-y-6 pb-10 lg:space-y-8"
      customHeader={
        provider ? <ProviderDetailPageHeader provider={provider} /> : undefined
      }
    >
      {(loaded) => (
        <ProviderDetailContent provider={loaded} onProviderUpdated={setProvider} />
      )}
    </ProviderDetailRouteShell>
  );
}
