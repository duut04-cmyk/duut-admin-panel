import type { ReactNode } from "react";

type AdminSectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export default function AdminSectionHeader({
  title,
  description,
  action,
  className = "",
}: AdminSectionHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${className}`}
    >
      <div className="min-w-0">
        <h2 className="text-body font-semibold text-foreground md:text-subheading md:font-semibold">
          {title}
        </h2>
        {description && (
          <p className="mt-1 max-w-2xl text-small text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex shrink-0 items-center">{action}</div>
      )}
    </div>
  );
}
