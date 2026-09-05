"use client";

import { useId, useMemo } from "react";
import {
  formatPercent,
  getCancelledBookingCount,
  getPendingBookingCount,
  type PlatformMetrics,
} from "@/data/orchestrationMetrics";
import type { OrchestrationRecord } from "@/data/orchestrationTypes";

type BookingOutcomesChartProps = {
  metrics: PlatformMetrics;
  records: OrchestrationRecord[];
};

type OutcomeSegment = {
  key: string;
  label: string;
  count: number;
  color: string;
  textColor: string;
};

const VIEW_SIZE = 296;
const OUTER_RADIUS = 130;
const INNER_RADIUS = 66;
const CENTER = VIEW_SIZE / 2;
const CHART_DISPLAY_SIZE = 296;
const CONTENT_MIN_HEIGHT = 296;

function polarToCartesianFromTop(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function describeDonutSegment(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const startOuter = polarToCartesianFromTop(cx, cy, outerRadius, endAngle);
  const endOuter = polarToCartesianFromTop(cx, cy, outerRadius, startAngle);
  const startInner = polarToCartesianFromTop(cx, cy, innerRadius, startAngle);
  const endInner = polarToCartesianFromTop(cx, cy, innerRadius, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${startOuter.x.toFixed(2)} ${startOuter.y.toFixed(2)}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${endOuter.x.toFixed(2)} ${endOuter.y.toFixed(2)}`,
    `L ${startInner.x.toFixed(2)} ${startInner.y.toFixed(2)}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${endInner.x.toFixed(2)} ${endInner.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

function buildSegments(
  metrics: PlatformMetrics,
  pendingCount: number,
  cancelledCount: number,
): OutcomeSegment[] {
  return [
    {
      key: "confirmed",
      label: "Confirmed",
      count: metrics.successfulBookings,
      color: "#15803d",
      textColor: "#ffffff",
    },
    {
      key: "failed",
      label: "Failed",
      count: metrics.failedBookings,
      color: "#b91c1c",
      textColor: "#ffffff",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: cancelledCount,
      color: "#64748b",
      textColor: "#ffffff",
    },
    {
      key: "pending",
      label: "Pending",
      count: pendingCount,
      color: "#b45309",
      textColor: "#ffffff",
    },
  ];
}

export default function BookingOutcomesChart({
  metrics,
  records,
}: BookingOutcomesChartProps) {
  const labelId = useId();
  const pendingCount = useMemo(
    () => getPendingBookingCount(records),
    [records],
  );
  const cancelledCount = useMemo(
    () => getCancelledBookingCount(records),
    [records],
  );
  const segments = useMemo(
    () => buildSegments(metrics, pendingCount, cancelledCount),
    [metrics, pendingCount, cancelledCount],
  );

  const total = metrics.totalDeliveries;
  const pct = (count: number) =>
    total === 0 ? 0 : Math.round((count / total) * 1000) / 10;

  const activeSegments = segments.filter((segment) => segment.count > 0);

  const arcs = activeSegments.reduce<
    Array<
      OutcomeSegment & {
        startAngle: number;
        endAngle: number;
        path: string;
        labelPos: { x: number; y: number };
        segmentPct: number;
      }
    >
  >((accumulated, segment) => {
    const sweep = total === 0 ? 0 : (segment.count / total) * 360;
    const startAngle =
      accumulated.length === 0
        ? 0
        : accumulated[accumulated.length - 1].endAngle;
    const endAngle = startAngle + sweep;
    const midAngle = startAngle + sweep / 2;
    const labelRadius = (INNER_RADIUS + OUTER_RADIUS) / 2;
    const labelPos = polarToCartesianFromTop(
      CENTER,
      CENTER,
      labelRadius,
      midAngle,
    );
    const segmentPct = pct(segment.count);

    accumulated.push({
      ...segment,
      startAngle,
      endAngle,
      path:
        sweep > 0
          ? describeDonutSegment(
              CENTER,
              CENTER,
              INNER_RADIUS,
              OUTER_RADIUS,
              startAngle,
              endAngle,
            )
          : "",
      labelPos,
      segmentPct,
    });

    return accumulated;
  }, []);

  const ariaLabel = segments
    .map((segment) => `${segment.label}: ${segment.count}`)
    .join(", ");

  return (
    <article
      className="flex h-full flex-col rounded-xl border border-border/80 bg-background p-6 font-sans shadow-sm"
      aria-labelledby={labelId}
    >
      <h2
        id={labelId}
        className="text-body font-semibold text-foreground md:text-subheading"
      >
        Booking Outcomes
      </h2>
      <p className="mt-1 text-small text-muted-foreground">
        Result after booking the selected service
      </p>

      <div
        className="mt-2 flex flex-1 flex-col gap-6 sm:flex-row sm:items-start sm:gap-10"
        style={{ minHeight: CONTENT_MIN_HEIGHT }}
      >
        <div className="relative shrink-0">
          <svg
            viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
            className="shrink-0"
            style={{ width: CHART_DISPLAY_SIZE, height: CHART_DISPLAY_SIZE }}
            role="img"
            aria-label={ariaLabel}
          >
            {total === 0 ? (
              <circle
                cx={CENTER}
                cy={CENTER}
                r={OUTER_RADIUS}
                fill="#e2e8f0"
              />
            ) : (
              arcs.map((arc) =>
                arc.path ? (
                  <path
                    key={arc.key}
                    d={arc.path}
                    fill={arc.color}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                ) : null,
              )
            )}

            <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS} fill="#ffffff" />

            {arcs.map(
              (arc) =>
                arc.segmentPct >= 8 && (
                  <text
                    key={`${arc.key}-label`}
                    x={arc.labelPos.x}
                    y={arc.labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[12px] font-semibold"
                    fill={arc.textColor}
                  >
                    {formatPercent(arc.segmentPct)}
                  </text>
                ),
            )}
          </svg>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-[1.625rem] font-semibold tabular-nums text-foreground">
              {formatPercent(metrics.bookingSuccessRate)}
            </span>
          </div>
        </div>

        <div
          className="flex flex-1 flex-col justify-between sm:pt-12"
          style={{ minHeight: CHART_DISPLAY_SIZE }}
        >
          <ul className="w-full space-y-4">
            {segments.map((segment) => (
              <li
                key={segment.key}
                className="grid w-full grid-cols-[1fr_auto] items-center gap-x-4 text-body"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: segment.color }}
                    aria-hidden="true"
                  />
                  <span className="text-foreground">{segment.label}</span>
                </span>
                <span className="shrink-0 text-right tabular-nums text-muted-foreground">
                  {segment.count} ({formatPercent(pct(segment.count))})
                </span>
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <p className="text-body text-muted-foreground">
              Booking success rate
            </p>
            <p className="mt-1 text-subheading font-semibold tabular-nums text-foreground">
              {formatPercent(metrics.bookingSuccessRate)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
