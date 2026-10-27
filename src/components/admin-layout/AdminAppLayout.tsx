"use client";

import { useState, type ReactNode } from "react";
import { AdminSessionProvider } from "@/components/AdminSessionProvider";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopBar from "@/components/AdminTopBar";
import {
  ADMIN_SHELL_CONTENT_PADDING,
  ADMIN_SHELL_MAIN_OFFSET,
} from "@/components/layout";
import { AdminPageConfigProvider, useAdminPageConfig } from "./AdminPageConfigContext";

function AdminAppChrome({ children }: { children: ReactNode }) {
  const { config } = useAdminPageConfig();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const onMenuClick = () => setSidebarOpen(true);

  const showPageHeader =
    !config.customHeader && (config.title || config.subtitle || config.actions);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`flex min-h-screen min-w-0 flex-col ${ADMIN_SHELL_MAIN_OFFSET}`}>
        {!config.hideTopBar && <AdminTopBar onMenuClick={onMenuClick} />}
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            {config.customHeader}
            {showPageHeader && (
              <AdminHeader
                title={config.title ?? ""}
                subtitle={config.subtitle}
                actions={config.actions}
              />
            )}
            <main className={`flex-1 bg-background ${config.mainClassName ?? ""}`}>
              {children}
            </main>
          </div>
          {config.rightRail && (
            <aside
              className={`hidden shrink-0 border-l border-border bg-background xl:block xl:w-[300px] ${ADMIN_SHELL_CONTENT_PADDING} py-6`}
            >
              {config.rightRail}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminAppLayout({ children }: { children: ReactNode }) {
  return (
    <AdminSessionProvider>
      <AdminPageConfigProvider>
        <AdminAppChrome>{children}</AdminAppChrome>
      </AdminPageConfigProvider>
    </AdminSessionProvider>
  );
}
