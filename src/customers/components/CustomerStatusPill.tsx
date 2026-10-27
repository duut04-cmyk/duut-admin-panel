import type { UserStatus } from "@/data/customerTypes";
import { customerStatusLabel } from "./utils";

const pillStyles: Record<UserStatus, { pill: string; dot: string }> = {
  ACTIVE: {
    pill: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  SUSPENDED: {
    pill: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  DELETED: {
    pill: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
};

type CustomerStatusPillProps = {
  status: UserStatus;
  className?: string;
};

export default function CustomerStatusPill({
  status,
  className = "",
}: CustomerStatusPillProps) {
  const styles = pillStyles[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded px-2.5 py-1 text-caption font-semibold ${styles.pill} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {customerStatusLabel(status)}
    </span>
  );
}
