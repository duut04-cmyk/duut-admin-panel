import type { DeliveryVolumePoint } from "@/data/orchestrationMetrics";
import AdminChartCard from "@/ui/AdminChartCard";

type DeliveryVolumeChartProps = {
  volume: DeliveryVolumePoint[];
  totalDeliveries: number;
};

export default function DeliveryVolumeChart({
  volume,
  totalDeliveries,
}: DeliveryVolumeChartProps) {
  const maxCount = Math.max(...volume.map((point) => point.count), 1);
  const averagePerDay =
    volume.length === 0 ? 0 : totalDeliveries / volume.length;

  const peak = volume.reduce(
    (best, point) => (point.count > best.count ? point : best),
    volume[0] ?? { date: "", label: "", count: 0 },
  );

  const summary =
    volume.length === 0
      ? "No deliveries in the selected period."
      : `${totalDeliveries} deliveries were created during this period, with the highest daily volume of ${peak.count} on ${peak.label}. Average volume was ${averagePerDay.toFixed(1)} deliveries per day.`;

  const chartWidth = 600;
  const chartHeight = 200;
  const padding = { top: 16, right: 16, bottom: 32, left: 32 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;
  const barWidth =
    volume.length === 0 ? 0 : innerWidth / volume.length - 8;

  return (
    <AdminChartCard
      title="Delivery volume"
      description={`${totalDeliveries} total · ${averagePerDay.toFixed(1)} avg. per day`}
    >
      {volume.length === 0 ? (
        <p className="text-small text-muted-foreground">No data for this period.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-48 w-full min-w-[320px]"
              role="img"
              aria-label={summary}
            >
              {volume.map((point, index) => {
                const barHeight = (point.count / maxCount) * innerHeight;
                const x =
                  padding.left +
                  index * (innerWidth / volume.length) +
                  4;
                const y = padding.top + innerHeight - barHeight;

                return (
                  <g key={point.date}>
                    <rect
                      x={x}
                      y={y}
                      width={Math.max(barWidth, 12)}
                      height={barHeight}
                      rx={4}
                      className="fill-accent/80"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      className="fill-muted-foreground text-[10px]"
                    >
                      {point.label}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={y - 4}
                      textAnchor="middle"
                      className="fill-foreground text-[10px] font-medium"
                    >
                      {point.count}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="mt-3 text-caption text-muted-foreground">{summary}</p>
        </>
      )}
    </AdminChartCard>
  );
}
