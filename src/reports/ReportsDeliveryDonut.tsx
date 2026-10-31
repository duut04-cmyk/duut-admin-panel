"use client";

import type { ReportingSummary } from "@/data/reportingTypes";

type ReportsDeliveryDonutProps = {
  summary: ReportingSummary;
  loading?: boolean;
};

const COLORS = {
  delivered: "#10B981",
  inProgress: "#3B82F6",
  cancelled: "#FB923C",
  failed: "#EF4444",
} as const;

const SIZE = 180;
const STROKE = 22;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ReportsDeliveryDonut({ summary, loading }: ReportsDeliveryDonutProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div
          className="animate-pulse rounded-full bg-muted/40"
          style={{ width: SIZE, height: SIZE }}
        />
      </div>
    );
  }

  const d = summary.deliveriesCreated;
  const segments = [
    {
      key: "delivered",
      label: "Delivered",
      value: d.deliveredCurrentStatus,
      color: COLORS.delivered,
    },
    {
      key: "inProgress",
      label: "In progress",
      value: d.inProgress,
      color: COLORS.inProgress,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      value: d.cancelled,
      color: COLORS.cancelled,
    },
    {
      key: "failed",
      label: "Failed",
      value: d.failed,
      color: COLORS.failed,
    },
  ];

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let offset = 0;
  const arcs =
    total <= 0
      ? []
      : segments
          .filter((s) => s.value > 0)
          .map((segment) => {
            const length = (segment.value / total) * CIRCUMFERENCE;
            const arc = {
              ...segment,
              dash: length,
              gap: CIRCUMFERENCE - length,
              offset,
              percent: Math.round((segment.value / total) * 100),
            };
            offset += length;
            return arc;
          });

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(15,23,42,0.06)"
            strokeWidth={STROKE}
          />
          {arcs.length === 0 ? null : (
            <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
              {arcs.map((arc) => (
                <circle
                  key={arc.key}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${arc.dash} ${arc.gap}`}
                  strokeDashoffset={-arc.offset}
                  strokeLinecap="butt"
                />
              ))}
            </g>
          )}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Total
          </p>
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {d.total.toLocaleString()}
          </p>
        </div>
      </div>

      <ul className="w-full space-y-2.5 sm:w-auto sm:min-w-[148px]">
        {segments.map((segment) => (
          <li
            key={segment.key}
            className="flex items-center justify-between gap-4 text-small"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segment.color }}
                aria-hidden
              />
              {segment.label}
            </span>
            <span className="font-medium tabular-nums text-foreground">
              {segment.value.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
