"use client";

import { useState, type ReactNode } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import {
  ADMIN_SHELL_CONTENT_PADDING,
  ADMIN_SHELL_MAIN_OFFSET,
} from "./layout";

type AdminShellProps = {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  customHeader?: ReactNode;
  mainClassName?: string;
  rightRail?: ReactNode;
  hideTopBar?: boolean;
};

export default function AdminShell({
  title = "",
  subtitle,
  actions,
  children,
  customHeader,
  mainClassName = "",
  rightRail,
  hideTopBar = false,
}: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const onMenuClick = () => setSidebarOpen(true);

  const showPageHeader = !customHeader && (title || subtitle || actions);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div
        className={`flex min-h-screen min-w-0 flex-col ${ADMIN_SHELL_MAIN_OFFSET}`}
      >
        {!hideTopBar && <AdminTopBar onMenuClick={onMenuClick} />}
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            {customHeader}
            {showPageHeader && (
              <AdminHeader
                title={title}
                subtitle={subtitle}
                actions={actions}
              />
            )}
            <main className={`flex-1 bg-background ${mainClassName}`}>
              {children}
            </main>
          </div>
          {rightRail && (
            <aside
              className={`hidden shrink-0 border-l border-border bg-background xl:block xl:w-[300px] ${ADMIN_SHELL_CONTENT_PADDING} py-6`}
            >
              {rightRail}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
