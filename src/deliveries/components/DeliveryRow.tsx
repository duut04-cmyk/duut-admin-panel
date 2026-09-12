import Link from "next/link";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import AdminStatus from "@/ui/AdminStatus";
import DeliveryStatus from "./DeliveryStatus";
import {
  bookingStatusLabel,
  bookingStatusVariant,
  formatRoute,
  formatTimestamp,
} from "./utils";

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
        className="block rounded-lg border border-border bg-background p-4 shadow-sm transition-colors hover:border-foreground/20 hover:bg-surface/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={`Open delivery ${deliveryId}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-foreground">{deliveryId}</p>
            <p className="mt-0.5 text-small text-muted-foreground">
              {formatRoute(record)}
            </p>
          </div>
          <DeliveryStatus status={deliveryRequest.status} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-small">
          <div>
            <dt className="text-caption text-muted-foreground">Service</dt>
            <dd className="mt-0.5 font-medium">{decision.selectedServiceName}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Booking</dt>
            <dd className="mt-0.5">
              <AdminStatus
                variant={bookingStatusVariant(booking.status)}
                label={bookingStatusLabel(booking.status)}
              />
            </dd>
          </div>
        </dl>
      </Link>
    );
  }

  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="whitespace-nowrap py-3.5 pr-4">
        <Link
          href={href}
          className="font-medium text-foreground underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {deliveryId}
        </Link>
      </td>
      <td className="whitespace-nowrap py-3.5 pr-4 text-small text-muted-foreground">
        {formatRoute(record)}
      </td>
      <td className="py-3.5 pr-4 text-small">{pkg.type}</td>
      <td className="py-3.5 pr-4">
        <DeliveryStatus status={deliveryRequest.status} />
      </td>
      <td className="py-3.5 pr-4 text-small">{decision.selectedServiceName}</td>
      <td className="py-3.5 pr-4">
        <AdminStatus
          variant={bookingStatusVariant(booking.status)}
          label={bookingStatusLabel(booking.status)}
        />
      </td>
      <td className="py-3.5 text-small tabular-nums text-muted-foreground">
        {formatTimestamp(deliveryRequest.createdAt)}
      </td>
    </tr>
  );
}
