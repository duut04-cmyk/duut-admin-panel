"use client";

import type { ProviderSummary } from "@/data/providerTypes";
import AdminEmptyState from "@/ui/AdminEmptyState";
import ProviderRow from "./ProviderRow";

type ProviderListProps = {
  providers: ProviderSummary[];
  togglingId: string | null;
  togglingField: "enabled" | "orchestrationEnabled" | null;
  onToggleEnabled: (provider: ProviderSummary, enabled: boolean) => void;
  onToggleOrchestration: (provider: ProviderSummary, enabled: boolean) => void;
};

export default function ProviderList({
  providers,
  togglingId,
  togglingField,
  onToggleEnabled,
  onToggleOrchestration,
}: ProviderListProps) {
  if (providers.length === 0) {
    return (
      <AdminEmptyState
        title="No providers found"
        description="Adjust filters or add a new provider to get started."
      />
    );
  }

  return (
    <section aria-labelledby="provider-list-heading">
      <article className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
        <div className="border-b border-border px-4 py-4 sm:px-5 lg:px-6">
          <h2
            id="provider-list-heading"
            className="text-subheading font-semibold leading-snug text-foreground"
          >
            Providers
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
            Delivery integrations registered in the platform.
          </p>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {providers.map((provider) => (
            <ProviderRow
              key={provider.id}
              provider={provider}
              variant="card"
              togglingField={togglingId === provider.id ? togglingField : null}
              onToggleEnabled={(enabled) => onToggleEnabled(provider, enabled)}
              onToggleOrchestration={(enabled) =>
                onToggleOrchestration(provider, enabled)
              }
            />
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] text-left text-small">
            <caption className="sr-only">Provider records</caption>
            <thead>
              <tr className="border-b border-border">
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Provider
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Environment
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Integration
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Health
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Enabled
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Orchestration
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5"
                >
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <ProviderRow
                  key={provider.id}
                  provider={provider}
                  variant="table"
                  togglingField={togglingId === provider.id ? togglingField : null}
                  onToggleEnabled={(enabled) => onToggleEnabled(provider, enabled)}
                  onToggleOrchestration={(enabled) =>
                    onToggleOrchestration(provider, enabled)
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
