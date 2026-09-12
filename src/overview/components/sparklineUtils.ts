import type { OrchestrationRecord } from "@/data/orchestrationTypes";

function sortRecords(records: OrchestrationRecord[]): OrchestrationRecord[] {
  return [...records].sort(
    (a, b) =>
      new Date(a.deliveryRequest.createdAt).getTime() -
      new Date(b.deliveryRequest.createdAt).getTime(),
  );
}

export type SparklinePath = {
  line: string;
  area: string;
  lastPoint: { x: number; y: number };
};

function buildPoints(
  values: number[],
  width: number,
  height: number,
): { x: number; y: number }[] {
  const series = values.length === 1 ? [values[0], values[0]] : values;
  let min = Math.min(...series);
  let max = Math.max(...series);
  let range = max - min;

  if (range === 0) {
    min -= 1;
    max += 1;
    range = 2;
  } else {
    const padding = range * 0.12;
    min -= padding;
    max += padding;
    range = max - min;
  }

  const yPad = 6;
  const innerHeight = height - yPad * 2;
  const step = width / (series.length - 1);

  return series.map((value, index) => ({
    x: index * step,
    y: yPad + innerHeight - ((value - min) / range) * innerHeight,
  }));
}

export function buildSmoothLine(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  }

  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const previous = points[index - 1] ?? current;
    const after = points[index + 2] ?? next;

    const cp1x = current.x + (next.x - previous.x) / 5;
    const cp1y = current.y + (next.y - previous.y) / 5;
    const cp2x = next.x - (after.x - current.x) / 5;
    const cp2y = next.y - (after.y - current.y) / 5;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
  }

  return path;
}

export function buildSparklinePath(
  values: number[],
  width = 300,
  height = 44,
): SparklinePath {
  const mid = height / 2;

  if (values.length === 0) {
    return {
      line: `M 0 ${mid} L ${width} ${mid}`,
      area: `M 0 ${height} L 0 ${mid} L ${width} ${mid} L ${width} ${height} Z`,
      lastPoint: { x: width, y: mid },
    };
  }

  const points = buildPoints(values, width, height);
  const line = buildSmoothLine(points);
  const last = points[points.length - 1];
  const area = `${line} L ${width.toFixed(1)} ${height} L 0 ${height} Z`;

  return {
    line,
    area,
    lastPoint: { x: last.x, y: last.y },
  };
}

export function getCumulativeDeliverySparkline(
  records: OrchestrationRecord[],
): number[] {
  const sorted = sortRecords(records);
  if (sorted.length === 0) return [];
  return sorted.map((_, index) => index + 1);
}

export function getCumulativeDeliveredSparkline(
  records: OrchestrationRecord[],
): number[] {
  let delivered = 0;
  return sortRecords(records).map((record) => {
    if (record.deliveryRequest.status === "delivered") {
      delivered += 1;
    }
    return delivered;
  });
}

export function getRollingBookingSuccessSparkline(
  records: OrchestrationRecord[],
  windowSize = 3,
): number[] {
  const sorted = sortRecords(records);

  return sorted.map((_, index) => {
    const start = Math.max(0, index - windowSize + 1);
    const window = sorted.slice(start, index + 1);
    const success = window.filter(
      (record) => record.booking.status === "confirmed",
    ).length;

    return (success / window.length) * 100;
  });
}

export function getDecisionTimeSparkline(records: OrchestrationRecord[]): number[] {
  const times = sortRecords(records).map((record) => record.decision.durationMs);
  return times.length > 0 ? times : [0];
}
