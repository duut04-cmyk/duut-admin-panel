import type { DeliveryEvent } from "@/data/orchestrationTypes";

type TimelineEventVariant = "success" | "failed" | "active" | "pending" | "cancelled";

const variantStyles: Record<TimelineEventVariant, { pill: string; dot: string }> = {
  success: {
    pill: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  active: {
    pill: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  pending: {
    pill: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
  failed: {
    pill: "bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
  cancelled: {
    pill: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
};

function eventVariant(type: DeliveryEvent["type"]): TimelineEventVariant {
  switch (type) {
    case "delivered":
    case "booking_confirmed":
      return "success";
    case "failed":
      return "failed";
    case "cancelled":
      return "cancelled";
    case "in_transit":
    case "picked_up":
    case "driver_assigned":
      return "active";
    default:
      return "pending";
  }
}

type TimelineEventPillProps = {
  eventType: DeliveryEvent["type"];
  className?: string;
};

export default function TimelineEventPill({
  eventType,
  className = "",
}: TimelineEventPillProps) {
  const variant = eventVariant(eventType);
  const styles = variantStyles[variant];
  const label = eventType.replace(/_/g, " ");

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-caption font-medium capitalize ${styles.pill} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}
