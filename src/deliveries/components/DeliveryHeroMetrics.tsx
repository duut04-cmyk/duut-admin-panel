import type { ReactNode } from "react";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import ServiceLogo from "@/components/ServiceLogo";
import { BookingStatusPill, DeliveryStatusPill } from "./DeliveryStatusPill";
import DeliveryDetailCard from "./DeliveryDetailCard";
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
      className={`flex flex-col justify-center px-3 py-3 sm:px-4 sm:py-4 ${
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
  record: OrchestrationRecord;
};

export default function DeliveryHeroMetrics({ record }: DeliveryHeroMetricsProps) {
  const { deliveryRequest, decision, booking } = record;
  const { requirements } = deliveryRequest;
  const deliveryType =
    requirements.deliveryType.charAt(0).toUpperCase() +
    requirements.deliveryType.slice(1);

  return (
    <section aria-labelledby="delivery-hero-metrics-heading">
      <h2 id="delivery-hero-metrics-heading" className="sr-only">
        Delivery at a glance
      </h2>

      <DeliveryDetailCard className="overflow-hidden">
        <div className="grid grid-cols-2 divide-border/60 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
          <MetricCell label="Status">
            <DeliveryStatusPill status={deliveryRequest.status} />
          </MetricCell>
          <MetricCell
            label="Selected service"
            highlight
            className="lg:border-l lg:border-border/60"
          >
            <span className="flex min-w-0 items-center gap-2">
              <ServiceLogo
                serviceName={decision.selectedServiceName}
                className="h-6 w-6 shrink-0"
              />
              <span className="truncate">{decision.selectedServiceName}</span>
            </span>
          </MetricCell>
          <MetricCell
            label="Booking"
            className="border-t border-border/60 sm:border-t-0 sm:border-l sm:border-border/60 lg:border-l lg:border-border/60"
          >
            <BookingStatusPill status={booking.status} />
          </MetricCell>
          <MetricCell
            label="Delivery type"
            className="border-t border-border/60 sm:border-t-0 lg:border-l lg:border-border/60"
          >
            {deliveryType}
          </MetricCell>
          <MetricCell
            label="Requested timing"
            className="col-span-2 border-t border-border/60 sm:col-span-1 sm:border-l sm:border-border/60 lg:border-l lg:border-border/60"
          >
            <span className="text-small font-semibold">
              {formatTimestamp(requirements.requestedTime)}
            </span>
          </MetricCell>
          <MetricCell
            label="Created"
            className="col-span-2 border-t border-border/60 sm:col-span-1 lg:col-span-1 lg:border-l lg:border-border/60"
          >
            <span className="text-small font-semibold">
              {formatTimestamp(deliveryRequest.createdAt)}
            </span>
          </MetricCell>
        </div>
      </DeliveryDetailCard>
    </section>
  );
}
