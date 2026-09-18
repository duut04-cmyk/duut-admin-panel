import type { ReactNode } from "react";
import { ADMIN_PAGE_HEADER, ADMIN_SHELL_CONTENT_PADDING } from "./layout";

type AdminHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export default function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
  return (
    <header
      className={`bg-background ${ADMIN_SHELL_CONTENT_PADDING} ${ADMIN_PAGE_HEADER}`}
    >
      <div className="flex w-full items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[1.75rem] leading-8 font-bold tracking-tight text-foreground xl:text-[1.875rem] xl:leading-9">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 line-clamp-2 text-small text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center">{actions}</div>}
      </div>
    </header>
  );
}
