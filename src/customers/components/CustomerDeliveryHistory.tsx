"use client";

import Link from "next/link";
import type { CustomerDeliverySummary } from "@/data/customerTypes";
import AdminEmptyState from "@/ui/AdminEmptyState";
import CustomerDeliveryStatusPill from "./CustomerDeliveryStatusPill";
import CustomerDetailCard from "./CustomerDetailCard";
import { formatCustomerDate, formatRoute } from "./utils";

type CustomerDeliveryHistoryProps = {
  deliveries: CustomerDeliverySummary[];
};

export default function CustomerDeliveryHistory({
  deliveries,
}: CustomerDeliveryHistoryProps) {
  return (
    <CustomerDetailCard
      title="Recent deliveries"
      description="Latest delivery requests from this customer."
    >
      {deliveries.length === 0 ? (
        <AdminEmptyState
          title="No deliveries yet"
          description="This customer has not created any deliveries."
        />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {deliveries.map((delivery) => (
              <Link
                key={delivery.id}
                href={`/deliveries/${delivery.reference}`}
                className="block rounded-card border border-border/60 p-4 transition-colors hover:border-foreground/20 hover:bg-surface/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">
                      {delivery.reference}
                    </p>
                    <p className="mt-0.5 text-small text-muted-foreground">
                      {formatRoute(delivery.pickup, delivery.drop)}
                    </p>
                  </div>
                  <CustomerDeliveryStatusPill status={delivery.status} />
                </div>
                <p className="mt-2 text-caption text-muted-foreground">
                  {formatCustomerDate(delivery.createdAt)}
                </p>
              </Link>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] text-left text-small">
              <caption className="sr-only">Customer delivery history</caption>
              <thead>
                <tr className="border-b border-border">
                  <th className="px-2 py-2 text-caption font-semibold text-muted-foreground">
                    Reference
                  </th>
                  <th className="px-2 py-2 text-caption font-semibold text-muted-foreground">
                    Route
                  </th>
                  <th className="px-2 py-2 text-caption font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="px-2 py-2 text-caption font-semibold text-muted-foreground">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery) => (
                  <tr
                    key={delivery.id}
                    className="border-b border-border/60 last:border-b-0"
                  >
                    <td className="px-2 py-3">
                      <Link
                        href={`/deliveries/${delivery.reference}`}
                        className="font-medium text-accent hover:underline"
                      >
                        {delivery.reference}
                      </Link>
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {formatRoute(delivery.pickup, delivery.drop)}
                    </td>
                    <td className="px-2 py-3">
                      <CustomerDeliveryStatusPill status={delivery.status} />
                    </td>
                    <td className="px-2 py-3 tabular-nums text-muted-foreground">
                      {formatCustomerDate(delivery.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </CustomerDetailCard>
  );
}
