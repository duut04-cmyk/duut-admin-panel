import type { DeliveryHistoryDetail } from "@/data/deliveryApiTypes";
import AdminBadge from "@/ui/AdminBadge";
import AdminSectionHeader from "@/ui/AdminSectionHeader";
import { ProviderBookingStatusPill } from "@/deliveries/components/DeliveryStatusPill";
import OrchestrationDetailCard from "./OrchestrationDetailCard";
import { formatTimestamp } from "./utils";

type OutcomeCardProps = {
  booking: DeliveryHistoryDetail["booking"];
  providerLabel: string | null;
};

export default function OutcomeCard({ booking, providerLabel }: OutcomeCardProps) {
  if (!booking) {
    return (
      <section aria-labelledby="outcome-heading" className="min-w-0">
        <AdminSectionHeader
          title="Outcome"
          description="Provider booking from delivery history."
        />
        <OrchestrationDetailCard className="mt-4 p-4 md:p-5">
          <p className="text-small text-muted-foreground">
            No booking record for this delivery yet.
          </p>
        </OrchestrationDetailCard>
      </section>
    );
  }

  const isFailed = booking.status === "FAILED";

  return (
    <section aria-labelledby="outcome-heading" className="min-w-0">
      <AdminSectionHeader
        title="Outcome"
        description="Provider booking from delivery history."
      />

      <OrchestrationDetailCard
        className={`mt-4 p-4 md:p-5 ${isFailed ? "ring-1 ring-red-200" : ""}`}
      >
        {isFailed ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-small font-semibold text-red-700">Booking failed</p>
          </div>
        ) : null}

        <dl className="space-y-2.5 text-small">
          <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
            <dt className="shrink-0 text-muted-foreground xl:w-28">Provider</dt>
            <dd className="font-medium">
              {providerLabel ??
                `${booking.providerCode}${booking.serviceCode ? ` · ${booking.serviceCode}` : ""}`}
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
          {booking.providerOrderId ? (
            <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
              <dt className="shrink-0 text-muted-foreground xl:w-28">Provider order</dt>
              <dd>
                <AdminBadge variant="neutral">{booking.providerOrderId}</AdminBadge>
              </dd>
            </div>
          ) : null}
          {booking.bookedAt ? (
            <div className="flex flex-col gap-0.5 xl:flex-row xl:gap-3">
              <dt className="shrink-0 text-muted-foreground xl:w-28">Booked at</dt>
              <dd>{formatTimestamp(booking.bookedAt)}</dd>
            </div>
          ) : null}
        </dl>
      </OrchestrationDetailCard>
    </section>
  );
}
