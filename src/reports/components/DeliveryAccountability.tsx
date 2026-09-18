"use client";

import Link from "next/link";
import type { DeliveryAccountabilityRow } from "@/reports/accountability";
import AdminEmptyState from "@/ui/AdminEmptyState";
import { DeliveryStatusPill } from "@/deliveries/components/DeliveryStatusPill";

type DeliveryAccountabilityProps = {
  rows: DeliveryAccountabilityRow[];
  problemRows: DeliveryAccountabilityRow[];
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function DeliveryAccountability({
  rows,
  problemRows,
}: DeliveryAccountabilityProps) {
  if (rows.length === 0) {
    return (
      <AdminEmptyState
        title="No deliveries in period"
        description="Adjust the date range to review delivery accountability."
      />
    );
  }

  const delivered = rows.filter((row) => row.status === "delivered").length;
  const failed = rows.filter((row) => row.status === "failed").length;
  const cancelled = rows.filter((row) => row.status === "cancelled").length;
  const inProgress = rows.length - delivered - failed - cancelled;

  return (
    <div className="space-y-4">
      <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Delivered", value: delivered },
          { label: "In progress", value: inProgress },
          { label: "Failed", value: failed },
          { label: "Cancelled", value: cancelled },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-card border border-border/60 bg-background p-4"
          >
            <p className="text-caption text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-body font-semibold tabular-nums">{item.value}</p>
          </div>
        ))}
      </div>

      <article className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
        <div className="border-b border-border px-4 py-4 sm:px-5">
          <h3 className="text-small font-semibold text-foreground">
            Deliveries needing attention
          </h3>
          <p className="mt-1 text-caption text-muted-foreground">
            Failed, cancelled, or booking-failed deliveries in this period.
          </p>
        </div>

        {problemRows.length === 0 ? (
          <p className="p-4 text-small text-muted-foreground sm:p-5">
            No delivery issues in this period.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-small">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                    Delivery
                  </th>
                  <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                    Route
                  </th>
                  <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                    Status
                  </th>
                  <th className="px-4 py-3 text-caption font-semibold text-muted-foreground md:px-5">
                    Issue
                  </th>
                </tr>
              </thead>
              <tbody>
                {problemRows.map((row) => (
                  <tr
                    key={row.deliveryId}
                    className="border-b border-border/60 last:border-b-0"
                  >
                    <td className="px-4 py-3 md:px-5">
                      <Link
                        href={`/deliveries/${row.deliveryId}`}
                        className="font-medium text-accent hover:underline"
                      >
                        {row.deliveryId}
                      </Link>
                      <p className="text-caption text-muted-foreground">
                        {formatDate(row.createdAt)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground md:px-5">
                      {row.route}
                    </td>
                    <td className="px-4 py-3 md:px-5">
                      <DeliveryStatusPill status={row.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground md:px-5">
                      {row.issue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </div>
  );
}
