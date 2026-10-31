import type { ReactNode } from "react";

type ReportsSectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function ReportsSection({
  id,
  eyebrow,
  title,
  description,
  action,
  children,
  className = "",
}: ReportsSectionProps) {
  return (
    <section aria-labelledby={id} className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-accent">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={id}
            className={`text-body-lg font-bold tracking-tight text-foreground ${eyebrow ? "mt-0.5" : ""}`}
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 max-w-3xl text-small text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
