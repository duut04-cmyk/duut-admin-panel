"use client";

import Link from "next/link";
import { useState } from "react";
import type { CustomerAccountabilityRow } from "@/reports/accountability";
import ListPagination from "@/components/ListPagination";
import { ListRowsSkeleton } from "@/components/loading/skeletonSections";
import AdminEmptyState from "@/ui/AdminEmptyState";
import CustomerStatusPill from "@/customers/components/CustomerStatusPill";

const PAGE_SIZE = 10;

type CustomerAccountabilityProps = {
  rows: CustomerAccountabilityRow[];
  atRiskRows: CustomerAccountabilityRow[];
  loading?: boolean;
  unavailable?: boolean;
  sampleAtRiskCount?: number | null;
  sampleAtRiskKnown?: boolean;
  platformTotal?: number | null;
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const thClass =
  "px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5";

export default function CustomerAccountability({
  rows,
  atRiskRows,
  loading = false,
  unavailable = false,
  sampleAtRiskCount = null,
  sampleAtRiskKnown = false,
  platformTotal = null,
}: CustomerAccountabilityProps) {
  const [page, setPage] = useState(1);

  if (loading) {
    return <ListRowsSkeleton rows={4} />;
  }

  if (unavailable) {
    return (
      <p className="text-small text-muted-foreground" role="status">
        Customer accountability could not be loaded. Try refreshing the page.
      </p>
    );
  }

  if (rows.length === 0 && platformTotal === 0) {
    return (
      <AdminEmptyState
        title="No customers found"
        description="Customer accountability will appear once accounts are registered."
      />
    );
  }

  const active = rows.filter((row) => row.status === "ACTIVE").length;
  const suspended = rows.filter((row) => row.status === "SUSPENDED").length;
  const verified = rows.filter((row) => row.emailVerified).length;
  const withDeliveries = rows.filter((row) => row.totalDeliveries > 0).length;

  const total = atRiskRows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageAtRisk = atRiskRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="space-y-4">
      <p className="text-caption text-muted-foreground">
        Sample of {rows.length}
        {platformTotal != null
          ? ` (platform total ${platformTotal.toLocaleString()})`
          : ""}
        . At-risk counts apply to this sample only.
      </p>

      <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "In sample", value: rows.length },
          { label: "Active", value: active },
          { label: "Verified", value: verified },
          { label: "With deliveries", value: withDeliveries },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[10px] border border-border bg-white p-4 shadow-[0_8px_24px_-16px_rgba(23,23,23,0.1)]"
          >
            <p className="text-caption text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-body font-bold tabular-nums tracking-tight">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {suspended > 0 ? (
        <p className="text-small text-amber-800">
          {suspended} suspended in this sample require review.
        </p>
      ) : null}

      <article className="min-w-0 overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_8px_24px_-16px_rgba(23,23,23,0.14)]">
        <div className="border-b border-border px-4 py-4 sm:px-5">
          <h3 className="text-small font-bold text-foreground">At-risk customers</h3>
          <p className="mt-0.5 text-caption text-muted-foreground">
            Suspended accounts or unverified users with delivery activity.
          </p>
          {sampleAtRiskKnown ? (
            <p className="mt-1 text-caption text-muted-foreground">
              {sampleAtRiskCount === 0
                ? "None in this sample."
                : `${sampleAtRiskCount} at-risk in this sample.`}
            </p>
          ) : null}
        </div>

        {atRiskRows.length === 0 ? (
          <p className="p-4 text-small text-muted-foreground sm:p-5">
            No at-risk customers in the loaded sample.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-small">
                <thead>
                  <tr className="border-b border-border bg-[#FFFBF5]/60">
                    <th className={thClass}>Customer</th>
                    <th className={thClass}>Status</th>
                    <th className={thClass}>Deliveries</th>
                    <th className={thClass}>Last activity</th>
                    <th className={thClass}>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {pageAtRisk.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border last:border-b-0 transition-colors hover:bg-surface/40"
                    >
                      <td className="px-4 py-3.5 md:px-5">
                        <Link
                          href={`/customers/${row.id}`}
                          className="font-semibold text-accent hover:underline"
                        >
                          {row.name}
                        </Link>
                        <p className="text-caption text-muted-foreground">
                          {row.email}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 md:px-5">
                        <CustomerStatusPill status={row.status} />
                      </td>
                      <td className="px-4 py-3.5 tabular-nums md:px-5">
                        {row.totalDeliveries}
                      </td>
                      <td className="px-4 py-3.5 tabular-nums text-muted-foreground md:px-5">
                        {formatDate(row.lastDeliveryAt)}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground md:px-5">
                        {row.riskNote}
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
          </>
        )}
      </article>
    </div>
  );
}
