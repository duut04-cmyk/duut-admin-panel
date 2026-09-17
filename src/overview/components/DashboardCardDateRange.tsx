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
      className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
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
  className?: string;
};

export default function DashboardCardDateRange({
  value,
  onChange,
  compact = false,
  className = "",
}: DashboardCardDateRangeProps) {
  return (
    <div
      className={`relative w-full sm:w-auto ${compact ? "min-w-0 sm:min-w-[140px]" : "min-w-0 sm:min-w-[168px]"} ${className}`}
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
        className={`[&_button]:rounded-[var(--radius-control)] [&_button]:border-border [&_button]:bg-background [&_button]:pl-8 [&_button]:pr-8 [&_button]:shadow-sm [&_button_svg:last-child]:hidden ${compact ? "[&_button]:h-9 [&_button]:text-caption" : "[&_button]:h-10"}`}
      />
    </div>
  );
}
