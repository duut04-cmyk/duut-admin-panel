"use client";

import { useId, type ReactNode } from "react";
import { buildSparklinePath } from "./sparklineUtils";

export type MetricTheme = "orange" | "green" | "blue" | "purple";

const themeStyles: Record<
  MetricTheme,
  {
    iconBg: string;
    iconColor: string;
    stroke: string;
    fillStart: string;
    fillEnd: string;
  }
> = {
  orange: {
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    stroke: "#f97316",
    fillStart: "rgba(249, 115, 22, 0.22)",
    fillEnd: "rgba(249, 115, 22, 0)",
  },
  green: {
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    stroke: "#10b981",
    fillStart: "rgba(16, 185, 129, 0.22)",
    fillEnd: "rgba(16, 185, 129, 0)",
  },
  blue: {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    stroke: "#3b82f6",
    fillStart: "rgba(59, 130, 246, 0.22)",
    fillEnd: "rgba(59, 130, 246, 0)",
  },
  purple: {
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    stroke: "#8b5cf6",
    fillStart: "rgba(139, 92, 246, 0.22)",
    fillEnd: "rgba(139, 92, 246, 0)",
  },
};

const SPARKLINE_WIDTH = 300;
const SPARKLINE_HEIGHT = 44;

type OverviewMetricCardProps = {
  title: string;
  value: ReactNode;
  supportingText?: string;
  theme: MetricTheme;
  icon: ReactNode;
  sparklineValues: number[];
};

export default function OverviewMetricCard({
  title,
  value,
  supportingText,
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
    <article className="flex flex-col rounded-xl border border-border/80 bg-background shadow-sm">
      <div className="flex flex-col px-5 pb-5 pt-5">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconColor}`}
            aria-hidden="true"
          >
            {icon}
          </span>
          <p className="text-body font-semibold text-foreground">{title}</p>
        </div>

        <p className="mt-4 text-[2rem] font-bold leading-none tracking-tight text-foreground">
          {value}
        </p>

        {supportingText && (
          <p className="mt-2 text-small text-muted-foreground">{supportingText}</p>
        )}

        <div className="mt-4 w-full" aria-hidden="true">
          <svg
            viewBox={`0 0 ${SPARKLINE_WIDTH} ${SPARKLINE_HEIGHT}`}
            className="block h-11 w-full"
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
              r="3"
              fill={styles.stroke}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    </article>
  );
}

export function DeliveriesIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M3 5a2 2 0 0 1 2-2h2.5l1 2H15a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z" />
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

export function BookingIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="12" height="14" rx="1.5" />
      <path d="M7 8h6M7 11h4" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon() {
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
