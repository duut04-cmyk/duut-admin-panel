import { useCallback, useRef, useState } from "react";

/**
 * Wraps an async function so only one invocation runs at a time (e.g. Retry clicks).
 */
export function useExclusiveAsync<T extends () => Promise<void>>(fn: T) {
  const inFlightRef = useRef(false);
  const [busy, setBusy] = useState(false);

  const run = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setBusy(true);
    try {
      await fn();
    } finally {
      inFlightRef.current = false;
      setBusy(false);
    }
  }, [fn]);

  return { run, busy };
}
