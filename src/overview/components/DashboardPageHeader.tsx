"use client";

import type { DateRangeKey } from "@/data/orchestrationMetrics";
import { getTimeBasedGreeting } from "@/data/mockAdminUser";
import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";
import DashboardCardDateRange from "./DashboardCardDateRange";

export type DashboardPageHeaderProps = {
  dateRange: DateRangeKey;
  onDateRangeChange: (value: DateRangeKey) => void;
};

export default function DashboardPageHeader({
  dateRange,
  onDateRangeChange,
}: DashboardPageHeaderProps) {
  const greeting = getTimeBasedGreeting();

  return (
    <header
      className={`bg-background pb-4 pt-4 lg:pb-5 lg:pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}
    >
      <p className="text-small text-muted-foreground">{greeting} 👋</p>

      <h1 className="mt-2 text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
        Here&apos;s what&apos;s happening with Doot
      </h1>

      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="min-w-0 flex-1 max-w-2xl text-small leading-snug text-muted-foreground">
          Real-time performance, delivery trends and platform health at a glance.
        </p>
        <div className="shrink-0 self-center md:pb-0.5">
          <DashboardCardDateRange value={dateRange} onChange={onDateRangeChange} />
        </div>
      </div>
    </header>
  );
}
