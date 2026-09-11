import type { ReactNode } from "react";
import type { DateRangeKey } from "@/data/orchestrationMetrics";
import type { DeliveryFunnelMetrics } from "@/data/dashboardMetrics";
import {
  formatFunnelPercent,
  resolveFunnelDisplay,
} from "@/data/overviewDisplay";
import DashboardCardDateRange from "./DashboardCardDateRange";

type DeliveryFunnelProps = {
  funnel: DeliveryFunnelMetrics;
  dateRange: DateRangeKey;
  onDateRangeChange: (value: DateRangeKey) => void;
};

type SegmentDef = {
  value: number;
  label: string;
  fill: string;
  icon: ReactNode;
};

const FUNNEL_WIDTH = 272;
const SEGMENT_HEIGHT = 72;
const SEGMENT_GAP = 5;
const TOP_RADIUS = 2;
const BOTTOM_RADIUS = 1;

/** Tapered widths as fraction of max (1.0 = widest at top). */
const TAPER_WIDTHS = [1, 0.88, 0.76, 0.66, 0.56];

function buildRoundedTrapezoidPath(
  topWidth: number,
  bottomWidth: number,
  height: number,
): string {
  const inset = (topWidth - bottomWidth) / 2;
  const rt = TOP_RADIUS;
  const rb = BOTTOM_RADIUS;

  return [
    `M ${inset + rb} ${height}`,
    `H ${topWidth - inset - rb}`,
    `Q ${topWidth - inset} ${height} ${topWidth - inset} ${height - rb}`,
    `L ${topWidth - rt} ${rt}`,
    `Q ${topWidth} 0 ${topWidth - rt} 0`,
    `H ${rt}`,
    `Q 0 0 0 ${rt}`,
    `L ${inset} ${height - rb}`,
    `Q ${inset} ${height} ${inset + rb} ${height}`,
    "Z",
  ].join(" ");
}

function getLegendPositions(
  segmentCount: number,
  segmentHeight: number,
  gap: number,
): number[] {
  const totalHeight = segmentCount * segmentHeight + (segmentCount - 1) * gap;

  return Array.from({ length: segmentCount - 1 }, (_, index) => {
    const boundaryY = (index + 1) * segmentHeight + index * gap + gap / 2;
    return boundaryY / totalHeight;
  });
}

function SegmentIcon({
  type,
}: {
  type: "requests" | "matched" | "quoted" | "confirmed" | "delivered";
}) {
  const className = "h-4 w-4";
  if (type === "requests") {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M5 3h10v14H5z" strokeLinejoin="round" />
        <path d="M8 7h4M8 10h4M8 13h2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "matched") {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="13" cy="7" r="2.5" />
        <path d="M3 16c0-2.5 1.8-4 4-4s4 1.5 4 4M13 12c2.2 0 4 1.5 4 4" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "quoted") {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path
          d="M4 4h6l4 4v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (type === "confirmed") {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="10" cy="10" r="7" />
        <path d="M7 10l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2 8h12l2 4v4H2V8z" strokeLinejoin="round" />
      <circle cx="6" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="14" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <path d="M2 8l2-4h8l2 4" strokeLinejoin="round" />
    </svg>
  );
}

function buildSegments(funnel: DeliveryFunnelMetrics): SegmentDef[] {
  return [
    {
      value: funnel.totalRequests,
      label: "Total requests",
      fill: "#ee5a1b",
      icon: <SegmentIcon type="requests" />,
    },
    {
      value: funnel.matched,
      label: "Providers matched",
      fill: "#f57c23",
      icon: <SegmentIcon type="matched" />,
    },
    {
      value: funnel.quoted,
      label: "Quotes received",
      fill: "#eab308",
      icon: <SegmentIcon type="quoted" />,
    },
    {
      value: funnel.confirmed,
      label: "Bookings confirmed",
      fill: "#4ade80",
      icon: <SegmentIcon type="confirmed" />,
    },
    {
      value: funnel.delivered,
      label: "Delivered",
      fill: "#14b8a6",
      icon: <SegmentIcon type="delivered" />,
    },
  ];
}

type RateLegendItem = {
  label: string;
  rate: number;
  color: string;
  description: string;
};

function buildRateLegend(funnel: DeliveryFunnelMetrics): RateLegendItem[] {
  return [
    {
      label: "Match rate",
      rate: funnel.matchRate,
      color: "#f57c23",
      description: "Providers found for your request",
    },
    {
      label: "Quote rate",
      rate: funnel.quoteRate,
      color: "#eab308",
      description: "Providers responded with quotes",
    },
    {
      label: "Confirmation rate",
      rate: funnel.confirmationRate,
      color: "#4ade80",
      description: "Bookings confirmed after selection",
    },
    {
      label: "Delivery rate",
      rate: funnel.deliveryRate,
      color: "#14b8a6",
      description: "Successfully delivered",
    },
  ];
}

function VerticalFunnelGraphic({ segments }: { segments: SegmentDef[] }) {
  return (
    <div
      className="flex shrink-0 flex-col items-center"
      style={{ width: FUNNEL_WIDTH, gap: SEGMENT_GAP }}
      role="img"
      aria-label="Delivery funnel stages"
    >
      {segments.map((segment, index) => {
        const topWidth = FUNNEL_WIDTH * TAPER_WIDTHS[index];
        const bottomWidth =
          FUNNEL_WIDTH *
          (TAPER_WIDTHS[index + 1] ?? TAPER_WIDTHS[index] * 0.92);

        return (
          <div
            key={segment.label}
            className="relative shrink-0"
            style={{ width: topWidth, height: SEGMENT_HEIGHT }}
          >
            <svg
              viewBox={`0 0 ${topWidth} ${SEGMENT_HEIGHT}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d={buildRoundedTrapezoidPath(topWidth, bottomWidth, SEGMENT_HEIGHT)}
                fill={segment.fill}
              />
            </svg>
            <div className="relative flex h-full flex-col items-center justify-center px-1.5 text-center text-white">
              <span className="mb-0.5 shrink-0 opacity-95" aria-hidden="true">
                {segment.icon}
              </span>
              <p className="shrink-0 text-xl font-bold leading-none">
                {segment.value.toLocaleString()}
              </p>
              <p className="mt-1 line-clamp-2 max-w-full text-[10px] leading-snug opacity-95">
                {segment.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RateLegend({
  items,
  funnelHeight,
  legendPositions,
}: {
  items: RateLegendItem[];
  funnelHeight: number;
  legendPositions: number[];
}) {
  return (
    <div
      className="relative min-w-0 flex-1 pl-5"
      style={{ height: funnelHeight }}
    >
      <span
        className="absolute bottom-3 left-[5px] top-3 w-px bg-border/30"
        aria-hidden="true"
      />
      {items.map((item, index) => (
        <div
          key={item.label}
          className="absolute left-0 flex max-w-full gap-3 pr-1"
          style={{
            top: `${legendPositions[index] * 100}%`,
            transform: "translateY(-50%)",
          }}
        >
          <span
            className="relative z-10 mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-background"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-small font-semibold text-foreground">
              {formatFunnelPercent(item.rate)}{" "}
              <span className="font-semibold">{item.label}</span>
            </p>
            <p className="mt-0.5 text-caption leading-snug text-muted-foreground">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DeliveryFunnel({
  funnel,
  dateRange,
  onDateRangeChange,
}: DeliveryFunnelProps) {
  const displayFunnel = resolveFunnelDisplay(funnel);
  const segments = buildSegments(displayFunnel);
  const legendItems = buildRateLegend(displayFunnel);
  const funnelHeight =
    segments.length * SEGMENT_HEIGHT + (segments.length - 1) * SEGMENT_GAP;
  const legendPositions = getLegendPositions(
    segments.length,
    SEGMENT_HEIGHT,
    SEGMENT_GAP,
  );

  return (
    <article
      className="self-start rounded-card border border-border/60 bg-background p-6 shadow-sm"
      aria-labelledby="delivery-funnel-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="delivery-funnel-heading"
            className="text-body font-semibold text-foreground md:text-subheading"
          >
            Delivery Funnel
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
            How Doot evaluates and selects the best delivery partner.
          </p>
        </div>
        <DashboardCardDateRange
          value={dateRange}
          onChange={onDateRangeChange}
          compact
        />
      </div>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
        <VerticalFunnelGraphic segments={segments} />
        <RateLegend
          items={legendItems}
          funnelHeight={funnelHeight}
          legendPositions={legendPositions}
        />
      </div>
    </article>
  );
}
