"use client";

import Link from "next/link";
import type { OverviewRecentDeliveryRow } from "@/overview/liveOverviewMappers";

type RecentDeliveriesReportingTableProps = {
  rows: OverviewRecentDeliveryRow[];
};

export default function RecentDeliveriesReportingTable({
  rows,
}: RecentDeliveriesReportingTableProps) {
  return (
    <section aria-labelledby="recent-deliveries-table-heading">
      <article className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
        <div className="flex flex-col gap-2 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 lg:px-6">
          <h2
            id="recent-deliveries-table-heading"
            className="min-w-0 text-subheading font-semibold leading-snug text-foreground"
          >
            Recent Deliveries
          </h2>
          <Link
            href="/deliveries"
            className="shrink-0 text-small font-medium text-link hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
          >
            View all deliveries →
          </Link>
        </div>

        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-small text-muted-foreground md:px-6">
            No deliveries in the selected period.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] table-fixed text-left text-small">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-[22%] px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                    Reference
                  </th>
                  <th className="w-[28%] px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                    Route
                  </th>
                  <th className="w-[14%] px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                    Package
                  </th>
                  <th className="w-[16%] px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                    Status
                  </th>
                  <th className="w-[20%] px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.deliveryId}
                    className="border-b border-border last:border-b-0 transition-colors hover:bg-surface/30"
                  >
                    <td className="px-4 py-3.5 md:px-5">
                      <Link
                        href={`/deliveries/${row.deliveryId}`}
                        className="block truncate font-semibold text-foreground hover:text-link"
                      >
                        {row.reference}
                      </Link>
                    </td>
                    <td className="truncate px-4 py-3.5 text-muted-foreground md:px-5">
                      {row.routeLabel ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 md:px-5">{row.packageType ?? "—"}</td>
                    <td className="px-4 py-3.5 md:px-5">{row.status}</td>
                    <td className="px-4 py-3.5 text-muted-foreground md:px-5">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
