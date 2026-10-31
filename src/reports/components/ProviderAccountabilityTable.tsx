"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProviderAccountabilityRow } from "@/reports/accountability";
import ListPagination from "@/components/ListPagination";
import { ListRowsSkeleton } from "@/components/loading/skeletonSections";
import AdminEmptyState from "@/ui/AdminEmptyState";
import AdminStatus from "@/ui/AdminStatus";
import ProviderEnvironmentBadge from "@/providers/components/ProviderEnvironmentBadge";
import {
  healthStatusLabel,
  healthStatusVariant,
  integrationStatusLabel,
  integrationStatusVariant,
} from "@/providers/components/utils";

const PAGE_SIZE = 10;

type ProviderAccountabilityTableProps = {
  rows: ProviderAccountabilityRow[];
  loading?: boolean;
  unavailable?: boolean;
};

const thClass =
  "px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5";

export default function ProviderAccountabilityTable({
  rows,
  loading = false,
  unavailable = false,
}: ProviderAccountabilityTableProps) {
  const [page, setPage] = useState(1);

  if (loading) {
    return <ListRowsSkeleton rows={4} />;
  }

  if (unavailable) {
    return (
      <p className="text-small text-muted-foreground" role="status">
        Provider accountability could not be loaded. Try refreshing the page.
      </p>
    );
  }

  if (rows.length === 0) {
    return (
      <AdminEmptyState
        title="No providers registered"
        description="Add providers to track integration and orchestration accountability."
      />
    );
  }

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <article className="min-w-0 overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_8px_24px_-16px_rgba(23,23,23,0.14)]">
      <div className="space-y-3 p-4 md:hidden">
        {pageRows.map((row) => (
          <div key={row.id} className="rounded-[10px] border border-border p-4">
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
            <p className="mt-3 text-caption text-muted-foreground">
              {row.issueSummary ?? "No issues detected"}
            </p>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[960px] text-left text-small">
          <caption className="sr-only">Provider accountability</caption>
          <thead>
            <tr className="border-b border-border bg-[#FFFBF5]/60">
              <th className={thClass}>Provider</th>
              <th className={thClass}>Environment</th>
              <th className={thClass}>Health</th>
              <th className={thClass}>Integration</th>
              <th className={thClass}>Enabled</th>
              <th className={thClass}>Orchestration</th>
              <th className={thClass}>Note</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-b-0 transition-colors hover:bg-surface/40"
              >
                <td className="px-4 py-3.5 md:px-5">
                  <Link
                    href="/providers"
                    className="font-semibold text-foreground hover:text-accent"
                  >
                    {row.name}
                  </Link>
                  <p className="text-caption text-muted-foreground">{row.code}</p>
                </td>
                <td className="px-4 py-3.5 md:px-5">
                  <ProviderEnvironmentBadge environment={row.environment} />
                </td>
                <td className="px-4 py-3.5 md:px-5">
                  <AdminStatus
                    variant={healthStatusVariant(row.healthStatus)}
                    label={healthStatusLabel(row.healthStatus)}
                  />
                </td>
                <td className="px-4 py-3.5 md:px-5">
                  <AdminStatus
                    variant={integrationStatusVariant(row.integrationStatus)}
                    label={integrationStatusLabel(row.integrationStatus)}
                  />
                </td>
                <td className="px-4 py-3.5 md:px-5">{row.enabled ? "Yes" : "No"}</td>
                <td className="px-4 py-3.5 md:px-5">
                  {row.orchestrationEnabled ? "On" : "Off"}
                </td>
                <td className="px-4 py-3.5 text-muted-foreground md:px-5">
                  {row.issueSummary ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ListPagination
        page={currentPage}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />
    </article>
  );
}
