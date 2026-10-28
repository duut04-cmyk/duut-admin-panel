import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import DeliveryDetailCard from "./DeliveryDetailCard";
import { ProviderBookingStatusPill } from "./DeliveryStatusPill";
import { formatTimestamp } from "./utils";

type DeliveryBookingProps = {
  booking: NonNullable<DeliveryHistoryDetail["booking"]>;
};

export default function DeliveryBooking({ booking }: DeliveryBookingProps) {
  const isFailed = booking.status === "FAILED";

  return (
    <section aria-labelledby="delivery-booking-heading">
      <AdminSectionHeader
        title="Booking"
        description="Provider-side booking record. Quote is the provider amount only (excludes platform fee and GST)."
      />

      <DeliveryDetailCard
        className={`mt-4 p-4 md:p-5 ${isFailed ? "ring-1 ring-red-200" : ""}`}
      >
        <dl className="space-y-2.5 text-small">
          <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
            <dt className="shrink-0 text-muted-foreground xl:w-28">Provider</dt>
            <dd className="font-medium">
              {booking.providerCode}
              {booking.serviceCode ? ` · ${booking.serviceCode}` : ""}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
            <dt className="shrink-0 text-muted-foreground xl:w-28">Booking status</dt>
            <dd>
              <ProviderBookingStatusPill status={booking.status} />
            </dd>
          </div>
          <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
            <dt className="shrink-0 text-muted-foreground xl:w-28">Quote</dt>
            <dd className="tabular-nums font-medium">
              {booking.quote.currency} {booking.quote.amount}
            </dd>
          </div>
          {booking.bookedAt ? (
            <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
              <dt className="shrink-0 text-muted-foreground xl:w-28">Booked at</dt>
              <dd>{formatTimestamp(booking.bookedAt)}</dd>
            </div>
          ) : null}
          {booking.providerOrderId ? (
            <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
              <dt className="shrink-0 text-muted-foreground xl:w-28">Provider order</dt>
              <dd className="font-mono text-caption">{booking.providerOrderId}</dd>
            </div>
          ) : null}
        </dl>
      </DeliveryDetailCard>
    </section>
  );
}
