import type { ReactNode } from "react";

type CustomerDetailCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function CustomerDetailCard({
  title,
  description,
  action,
  children,
  className = "",
}: CustomerDetailCardProps) {
  return (
    <article
      className={`min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5 lg:px-6">
        <div className="min-w-0">
          <h2 className="text-subheading font-semibold leading-snug text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-small text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="p-4 sm:p-5 lg:p-6">{children}</div>
    </article>
  );
}
