type AdminProgressTone = "default" | "success" | "warning" | "danger";

type AdminProgressProps = {
  value: number;
  label?: string;
  tone?: AdminProgressTone;
  showValue?: boolean;
  className?: string;
};

const toneClasses: Record<AdminProgressTone, string> = {
  default: "bg-accent",
  success: "bg-admin-success",
  warning: "bg-admin-warning",
  danger: "bg-admin-danger",
};

export default function AdminProgress({
  value,
  label,
  tone = "default",
  showValue = true,
  className = "",
}: AdminProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const displayValue = `${clamped.toFixed(clamped % 1 === 0 ? 0 : 1)}%`;

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between gap-3 text-small">
          {label && <span className="font-medium text-foreground">{label}</span>}
          {showValue && (
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {displayValue}
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? `Progress ${displayValue}`}
        className="h-2 overflow-hidden rounded-pill bg-surface"
      >
        <div
          className={`h-full rounded-pill transition-[width] duration-300 ease-out ${toneClasses[tone]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
