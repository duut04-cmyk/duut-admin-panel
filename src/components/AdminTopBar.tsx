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
        className={`flex flex-col gap-3 pb-0 pt-5 xl:flex-row xl:items-center xl:pb-2 ${ADMIN_SHELL_CONTENT_PADDING}`}
      >
        <div className="flex w-full items-center gap-3">
          {onMenuClick && (
            <AdminIconButton
              icon={<MenuIcon />}
              label="Open navigation menu"
              className={`shrink-0 rounded-[4px] border border-border bg-background ${ADMIN_SHELL_SIDEBAR_DRAWER_CHROME_HIDDEN}`}
              onClick={onMenuClick}
            />
          )}
          <div className="hidden min-w-0 flex-1 xl:block">
            <AdminGlobalSearch />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <AdminNotificationsButton hasUnread />
            <AdminUserMenu />
          </div>
        </div>
        <div className="w-full xl:hidden">
          <AdminGlobalSearch className="max-w-none" />
        </div>
      </div>
    </header>
  );
}
