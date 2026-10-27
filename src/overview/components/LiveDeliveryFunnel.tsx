import type { ReportingSummary } from "@/data/reportingTypes";
import { formatPercent } from "../reportingUi";
import type { ReportingDateRangeKey } from "@/lib/reportingDateRange";
import type { DateRangeKey } from "@/data/orchestrationMetrics";
import DashboardCardDateRange from "./DashboardCardDateRange";

type LiveDeliveryFunnelProps = {
  funnel: ReportingSummary["funnel"];
  dateRange: ReportingDateRangeKey;
  onDateRangeChange: (value: ReportingDateRangeKey) => void;
};

export default function LiveDeliveryFunnel({
  funnel,
  dateRange,
  onDateRangeChange,
}: LiveDeliveryFunnelProps) {
  const stages = [
    { label: "Created", value: funnel.deliveriesCreated },
    { label: "Eligible eval", value: funnel.withEligibleEvaluation },
    { label: "Quoted", value: funnel.withQuote },
    { label: "Booked", value: funnel.withConfirmedBooking },
    { label: "Delivered now", value: funnel.currentlyDelivered },
  ];

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-small font-semibold text-foreground">Delivery funnel</h3>
          <p className="text-caption text-muted-foreground">
            Deliveries created in the selected period ({funnel.attemptSelectionRule}).
          </p>
        </div>
        <DashboardCardDateRange
          value={dateRange}
          onChange={(value: DateRangeKey) => {
            if (value === "7d" || value === "30d" || value === "month") {
              onDateRangeChange(value);
            }
          }}
        />
      </div>
      {funnel.deliveriesCreated === 0 ? (
        <p className="text-small text-muted-foreground">
          No deliveries in this period.
        </p>
      ) : (
        <ul className="space-y-2">
          {stages.map((stage) => {
            const rate =
              funnel.deliveriesCreated === 0
                ? 0
                : (stage.value / funnel.deliveriesCreated) * 100;
            return (
              <li
                key={stage.label}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <span className="text-small text-foreground">{stage.label}</span>
                <span className="text-small font-semibold text-foreground">
                  {stage.value.toLocaleString()} ·{" "}
                  {formatPercent(Math.round(rate * 10) / 10)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
