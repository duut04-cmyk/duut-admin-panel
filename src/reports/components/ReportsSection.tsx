import type { ReactNode } from "react";

type ReportsSectionProps = {
  id: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function ReportsSection({
  id,
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
          <h2
            id={id}
            className="text-subheading font-semibold leading-snug text-foreground"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-small text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
