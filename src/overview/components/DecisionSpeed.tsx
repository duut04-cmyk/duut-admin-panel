"use client";

import { useId, useMemo } from "react";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import {
  formatDecisionTime,
  type PlatformMetrics,
} from "@/data/orchestrationMetrics";

type DecisionSpeedProps = {
  metrics: PlatformMetrics;
  records: OrchestrationRecord[];
};

type DecisionTimePoint = {
  date: string;
  label: string;
  ms: number;
};

const MAX_Y_SECONDS = 5;
const X_TICK_COUNT = 7;
const X_TICK_INTERVAL_DAYS = 3;
const DAY_MS = 86_400_000;
const PLOT_HEIGHT = 268;
const Y_AXIS_WIDTH = 36;
const PLOT_PAD_Y = 10;
const PLOT_PAD_X = 16;

const axisTextClass =
  "font-sans text-small font-normal leading-none text-foreground";

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

function buildDecisionTimeSeries(
  records: OrchestrationRecord[],
): DecisionTimePoint[] {
  return [...records]
    .sort((a, b) =>
      a.deliveryRequest.createdAt.localeCompare(b.deliveryRequest.createdAt),
    )
    .map((record) => {
      const date = record.deliveryRequest.createdAt.slice(0, 10);
      return {
        date,
        label: formatChartDate(date),
        ms: record.decision.durationMs,
      };
    });
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

function buildStraightLinePath(
  coords: { x: number; y: number }[],
): string {
  if (coords.length === 0) return "";

  return coords
    .map((point, index) =>
      index === 0
        ? `M ${point.x.toFixed(1)} ${point.y.toFixed(1)}`
        : `L ${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
    )
    .join(" ");
}

function DecisionTimeChart({ points }: { points: DecisionTimePoint[] }) {
  const gradientId = useId();
  const plotWidth = 400;
  const plotHeight = PLOT_HEIGHT;
  const innerPlotHeight = plotHeight - PLOT_PAD_Y * 2;
  const innerPlotWidth = plotWidth - PLOT_PAD_X * 2;
  const plotBottom = PLOT_PAD_Y + innerPlotHeight;

  const minDateMs = parseDateMs(points[0].date);
  const maxDateMs = parseDateMs(points[points.length - 1].date);
  const xTicks = buildXAxisTicks(minDateMs);
  const chartStartMs = xTicks[0].ms;
  const chartEndMs = xTicks[xTicks.length - 1].ms;
  const axisDateRange = chartEndMs - chartStartMs;
  const dataDateRange = maxDateMs - minDateMs;

  const yTicks = Array.from({ length: MAX_Y_SECONDS + 1 }, (_, index) => index);

  const yForTick = (tick: number): number =>
    PLOT_PAD_Y + innerPlotHeight - (tick / MAX_Y_SECONDS) * innerPlotHeight;

  const yForMs = (ms: number): number =>
    PLOT_PAD_Y +
    innerPlotHeight -
    (ms / 1000 / MAX_Y_SECONDS) * innerPlotHeight;

  const xForAxisTick = (tickMs: number): number => {
    if (axisDateRange === 0) return PLOT_PAD_X;
    const ratio = (tickMs - chartStartMs) / axisDateRange;
    return PLOT_PAD_X + ratio * innerPlotWidth;
  };

  const xForLinePoint = (dateMs: number): number => {
    if (dataDateRange === 0) return PLOT_PAD_X + innerPlotWidth;
    const ratio = (dateMs - minDateMs) / dataDateRange;
    return PLOT_PAD_X + ratio * innerPlotWidth;
  };

  const xPercentForTick = (tickMs: number): number =>
    (xForAxisTick(tickMs) / plotWidth) * 100;

  const coords = points.map((point, index) => ({
    x: xForLinePoint(parseDateMs(point.date)),
    y: yForMs(point.ms),
    label: point.label,
    index,
  }));

  const linePath = buildStraightLinePath(coords);
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${plotBottom} L ${coords[0].x.toFixed(1)} ${plotBottom} Z`
      : "";

  return (
    <div className="w-full font-sans">
      <div className="flex" style={{ height: plotHeight }}>
        <div
          className="flex shrink-0 flex-col justify-between text-right"
          style={{
            width: Y_AXIS_WIDTH,
            height: plotHeight,
            paddingTop: PLOT_PAD_Y,
            paddingBottom: PLOT_PAD_Y,
          }}
          aria-hidden="true"
        >
          {[...yTicks].reverse().map((tick) => (
            <span key={tick} className={axisTextClass}>
              {tick}s
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          <svg
            viewBox={`0 0 ${plotWidth} ${plotHeight}`}
            className="block w-full"
            style={{ height: plotHeight }}
            preserveAspectRatio="none"
            role="img"
            aria-label="Decision time trend chart"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(249, 115, 22, 0.18)" />
                <stop offset="100%" stopColor="rgba(249, 115, 22, 0.02)" />
              </linearGradient>
            </defs>

            {yTicks.map((tick) => {
              const y = yForTick(tick);

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

            {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} />}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="miter"
                vectorEffect="non-scaling-stroke"
              />
            )}

            {coords.map((point) => (
              <circle
                key={`${point.label}-${point.index}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#f97316"
                stroke="#ffffff"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </div>
      </div>

      <div
        className="relative mt-2 h-5"
        style={{ marginLeft: Y_AXIS_WIDTH }}
      >
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
  );
}

export default function DecisionSpeed({
  metrics,
  records,
}: DecisionSpeedProps) {
  const points = useMemo(() => buildDecisionTimeSeries(records), [records]);

  return (
    <article
      className="rounded-xl border border-border/80 bg-background p-6 font-sans shadow-sm"
      aria-labelledby="decision-speed-heading"
    >
      <h2
        id="decision-speed-heading"
        className="text-body font-semibold text-foreground md:text-subheading"
      >
        Decision Speed
      </h2>
      <p className="mt-1 text-small text-muted-foreground">
        Time taken to evaluate services and make a decision.
      </p>

      <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-background">
        <div className="px-3 py-5 text-center sm:px-5">
          <p className="text-small font-medium text-muted-foreground">Average</p>
          <p className="mt-1.5 text-[1.75rem] font-bold leading-none tracking-tight text-foreground">
            {formatDecisionTime(metrics.averageDecisionTimeMs)}
          </p>
        </div>
        <div className="px-3 py-5 text-center sm:px-5">
          <p className="text-small font-medium text-muted-foreground">Fastest</p>
          <p className="mt-1.5 text-[1.75rem] font-bold leading-none tracking-tight text-foreground">
            {formatDecisionTime(metrics.fastestDecisionTimeMs)}
          </p>
        </div>
        <div className="px-3 py-5 text-center sm:px-5">
          <p className="text-small font-medium text-muted-foreground">Slowest</p>
          <p className="mt-1.5 text-[1.75rem] font-bold leading-none tracking-tight text-foreground">
            {formatDecisionTime(metrics.slowestDecisionTimeMs)}
          </p>
        </div>
      </div>

      {points.length > 0 && (
        <div className="mt-8 w-full">
          <DecisionTimeChart points={points} />
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-2 text-small text-foreground">
        <span
          className="inline-block h-[3px] w-5 rounded-full bg-orange-500"
          aria-hidden="true"
        />
        Decision time
      </div>
    </article>
  );
}
