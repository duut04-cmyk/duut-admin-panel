import type { ReactNode } from "react";

type AdminFilterProps = {
  label: string;
  active?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function AdminFilter({
  label,
  active = false,
  icon,
  onClick,
  className = "",
}: AdminFilterProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-control border px-3 py-2 text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        active
          ? "border-accent/30 bg-surface-accent text-foreground"
          : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
      } ${className}`}
    >
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      {label}
    </button>
  );
}
