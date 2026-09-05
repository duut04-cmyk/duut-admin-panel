import type { ReactNode } from "react";
import { ADMIN_SHELL_CONTENT_PADDING, ADMIN_SHELL_HEADER } from "./layout";
import AdminIconButton, { MenuIcon } from "./AdminIconButton";

type AdminHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  onMenuClick?: () => void;
};

export default function AdminHeader({
  title,
  subtitle,
  actions,
  onMenuClick,
}: AdminHeaderProps) {
  return (
    <header className={`bg-background ${ADMIN_SHELL_CONTENT_PADDING} ${ADMIN_SHELL_HEADER}`}>
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {onMenuClick && (
            <AdminIconButton
              icon={<MenuIcon />}
              label="Open navigation menu"
              className="shrink-0 lg:hidden"
              onClick={onMenuClick}
            />
          )}
          <div className="min-w-0">
            <h1 className="text-subheading font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 line-clamp-2 text-small text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 items-center">{actions}</div>
        )}
      </div>
    </header>
  );
}
