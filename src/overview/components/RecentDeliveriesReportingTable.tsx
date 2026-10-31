"use client";

import Link from "next/link";
import { useState } from "react";
import ListPagination from "@/components/ListPagination";
import { DeliveryStatusPill } from "@/deliveries/components/DeliveryStatusPill";
import type { OverviewRecentDeliveryRow } from "@/overview/liveOverviewMappers";

const PAGE_SIZE = 10;

type RecentDeliveriesReportingTableProps = {
  rows: OverviewRecentDeliveryRow[];
  /** Resets pagination when the reporting window changes. */
  listKey?: string;
};

function formatPackageLabel(value: string | null): string {
  if (!value) return "—";
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "—";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export default function RecentDeliveriesReportingTable({
  rows,
  listKey = "default",
}: RecentDeliveriesReportingTableProps) {
  const [pagination, setPagination] = useState({ key: listKey, page: 1 });
  const page = pagination.key === listKey ? pagination.page : 1;
  const setPage = (nextPage: number) => {
    setPagination({ key: listKey, page: nextPage });
  };

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section aria-labelledby="recent-deliveries-table-heading">
      <article className="min-w-0 overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_8px_24px_-16px_rgba(23,23,23,0.14)]">
        <div className="flex flex-col gap-2 border-b border-border px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-5 lg:px-6">
          <div className="min-w-0">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-accent">
              Activity
            </p>
            <h2
              id="recent-deliveries-table-heading"
              className="mt-0.5 text-body-lg font-bold tracking-tight text-foreground"
            >
              Recent Deliveries
            </h2>
            <p className="mt-0.5 text-small text-muted-foreground">
              Latest deliveries in the selected period.
            </p>
          </div>
          <Link
            href="/deliveries"
            className="shrink-0 text-small font-semibold text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View all deliveries →
          </Link>
        </div>

        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-small text-muted-foreground md:px-6">
            No deliveries in the selected period.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] table-fixed text-left text-small">
                <thead>
                  <tr className="border-b border-border bg-[#FFFBF5]/60">
                    <th className="w-[20%] px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5">
                      Reference
                    </th>
                    <th className="w-[30%] px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5">
                      Route
                    </th>
                    <th className="w-[14%] px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5">
                      Package
                    </th>
                    <th className="w-[16%] px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5">
                      Status
                    </th>
                    <th className="w-[20%] px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row) => (
                    <tr
                      key={row.deliveryId}
                      className="border-b border-border last:border-b-0 transition-colors hover:bg-surface/40"
                    >
                      <td className="px-4 py-3.5 md:px-5">
                        <Link
                          href={`/deliveries/${row.deliveryId}`}
                          className="block truncate font-semibold text-foreground hover:text-accent"
                        >
                          {row.reference}
                        </Link>
                      </td>
                      <td className="truncate px-4 py-3.5 text-muted-foreground md:px-5">
                        {row.routeLabel ?? "—"}
                      </td>
                      <td className="px-4 py-3.5 md:px-5">
                        <span className="inline-flex rounded-full border border-border bg-[#FFFBF5] px-2.5 py-0.5 text-caption font-medium text-foreground">
                          {formatPackageLabel(row.packageType)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 md:px-5">
                        <DeliveryStatusPill status={row.status} />
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground md:px-5">
                        {new Date(row.createdAt).toLocaleString()}
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
    </section>
  );
}
