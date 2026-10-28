"use client";

import { useCallback, useState } from "react";
import type { ProviderDetail } from "@/data/providerTypes";
import { isValidProviderId } from "@/lib/bff/providers";
import { useLoadedAsync } from "@/lib/useLoadedAsync";
import { useExclusiveAsync } from "@/lib/useExclusiveAsync";
import { fetchProvider } from "../api";

export function useProviderDetail(providerId: string) {
  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const invalidId = !isValidProviderId(providerId);

  const loadProvider = useCallback(
    async (isStale: () => boolean = () => false) => {
      if (invalidId) {
        setLoading(false);
        setProvider(null);
        setLoadError(null);
        return;
      }

      setLoading(true);
      setLoadError(null);

      const result = await fetchProvider(providerId);

      if (isStale()) return;

      setLoading(false);

      if (!result.success || !result.data) {
        setProvider(null);
        setLoadError(result.error ?? "Failed to load provider.");
        return;
      }

      setProvider(result.data);
    },
    [invalidId, providerId],
  );

  useLoadedAsync(
    async (isStale) => {
      await loadProvider(isStale);
    },
    [loadProvider],
  );

  const { run: retryLoad, busy: retrying } = useExclusiveAsync(async () => {
    await loadProvider();
  });

  return {
    provider,
    setProvider,
    loading,
    loadError,
    invalidId,
    retryLoad,
    retrying,
  };
}
