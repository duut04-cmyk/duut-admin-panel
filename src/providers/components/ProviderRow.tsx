"use client";

import type { ProviderSummary } from "@/data/providerTypes";
import AdminStatus from "@/ui/AdminStatus";
import AdminToggle from "@/ui/AdminToggle";
import ProviderEnvironmentBadge from "./ProviderEnvironmentBadge";
import {
  formatProviderDate,
  healthStatusLabel,
  healthStatusVariant,
  integrationStatusLabel,
  integrationStatusVariant,
  providerStatusLabel,
  providerStatusVariant,
} from "./utils";

type ProviderRowProps = {
  provider: ProviderSummary;
  variant?: "table" | "card";
  togglingField?: "enabled" | "orchestrationEnabled" | null;
  onToggleEnabled: (enabled: boolean) => void;
  onToggleOrchestration: (enabled: boolean) => void;
};

function ProviderIdentity({ provider }: { provider: ProviderSummary }) {
  return (
    <div className="min-w-0">
      <p className="font-semibold text-foreground">{provider.name}</p>
      <p className="mt-0.5 text-caption text-muted-foreground">{provider.code}</p>
      {provider.displayName ? (
        <p className="mt-0.5 truncate text-caption text-muted-foreground">
          {provider.displayName}
        </p>
      ) : null}
    </div>
  );
}

export default function ProviderRow({
  provider,
  variant = "table",
  togglingField = null,
  onToggleEnabled,
  onToggleOrchestration,
}: ProviderRowProps) {
  const toggles = (
    <div className="flex flex-col gap-3">
      <AdminToggle
        checked={provider.enabled}
        label="Enabled"
        onCheckedChange={onToggleEnabled}
        disabled={togglingField === "enabled"}
        className="items-center"
      />
      <AdminToggle
        checked={provider.orchestrationEnabled}
        label="Orchestration"
        onCheckedChange={onToggleOrchestration}
        disabled={togglingField === "orchestrationEnabled" || !provider.enabled}
        className="items-center"
      />
    </div>
  );

  if (variant === "card") {
    return (
      <article className="rounded-card border border-border/60 bg-background p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <ProviderIdentity provider={provider} />
          <ProviderEnvironmentBadge environment={provider.environment} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-small">
          <div>
            <dt className="text-caption text-muted-foreground">Status</dt>
            <dd className="mt-1">
              <AdminStatus
                variant={providerStatusVariant(provider.status)}
                label={providerStatusLabel(provider.status)}
              />
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Integration</dt>
            <dd className="mt-1">
              <AdminStatus
                variant={integrationStatusVariant(provider.integrationStatus)}
                label={integrationStatusLabel(provider.integrationStatus)}
              />
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Health</dt>
            <dd className="mt-1">
              <AdminStatus
                variant={healthStatusVariant(provider.health.status)}
                label={healthStatusLabel(provider.health.status)}
              />
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Updated</dt>
            <dd className="mt-1 tabular-nums text-foreground">
              {formatProviderDate(provider.updatedAt)}
            </dd>
          </div>
        </dl>

        <div className="mt-4 border-t border-border/60 pt-4">{toggles}</div>
      </article>
    );
  }

  return (
    <tr className="border-b border-border/60 last:border-b-0">
      <td className="px-4 py-4 align-top md:px-5">
        <ProviderIdentity provider={provider} />
      </td>
      <td className="px-4 py-4 align-top md:px-5">
        <ProviderEnvironmentBadge environment={provider.environment} />
      </td>
      <td className="px-4 py-4 align-top md:px-5">
        <AdminStatus
          variant={providerStatusVariant(provider.status)}
          label={providerStatusLabel(provider.status)}
        />
      </td>
      <td className="px-4 py-4 align-top md:px-5">
        <AdminStatus
          variant={integrationStatusVariant(provider.integrationStatus)}
          label={integrationStatusLabel(provider.integrationStatus)}
        />
      </td>
      <td className="px-4 py-4 align-top md:px-5">
        <AdminStatus
          variant={healthStatusVariant(provider.health.status)}
          label={healthStatusLabel(provider.health.status)}
        />
      </td>
      <td className="px-4 py-4 align-top md:px-5">
        <AdminToggle
          checked={provider.enabled}
          label="Enabled"
          onCheckedChange={onToggleEnabled}
          disabled={togglingField === "enabled"}
        />
      </td>
      <td className="px-4 py-4 align-top md:px-5">
        <AdminToggle
          checked={provider.orchestrationEnabled}
          label="Orchestration"
          onCheckedChange={onToggleOrchestration}
          disabled={togglingField === "orchestrationEnabled" || !provider.enabled}
        />
      </td>
      <td className="px-4 py-4 align-top text-small tabular-nums text-muted-foreground md:px-5">
        {formatProviderDate(provider.updatedAt)}
      </td>
    </tr>
  );
}
