"use client";

import type { ProviderSummary } from "@/data/providerTypes";
import ListPagination from "@/components/ListPagination";
import AdminEmptyState from "@/ui/AdminEmptyState";
import ProviderRow from "./ProviderRow";

type ProviderListProps = {
  providers: ProviderSummary[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  togglingId: string | null;
  togglingField: "enabled" | "orchestrationEnabled" | null;
  onToggleEnabled: (provider: ProviderSummary, enabled: boolean) => void;
  onToggleOrchestration: (provider: ProviderSummary, enabled: boolean) => void;
};

const thClass =
  "px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5";

export default function ProviderList({
  providers,
  page,
  pageSize,
  total,
  onPageChange,
  togglingId,
  togglingField,
  onToggleEnabled,
  onToggleOrchestration,
}: ProviderListProps) {
  if (providers.length === 0 && total === 0) {
    return (
      <AdminEmptyState
        title="No providers found"
        description="Adjust filters or add a new provider to get started."
      />
    );
  }

  return (
    <section aria-labelledby="provider-list-heading">
      <article className="min-w-0 overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_8px_24px_-16px_rgba(23,23,23,0.14)]">
        <div className="border-b border-border px-4 py-4 sm:px-5 lg:px-6">
          <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-accent">
            Directory
          </p>
          <h2
            id="provider-list-heading"
            className="mt-0.5 text-body-lg font-bold tracking-tight text-foreground"
          >
            Providers
          </h2>
          <p className="mt-0.5 text-small text-muted-foreground">
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
              <tr className="border-b border-border bg-[#FFFBF5]/60">
                <th scope="col" className={thClass}>
                  Provider
                </th>
                <th scope="col" className={thClass}>
                  Environment
                </th>
                <th scope="col" className={thClass}>
                  Status
                </th>
                <th scope="col" className={thClass}>
                  Integration
                </th>
                <th scope="col" className={thClass}>
                  Health
                </th>
                <th scope="col" className={thClass}>
                  Enabled
                </th>
                <th scope="col" className={thClass}>
                  Orchestration
                </th>
                <th scope="col" className={thClass}>
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

        <ListPagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
        />
      </article>
    </section>
  );
}
