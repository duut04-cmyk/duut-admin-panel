import type { ReactNode } from "react";

type AdminCardProps = {
  children: ReactNode;
  title?: string;
  className?: string;
};

export default function AdminCard({
  children,
  title,
  className = "",
}: AdminCardProps) {
  return (
    <section
      className={`rounded-lg border border-border bg-background p-5 shadow-sm ${className}`}
    >
      {title && (
        <h2 className="mb-4 text-body font-semibold text-foreground">{title}</h2>
      )}
      {children}
    </section>
  );
}
