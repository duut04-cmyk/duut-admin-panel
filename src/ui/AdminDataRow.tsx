import type { ReactNode } from "react";

type AdminDataRowProps = {
  leading?: ReactNode;
  primary: ReactNode;
  secondary?: ReactNode;
  metadata?: ReactNode;
  status?: ReactNode;
  trailing?: ReactNode;
  className?: string;
};

export default function AdminDataRow({
  leading,
  primary,
  secondary,
  metadata,
  status,
  trailing,
  className = "",
}: AdminDataRowProps) {
  return (
    <div
      className={`flex flex-col gap-3 border-b border-border py-4 last:border-b-0 sm:flex-row sm:items-center sm:gap-4 ${className}`}
    >
      {leading && <div className="shrink-0">{leading}</div>}

      <div className="min-w-0 flex-1">
        <div className="text-small font-semibold text-foreground">{primary}</div>
        {secondary && (
          <div className="mt-0.5 text-small text-muted-foreground">
            {secondary}
          </div>
        )}
      </div>

      {metadata && (
        <div className="shrink-0 text-caption text-muted-foreground sm:text-right">
          {metadata}
        </div>
      )}

      {status && <div className="shrink-0">{status}</div>}

      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}
