"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { AdminAccount } from "@/data/settingsTypes";
import { submitAdminLogout } from "@/auth/adminLogin";

export type AdminSessionState =
  | { status: "loading"; account: null }
  | { status: "authenticated"; account: AdminAccount }
  | { status: "unauthenticated"; account: null };

async function fetchAdminAccount(): Promise<AdminAccount | null> {
  const response = await fetch("/api/auth/me", { cache: "no-store" });
  const data = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    data?: AdminAccount;
  };

  if (!response.ok || !data.success || !data.data) {
    return null;
  }

  return data.data;
}

export function useAdminSession(options?: { redirectOnUnauthenticated?: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<AdminSessionState>({
    status: "loading",
    account: null,
  });

  const reload = useCallback(async () => {
    const account = await fetchAdminAccount();
    setState(
      account
        ? { status: "authenticated", account }
        : { status: "unauthenticated", account: null },
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const account = await fetchAdminAccount();
      if (cancelled) {
        return;
      }
      setState(
        account
          ? { status: "authenticated", account }
          : { status: "unauthenticated", account: null },
      );
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (options?.redirectOnUnauthenticated && state.status === "unauthenticated") {
      router.replace("/login");
    }
  }, [options?.redirectOnUnauthenticated, router, state.status]);

  const logout = useCallback(async () => {
    await submitAdminLogout();
    setState({ status: "unauthenticated", account: null });
    router.replace("/login");
  }, [router]);

  return { ...state, reload, logout };
}
