"use client";

import type { DateRangeKey } from "@/data/orchestrationMetrics";
import AdminCustomSelect from "@/ui/AdminCustomSelect";

const dateOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "month", label: "This month" },
  { value: "custom", label: "Custom" },
];

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-muted-foreground"
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

export function OverviewDateRange({
  value,
  onChange,
}: {
  value: DateRangeKey;
  onChange: (value: DateRangeKey) => void;
}) {
  return (
    <div className="relative min-w-[168px]">
      <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
        <CalendarIcon />
      </div>
      <AdminCustomSelect
        value={value}
        onChange={(next) => onChange(next as DateRangeKey)}
        options={dateOptions}
        className="[&_button]:h-10 [&_button]:border-border [&_button]:bg-background [&_button]:pl-9 [&_button]:pr-8 [&_button]:shadow-sm"
      />
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        d="M13 8a5 5 0 1 1-1.46-3.54M13 3v3.5H9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type OverviewToolbarProps = {
  onMenuClick?: () => void;
  dateRange: DateRangeKey;
  onDateRangeChange: (value: DateRangeKey) => void;
  onRefresh: () => void;
  refreshing?: boolean;
};

export function OverviewToolbar({
  onMenuClick,
  dateRange,
  onDateRangeChange,
  onRefresh,
  refreshing = false,
}: OverviewToolbarProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {onMenuClick && (
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={onMenuClick}
            className="mt-1 inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-control border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden="true"
            >
              <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
            </svg>
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-heading font-bold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="mt-1.5 max-w-xl text-body text-muted-foreground">
            Real-time visibility into Doot&apos;s delivery orchestration
            performance.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 self-start">
        <OverviewDateRange value={dateRange} onChange={onDateRangeChange} />
        <button
          type="button"
          aria-label="Refresh overview data"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-control border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshIcon />
        </button>
      </div>
    </div>
  );
}
