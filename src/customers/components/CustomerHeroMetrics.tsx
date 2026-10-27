import type { ReactNode } from "react";
import type { CustomerDetail } from "@/data/customerTypes";
import { formatCustomerDate } from "./utils";

const CARD_CLASS = "rounded-card border border-border/60 bg-background shadow-sm";

type MetricCellProps = {
  label: string;
  children: ReactNode;
  highlight?: boolean;
};

function MetricCell({ label, children, highlight = false }: MetricCellProps) {
  return (
    <div
      className={`flex flex-col justify-center px-3 py-3 sm:px-4 sm:py-4 ${
        highlight ? "bg-orange-50/60" : ""
      }`}
    >
      <div className="min-w-0 font-semibold tabular-nums text-foreground">
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
        <div className="grid grid-cols-2 divide-border/60 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
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
