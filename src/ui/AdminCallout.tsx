import type { ReactNode } from "react";

type AdminCalloutVariant = "neutral" | "accent" | "success" | "warning";

type AdminCalloutProps = {
  variant?: AdminCalloutVariant;
  title?: string;
  children: ReactNode;
  className?: string;
};

const variantClasses: Record<AdminCalloutVariant, string> = {
  neutral: "border-border bg-surface/60",
  accent: "border-accent/20 bg-surface-accent",
  success: "border-admin-success/20 bg-surface",
  warning: "border-admin-warning/25 bg-surface-accent/50",
};

export default function AdminCallout({
  variant = "neutral",
  title,
  children,
  className = "",
}: AdminCalloutProps) {
  return (
    <aside
      className={`rounded-lg border px-4 py-3.5 md:px-5 md:py-4 ${variantClasses[variant]} ${className}`}
    >
      {title && (
        <p className="text-small font-semibold text-foreground">{title}</p>
      )}
      <div
        className={`text-small text-muted-foreground ${title ? "mt-1" : ""}`}
      >
        {children}
      </div>
    </aside>
  );
}
