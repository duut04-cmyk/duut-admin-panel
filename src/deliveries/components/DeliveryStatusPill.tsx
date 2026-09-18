import type { BookingStatus, DeliveryRequestStatus } from "@/data/orchestrationTypes";
import { bookingStatusLabel, deliveryStatusLabel } from "./utils";

const deliveryPillStyles: Record<DeliveryRequestStatus, { pill: string; dot: string }> =
  {
    delivered: {
      pill: "bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    },
    in_transit: {
      pill: "bg-blue-50 text-blue-700",
      dot: "bg-blue-500",
    },
    booked: {
      pill: "bg-sky-50 text-sky-700",
      dot: "bg-sky-500",
    },
    failed: {
      pill: "bg-red-50 text-red-700",
      dot: "bg-red-500",
    },
    cancelled: {
      pill: "bg-slate-100 text-slate-600",
      dot: "bg-slate-400",
    },
    orchestrating: {
      pill: "bg-violet-50 text-violet-700",
      dot: "bg-violet-500",
    },
    pending_orchestration: {
      pill: "bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    },
    booking: {
      pill: "bg-sky-50 text-sky-700",
      dot: "bg-sky-500",
    },
  };

const bookingPillStyles: Record<BookingStatus, { pill: string; dot: string }> = {
  confirmed: {
    pill: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  failed: {
    pill: "bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
  pending: {
    pill: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  cancelled: {
    pill: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
};

type DeliveryStatusPillProps = {
  status: DeliveryRequestStatus;
  className?: string;
};

export function DeliveryStatusPill({
  status,
  className = "",
}: DeliveryStatusPillProps) {
  const styles = deliveryPillStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-caption font-medium ${styles.pill} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {deliveryStatusLabel(status)}
    </span>
  );
}

type BookingStatusPillProps = {
  status: BookingStatus;
  className?: string;
};

export function BookingStatusPill({ status, className = "" }: BookingStatusPillProps) {
  const styles = bookingPillStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-caption font-medium ${styles.pill} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {bookingStatusLabel(status)}
    </span>
  );
}
