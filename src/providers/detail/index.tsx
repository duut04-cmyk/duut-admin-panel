"use client";

import { useState, type ReactNode } from "react";
import type { ProviderDetail } from "@/data/providerTypes";
import { ADMIN_DETAIL_RAIL_GRID } from "@/components/layout";
import ProviderCapabilitiesSection from "../components/ProviderCapabilitiesSection";
import ProviderConfigurationSection from "../components/ProviderConfigurationSection";
import ProviderCredentialsSection from "../components/ProviderCredentialsSection";
import ProviderDiagnosticsSection from "../components/ProviderDiagnosticsSection";
import ProviderStatusSection from "../components/ProviderStatusSection";
import {
  formatBoolean,
  formatOptionalNumber,
  formatPackageTypes,
  formatProviderDateTime,
} from "../components/detailFormatting";
import ProviderDetailPageHeader from "../components/ProviderDetailPageHeader";
import ProviderDetailRouteShell from "./ProviderDetailRouteShell";
import { useProviderDetail } from "./useProviderDetail";

type ProviderDetailPageProps = {
  providerId: string;
};

function DetailSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5 lg:px-6">
        <h2 className="text-subheading font-semibold leading-snug text-foreground">
          {title}
        </h2>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="p-4 sm:p-5 lg:p-6">{children}</div>
    </section>
  );
}

function DefinitionGrid({ children }: { children: ReactNode }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">{children}</dl>
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

function RecordSection({ provider }: { provider: ProviderDetail }) {
  const [copied, setCopied] = useState(false);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(provider.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <DetailSection title="Record">
      <dl className="space-y-2.5 text-small">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Code</dt>
          <dd className="font-mono text-caption font-medium">{provider.code}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">ID</dt>
          <dd className="min-w-0 text-right">
            <button
              type="button"
              onClick={() => void copyId()}
              className="inline-flex max-w-full items-center gap-1.5 font-mono text-caption text-muted-foreground hover:text-foreground"
              title={provider.id}
            >
              <span className="truncate">{provider.id}</span>
              <span className="shrink-0 font-sans font-medium text-accent">
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Created</dt>
          <dd>{formatProviderDateTime(provider.createdAt)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Updated</dt>
          <dd>{formatProviderDateTime(provider.updatedAt)}</dd>
        </div>
      </dl>
    </DetailSection>
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
    <div className={`grid min-w-0 gap-5 ${ADMIN_DETAIL_RAIL_GRID} xl:items-start`}>
      <div className="min-w-0 space-y-5 xl:order-1">
        <ProviderConfigurationSection
          mode="view"
          provider={provider}
          onProviderUpdated={onProviderUpdated}
        />

        <ProviderStatusSection
          provider={provider}
          onProviderUpdated={onProviderUpdated}
        />

        <ProviderDiagnosticsSection
          provider={provider}
          onProviderUpdated={onProviderUpdated}
        />

        <ProviderCapabilitiesSection
          provider={provider}
          onProviderUpdated={onProviderUpdated}
        />

        <DetailSection title="HTTP">
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
              label="Webhooks"
              value={formatBoolean(provider.settings.webhookEnabled)}
            />
            <DefinitionItem
              label="Health checks"
              value={
                provider.settings.healthCheckEnabled
                  ? `Every ${provider.settings.healthCheckIntervalMs} ms`
                  : "Off"
              }
            />
          </DefinitionGrid>
        </DetailSection>

        {provider.packageLimits ? (
          <DetailSection title="Package limits">
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
                label="Package types"
                value={formatPackageTypes(provider.packageLimits.supportedPackageTypes)}
              />
            </DefinitionGrid>
          </DetailSection>
        ) : null}
      </div>

      <aside className="min-w-0 space-y-5 xl:order-2 xl:sticky xl:top-6 xl:self-start">
        <ProviderCredentialsSection
          mode="view"
          provider={provider}
          onProviderUpdated={onProviderUpdated}
        />
        <RecordSection provider={provider} />
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
      containerClassName="space-y-5 pb-10 lg:space-y-6"
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
