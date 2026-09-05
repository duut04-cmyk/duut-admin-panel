import type { ReactNode } from "react";

type AdminChartCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function AdminChartCard({
  title,
  description,
  action,
  children,
  className = "",
}: AdminChartCardProps) {
  return (
    <section
      className={`rounded-lg border border-border bg-background p-5 shadow-sm md:p-6 ${className}`}
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-body font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="mt-1 text-small text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
