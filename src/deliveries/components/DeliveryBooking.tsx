import type { BookingRecord } from "@/data/orchestrationTypes";
import { formatDecisionTime } from "@/data/orchestrationMetrics";
import AdminBadge from "@/ui/AdminBadge";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import AdminStatus from "@/ui/AdminStatus";
import { bookingStatusLabel, bookingStatusVariant, formatTimestamp } from "./utils";

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

      <AdminCard
        className={`mt-4 p-5 md:p-6 ${isFailed ? "ring-1 ring-admin-danger/30" : ""}`}
      >
        {isFailed && booking.failureReason && (
          <div className="mb-4 rounded-md border border-admin-danger/20 bg-surface px-4 py-3">
            <p className="text-small font-semibold text-admin-danger">Booking failed</p>
            <p className="mt-1 text-small text-muted-foreground">
              {booking.failureReason}
            </p>
          </div>
        )}

        <dl className="space-y-3 text-small">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <dt className="shrink-0 text-muted-foreground sm:w-36">Selected service</dt>
            <dd className="font-medium">{booking.serviceName}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <dt className="shrink-0 text-muted-foreground sm:w-36">Booking status</dt>
            <dd>
              <AdminStatus
                variant={bookingStatusVariant(booking.status)}
                label={bookingStatusLabel(booking.status)}
              />
            </dd>
          </div>
          {booking.bookingId && (
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="shrink-0 text-muted-foreground sm:w-36">Booking ID</dt>
              <dd>
                <AdminBadge variant="neutral">{booking.bookingId}</AdminBadge>
              </dd>
            </div>
          )}
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <dt className="shrink-0 text-muted-foreground sm:w-36">Requested at</dt>
            <dd>{formatTimestamp(booking.requestedAt)}</dd>
          </div>
          {booking.confirmedAt && (
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="shrink-0 text-muted-foreground sm:w-36">Confirmed at</dt>
              <dd>{formatTimestamp(booking.confirmedAt)}</dd>
            </div>
          )}
          {booking.bookingResponseTimeMs !== null && (
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="shrink-0 text-muted-foreground sm:w-36">Response time</dt>
              <dd className="tabular-nums">
                {formatDecisionTime(booking.bookingResponseTimeMs)}
              </dd>
            </div>
          )}
        </dl>
      </AdminCard>
    </section>
  );
}
