import Link from "next/link";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import ServiceLogo from "@/components/ServiceLogo";
import DeliveryStatus from "./DeliveryStatus";
import { BookingStatusPill } from "./DeliveryStatusPill";
import { formatRoute, formatTimestamp } from "./utils";

type DeliveryRowProps = {
  record: OrchestrationRecord;
  variant?: "table" | "card";
};

export default function DeliveryRow({ record, variant = "table" }: DeliveryRowProps) {
  const { deliveryRequest, decision, booking } = record;
  const deliveryId = deliveryRequest.deliveryId;
  const href = `/deliveries/${deliveryId}`;
  const { package: pkg } = deliveryRequest;

  if (variant === "card") {
    return (
      <Link
        href={href}
        className="block rounded-card border border-border/60 bg-background p-4 shadow-sm transition-colors hover:border-foreground/20 hover:bg-surface/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={`Open delivery ${deliveryId}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{deliveryId}</p>
            <p className="mt-0.5 text-small text-muted-foreground">
              {formatRoute(record)}
            </p>
          </div>
          <DeliveryStatus status={deliveryRequest.status} />
        </div>

        <dl className="mt-4 flex items-start justify-between gap-4 text-small">
          <div className="min-w-0">
            <dt className="text-caption text-muted-foreground">Service</dt>
            <dd className="mt-0.5 flex min-w-0 items-center gap-2 font-medium text-foreground">
              <ServiceLogo
                serviceName={decision.selectedServiceName}
                className="h-7 w-7"
              />
              <span className="truncate">{decision.selectedServiceName}</span>
            </dd>
          </div>
          <div className="shrink-0 text-right">
            <dt className="text-caption text-muted-foreground">Booking</dt>
            <dd className="mt-0.5 flex justify-end">
              <BookingStatusPill status={booking.status} />
            </dd>
          </div>
        </dl>
      </Link>
    );
  }

  return (
    <tr className="border-b border-border last:border-b-0 transition-colors hover:bg-surface/30">
      <td className="whitespace-nowrap px-4 py-3.5 md:px-5">
        <Link
          href={href}
          className="font-semibold text-foreground hover:text-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
        >
          {deliveryId}
        </Link>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-small text-muted-foreground md:px-5">
        {formatRoute(record)}
      </td>
      <td className="px-4 py-3.5 text-small text-foreground md:px-5">{pkg.type}</td>
      <td className="px-4 py-3.5 md:px-5">
        <DeliveryStatus status={deliveryRequest.status} />
      </td>
      <td className="px-4 py-3.5 md:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <ServiceLogo serviceName={decision.selectedServiceName} />
          <span className="truncate text-small text-foreground">
            {decision.selectedServiceName}
          </span>
        </div>
      </td>
      <td className="px-4 py-3.5 md:px-5">
        <BookingStatusPill status={booking.status} />
      </td>
      <td className="px-4 py-3.5 text-small tabular-nums text-muted-foreground md:px-5">
        {formatTimestamp(deliveryRequest.createdAt)}
      </td>
    </tr>
  );
}
