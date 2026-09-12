import type { ReactNode } from "react";
import AdminTrend from "./AdminTrend";

type AdminMetricCardProps = {
  label: string;
  value: ReactNode;
  supportingText?: string;
  trend?: {
    value: string;
    direction: "positive" | "negative" | "neutral";
  };
  className?: string;
};

export default function AdminMetricCard({
  label,
  value,
  supportingText,
  trend,
  className = "",
}: AdminMetricCardProps) {
  return (
    <article
      className={`rounded-lg border border-border bg-background p-5 shadow-sm md:p-6 ${className}`}
    >
      <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-[2rem]">
        {value}
      </p>
      {(supportingText || trend) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          {trend && <AdminTrend value={trend.value} direction={trend.direction} />}
          {supportingText && (
            <span className="text-caption text-muted-foreground">{supportingText}</span>
          )}
        </div>
      )}
    </article>
  );
}
