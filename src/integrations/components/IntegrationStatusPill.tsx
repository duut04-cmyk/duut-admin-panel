import type { IntegrationStatus } from "@/data/integrationTypes";

const styles: Record<IntegrationStatus, { pill: string; dot: string }> = {
  connected: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  not_configured: { pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  degraded: { pill: "bg-red-50 text-red-700", dot: "bg-red-500" },
  coming_soon: { pill: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
};

type IntegrationStatusPillProps = {
  status: IntegrationStatus;
  label: string;
  className?: string;
};

export default function IntegrationStatusPill({
  status,
  label,
  className = "",
}: IntegrationStatusPillProps) {
  const style = styles[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded px-2.5 py-1 text-caption font-semibold ${style.pill} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}
