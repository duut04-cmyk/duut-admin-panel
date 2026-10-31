"use client";

import { useState } from "react";
import type { ServicePerformance } from "@/data/orchestrationMetrics";
import { formatPercent } from "@/data/orchestrationMetrics";
import ListPagination from "@/components/ListPagination";
import AdminEmptyState from "@/ui/AdminEmptyState";

const PAGE_SIZE = 10;

type ServiceOrchestrationTableProps = {
  services: ServicePerformance[];
};

const thClass =
  "px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground md:px-5";

export default function ServiceOrchestrationTable({
  services,
}: ServiceOrchestrationTableProps) {
  const [page, setPage] = useState(1);

  if (services.length === 0) {
    return (
      <AdminEmptyState
        title="No service evaluations"
        description="Orchestration service performance will appear once deliveries are evaluated."
      />
    );
  }

  const total = services.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageServices = services.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <article className="min-w-0 overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_8px_24px_-16px_rgba(23,23,23,0.14)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-small">
          <caption className="sr-only">Service orchestration performance</caption>
          <thead>
            <tr className="border-b border-border bg-[#FFFBF5]/60">
              <th className={thClass}>Service</th>
              <th className={thClass}>Evaluated</th>
              <th className={thClass}>Available</th>
              <th className={thClass}>Selected</th>
              <th className={thClass}>Booking attempts</th>
              <th className={thClass}>Booking success</th>
              <th className={thClass}>Avg price</th>
            </tr>
          </thead>
          <tbody>
            {pageServices.map((service) => (
              <tr
                key={service.serviceId}
                className="border-b border-border last:border-b-0 transition-colors hover:bg-surface/40"
              >
                <td className="px-4 py-3.5 font-medium text-foreground md:px-5">
                  {service.serviceName}
                </td>
                <td className="px-4 py-3.5 tabular-nums md:px-5">
                  {service.timesEvaluated}
                </td>
                <td className="px-4 py-3.5 tabular-nums md:px-5">
                  {formatPercent(service.availabilityRate)}
                </td>
                <td className="px-4 py-3.5 tabular-nums md:px-5">
                  {formatPercent(service.selectionRate)}
                </td>
                <td className="px-4 py-3.5 tabular-nums md:px-5">
                  {service.bookingAttempts}
                </td>
                <td className="px-4 py-3.5 tabular-nums md:px-5">
                  {service.bookingAttempts === 0
                    ? "—"
                    : formatPercent(service.bookingSuccessRate)}
                </td>
                <td className="px-4 py-3.5 tabular-nums text-muted-foreground md:px-5">
                  {service.averagePrice != null ? `₹${service.averagePrice}` : "—"}
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
