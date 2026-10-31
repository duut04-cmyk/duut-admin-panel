"use client";

import type { FinanceSummary } from "@/data/financeTypes";
import { formatInrAmount, parseMoneyNumber } from "../lib/formatMoney";

type RefundSummaryDonutProps = {
  summary: FinanceSummary | null;
  loading?: boolean;
};

const COLORS = {
  successful: "#10B981",
  pending: "#FB923C",
  failed: "#EF4444",
} as const;

const SIZE = 208;
const STROKE = 26;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function RefundSummaryDonut({
  summary,
  loading,
}: RefundSummaryDonutProps) {
  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center py-1">
        <div
          className="animate-pulse rounded-full bg-muted/40"
          style={{ width: SIZE, height: SIZE }}
        />
      </div>
    );
  }

  const successful = parseMoneyNumber(summary.successfulRefunds.totalAmount);
  const pending = parseMoneyNumber(summary.pendingRefunds.totalAmount);
  const failed = parseMoneyNumber(summary.failedRefunds.totalAmount);
  const total = successful + pending + failed;
  const segments = [
    {
      key: "successful",
      label: "Successful",
      amount: successful,
      color: COLORS.successful,
    },
    { key: "pending", label: "Pending", amount: pending, color: COLORS.pending },
    { key: "failed", label: "Failed", amount: failed, color: COLORS.failed },
  ];

  let offset = 0;
  const arcs =
    total <= 0
      ? []
      : segments.map((segment) => {
          const length = (segment.amount / total) * CIRCUMFERENCE;
          const arc = {
            ...segment,
            dash: length,
            gap: CIRCUMFERENCE - length,
            offset,
            percent: Math.round((segment.amount / total) * 100),
          };
          offset += length;
          return arc;
        });

  return (
    <div className="flex items-center gap-4 sm:gap-5">
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
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
          <p className="text-xl font-bold leading-tight tabular-nums text-foreground">
            {formatInrAmount(total)}
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
            Total Refunds
          </p>
        </div>
      </div>

      <ul className="min-w-0 flex-1 space-y-3 text-small">
        {segments.map((segment) => {
          const percent = total <= 0 ? 0 : Math.round((segment.amount / total) * 100);
          return (
            <li key={segment.key} className="flex items-start gap-2.5">
              <span
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: segment.color }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="font-semibold leading-snug text-foreground">
                  {segment.label}
                </p>
                <p className="tabular-nums leading-snug text-muted-foreground">
                  {formatInrAmount(segment.amount)} ({percent}%)
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
