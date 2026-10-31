import type { FinanceTimeseriesPoint } from "@/data/financeTypes";

type FinanceTimeseriesChartProps = {
  points: FinanceTimeseriesPoint[];
};

export default function FinanceTimeseriesChart({
  points,
}: FinanceTimeseriesChartProps) {
  if (points.length === 0) {
    return (
      <p className="text-small text-muted-foreground">
        No collection or refund activity in this period.
      </p>
    );
  }

  const maxValue = Math.max(
    ...points.flatMap((point) => [
      Number(point.collections),
      Number(point.successfulRefunds),
      Math.abs(Number(point.net)),
    ]),
    1,
  );

  return (
    <div className="space-y-3">
      <div
        className="flex h-48 items-end gap-1 overflow-x-auto border-b border-border pb-2"
        role="img"
        aria-label="Collections and refunds by period"
      >
        {points.map((point) => {
          const collectionHeight = (Number(point.collections) / maxValue) * 100;
          const refundHeight = (Number(point.successfulRefunds) / maxValue) * 100;
          return (
            <div
              key={point.bucketStart}
              className="flex min-w-[2.5rem] flex-1 flex-col items-center gap-1"
              title={`${point.bucketLabel}: collections ${point.collections}, refunds ${point.successfulRefunds}`}
            >
              <div className="flex h-36 w-full items-end justify-center gap-0.5">
                <div
                  className="w-2 rounded-t bg-emerald-500/80"
                  style={{ height: `${collectionHeight}%` }}
                />
                <div
                  className="w-2 rounded-t bg-amber-500/80"
                  style={{ height: `${refundHeight}%` }}
                />
              </div>
              <span className="max-w-[4rem] truncate text-[10px] text-muted-foreground">
                {point.bucketStart}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-emerald-500/80" /> Collections
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-amber-500/80" /> Successful refunds
        </span>
      </div>
    </div>
  );
}
