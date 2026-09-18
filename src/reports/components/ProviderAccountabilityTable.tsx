"use client";

import Link from "next/link";
import type { ProviderAccountabilityRow } from "@/reports/accountability";
import AdminEmptyState from "@/ui/AdminEmptyState";
import AdminStatus from "@/ui/AdminStatus";
import ProviderEnvironmentBadge from "@/providers/components/ProviderEnvironmentBadge";
import {
  healthStatusLabel,
  healthStatusVariant,
  integrationStatusLabel,
  integrationStatusVariant,
} from "@/providers/components/utils";

type ProviderAccountabilityTableProps = {
  rows: ProviderAccountabilityRow[];
  loading?: boolean;
};

export default function ProviderAccountabilityTable({
  rows,
  loading = false,
}: ProviderAccountabilityTableProps) {
  if (loading) {
    return <p className="text-small text-muted-foreground">Loading providers…</p>;
  }

  if (rows.length === 0) {
    return (
      <AdminEmptyState
        title="No providers registered"
        description="Add providers to track integration and orchestration accountability."
      />
    );
  }

  return (
    <article className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
      <div className="space-y-3 p-4 md:hidden">
        {rows.map((row) => (
          <div key={row.id} className="rounded-card border border-border/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{row.name}</p>
                <p className="text-caption text-muted-foreground">{row.code}</p>
              </div>
              <ProviderEnvironmentBadge environment={row.environment} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-small">
              <div>
                <dt className="text-caption text-muted-foreground">Health</dt>
                <dd className="mt-1">
                  <AdminStatus
                    variant={healthStatusVariant(row.healthStatus)}
                    label={healthStatusLabel(row.healthStatus)}
                  />
                </dd>
              </div>
              <div>
                <dt className="text-caption text-muted-foreground">Integration</dt>
                <dd className="mt-1">
                  <AdminStatus
                    variant={integrationStatusVariant(row.integrationStatus)}
                    label={integrationStatusLabel(row.integrationStatus)}
                  />
                </dd>
              </div>
            </dl>
            {row.issueSummary ? (
              <p className="mt-3 text-caption text-admin-danger">{row.issueSummary}</p>
            ) : (
              <p className="mt-3 text-caption text-muted-foreground">
                No issues detected
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[960px] text-left text-small">
          <caption className="sr-only">Provider accountability</caption>
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Provider
              </th>
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Environment
              </th>
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Health
              </th>
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Integration
              </th>
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Enabled
              </th>
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Orchestration
              </th>
              <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                Accountability note
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border/60 last:border-b-0">
                <td className="px-4 py-4 md:px-5">
                  <Link
                    href="/providers"
                    className="font-semibold text-foreground hover:text-accent"
                  >
                    {row.name}
                  </Link>
                  <p className="text-caption text-muted-foreground">{row.code}</p>
                </td>
                <td className="px-4 py-4 md:px-5">
                  <ProviderEnvironmentBadge environment={row.environment} />
                </td>
                <td className="px-4 py-4 md:px-5">
                  <AdminStatus
                    variant={healthStatusVariant(row.healthStatus)}
                    label={healthStatusLabel(row.healthStatus)}
                  />
                </td>
                <td className="px-4 py-4 md:px-5">
                  <AdminStatus
                    variant={integrationStatusVariant(row.integrationStatus)}
                    label={integrationStatusLabel(row.integrationStatus)}
                  />
                </td>
                <td className="px-4 py-4 md:px-5">{row.enabled ? "Yes" : "No"}</td>
                <td className="px-4 py-4 md:px-5">
                  {row.orchestrationEnabled ? "On" : "Off"}
                </td>
                <td className="px-4 py-4 text-muted-foreground md:px-5">
                  {row.issueSummary ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
