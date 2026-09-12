"use client";

import { useMemo } from "react";
import {
  getDeliveryVolumeByDate,
  type PlatformMetrics,
} from "@/data/orchestrationMetrics";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";

type DeliveriesOverTimeProps = {
  metrics: PlatformMetrics;
  records: OrchestrationRecord[];
};

const X_TICK_COUNT = 7;
const X_TICK_INTERVAL_DAYS = 3;
const DAY_MS = 86_400_000;
const PLOT_HEIGHT = 250;
const Y_AXIS_WIDTH = 32;
const PLOT_PAD_Y = 20;
const PLOT_PAD_X = 16;
const BAR_RADIUS = 0.5;
const BAR_WIDTH_RATIO = 0.75;
const MIN_BAR_WIDTH = 8;
const MAX_BAR_WIDTH = 12;

const axisTextClass =
  "font-sans text-body font-normal leading-none text-muted-foreground";

function formatChartDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function parseDateMs(isoDate: string): number {
  return new Date(`${isoDate}T00:00:00`).getTime();
}

function msToLocalIsoDate(ms: number): string {
  const date = new Date(ms);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildXAxisTicks(startMs: number): { ms: number; label: string }[] {
  return Array.from({ length: X_TICK_COUNT }, (_, index) => {
    const ms = startMs + index * X_TICK_INTERVAL_DAYS * DAY_MS;

    return {
      ms,
      label: formatChartDate(msToLocalIsoDate(ms)),
    };
  });
}

function computeYMax(maxCount: number): number {
  if (maxCount <= 4) return 4;
  return Math.ceil(maxCount / 2) * 2;
}

type BarLayout = {
  date: string;
  label: string;
  count: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

function buildBars(
  volume: { date: string; label: string; count: number }[],
  xForDateMs: (dateMs: number) => number,
  innerPlotHeight: number,
  plotBottom: number,
  yMax: number,
  barWidth: number,
): BarLayout[] {
  return volume.map((point) => {
    const centerX = xForDateMs(parseDateMs(point.date));
    const barHeight = (point.count / yMax) * innerPlotHeight;

    return {
      ...point,
      x: centerX - barWidth / 2,
      y: plotBottom - barHeight,
      width: barWidth,
      height: barHeight,
    };
  });
}

export default function DeliveriesOverTime({
  metrics,
  records,
}: DeliveriesOverTimeProps) {
  const volume = useMemo(() => getDeliveryVolumeByDate(records), [records]);

  const maxCount = Math.max(...volume.map((point) => point.count), 0);
  const yMax = computeYMax(maxCount);
  const yTicks = Array.from({ length: yMax + 1 }, (_, index) => index);

  const minDateMs = volume.length > 0 ? parseDateMs(volume[0].date) : 0;

  const xTicks = buildXAxisTicks(minDateMs);
  const chartStartMs = xTicks[0].ms;
  const chartEndMs = xTicks[xTicks.length - 1].ms;
  const axisDateRange = chartEndMs - chartStartMs;

  const plotWidth = 600;
  const innerPlotHeight = PLOT_HEIGHT - PLOT_PAD_Y * 2;
  const innerPlotWidth = plotWidth - PLOT_PAD_X * 2;
  const plotBottom = PLOT_HEIGHT - PLOT_PAD_Y;

  const yForCount = (count: number): number =>
    PLOT_PAD_Y + innerPlotHeight - (count / yMax) * innerPlotHeight;

  const xForDateMs = (dateMs: number): number => {
    if (axisDateRange === 0) return PLOT_PAD_X + innerPlotWidth / 2;
    const ratio = (dateMs - chartStartMs) / axisDateRange;
    return PLOT_PAD_X + ratio * innerPlotWidth;
  };

  const xPercentForTick = (tickMs: number): number =>
    (xForDateMs(tickMs) / plotWidth) * 100;

  const dayWidth =
    axisDateRange === 0 ? MAX_BAR_WIDTH : (DAY_MS / axisDateRange) * innerPlotWidth;
  const barWidth = Math.max(
    MIN_BAR_WIDTH,
    Math.min(MAX_BAR_WIDTH, dayWidth * BAR_WIDTH_RATIO),
  );

  const bars = buildBars(
    volume,
    xForDateMs,
    innerPlotHeight,
    plotBottom,
    yMax,
    barWidth,
  );

  const summary =
    volume.length === 0
      ? "No deliveries in the selected period."
      : `${metrics.totalDeliveries} delivery requests across ${volume.length} days.`;

  return (
    <article
      className="flex h-full flex-col rounded-xl border border-border/80 bg-background p-6 font-sans shadow-sm"
      aria-labelledby="deliveries-over-time-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="deliveries-over-time-heading"
            className="text-body font-semibold text-foreground md:text-subheading"
          >
            Deliveries Over Time
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
            Daily delivery requests
          </p>
        </div>
        <span className="inline-flex items-center rounded-control border border-border bg-transparent px-4 py-2 text-small font-semibold text-foreground">
          Total: {metrics.totalDeliveries}
        </span>
      </div>

      {volume.length === 0 ? (
        <p className="mt-6 text-small text-muted-foreground">
          No data for this period.
        </p>
      ) : (
        <div className="mt-6 flex flex-1 flex-col">
          <div className="flex" style={{ height: PLOT_HEIGHT }}>
            <div
              className="flex shrink-0 flex-col justify-between pr-3 text-right"
              style={{
                width: Y_AXIS_WIDTH,
                height: PLOT_HEIGHT,
                paddingTop: PLOT_PAD_Y,
                paddingBottom: PLOT_PAD_Y,
              }}
              aria-hidden="true"
            >
              {[...yTicks].reverse().map((tick) => (
                <span key={tick} className={axisTextClass}>
                  {tick}
                </span>
              ))}
            </div>

            <div className="relative min-w-0 flex-1">
              <svg
                viewBox={`0 0 ${plotWidth} ${PLOT_HEIGHT}`}
                className="block w-full"
                style={{ height: PLOT_HEIGHT }}
                role="img"
                aria-label={summary}
              >
                {yTicks.map((tick) => {
                  const y = yForCount(tick);

                  return (
                    <line
                      key={tick}
                      x1={PLOT_PAD_X}
                      y1={y}
                      x2={plotWidth - PLOT_PAD_X}
                      y2={y}
                      stroke="#e8eaed"
                      strokeWidth="1"
                    />
                  );
                })}

                {bars.map((bar) => (
                  <rect
                    key={bar.date}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    rx={BAR_RADIUS}
                    ry={BAR_RADIUS}
                    fill="#f97316"
                  />
                ))}
              </svg>
            </div>
          </div>

          <div className="relative mt-3 h-6" style={{ marginLeft: Y_AXIS_WIDTH }}>
            {xTicks.map((tick, index) => {
              const percent = xPercentForTick(tick.ms);
              const isFirst = index === 0;
              const isLast = index === xTicks.length - 1;

              return (
                <span
                  key={tick.ms}
                  className={`absolute whitespace-nowrap ${axisTextClass}`}
                  style={{
                    left: `${percent}%`,
                    transform: isFirst
                      ? "translateX(0)"
                      : isLast
                        ? "translateX(-100%)"
                        : "translateX(-50%)",
                  }}
                >
                  {tick.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
