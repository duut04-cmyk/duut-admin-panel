"use client";

import { useId, type ReactNode } from "react";
import type { MetricTrend } from "@/data/dashboardMetrics";
import { buildSparklinePath } from "./sparklineUtils";

export type MetricTheme =
  "orange" | "green" | "blue" | "purple" | "pink" | "red" | "slate";

const themeStyles: Record<
  MetricTheme,
  {
    iconBg: string;
    iconColor: string;
    stroke: string;
    fillStart: string;
    fillEnd: string;
    trendPositive: string;
    trendNegative: string;
  }
> = {
  orange: {
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    stroke: "#f97316",
    fillStart: "rgba(249, 115, 22, 0.18)",
    fillEnd: "rgba(249, 115, 22, 0)",
    trendPositive: "text-emerald-600",
    trendNegative: "text-red-600",
  },
  green: {
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    stroke: "#10b981",
    fillStart: "rgba(16, 185, 129, 0.18)",
    fillEnd: "rgba(16, 185, 129, 0)",
    trendPositive: "text-emerald-600",
    trendNegative: "text-red-600",
  },
  blue: {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    stroke: "#3b82f6",
    fillStart: "rgba(59, 130, 246, 0.18)",
    fillEnd: "rgba(59, 130, 246, 0)",
    trendPositive: "text-emerald-600",
    trendNegative: "text-red-600",
  },
  purple: {
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    stroke: "#8b5cf6",
    fillStart: "rgba(139, 92, 246, 0.18)",
    fillEnd: "rgba(139, 92, 246, 0)",
    trendPositive: "text-emerald-600",
    trendNegative: "text-red-600",
  },
  pink: {
    iconBg: "bg-pink-100",
    iconColor: "text-admin-pink",
    stroke: "#ec4899",
    fillStart: "rgba(236, 72, 153, 0.18)",
    fillEnd: "rgba(236, 72, 153, 0)",
    trendPositive: "text-emerald-600",
    trendNegative: "text-admin-pink",
  },
  red: {
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    stroke: "#ef4444",
    fillStart: "rgba(239, 68, 68, 0.18)",
    fillEnd: "rgba(239, 68, 68, 0)",
    trendPositive: "text-emerald-600",
    trendNegative: "text-red-600",
  },
  slate: {
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    stroke: "#64748b",
    fillStart: "rgba(100, 116, 139, 0.18)",
    fillEnd: "rgba(100, 116, 139, 0)",
    trendPositive: "text-emerald-600",
    trendNegative: "text-red-600",
  },
};

const SPARKLINE_WIDTH = 300;
const SPARKLINE_HEIGHT = 36;

type OverviewMetricCardProps = {
  title: string;
  value: ReactNode;
  supportingText?: string;
  trend?: MetricTrend;
  theme: MetricTheme;
  icon: ReactNode;
  sparklineValues: number[];
};

function TrendArrow({ up }: { up: boolean }) {
  return (
    <svg
      className="h-3 w-3 shrink-0"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {up ? (
        <path d="M6 9V3M6 3L3 6M6 3l3 3" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M6 3v6M6 9L3 6M6 9l3-3" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function MetricTrendLine({ trend, theme }: { trend: MetricTrend; theme: MetricTheme }) {
  const styles = themeStyles[theme];
  const isUp = trend.direction === "positive";
  const colorClass =
    trend.direction === "neutral"
      ? "text-muted-foreground"
      : isUp
        ? styles.trendPositive
        : styles.trendNegative;

  const displayValue = trend.value.replace(/^[+-]/, "");

  return (
    <p
      className={`mt-2 flex flex-wrap items-center gap-1 text-caption font-medium ${colorClass}`}
    >
      {trend.direction !== "neutral" && <TrendArrow up={isUp} />}
      <span>{displayValue} vs. last 30 days</span>
    </p>
  );
}

export default function OverviewMetricCard({
  title,
  value,
  supportingText,
  trend,
  theme,
  icon,
  sparklineValues,
}: OverviewMetricCardProps) {
  const styles = themeStyles[theme];
  const gradientId = useId();
  const { line, area, lastPoint } = buildSparklinePath(
    sparklineValues,
    SPARKLINE_WIDTH,
    SPARKLINE_HEIGHT,
  );

  return (
    <article className="flex flex-col rounded-card border border-border/60 bg-background shadow-sm">
      <div className="flex flex-col px-3 pb-3 pt-3 sm:px-4 sm:pt-4">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconColor}`}
            aria-hidden="true"
          >
            {icon}
          </span>
          <p className="min-w-0 text-small font-medium leading-snug text-muted-foreground line-clamp-2 sm:line-clamp-1">
            {title}
          </p>
        </div>

        <p className="mt-2 text-xl font-bold leading-none tracking-tight text-foreground sm:mt-3 sm:text-[1.75rem]">
          {value}
        </p>

        {trend && <MetricTrendLine trend={trend} theme={theme} />}
        {!trend && supportingText && (
          <p className="mt-2 text-caption text-muted-foreground">{supportingText}</p>
        )}

        <div className="mt-3 w-full" aria-hidden="true">
          <svg
            viewBox={`0 0 ${SPARKLINE_WIDTH} ${SPARKLINE_HEIGHT}`}
            className="block h-9 w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={styles.fillStart} />
                <stop offset="100%" stopColor={styles.fillEnd} />
              </linearGradient>
            </defs>
            <path d={area} fill={`url(#${gradientId})`} />
            <path
              d={line}
              fill="none"
              stroke={styles.stroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r="2.5"
              fill={styles.stroke}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    </article>
  );
}

export function PackageIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M3 6l7-3 7 3v8l-7 3-7-3V6z" strokeLinejoin="round" />
      <path d="M10 3v15M3 6l7 4 7-4" strokeLinejoin="round" />
    </svg>
  );
}

export function DeliveredIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 10l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InProgressIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6.5V10l2.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TicketIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        d="M5 5h10a1 1 0 0 1 1 1v2a1.5 1.5 0 0 0 0 3v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1.5 1.5 0 0 0 0-3V6a1 1 0 0 1 1-1z"
        strokeLinejoin="round"
      />
      <path d="M10 7v6" strokeLinecap="round" strokeDasharray="2 2" />
    </svg>
  );
}

export function StopwatchIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <circle cx="10" cy="11" r="6" />
      <path d="M10 8v3.5l2 1.5M8 3h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FailedIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7" />
      <path d="M7 7l6 6M13 7l-6 6" strokeLinecap="round" />
    </svg>
  );
}

export function CancelledIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7" />
      <path d="M6.5 10h7" strokeLinecap="round" />
    </svg>
  );
}
