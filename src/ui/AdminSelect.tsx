import type { ReactNode, SelectHTMLAttributes } from "react";

type AdminSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  children: ReactNode;
};

const selectClasses =
  "h-10 w-full min-w-0 cursor-pointer appearance-none rounded-md border border-border bg-background px-3 pr-9 text-small text-foreground transition-colors hover:border-foreground/25 focus:border-foreground focus:ring-1 focus:ring-foreground/10 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60";

export default function AdminSelect({
  label,
  id,
  children,
  className = "",
  ...props
}: AdminSelectProps) {
  const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={`relative min-w-0 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-caption font-medium text-muted-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select id={selectId} className={selectClasses} {...props}>
          {children}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="h-4 w-4 text-muted-foreground"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
