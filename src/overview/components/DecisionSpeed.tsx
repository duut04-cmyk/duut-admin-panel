"use client";

import { useId, useMemo, useState } from "react";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import {
  decisionSpeedStatTrends,
  resolveDecisionSpeedChart,
  resolveDecisionSpeedMetrics,
  type DecisionSpeedChartPoint,
} from "@/data/overviewDisplay";
import { formatDecisionTime, type PlatformMetrics } from "@/data/orchestrationMetrics";

type DecisionSpeedProps = {
  metrics: PlatformMetrics;
  records: OrchestrationRecord[];
};

const MAX_Y_SECONDS = 8;
const Y_TICK_STEP = 2;
const X_TICK_INTERVAL_DAYS = 5;
const DAY_MS = 86_400_000;
const PLOT_HEIGHT = 200;
const Y_AXIS_WIDTH = 32;
const PLOT_PAD_Y = 8;
const PLOT_PAD_X = 16;

const axisTextClass =
  "font-sans text-[10px] font-normal leading-none text-foreground sm:text-small";

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

/** Aggregate decision times by day for a smoother chart line. */
function buildDecisionTimeSeries(
  records: OrchestrationRecord[],
): DecisionSpeedChartPoint[] {
  const byDay = new Map<string, number[]>();

  for (const record of records) {
    const date = record.deliveryRequest.createdAt.slice(0, 10);
    const existing = byDay.get(date) ?? [];
    existing.push(record.decision.durationMs);
    byDay.set(date, existing);
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, durations]) => {
      const avgMs = durations.reduce((sum, ms) => sum + ms, 0) / durations.length;
      return {
        date,
        label: formatChartDate(date),
        ms: avgMs,
      };
    });
}

function buildXAxisTicks(
  chartStartMs: number,
  chartEndMs: number,
): { ms: number; label: string }[] {
  const ticks: { ms: number; label: string }[] = [];
  for (let ms = chartStartMs; ms <= chartEndMs; ms += X_TICK_INTERVAL_DAYS * DAY_MS) {
    ticks.push({ ms, label: formatChartDate(msToLocalIsoDate(ms)) });
  }
  return ticks;
}

function buildSmoothLinePath(coords: { x: number; y: number }[]): string {
  if (coords.length === 0) return "";
  if (coords.length === 1) {
    return `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  }

  let path = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;

  for (let index = 0; index < coords.length - 1; index += 1) {
    const current = coords[index];
    const next = coords[index + 1];
    const controlX = (current.x + next.x) / 2;
    path += ` C ${controlX.toFixed(1)} ${current.y.toFixed(1)}, ${controlX.toFixed(1)} ${next.y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
  }

  return path;
}

function DecisionTimeChart({ points }: { points: DecisionSpeedChartPoint[] }) {
  const gradientId = useId();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const plotWidth = 400;
  const plotHeight = PLOT_HEIGHT;
  const innerPlotHeight = plotHeight - PLOT_PAD_Y * 2;
  const innerPlotWidth = plotWidth - PLOT_PAD_X * 2;
  const plotBottom = PLOT_PAD_Y + innerPlotHeight;

  const chartStartMs = parseDateMs(points[0].date);
  const chartEndMs = parseDateMs(points[points.length - 1].date);
  const axisDateRange = chartEndMs - chartStartMs;

  const xTicks = buildXAxisTicks(chartStartMs, chartEndMs);
  const yTicks = Array.from(
    { length: MAX_Y_SECONDS / Y_TICK_STEP + 1 },
    (_, index) => index * Y_TICK_STEP,
  );

  const yForTick = (tick: number): number =>
    PLOT_PAD_Y + innerPlotHeight - (tick / MAX_Y_SECONDS) * innerPlotHeight;

  const yForMs = (ms: number): number =>
    PLOT_PAD_Y + innerPlotHeight - (ms / 1000 / MAX_Y_SECONDS) * innerPlotHeight;

  const xForDateMs = (dateMs: number): number => {
    if (axisDateRange === 0) return PLOT_PAD_X + innerPlotWidth / 2;
    const ratio = (dateMs - chartStartMs) / axisDateRange;
    return PLOT_PAD_X + ratio * innerPlotWidth;
  };

  const xPercentForTick = (tickMs: number): number =>
    (xForDateMs(tickMs) / plotWidth) * 100;

  const coords = points.map((point, index) => ({
    x: xForDateMs(parseDateMs(point.date)),
    y: yForMs(point.ms),
    label: point.label,
    ms: point.ms,
    index,
  }));

  const linePath = buildSmoothLinePath(coords);
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${plotBottom} L ${coords[0].x.toFixed(1)} ${plotBottom} Z`
      : "";

  return (
    <div className="min-w-0 w-full overflow-x-hidden font-sans">
      <div className="flex min-w-0" style={{ height: plotHeight }}>
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
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            )}

            {coords.map((point) => (
              <circle
                key={`${point.label}-${point.index}`}
                cx={point.x}
                cy={point.y}
                r={hoveredIndex === point.index ? "5" : "4"}
                fill="#f97316"
                stroke="#ffffff"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                onMouseEnter={() => setHoveredIndex(point.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              />
            ))}
          </svg>
          {hoveredIndex !== null && coords[hoveredIndex] && (
            <div
              className="pointer-events-none absolute z-10 rounded-md bg-[#0f172a] px-3 py-2 text-caption text-white shadow-md"
              style={{
                left: `${(coords[hoveredIndex].x / plotWidth) * 100}%`,
                top: `${(coords[hoveredIndex].y / plotHeight) * 100 - 14}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <p className="font-medium">{coords[hoveredIndex].label}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-white/90">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-orange-400"
                  aria-hidden="true"
                />
                {formatDecisionTime(coords[hoveredIndex].ms)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div
        className="relative mt-1.5 h-4 overflow-hidden"
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

function StatTrend({ value }: { value: string }) {
  return (
    <p className="mt-1 flex items-center justify-center gap-0.5 text-caption font-medium text-emerald-600">
      <svg
        className="h-3 w-3 shrink-0"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M6 3v6M6 9L3 6M6 9l3-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{value}</span>
    </p>
  );
}

export default function DecisionSpeed({ metrics, records }: DecisionSpeedProps) {
  const rawPoints = useMemo(() => buildDecisionTimeSeries(records), [records]);
  const displayMetrics = resolveDecisionSpeedMetrics(metrics, records.length);
  const points = useMemo(
    () => resolveDecisionSpeedChart(rawPoints, records.length),
    [rawPoints, records.length],
  );

  return (
    <article
      className="min-w-0 rounded-card border border-border/60 bg-background p-4 font-sans shadow-sm sm:p-5"
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

      <div className="mt-5 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-lg border border-border">
        <div className="px-2 py-3 text-center sm:px-3">
          <p className="text-small font-medium text-muted-foreground">Average</p>
          <p className="mt-1 text-xl font-bold leading-none tracking-tight text-foreground sm:text-2xl">
            {formatDecisionTime(displayMetrics.averageDecisionTimeMs)}
          </p>
          <StatTrend value={decisionSpeedStatTrends.average.value} />
        </div>
        <div className="px-2 py-3 text-center sm:px-3">
          <p className="text-small font-medium text-muted-foreground">Fastest</p>
          <p className="mt-1 text-xl font-bold leading-none tracking-tight text-foreground sm:text-2xl">
            {formatDecisionTime(displayMetrics.fastestDecisionTimeMs)}
          </p>
          <StatTrend value={decisionSpeedStatTrends.fastest.value} />
        </div>
        <div className="px-2 py-3 text-center sm:px-3">
          <p className="text-small font-medium text-muted-foreground">Slowest</p>
          <p className="mt-1 text-xl font-bold leading-none tracking-tight text-foreground sm:text-2xl">
            {formatDecisionTime(displayMetrics.slowestDecisionTimeMs)}
          </p>
          <StatTrend value={decisionSpeedStatTrends.slowest.value} />
        </div>
      </div>

      {points.length > 0 && (
        <div className="mt-5 w-full">
          <DecisionTimeChart points={points} />
        </div>
      )}

      <div className="mt-2 flex items-center justify-center gap-2 text-small text-foreground">
        <span
          className="inline-block h-[3px] w-5 rounded-full bg-orange-500"
          aria-hidden="true"
        />
        Decision time
      </div>
    </article>
  );
}
