import type { PlatformMetrics } from "@/data/orchestrationMetrics";
import { formatPercent, getPendingBookingCount } from "@/data/orchestrationMetrics";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import AdminCard from "@/ui/AdminCard";
import AdminSectionHeader from "@/ui/AdminSectionHeader";

type BookingOutcomesProps = {
  metrics: PlatformMetrics;
  records: OrchestrationRecord[];
};

export default function BookingOutcomes({ metrics, records }: BookingOutcomesProps) {
  const total = metrics.totalDeliveries;
  const pendingCount = getPendingBookingCount(records);

  const segments = [
    {
      key: "successful",
      label: "Confirmed",
      count: metrics.successfulBookings,
      className: "bg-admin-success",
    },
    {
      key: "failed",
      label: "Failed",
      count: metrics.failedBookings,
      className: "bg-admin-danger",
    },
    ...(pendingCount > 0
      ? [
          {
            key: "pending",
            label: "Pending",
            count: pendingCount,
            className: "bg-admin-warning",
          },
        ]
      : []),
    {
      key: "cancelled",
      label: "Cancelled",
      count: metrics.cancelledDeliveries,
      className: "bg-muted-foreground/40",
    },
  ].filter((segment) => segment.count > 0);

  const pct = (count: number) =>
    total === 0 ? 0 : Math.round((count / total) * 1000) / 10;

  return (
    <section aria-labelledby="booking-outcomes-heading">
      <AdminSectionHeader
        title="Booking outcomes"
        description="Outcome distribution after orchestration selects a service."
      />

      <AdminCard className="mt-4">
        <div
          className="flex h-3 overflow-hidden rounded-pill bg-surface"
          role="img"
          aria-label={`Booking breakdown: ${metrics.successfulBookings} successful, ${metrics.failedBookings} failed, ${metrics.cancelledDeliveries} cancelled.`}
        >
          {segments.map((segment) =>
            segment.count > 0 ? (
              <div
                key={segment.key}
                className={`${segment.className} h-full transition-[width]`}
                style={{ width: `${pct(segment.count)}%` }}
              />
            ) : null,
          )}
        </div>

        <ul className="mt-6 space-y-3">
          {segments.map((segment) => (
            <li
              key={segment.key}
              className="flex items-center justify-between gap-4 text-small"
            >
              <span className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${segment.className}`}
                  aria-hidden="true"
                />
                {segment.label}
              </span>
              <span className="tabular-nums text-muted-foreground">
                {segment.count}{" "}
                <span className="text-foreground">
                  ({formatPercent(pct(segment.count))})
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-border pt-4">
          <p className="text-caption text-muted-foreground">Booking success rate</p>
          <p className="mt-1 text-subheading font-semibold text-foreground">
            {formatPercent(metrics.bookingSuccessRate)}
          </p>
          <p className="mt-1 text-caption text-muted-foreground">
            Average booking response: {metrics.averageBookingResponseTimeMs}ms
          </p>
        </div>
      </AdminCard>
    </section>
  );
}
