"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AdminAccount } from "@/data/settingsTypes";
import { useAdminSession } from "@/lib/useAdminSession";

type AdminSessionContextValue = {
  status: "authenticated";
  account: AdminAccount;
  reload: () => Promise<void>;
  logout: () => Promise<void>;
};

const AdminSessionContext = createContext<AdminSessionContextValue | null>(null);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const session = useAdminSession({ redirectOnUnauthenticated: true });

  if (session.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <p className="text-small text-muted-foreground">Loading session…</p>
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    return null;
  }

  return (
    <AdminSessionContext.Provider
      value={{
        status: "authenticated",
        account: session.account,
        reload: session.reload,
        logout: session.logout,
      }}
    >
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSessionContext(): AdminSessionContextValue {
  const value = useContext(AdminSessionContext);
  if (!value) {
    throw new Error("useAdminSessionContext must be used within AdminSessionProvider");
  }
  return value;
}
