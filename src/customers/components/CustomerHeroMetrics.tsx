import type { ReactNode } from "react";
import type { CustomerDetail } from "@/data/customerTypes";
import { formatCustomerDate } from "./utils";

const CARD_CLASS =
  "rounded-[10px] border border-border bg-white shadow-[0_8px_24px_-16px_rgba(23,23,23,0.14)]";

type MetricCellProps = {
  label: string;
  children: ReactNode;
  highlight?: boolean;
};

function MetricCell({ label, children, highlight = false }: MetricCellProps) {
  return (
    <div
      className={`flex flex-col justify-center px-3 py-3 sm:px-4 sm:py-4 ${
        highlight ? "bg-[#FFF8F1]" : ""
      }`}
    >
      <div className="min-w-0 text-body font-bold tabular-nums tracking-tight text-foreground">
        {children}
      </div>
      <p className="mt-1 text-caption text-muted-foreground">{label}</p>
    </div>
  );
}

type CustomerHeroMetricsProps = {
  customer: CustomerDetail;
};

export default function CustomerHeroMetrics({ customer }: CustomerHeroMetricsProps) {
  const { stats } = customer;

  return (
    <section aria-labelledby="customer-hero-metrics-heading">
      <h2 id="customer-hero-metrics-heading" className="sr-only">
        Customer at a glance
      </h2>

      <div className={`overflow-hidden ${CARD_CLASS}`}>
        <div className="grid grid-cols-2 divide-y divide-border sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-6 lg:divide-x lg:divide-border">
          <MetricCell label="Total deliveries" highlight>
            {stats.totalDeliveries}
          </MetricCell>
          <MetricCell label="Active">{stats.activeDeliveries}</MetricCell>
          <MetricCell label="Completed">{stats.completedDeliveries}</MetricCell>
          <MetricCell label="Failed">{stats.failedDeliveries}</MetricCell>
          <MetricCell label="Cancelled">{stats.cancelledDeliveries}</MetricCell>
          <MetricCell label="Last delivery">
            {formatCustomerDate(stats.lastDeliveryAt)}
          </MetricCell>
        </div>
      </div>
    </section>
  );
}
