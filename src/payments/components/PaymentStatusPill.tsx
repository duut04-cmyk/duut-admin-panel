type PaymentStatusPillProps = {
  status: string;
};

function pillStyles(status: string): { label: string; className: string } {
  const normalized = status.trim().toUpperCase();
  switch (normalized) {
    case "PAID":
      return {
        label: "Paid",
        className: "bg-emerald-50 text-emerald-700",
      };
    case "REFUNDED":
      return {
        label: "Refunded",
        className: "bg-sky-50 text-sky-700",
      };
    case "PARTIALLY_REFUNDED":
      return {
        label: "Partially Refunded",
        className: "bg-sky-50 text-sky-700",
      };
    case "PENDING":
    case "CREATED":
      return {
        label: normalized === "CREATED" ? "Created" : "Pending",
        className: "bg-amber-50 text-amber-800",
      };
    case "FAILED":
    case "EXPIRED":
      return {
        label: normalized === "EXPIRED" ? "Expired" : "Failed",
        className: "bg-red-50 text-red-700",
      };
    default:
      return {
        label: status.replaceAll("_", " "),
        className: "bg-slate-50 text-slate-700",
      };
  }
}

export default function PaymentStatusPill({ status }: PaymentStatusPillProps) {
  const { label, className } = pillStyles(status);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
