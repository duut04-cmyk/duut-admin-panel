import type { ReactNode } from "react";

type AdminEmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

function DefaultIcon() {
  return (
    <svg
      className="h-8 w-8 text-muted-foreground/60"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="6" y="8" width="20" height="16" rx="2" />
      <path d="M6 14h20" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminEmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: AdminEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface/30 px-6 py-12 text-center ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface">
        {icon ?? <DefaultIcon />}
      </div>
      <h3 className="text-body font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-small text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
