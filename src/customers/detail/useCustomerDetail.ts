"use client";

import { useCallback, useState } from "react";
import type { CustomerDetail } from "@/data/customerTypes";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import { useExclusiveAsync } from "@/lib/useExclusiveAsync";
import { fetchCustomer } from "../api";

export function useCustomerDetail(customerId: string) {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadCustomer = useCallback(
    async (isStale: () => boolean = () => false) => {
      setLoading(true);
      setLoadError(null);

      const result = await fetchCustomer(customerId);

      if (isStale()) return;

      setLoading(false);

      if (!result.success || !result.data) {
        setCustomer(null);
        setLoadError(result.error ?? "Customer not found.");
        return;
      }

      setCustomer(result.data);
    },
    [customerId],
  );

  useLoadedAsync(
    async (isStale) => {
      await loadCustomer(isStale);
    },
    [loadCustomer],
  );

  const { run: retryLoad, busy: retrying } = useExclusiveAsync(async () => {
    await loadCustomer();
  });

  return {
    customer,
    setCustomer,
    loading,
    loadError,
    retryLoad,
    retrying,
  };
}
