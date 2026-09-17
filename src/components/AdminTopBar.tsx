"use client";

import AdminGlobalSearch from "./AdminGlobalSearch";
import AdminIconButton, { MenuIcon } from "./AdminIconButton";
import AdminNotificationsButton from "./AdminNotificationsButton";
import AdminUserMenu from "./AdminUserMenu";
import {
  ADMIN_SHELL_CONTENT_PADDING,
  ADMIN_SHELL_SIDEBAR_DRAWER_CHROME_HIDDEN,
} from "./layout";

type AdminTopBarProps = {
  onMenuClick?: () => void;
};

export default function AdminTopBar({ onMenuClick }: AdminTopBarProps) {
  return (
    <header className="sticky top-0 z-30 shrink-0 bg-background">
      <div
        className={`flex items-center gap-3 pb-3.5 pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}
      >
        {onMenuClick && (
          <AdminIconButton
            icon={<MenuIcon />}
            label="Open navigation menu"
            className={`shrink-0 ${ADMIN_SHELL_SIDEBAR_DRAWER_CHROME_HIDDEN}`}
            onClick={onMenuClick}
          />
        )}
        <div className="min-w-0 flex-1">
          <AdminGlobalSearch />
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <AdminNotificationsButton hasUnread />
          <AdminUserMenu />
        </div>
      </div>
    </header>
  );
}
