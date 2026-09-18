"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { DateRangeKey } from "@/data/orchestrationMetrics";
import AdminCustomSelect from "@/ui/AdminCustomSelect";

const dateOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "month", label: "This month" },
  { value: "custom", label: "Custom" },
];

function CalendarIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      className={`shrink-0 text-muted-foreground ${className}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M2 6.5h12M5 1.5v2M11 1.5v2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type DashboardCardDateRangeProps = {
  value: DateRangeKey;
  onChange: (value: DateRangeKey) => void;
  compact?: boolean;
  /** Align select height with h-11 toolbar inputs (search, filter buttons). */
  matchToolbarHeight?: boolean;
  className?: string;
  /** On mobile, show a calendar icon button instead of the full select. */
  iconOnlyMobile?: boolean;
  /** Breakpoint below which the calendar icon is shown (default md). */
  iconOnlyBelow?: "sm" | "md";
};

export default function DashboardCardDateRange({
  value,
  onChange,
  compact = false,
  matchToolbarHeight = false,
  className = "",
  iconOnlyMobile = true,
  iconOnlyBelow = "md",
}: DashboardCardDateRangeProps) {
  const iconVisibleClass = iconOnlyBelow === "sm" ? "sm:hidden" : "md:hidden";
  const selectVisibleClass =
    iconOnlyBelow === "sm" ? "hidden sm:block" : "hidden md:block";
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = dateOptions.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const mobileDropdown = open && (
    <ul
      id={listboxId}
      role="listbox"
      aria-label="Date range"
      className="absolute right-0 top-full z-30 mt-1.5 w-44 overflow-hidden rounded-md border border-border bg-background py-1 shadow-sm"
    >
      {dateOptions.map((option) => {
        const active = option.value === value;
        return (
          <li key={option.value} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => {
                onChange(option.value as DateRangeKey);
                setOpen(false);
              }}
              className={`flex w-full cursor-pointer whitespace-nowrap px-3 py-2 text-left text-small transition-colors hover:bg-surface focus:outline-none focus-visible:bg-surface ${
                active
                  ? "bg-surface-accent font-medium text-foreground"
                  : "text-foreground"
              }`}
            >
              {option.label}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={className}>
      {iconOnlyMobile && (
        <div ref={containerRef} className={`relative ${iconVisibleClass}`}>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-label={`Date range: ${selected?.label ?? "Select"}`}
            onClick={() => setOpen((current) => !current)}
            className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[4px] border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <CalendarIcon className="h-4 w-4" />
          </button>
          {mobileDropdown}
        </div>
      )}

      <div
        className={`relative w-full sm:w-auto ${iconOnlyMobile ? selectVisibleClass : "block"} ${
          matchToolbarHeight
            ? "min-w-0 sm:min-w-[11.5rem]"
            : compact
              ? "min-w-0 sm:min-w-[140px]"
              : "min-w-0 sm:min-w-[168px]"
        }`}
      >
        <div className="pointer-events-none absolute inset-y-0 left-2.5 z-10 flex items-center">
          <CalendarIcon />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-2.5 z-10 flex items-center">
          <ChevronDownIcon />
        </div>
        <AdminCustomSelect
          value={value}
          onChange={(next) => onChange(next as DateRangeKey)}
          options={dateOptions}
          className={`[&_button]:rounded-[4px] [&_button]:border-border [&_button]:bg-background [&_button]:pl-8 [&_button]:pr-8 [&_button]:shadow-sm [&_button_svg:last-child]:hidden [&_ul]:min-w-full [&_ul]:w-max [&_li_button]:whitespace-nowrap ${
            matchToolbarHeight
              ? "[&_button]:h-11 [&_button]:text-small [&_button_span]:whitespace-nowrap"
              : compact
                ? "[&_button]:h-9 [&_button]:text-caption"
                : "[&_button]:h-10"
          }`}
        />
      </div>
    </div>
  );
}
