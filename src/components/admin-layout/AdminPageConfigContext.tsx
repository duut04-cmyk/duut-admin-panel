"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AdminPageConfig = {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  customHeader?: ReactNode;
  mainClassName?: string;
  rightRail?: ReactNode;
  hideTopBar?: boolean;
};

const emptyConfig: AdminPageConfig = {};

type AdminPageConfigContextValue = {
  config: AdminPageConfig;
  setConfig: (config: AdminPageConfig) => void;
};

const AdminPageConfigContext = createContext<AdminPageConfigContextValue | null>(null);

export function AdminPageConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<AdminPageConfig>(emptyConfig);
  const setConfig = useCallback((next: AdminPageConfig) => {
    setConfigState(next);
  }, []);

  const value = useMemo(() => ({ config, setConfig }), [config, setConfig]);

  return (
    <AdminPageConfigContext.Provider value={value}>
      {children}
    </AdminPageConfigContext.Provider>
  );
}

export function useAdminPageConfig(): AdminPageConfigContextValue {
  const value = useContext(AdminPageConfigContext);
  if (!value) {
    throw new Error("useAdminPageConfig must be used within AdminPageConfigProvider");
  }
  return value;
}

type AdminPageProps = AdminPageConfig & {
  children: ReactNode;
};

/** Registers page chrome with the persistent admin layout. */
export function AdminPage({
  children,
  title,
  subtitle,
  actions,
  customHeader,
  mainClassName,
  rightRail,
  hideTopBar,
}: AdminPageProps) {
  const { setConfig } = useAdminPageConfig();

  useLayoutEffect(() => {
    setConfig({
      title,
      subtitle,
      actions,
      customHeader,
      mainClassName,
      rightRail,
      hideTopBar,
    });
    return () => setConfig(emptyConfig);
  }, [
    setConfig,
    title,
    subtitle,
    actions,
    customHeader,
    mainClassName,
    rightRail,
    hideTopBar,
  ]);

  return children;
}
