"use client";

import Link from "next/link";
import { useState } from "react";
import type { CustomerDeliverySummary } from "@/data/customerTypes";
import ListPagination from "@/components/ListPagination";
import AdminEmptyState from "@/ui/AdminEmptyState";
import CustomerDeliveryStatusPill from "./CustomerDeliveryStatusPill";
import CustomerDetailCard from "./CustomerDetailCard";
import CustomerDeliveryRoute from "./CustomerDeliveryRoute";
import { formatCustomerDate } from "./utils";

const PAGE_SIZE = 10;

type CustomerDeliveryHistoryProps = {
  deliveries: CustomerDeliverySummary[];
};

const thClass =
  "px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5";

export default function CustomerDeliveryHistory({
  deliveries,
}: CustomerDeliveryHistoryProps) {
  const [page, setPage] = useState(1);
  const total = deliveries.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageDeliveries = deliveries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <CustomerDetailCard
      eyebrow="Activity"
      title="Recent deliveries"
      description="Latest delivery requests from this customer."
      flushBody
    >
      {deliveries.length === 0 ? (
        <div className="p-4 sm:p-5 lg:p-6">
          <AdminEmptyState
            title="No deliveries yet"
            description="This customer has not created any deliveries."
          />
        </div>
      ) : (
        <>
          <div className="space-y-3 p-4 md:hidden">
            {pageDeliveries.map((delivery) => (
              <Link
                key={delivery.id}
                href={`/deliveries/${delivery.reference}`}
                className="block rounded-[10px] border border-border p-4 transition-colors hover:border-foreground/20 hover:bg-surface/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">
                      {delivery.reference}
                    </p>
                    <div className="mt-2">
                      <CustomerDeliveryRoute
                        pickup={delivery.pickup}
                        drop={delivery.drop}
                      />
                    </div>
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
                <tr className="border-b border-border bg-[#FFFBF5]/60">
                  <th className={thClass}>Reference</th>
                  <th className={thClass}>Route</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Created</th>
                </tr>
              </thead>
              <tbody>
                {pageDeliveries.map((delivery) => (
                  <tr
                    key={delivery.id}
                    className="border-b border-border last:border-b-0 transition-colors hover:bg-surface/40"
                  >
                    <td className="px-4 py-3.5 md:px-5">
                      <Link
                        href={`/deliveries/${delivery.reference}`}
                        className="font-semibold text-accent hover:underline"
                      >
                        {delivery.reference}
                      </Link>
                    </td>
                    <td className="max-w-lg px-4 py-3.5 align-top md:px-5">
                      <CustomerDeliveryRoute
                        pickup={delivery.pickup}
                        drop={delivery.drop}
                      />
                    </td>
                    <td className="px-4 py-3.5 md:px-5">
                      <CustomerDeliveryStatusPill status={delivery.status} />
                    </td>
                    <td className="px-4 py-3.5 tabular-nums text-muted-foreground md:px-5">
                      {formatCustomerDate(delivery.createdAt)}
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
    </CustomerDetailCard>
  );
}
