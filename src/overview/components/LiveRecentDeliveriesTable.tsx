"use client";

import Link from "next/link";
import type { RecentDeliveryItem } from "@/data/reportingTypes";

type LiveRecentDeliveriesTableProps = {
  items: RecentDeliveryItem[];
};

export default function LiveRecentDeliveriesTable({
  items,
}: LiveRecentDeliveriesTableProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <h3 className="mb-3 text-small font-semibold text-foreground">
        Recent deliveries
      </h3>
      {items.length === 0 ? (
        <p className="text-small text-muted-foreground">
          No deliveries in this period.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-small">
            <thead>
              <tr className="text-caption text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Reference</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 pr-4 font-medium">Package</th>
                <th className="pb-2 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.deliveryId} className="border-t border-border">
                  <td className="py-2 pr-4">
                    <Link
                      href={`/deliveries/${item.deliveryId}`}
                      className="font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      {item.reference}
                    </Link>
                    {item.routeLabel ? (
                      <p className="text-caption text-muted-foreground">
                        {item.routeLabel}
                      </p>
                    ) : null}
                  </td>
                  <td className="py-2 pr-4">{item.status}</td>
                  <td className="py-2 pr-4">{item.packageType ?? "—"}</td>
                  <td className="py-2">{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
