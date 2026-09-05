import type { ReactNode } from "react";

type AdminBadgeVariant = "neutral" | "success" | "warning" | "danger" | "accent";

type AdminBadgeProps = {
  children: ReactNode;
  variant?: AdminBadgeVariant;
  className?: string;
};

const variantClasses: Record<AdminBadgeVariant, string> = {
  neutral: "bg-surface text-foreground",
  success: "bg-surface text-foreground border border-border",
  warning: "bg-surface-accent text-foreground",
  danger: "bg-surface text-foreground/80 ring-1 ring-border",
  accent: "bg-accent/10 text-accent",
};

export default function AdminBadge({
  children,
  variant = "neutral",
  className = "",
}: AdminBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-1 text-caption font-semibold ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
