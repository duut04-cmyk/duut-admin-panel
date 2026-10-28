"use client";

import Link from "next/link";
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

function ProviderIdentity({
  provider,
  linked = true,
}: {
  provider: ProviderSummary;
  /** When the parent row already provides navigation, render plain text. */
  linked?: boolean;
}) {
  const name = linked ? (
    <Link
      href={`/providers/${provider.id}`}
      className="font-semibold text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {provider.name}
    </Link>
  ) : (
    <p className="font-semibold text-foreground">{provider.name}</p>
  );

  return <div className="min-w-0">{name}</div>;
}

export default function ProviderRow({
  provider,
  variant = "table",
  togglingField = null,
  onToggleEnabled,
  onToggleOrchestration,
}: ProviderRowProps) {
  const href = `/providers/${provider.id}`;

  const toggles = (
    <div className="relative z-10 flex flex-col gap-3">
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
        <Link
          href={href}
          className="block cursor-pointer rounded-control transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={`Open provider ${provider.name}`}
        >
          <div className="flex items-start justify-between gap-3">
            <ProviderIdentity provider={provider} linked={false} />
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
        </Link>

        <div className="mt-4 border-t border-border/60 pt-4">{toggles}</div>
      </article>
    );
  }

  return (
    <tr className="relative cursor-pointer border-b border-border/60 transition-colors last:border-b-0 hover:bg-surface/30">
      <td className="px-4 py-4 align-top md:px-5">
        <Link
          href={href}
          className="block min-w-0 after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={`Open provider ${provider.name}`}
        >
          <ProviderIdentity provider={provider} linked={false} />
        </Link>
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
      <td className="relative z-10 px-4 py-4 align-top md:px-5">
        <AdminToggle
          checked={provider.enabled}
          label="Enabled"
          onCheckedChange={onToggleEnabled}
          disabled={togglingField === "enabled"}
        />
      </td>
      <td className="relative z-10 px-4 py-4 align-top md:px-5">
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
