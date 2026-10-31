import type { ReactNode } from "react";

type CustomerDetailCardProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** When true, children are flush (no inner padding) — useful for tables. */
  flushBody?: boolean;
};

export default function CustomerDetailCard({
  title,
  description,
  eyebrow,
  action,
  children,
  className = "",
  flushBody = false,
}: CustomerDetailCardProps) {
  return (
    <article
      className={`min-w-0 overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_8px_24px_-16px_rgba(23,23,23,0.14)] ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5 lg:px-6">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-accent">
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={`text-body-lg font-bold tracking-tight text-foreground ${eyebrow ? "mt-0.5" : ""}`}
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-small text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={flushBody ? undefined : "p-4 sm:p-5 lg:p-6"}>{children}</div>
    </article>
  );
}
