"use client";

import { useId, useState } from "react";
import type { DecisionSpeedChartPoint } from "@/data/overviewDisplay";
import { formatDecisionChartDate, formatDecisionTime } from "@/overview/reportingUi";

const MAX_Y_SECONDS = 8;
const Y_TICK_STEP = 2;
const X_TICK_INTERVAL_DAYS = 5;
const DAY_MS = 86_400_000;
const PLOT_HEIGHT = 200;
const Y_AXIS_WIDTH_DESKTOP = 32;
const Y_AXIS_WIDTH_MOBILE = 24;
const PLOT_PAD_Y = 8;
const PLOT_PAD_X_DESKTOP = 12;
const PLOT_PAD_X_MOBILE = 6;

const axisTextClass =
  "font-sans text-[10px] font-normal leading-none text-foreground sm:text-small";

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

function buildXAxisTicks(
  chartStartMs: number,
  chartEndMs: number,
): { ms: number; label: string }[] {
  const ticks: { ms: number; label: string }[] = [];
  for (let ms = chartStartMs; ms <= chartEndMs; ms += X_TICK_INTERVAL_DAYS * DAY_MS) {
    ticks.push({ ms, label: formatDecisionChartDate(msToLocalIsoDate(ms)) });
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

export default function DecisionTimeChart({
  points,
  compact = false,
}: {
  points: DecisionSpeedChartPoint[];
  compact?: boolean;
}) {
  const gradientId = useId();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const yAxisWidth = compact ? Y_AXIS_WIDTH_MOBILE : Y_AXIS_WIDTH_DESKTOP;
  const plotPadX = compact ? PLOT_PAD_X_MOBILE : PLOT_PAD_X_DESKTOP;
  const plotWidth = compact ? 480 : 448;
  const plotHeight = PLOT_HEIGHT;
  const innerPlotHeight = plotHeight - PLOT_PAD_Y * 2;
  const innerPlotWidth = plotWidth - plotPadX * 2;
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
    if (axisDateRange === 0) return plotPadX + innerPlotWidth / 2;
    const ratio = (dateMs - chartStartMs) / axisDateRange;
    return plotPadX + ratio * innerPlotWidth;
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
            width: yAxisWidth,
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
                  x1={plotPadX}
                  y1={y}
                  x2={plotWidth - plotPadX}
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
        style={{ marginLeft: yAxisWidth }}
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
