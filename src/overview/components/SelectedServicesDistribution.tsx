"use client";

import { useId, useMemo } from "react";
import type { ServicePerformance } from "@/data/orchestrationMetrics";
import { formatPercent } from "@/data/orchestrationMetrics";

type SelectedServicesDistributionProps = {
  services: ServicePerformance[];
};

type DistributionSegment = {
  serviceId: string;
  label: string;
  count: number;
  color: string;
  textColor: string;
};

const VIEW_SIZE = 296;
const OUTER_RADIUS = 130;
const INNER_RADIUS = 62;
const CENTER = VIEW_SIZE / 2;
const CHART_DISPLAY_SIZE = 296;
const CONTENT_MIN_HEIGHT = 296;

const SERVICE_ORDER = [
  "flashdrop",
  "cityfleet",
  "movex",
  "swiftgo",
  "quickroute",
];

const SERVICE_COLORS: Record<string, string> = {
  flashdrop: "#f97316",
  cityfleet: "#15803d",
  movex: "#eab308",
  swiftgo: "#60a5fa",
  quickroute: "#475569",
};

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

function sortServices(services: ServicePerformance[]): ServicePerformance[] {
  return [...services].sort((a, b) => {
    const aIndex = SERVICE_ORDER.indexOf(a.serviceId);
    const bIndex = SERVICE_ORDER.indexOf(b.serviceId);
    const aOrder = aIndex === -1 ? SERVICE_ORDER.length : aIndex;
    const bOrder = bIndex === -1 ? SERVICE_ORDER.length : bIndex;
    return aOrder - bOrder;
  });
}

export default function SelectedServicesDistribution({
  services,
}: SelectedServicesDistributionProps) {
  const labelId = useId();

  const { legendItems, arcs, totalSelections, ariaLabel } = useMemo(() => {
    const ordered = sortServices(services);
    const total = ordered.reduce((sum, service) => sum + service.timesSelected, 0);

    const legendItems: DistributionSegment[] = ordered.map((service) => ({
      serviceId: service.serviceId,
      label: service.serviceName,
      count: service.timesSelected,
      color: SERVICE_COLORS[service.serviceId] ?? "#94a3b8",
      textColor: "#ffffff",
    }));

    const pct = (count: number) =>
      total === 0 ? 0 : Math.round((count / total) * 1000) / 10;

    const activeSegments = legendItems.filter((segment) => segment.count > 0);

    const builtArcs = activeSegments.reduce<
      Array<
        DistributionSegment & {
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

    return {
      legendItems,
      arcs: builtArcs,
      totalSelections: total,
      ariaLabel: legendItems
        .map((item) => `${item.label}: ${item.count}`)
        .join(", "),
    };
  }, [services]);

  const sharePct = (count: number) =>
    totalSelections === 0
      ? 0
      : Math.round((count / totalSelections) * 1000) / 10;

  return (
    <article
      className="flex h-full flex-col rounded-xl border border-border/80 bg-background p-6 font-sans shadow-sm"
      aria-labelledby={labelId}
    >
      <h2
        id={labelId}
        className="text-body font-semibold text-foreground md:text-subheading"
      >
        Selected Services Distribution
      </h2>
      <p className="mt-1 text-small text-muted-foreground">
        How often each service is chosen
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
            {totalSelections === 0 ? (
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
                    key={arc.serviceId}
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
                    key={`${arc.serviceId}-label`}
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
        </div>

        <div
          className="flex flex-1 flex-col justify-between sm:pt-12"
          style={{ minHeight: CHART_DISPLAY_SIZE }}
        >
          <ul className="w-full space-y-4">
            {legendItems.map((item) => (
              <li
                key={item.serviceId}
                className="grid w-full grid-cols-[1fr_auto] items-center gap-x-4 text-body"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <span className="text-foreground">{item.label}</span>
                </span>
                <span className="shrink-0 text-right tabular-nums text-muted-foreground">
                  {formatPercent(sharePct(item.count))} ({item.count})
                </span>
              </li>
            ))}
          </ul>

          <p className="pt-4 text-body text-muted-foreground">
            Total selections:{" "}
            <span className="font-semibold text-foreground">
              {totalSelections}
            </span>
          </p>
        </div>
      </div>
    </article>
  );
}
