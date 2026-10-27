import type { DeliveryStatus } from "@/data/customerTypes";
import { deliveryStatusLabel } from "./utils";

const pillStyles: Partial<Record<DeliveryStatus, { pill: string; dot: string }>> = {
  DELIVERED: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  IN_TRANSIT: { pill: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  BOOKED: { pill: "bg-sky-50 text-sky-700", dot: "bg-sky-500" },
  FAILED: { pill: "bg-red-50 text-red-700", dot: "bg-red-500" },
  CANCELLED: { pill: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
  ORCHESTRATING: { pill: "bg-violet-50 text-violet-700", dot: "bg-violet-500" },
};

const defaultStyles = {
  pill: "bg-surface-accent text-accent",
  dot: "bg-accent",
};

type CustomerDeliveryStatusPillProps = {
  status: DeliveryStatus;
  className?: string;
};

export default function CustomerDeliveryStatusPill({
  status,
  className = "",
}: CustomerDeliveryStatusPillProps) {
  const styles = pillStyles[status] ?? defaultStyles;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded px-2.5 py-1 text-caption font-semibold ${styles.pill} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {deliveryStatusLabel(status)}
    </span>
  );
}
