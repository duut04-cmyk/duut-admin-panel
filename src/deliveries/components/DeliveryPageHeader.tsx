"use client";

import type { DateRangeKey } from "@/data/orchestrationMetrics";
import { ADMIN_SHELL_CONTENT_PADDING } from "@/components/layout";
import DashboardCardDateRange from "@/overview/components/DashboardCardDateRange";

type DeliveryPageHeaderProps = {
  dateRange: DateRangeKey;
  onDateRangeChange: (value: DateRangeKey) => void;
};

export default function DeliveryPageHeader({
  dateRange,
  onDateRangeChange,
}: DeliveryPageHeaderProps) {
  return (
    <header
      className={`bg-background pb-4 pt-4 lg:pb-5 lg:pt-5 ${ADMIN_SHELL_CONTENT_PADDING}`}
    >
      <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground md:text-heading-md">
        Deliveries
      </h1>

      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="min-w-0 flex-1 max-w-2xl text-small leading-snug text-muted-foreground">
          Monitor delivery activity, status, bookings, and outcomes.
        </p>
        <div className="hidden shrink-0 self-center sm:block md:pb-0.5">
          <DashboardCardDateRange
            value={dateRange}
            onChange={onDateRangeChange}
            iconOnlyMobile={false}
          />
        </div>
      </div>
    </header>
  );
}
