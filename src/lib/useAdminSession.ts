"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { AdminAccount } from "@/data/settingsTypes";
import { submitAdminLogout } from "@/auth/adminLogin";
import {
  clearAdminSessionCache,
  getInFlightAdminAccount,
  readCachedAdminAccount,
  setInFlightAdminAccount,
  writeCachedAdminAccount,
} from "@/lib/auth/adminSessionCache";

export type AdminSessionState =
  | { status: "loading"; account: null }
  | { status: "authenticated"; account: AdminAccount }
  | { status: "unauthenticated"; account: null };

export { clearAdminSessionCache };

async function fetchAdminAccount(options?: {
  bypassCache?: boolean;
}): Promise<AdminAccount | null> {
  const bypassCache = options?.bypassCache === true;
  if (!bypassCache) {
    const cached = readCachedAdminAccount();
    if (cached !== undefined) {
      return cached;
    }
    const inFlight = getInFlightAdminAccount();
    if (inFlight) {
      return inFlight;
    }
  }

  const request = (async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const data = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        data?: AdminAccount;
      };

      const account = response.ok && data.success && data.data ? data.data : null;
      writeCachedAdminAccount(account);
      return account;
    } finally {
      setInFlightAdminAccount(null);
    }
  })();

  setInFlightAdminAccount(request);
  return request;
}

export function useAdminSession(options?: { redirectOnUnauthenticated?: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<AdminSessionState>({
    status: "loading",
    account: null,
  });

  const reload = useCallback(async () => {
    const account = await fetchAdminAccount({ bypassCache: true });
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
    clearAdminSessionCache();
    await submitAdminLogout();
    setState({ status: "unauthenticated", account: null });
    router.replace("/login");
  }, [router]);

  return { ...state, reload, logout };
}
