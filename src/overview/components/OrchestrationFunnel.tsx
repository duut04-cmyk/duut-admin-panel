import type { OrchestrationRecord } from "@/data/orchestrationTypes";
import {
  countEligibleEvaluations,
  formatPercent,
  type PlatformMetrics,
} from "@/data/orchestrationMetrics";

const FUNNEL_VIEW_WIDTH = 280;
const FUNNEL_VIEW_HEIGHT = 300;
const SEGMENT_GAP = 1.5;
const CORNER_RADIUS = 5;

type FunnelStage = {
  value: number;
  label: string;
  detail: string;
  dotColor: string;
  segmentColor: string;
};

type OrchestrationFunnelProps = {
  metrics: PlatformMetrics;
  records: OrchestrationRecord[];
};

function buildFunnelStages(
  metrics: PlatformMetrics,
  records: OrchestrationRecord[],
): FunnelStage[] {
  const eligibleCount = countEligibleEvaluations(records);
  const eligibleDetail =
    metrics.totalAvailableOptions === 0
      ? "No available services"
      : eligibleCount === metrics.totalAvailableOptions
        ? "All available were eligible"
        : `${formatPercent((eligibleCount / metrics.totalAvailableOptions) * 100)} eligible rate`;

  return [
    {
      value: metrics.totalServicesEvaluated,
      label: "Services Evaluated",
      detail: `${metrics.averageOptionsPerDelivery} avg. per delivery`,
      dotColor: "#ee5a1b",
      segmentColor: "#ee5a1b",
    },
    {
      value: metrics.totalAvailableOptions,
      label: "Available",
      detail: `${formatPercent(metrics.availabilityRate)} availability rate`,
      dotColor: "#f57c23",
      segmentColor: "#f57c23",
    },
    {
      value: eligibleCount,
      label: "Eligible (Compatible)",
      detail: eligibleDetail,
      dotColor: "#f7a61c",
      segmentColor: "#f7a61c",
    },
    {
      value: metrics.totalDeliveries,
      label: "Selected",
      detail: "Best option chosen",
      dotColor: "#bdf2ce",
      segmentColor: "#bdf2ce",
    },
    {
      value: metrics.successfulBookings,
      label: "Bookings Confirmed",
      detail: `${formatPercent(metrics.bookingSuccessRate)} success rate`,
      dotColor: "#4ad97f",
      segmentColor: "#4ad97f",
    },
  ];
}

function getSpanAtRatio(topWidth: number, tipWidth: number, ratio: number): number {
  return topWidth - (topWidth - tipWidth) * ratio;
}

function clampRadius(
  radius: number,
  height: number,
  topWidth: number,
  bottomWidth: number,
): number {
  if (radius <= 0 || height <= 0) return 0;
  return Math.min(
    radius,
    height / 2 - 0.25,
    topWidth / 2 - 0.25,
    bottomWidth / 2 - 0.25,
  );
}


function getSegmentEdges(
  index: number,
  segmentHeight: number,
  bodyHeight: number,
  topWidth: number,
  tipWidth: number,
  viewWidth: number,
) {
  const yTop = index * (segmentHeight + SEGMENT_GAP);
  const yBottom = yTop + segmentHeight;
  const topRatio = yTop / bodyHeight;
  const bottomRatio = yBottom / bodyHeight;
  const topSpan = getSpanAtRatio(topWidth, tipWidth, topRatio);
  const bottomSpan = getSpanAtRatio(topWidth, tipWidth, bottomRatio);
  const centerX = viewWidth / 2;

  return {
    yTop,
    yBottom,
    topLeft: centerX - topSpan / 2,
    topRight: centerX + topSpan / 2,
    bottomLeft: centerX - bottomSpan / 2,
    bottomRight: centerX + bottomSpan / 2,
    bottomSpan,
  };
}

function firstSegmentPath(
  topLeftX: number,
  topRightX: number,
  bottomRightX: number,
  bottomLeftX: number,
  yTop: number,
  yBottom: number,
  radius: number,
): string {
  const height = yBottom - yTop;
  const topSpan = topRightX - topLeftX;
  const r = clampRadius(radius, height, topSpan, bottomRightX - bottomLeftX);

  if (r <= 0) {
    return `M ${topLeftX} ${yTop} L ${topRightX} ${yTop} L ${bottomRightX} ${yBottom} L ${bottomLeftX} ${yBottom} Z`;
  }

  const rightLen = Math.hypot(bottomRightX - topRightX, height);
  const leftLen = Math.hypot(bottomLeftX - topLeftX, height);
  const rightUx = (bottomRightX - topRightX) / rightLen;
  const rightUy = height / rightLen;
  const leftUx = (bottomLeftX - topLeftX) / leftLen;
  const leftUy = height / leftLen;

  return [
    `M ${topLeftX + r} ${yTop}`,
    `L ${topRightX - r} ${yTop}`,
    `Q ${topRightX} ${yTop} ${topRightX + rightUx * r} ${yTop + rightUy * r}`,
    `L ${bottomRightX} ${yBottom}`,
    `L ${bottomLeftX} ${yBottom}`,
    `L ${topLeftX + leftUx * r} ${yTop + leftUy * r}`,
    `Q ${topLeftX} ${yTop} ${topLeftX + r} ${yTop}`,
    "Z",
  ].join(" ");
}

function plainTrapezoidPath(
  topLeftX: number,
  topRightX: number,
  bottomRightX: number,
  bottomLeftX: number,
  yTop: number,
  yBottom: number,
): string {
  return `M ${topLeftX} ${yTop} L ${topRightX} ${yTop} L ${bottomRightX} ${yBottom} L ${bottomLeftX} ${yBottom} Z`;
}

function roundedTipPath(
  centerX: number,
  topY: number,
  bottomY: number,
  topHalfWidth: number,
  radius: number,
): string {
  const left = centerX - topHalfWidth;
  const right = centerX + topHalfWidth;
  const height = bottomY - topY;
  const r = Math.min(radius, topHalfWidth - 0.5, height - 1);

  if (r <= 0) {
    return `M ${left} ${topY} L ${right} ${topY} L ${centerX} ${bottomY} Z`;
  }

  const sideLen = Math.hypot(topHalfWidth, height);
  const sideUx = topHalfWidth / sideLen;
  const sideUy = height / sideLen;

  return [
    `M ${left} ${topY}`,
    `L ${right} ${topY}`,
    `L ${centerX + sideUx * r} ${bottomY - sideUy * r}`,
    `Q ${centerX} ${bottomY} ${centerX - sideUx * r} ${bottomY - sideUy * r}`,
    "Z",
  ].join(" ");
}

function FunnelGraphic({ stages }: { stages: FunnelStage[] }) {
  const tipHeight = 18;
  const bodyHeight = FUNNEL_VIEW_HEIGHT - tipHeight;
  const segmentHeight =
    (bodyHeight - SEGMENT_GAP * (stages.length - 1)) / stages.length;
  const topWidth = FUNNEL_VIEW_WIDTH;
  const tipWidth = 14;

  return (
    <svg
      viewBox={`0 0 ${FUNNEL_VIEW_WIDTH} ${FUNNEL_VIEW_HEIGHT}`}
      className="block h-full w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {stages.map((stage, index) => {
        const edges = getSegmentEdges(
          index,
          segmentHeight,
          bodyHeight,
          topWidth,
          tipWidth,
          FUNNEL_VIEW_WIDTH,
        );

        const path =
          index === 0
            ? firstSegmentPath(
                edges.topLeft,
                edges.topRight,
                edges.bottomRight,
                edges.bottomLeft,
                edges.yTop,
                edges.yBottom,
                CORNER_RADIUS,
              )
            : plainTrapezoidPath(
                edges.topLeft,
                edges.topRight,
                edges.bottomRight,
                edges.bottomLeft,
                edges.yTop,
                edges.yBottom,
              );

        return <path key={stage.label} d={path} fill={stage.segmentColor} />;
      })}
      <path
        d={roundedTipPath(
          FUNNEL_VIEW_WIDTH / 2,
          bodyHeight,
          FUNNEL_VIEW_HEIGHT,
          tipWidth / 2,
          CORNER_RADIUS,
        )}
        fill="#4ad97f"
      />
    </svg>
  );
}

export default function OrchestrationFunnel({
  metrics,
  records,
}: OrchestrationFunnelProps) {
  const stages = buildFunnelStages(metrics, records);

  return (
    <article
      className="rounded-xl border border-border/80 bg-background p-6 shadow-sm"
      aria-labelledby="orchestration-funnel-heading"
    >
      <h2
        id="orchestration-funnel-heading"
        className="text-body font-semibold text-foreground md:text-subheading"
      >
        Orchestration Funnel
      </h2>
      <p className="mt-1 text-small text-muted-foreground">
        How Dutt evaluates and filters delivery services.
      </p>

      <div className="mt-8 grid grid-cols-[minmax(220px,56%)_1fr] items-stretch gap-x-8 sm:gap-x-10">
        <div className="min-h-[315px] w-full">
          <FunnelGraphic stages={stages} />
        </div>

        <ol className="flex min-h-[315px] flex-col justify-between">
          {stages.map((stage) => (
            <li key={stage.label} className="flex items-start gap-3.5">
              <span
                className="mt-1 h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: stage.dotColor }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-2xl font-bold leading-none tracking-tight text-foreground">
                  {stage.value}
                </p>
                <p className="mt-1 text-small font-medium text-muted-foreground">
                  {stage.label}
                </p>
                <p className="mt-0.5 text-caption text-muted-foreground">
                  {stage.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}
