import { useEffect, type DependencyList } from "react";

/**
 * Runs an async loader when dependencies change. Call setState only after await
 * inside the loader so eslint react-hooks/set-state-in-effect stays satisfied.
 */
export function useLoadedAsync(
  loader: (isStale: () => boolean) => Promise<void>,
  deps: DependencyList,
): void {
  useEffect(() => {
    let stale = false;
    const isStale = () => stale;

    void loader(isStale);

    return () => {
      stale = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller owns dependency list
  }, deps);
}
