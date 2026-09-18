import type { ReactNode } from "react";

type CustomerDetailCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function CustomerDetailCard({
  title,
  description,
  children,
  className = "",
}: CustomerDetailCardProps) {
  return (
    <article
      className={`min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm ${className}`}
    >
      <div className="border-b border-border px-4 py-4 sm:px-5 lg:px-6">
        <h2 className="text-subheading font-semibold leading-snug text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-small text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="p-4 sm:p-5 lg:p-6">{children}</div>
    </article>
  );
}
