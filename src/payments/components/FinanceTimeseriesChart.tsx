"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FinanceTimeseriesPoint } from "@/data/financeTypes";
import { buildSmoothLine } from "@/overview/components/sparklineUtils";
import {
  formatInrAmount,
  formatInrCompact,
  parseMoneyNumber,
} from "../lib/formatMoney";

type FinanceTimeseriesChartProps = {
  points: FinanceTimeseriesPoint[];
};

const COLORS = {
  collections: "#2563EB",
  refunds: "#10B981",
  net: "#8B5CF6",
} as const;

const HEIGHT = 224;

function chartPadding(chartWidth: number) {
  return {
    top: 16,
    right: 0,
    bottom: 36,
    left: Math.min(48, Math.max(36, chartWidth * 0.08)),
  };
}

function formatAxisLabel(bucketStart: string, bucketLabel: string): string {
  const parsed = new Date(bucketStart);
  if (!Number.isNaN(parsed.getTime())) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      month: "short",
      day: "numeric",
    }).format(parsed);
  }
  return bucketLabel;
}

function valueToPoints(
  values: number[],
  maxY: number,
  plotW: number,
  plotH: number,
  pad: ReturnType<typeof chartPadding>,
): { x: number; y: number }[] {
  const step = values.length === 1 ? 0 : plotW / (values.length - 1);
  return values.map((value, index) => ({
    x: pad.left + index * step,
    y: pad.top + plotH - (value / maxY) * plotH,
  }));
}

function buildSmoothArea(
  values: number[],
  maxY: number,
  plotW: number,
  plotH: number,
  pad: ReturnType<typeof chartPadding>,
): string {
  const pts = valueToPoints(values, maxY, plotW, plotH, pad);
  if (pts.length === 0) return "";
  const line = buildSmoothLine(pts);
  const last = pts[pts.length - 1]!;
  const first = pts[0]!;
  const baseY = pad.top + plotH;
  return `${line} L ${last.x.toFixed(1)} ${baseY} L ${first.x.toFixed(1)} ${baseY} Z`;
}

export default function FinanceTimeseriesChart({
  points,
}: FinanceTimeseriesChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(640);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => {
      const next = element.clientWidth;
      if (next > 0) {
        setChartWidth(next);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const pad = chartPadding(chartWidth);
  const plotW = Math.max(chartWidth - pad.left - pad.right, 1);
  const plotH = HEIGHT - pad.top - pad.bottom;

  const series = useMemo(() => {
    const collections = points.map((p) => parseMoneyNumber(p.collections));
    const refunds = points.map((p) => parseMoneyNumber(p.successfulRefunds));
    const net = points.map((p) => parseMoneyNumber(p.net));
    const maxY = Math.max(...collections, ...refunds, ...net.map(Math.abs), 1);

    const collectionPts = valueToPoints(collections, maxY, plotW, plotH, pad);
    const refundPts = valueToPoints(refunds, maxY, plotW, plotH, pad);
    const netPts = valueToPoints(net, maxY, plotW, plotH, pad);

    return {
      collections,
      refunds,
      net,
      maxY,
      collectionLine: buildSmoothLine(collectionPts),
      refundLine: buildSmoothLine(refundPts),
      netLine: buildSmoothLine(netPts),
      collectionArea: buildSmoothArea(collections, maxY, plotW, plotH, pad),
      collectionPts,
      refundPts,
      netPts,
    };
  }, [points, chartWidth, plotW, plotH, pad.left, pad.right, pad.top, pad.bottom]);

  if (points.length === 0) {
    return (
      <p className="text-small text-muted-foreground">
        No collection or refund activity in this period.
      </p>
    );
  }

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    ratio,
    value: series.maxY * ratio,
    y: pad.top + plotH * (1 - ratio),
  }));

  const step = points.length === 1 ? 0 : plotW / (points.length - 1);
  const labelEvery = Math.max(1, Math.ceil(points.length / 5));
  const plotRight = pad.left + plotW;

  const hovered = hoverIndex != null ? points[hoverIndex] : null;

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      <svg
        viewBox={`0 0 ${chartWidth} ${HEIGHT}`}
        width={chartWidth}
        height={HEIGHT}
        className="block h-56 w-full max-w-none"
        preserveAspectRatio="none"
        role="img"
        aria-label="Collections, refunds, and net activity over time"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="collectionsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.collections} stopOpacity="0.28" />
            <stop offset="100%" stopColor={COLORS.collections} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => (
          <g key={tick.ratio}>
            <line
              x1={pad.left}
              x2={plotRight}
              y1={tick.y}
              y2={tick.y}
              stroke="rgba(15,23,42,0.07)"
            />
            <text
              x={pad.left - 6}
              y={tick.y + 4}
              textAnchor="end"
              fill="rgba(15,23,42,0.45)"
              style={{ fontSize: 11 }}
            >
              {formatInrCompact(tick.value)}
            </text>
          </g>
        ))}

        {points.map((_, index) => {
          if (index % labelEvery !== 0 && index !== points.length - 1) {
            return null;
          }
          const x = pad.left + index * step;
          return (
            <line
              key={`v-${index}`}
              x1={x}
              x2={x}
              y1={pad.top}
              y2={pad.top + plotH}
              stroke="rgba(15,23,42,0.05)"
            />
          );
        })}

        <path d={series.collectionArea} fill="url(#collectionsFill)" />
        <path
          d={series.collectionLine}
          fill="none"
          stroke={COLORS.collections}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={series.refundLine}
          fill="none"
          stroke={COLORS.refunds}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={series.netLine}
          fill="none"
          stroke={COLORS.net}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {points.map((point, index) => {
          const cp = series.collectionPts[index]!;
          const rp = series.refundPts[index]!;
          const np = series.netPts[index]!;
          const x = pad.left + index * step;
          const showLabel = index % labelEvery === 0 || index === points.length - 1;
          return (
            <g key={point.bucketStart}>
              <rect
                x={x - step / 2}
                y={pad.top}
                width={Math.max(step, 12)}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(index)}
              />
              <circle cx={cp.x} cy={cp.y} r="4" fill={COLORS.collections} />
              <circle cx={rp.x} cy={rp.y} r="4" fill={COLORS.refunds} />
              <circle cx={np.x} cy={np.y} r="4" fill={COLORS.net} />
              {showLabel ? (
                <text
                  x={x}
                  y={HEIGHT - 10}
                  textAnchor="middle"
                  fill="rgba(15,23,42,0.45)"
                  style={{ fontSize: 11 }}
                >
                  {formatAxisLabel(point.bucketStart, point.bucketLabel)}
                </text>
              ) : null}
            </g>
          );
        })}

        {hoverIndex != null ? (
          <line
            x1={pad.left + hoverIndex * step}
            x2={pad.left + hoverIndex * step}
            y1={pad.top}
            y2={pad.top + plotH}
            stroke="rgba(15,23,42,0.15)"
            strokeDasharray="4 4"
          />
        ) : null}
      </svg>

      {hovered && hoverIndex != null ? (
        <div
          className="pointer-events-none absolute z-10 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-md"
          style={{
            left: `min(calc(${((pad.left + hoverIndex * step) / chartWidth) * 100}% + 8px), calc(100% - 12rem))`,
            top: 8,
          }}
        >
          <p className="font-medium">
            {formatAxisLabel(hovered.bucketStart, hovered.bucketLabel)}
          </p>
          <p className="mt-1 text-blue-200">
            Collections {formatInrAmount(hovered.collections)}
          </p>
          <p className="text-emerald-200">
            Refunds {formatInrAmount(hovered.successfulRefunds)}
          </p>
          <p className="text-violet-200">Net {formatInrAmount(hovered.net)}</p>
        </div>
      ) : null}
    </div>
  );
}
