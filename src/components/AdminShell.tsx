"use client";

import { useState, type ReactNode } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

type AdminShellProps = {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  customHeader?: (props: { onMenuClick: () => void }) => ReactNode;
  mainClassName?: string;
};

export default function AdminShell({
  title = "",
  subtitle,
  actions,
  children,
  customHeader,
  mainClassName = "",
}: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const onMenuClick = () => setSidebarOpen(true);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-surface/40">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col bg-background">
        {customHeader ? (
          customHeader({ onMenuClick })
        ) : (
          <AdminHeader
            title={title}
            subtitle={subtitle}
            actions={actions}
            onMenuClick={onMenuClick}
          />
        )}
        <main className={`flex-1 bg-background ${mainClassName}`}>{children}</main>
      </div>
    </div>
  );
}
