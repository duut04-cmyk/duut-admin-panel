"use client";

import { useCallback, useId, useRef, type KeyboardEvent } from "react";

export type AdminTab = {
  id: string;
  label: string;
};

type AdminTabsProps = {
  tabs: AdminTab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  "aria-label"?: string;
};

export default function AdminTabs({
  tabs,
  activeId,
  onChange,
  className = "",
  "aria-label": ariaLabel = "Tabs",
}: AdminTabsProps) {
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = useCallback((index: number) => {
    tabRefs.current[index]?.focus();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % tabs.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    onChange(tabs[nextIndex].id);
    focusTab(nextIndex);
  };

  return (
    <div
      className={`-mx-1 overflow-x-auto px-1 ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      <div className="flex min-w-max gap-1 border-b border-border">
        {tabs.map((tab, index) => {
          const active = tab.id === activeId;
          const tabId = `${baseId}-tab-${tab.id}`;
          const panelId = `${baseId}-panel-${tab.id}`;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={tabId}
              aria-selected={active}
              aria-controls={panelId}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`cursor-pointer border-b-2 px-3 py-2.5 text-small font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                active
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AdminTabPanel({
  id,
  tabId,
  active,
  children,
  className = "",
}: {
  id: string;
  tabId: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  if (!active) return null;

  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={tabId}
      tabIndex={0}
      className={`pt-4 focus-visible:outline-none ${className}`}
    >
      {children}
    </div>
  );
}
