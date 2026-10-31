import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import DeliveryDetailCard from "./DeliveryDetailCard";
import { ProviderBookingStatusPill } from "./DeliveryStatusPill";
import { formatTimestamp } from "./utils";

type DeliveryBookingProps = {
  booking: NonNullable<DeliveryHistoryDetail["booking"]>;
  orchestration?: DeliveryHistoryDetail["orchestration"];
};

function shortId(value: string): string {
  if (value.length <= 16) return value;
  return `${value.slice(0, 8)}…${value.slice(-4)}`;
}

export default function DeliveryBooking({
  booking,
  orchestration,
}: DeliveryBookingProps) {
  const isFailed = booking.status === "FAILED";
  const selected = orchestration?.selectedOption;

  return (
    <section aria-labelledby="delivery-booking-heading">
      <AdminSectionHeader title="Booking" />

      <DeliveryDetailCard
        className={`mt-3 space-y-2.5 p-4 text-small ${isFailed ? "ring-1 ring-red-200" : ""}`}
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-muted-foreground">Provider</span>
          <span className="text-right font-medium">
            {booking.providerCode}
            {booking.serviceCode ? ` · ${booking.serviceCode}` : ""}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Status</span>
          <ProviderBookingStatusPill status={booking.status} />
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-muted-foreground">Provider quote</span>
          <span className="tabular-nums font-medium">
            {booking.quote.currency} {booking.quote.amount}
          </span>
        </div>
        {booking.bookedAt ? (
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-muted-foreground">Booked</span>
            <span className="font-medium">{formatTimestamp(booking.bookedAt)}</span>
          </div>
        ) : null}
        {booking.providerOrderId ? (
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-muted-foreground">Order</span>
            <span
              className="font-mono text-caption font-medium"
              title={booking.providerOrderId}
            >
              {shortId(booking.providerOrderId)}
            </span>
          </div>
        ) : null}
        {selected?.selectionReason ? (
          <p className="border-t border-border/60 pt-2.5 text-caption text-muted-foreground">
            Selected: {selected.selectionReason}
          </p>
        ) : null}
      </DeliveryDetailCard>
    </section>
  );
}
