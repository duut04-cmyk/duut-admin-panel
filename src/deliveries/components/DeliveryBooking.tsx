import type { BookingRecord } from "@/data/orchestrationTypes";
import { formatDecisionTime } from "@/data/orchestrationMetrics";
import AdminBadge from "@/ui/AdminBadge";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import { BookingStatusPill } from "./DeliveryStatusPill";
import DeliveryDetailCard from "./DeliveryDetailCard";
import { formatTimestamp } from "./utils";

type DeliveryBookingProps = {
  booking: BookingRecord;
};

export default function DeliveryBooking({ booking }: DeliveryBookingProps) {
  const isFailed = booking.status === "failed";

  return (
    <section aria-labelledby="delivery-booking-heading">
      <AdminSectionHeader
        title="Booking"
        description="Service booking outcome after orchestration."
      />

      <DeliveryDetailCard
        className={`mt-4 p-4 md:p-5 ${isFailed ? "ring-1 ring-red-200" : ""}`}
      >
        {isFailed && booking.failureReason && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-small font-semibold text-red-700">Booking failed</p>
            <p className="mt-1 text-small text-red-600/90">{booking.failureReason}</p>
          </div>
        )}

        <dl className="space-y-2.5 text-small">
          <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
            <dt className="shrink-0 text-muted-foreground xl:w-28">Selected service</dt>
            <dd className="font-medium">{booking.serviceName}</dd>
          </div>
          <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
            <dt className="shrink-0 text-muted-foreground xl:w-28">Booking status</dt>
            <dd>
              <BookingStatusPill status={booking.status} />
            </dd>
          </div>
          {booking.bookingId && (
            <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
              <dt className="shrink-0 text-muted-foreground xl:w-28">Booking ID</dt>
              <dd>
                <AdminBadge variant="neutral">{booking.bookingId}</AdminBadge>
              </dd>
            </div>
          )}
          <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
            <dt className="shrink-0 text-muted-foreground xl:w-28">Requested at</dt>
            <dd>{formatTimestamp(booking.requestedAt)}</dd>
          </div>
          {booking.confirmedAt && (
            <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
              <dt className="shrink-0 text-muted-foreground xl:w-28">Confirmed at</dt>
              <dd>{formatTimestamp(booking.confirmedAt)}</dd>
            </div>
          )}
          {booking.bookingResponseTimeMs !== null && (
            <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
              <dt className="shrink-0 text-muted-foreground xl:w-28">Response time</dt>
              <dd className="tabular-nums">
                {formatDecisionTime(booking.bookingResponseTimeMs)}
              </dd>
            </div>
          )}
        </dl>
      </DeliveryDetailCard>
    </section>
  );
}
