type AdminStatusVariant =
  "operational" | "active" | "pending" | "success" | "failed" | "cancelled" | "warning";

type AdminStatusProps = {
  variant: AdminStatusVariant;
  label: string;
  className?: string;
};

const dotClasses: Record<AdminStatusVariant, string> = {
  operational: "bg-admin-success",
  active: "bg-accent",
  pending: "bg-muted-foreground/50",
  success: "bg-admin-success",
  failed: "bg-admin-danger",
  cancelled: "bg-muted-foreground/40",
  warning: "bg-admin-warning",
};

export default function AdminStatus({
  variant,
  label,
  className = "",
}: AdminStatusProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-small text-foreground ${className}`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${dotClasses[variant]}`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
}
