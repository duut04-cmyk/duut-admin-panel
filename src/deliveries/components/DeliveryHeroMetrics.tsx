import type { ReactNode } from "react";
import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";
import DeliveryDetailCard from "./DeliveryDetailCard";
import { ProviderBookingStatusPill } from "./DeliveryStatusPill";
import { formatTimestamp } from "./utils";

type MetricCellProps = {
  label: string;
  children: ReactNode;
  highlight?: boolean;
  className?: string;
};

function MetricCell({
  label,
  children,
  highlight = false,
  className = "",
}: MetricCellProps) {
  return (
    <div
      className={`flex flex-col justify-center px-3 py-3 sm:px-4 sm:py-3.5 ${
        highlight ? "bg-orange-50/60" : ""
      } ${className}`}
    >
      <div className="min-w-0 font-semibold tabular-nums text-foreground">
        {children}
      </div>
      <p className="mt-1 text-caption text-muted-foreground">{label}</p>
    </div>
  );
}

type DeliveryHeroMetricsProps = {
  history: DeliveryHistoryDetail;
};

export default function DeliveryHeroMetrics({ history }: DeliveryHeroMetricsProps) {
  const { delivery, schedule, booking, orchestration, payment } = history;
  const providerLabel =
    booking?.providerCode ?? orchestration?.selectedOption?.providerCode ?? "—";

  return (
    <section aria-labelledby="delivery-hero-metrics-heading">
      <h2 id="delivery-hero-metrics-heading" className="sr-only">
        Delivery at a glance
      </h2>

      <DeliveryDetailCard className="overflow-hidden">
        <div className="grid grid-cols-2 divide-border/60 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          <MetricCell label="Provider" highlight>
            <span className="truncate text-small font-semibold">{providerLabel}</span>
          </MetricCell>
          <MetricCell label="Booking" className="lg:border-l lg:border-border/60">
            {booking ? (
              <ProviderBookingStatusPill status={booking.status} />
            ) : (
              <span className="text-small text-muted-foreground">No booking</span>
            )}
          </MetricCell>
          <MetricCell
            label="Schedule"
            className="border-t border-border/60 sm:border-t-0 sm:border-l sm:border-border/60"
          >
            <span className="text-small font-semibold">{schedule.mode}</span>
          </MetricCell>
          <MetricCell
            label="Created"
            className="border-t border-border/60 sm:border-t-0 lg:border-l lg:border-border/60"
          >
            <span className="text-small font-semibold">
              {formatTimestamp(delivery.createdAt)}
            </span>
          </MetricCell>
          <MetricCell
            label="Amount"
            className="col-span-2 border-t border-border/60 sm:col-span-1 lg:col-span-1 lg:border-l lg:border-border/60"
          >
            {payment ? (
              <span className="text-small font-semibold">
                {payment.currency} {payment.amount.toFixed(2)}
              </span>
            ) : (
              <span className="text-small text-muted-foreground">—</span>
            )}
          </MetricCell>
        </div>
      </DeliveryDetailCard>
    </section>
  );
}
