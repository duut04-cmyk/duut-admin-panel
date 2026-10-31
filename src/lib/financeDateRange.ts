export type FinanceDateRangeKey = "today" | "7d" | "30d" | "month" | "custom";

const FINANCE_TIME_ZONE = "Asia/Kolkata";

type ZonedParts = {
  year: number;
  month: number;
  day: number;
};

function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
    day: Number(parts.find((part) => part.type === "day")?.value),
  };
}

function getTimeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);
  const asUtcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes();
  const zonedMinutes = hour * 60 + minute;
  return zonedMinutes - asUtcMinutes;
}

export function zonedMidnightToUtcIso(parts: ZonedParts, timeZone: string): string {
  const utcGuess = Date.UTC(parts.year, parts.month - 1, parts.day, 0, 0, 0);
  const offsetMinutes = getTimeZoneOffsetMinutes(new Date(utcGuess), timeZone);
  return new Date(utcGuess - offsetMinutes * 60_000).toISOString();
}

function parseYmd(value: string): ZonedParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }
  return { year, month, day };
}

/**
 * Custom range in Asia/Kolkata: start date inclusive at IST midnight,
 * end date exclusive at IST midnight on that calendar day.
 */
export function resolveCustomFinanceWindowIst(input: {
  startYmd: string;
  endYmdExclusive: string;
}): { from: string; to: string } | null {
  const start = parseYmd(input.startYmd);
  const end = parseYmd(input.endYmdExclusive);
  if (!start || !end) {
    return null;
  }
  const from = zonedMidnightToUtcIso(start, FINANCE_TIME_ZONE);
  const to = zonedMidnightToUtcIso(end, FINANCE_TIME_ZONE);
  if (new Date(from).getTime() >= new Date(to).getTime()) {
    return null;
  }
  return { from, to };
}

function startOfTomorrowUtcIso(now = new Date()): string {
  const today = getZonedParts(now, FINANCE_TIME_ZONE);
  const tomorrow = new Date(zonedMidnightToUtcIso(today, FINANCE_TIME_ZONE));
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const parts = getZonedParts(tomorrow, FINANCE_TIME_ZONE);
  return zonedMidnightToUtcIso(parts, FINANCE_TIME_ZONE);
}

export function resolveFinanceWindow(
  range: FinanceDateRangeKey,
  custom?: { startYmd: string; endYmdExclusive: string },
  now = new Date(),
): { from: string; to: string } {
  if (range === "custom" && custom?.startYmd && custom?.endYmdExclusive) {
    const resolved = resolveCustomFinanceWindowIst(custom);
    if (resolved) {
      return resolved;
    }
  }

  const today = getZonedParts(now, FINANCE_TIME_ZONE);
  const startOfPeriod: ZonedParts = { ...today };
  const to = startOfTomorrowUtcIso(now);

  if (range === "today") {
    return { from: zonedMidnightToUtcIso(today, FINANCE_TIME_ZONE), to };
  }

  if (range === "7d") {
    const anchor = new Date(zonedMidnightToUtcIso(today, FINANCE_TIME_ZONE));
    anchor.setUTCDate(anchor.getUTCDate() - 6);
    const parts = getZonedParts(anchor, FINANCE_TIME_ZONE);
    startOfPeriod.year = parts.year;
    startOfPeriod.month = parts.month;
    startOfPeriod.day = parts.day;
  } else if (range === "30d") {
    const anchor = new Date(zonedMidnightToUtcIso(today, FINANCE_TIME_ZONE));
    anchor.setUTCDate(anchor.getUTCDate() - 29);
    const parts = getZonedParts(anchor, FINANCE_TIME_ZONE);
    startOfPeriod.year = parts.year;
    startOfPeriod.month = parts.month;
    startOfPeriod.day = parts.day;
  } else if (range === "month") {
    startOfPeriod.day = 1;
  }

  return {
    from: zonedMidnightToUtcIso(startOfPeriod, FINANCE_TIME_ZONE),
    to,
  };
}

export const FINANCE_TIME_ZONE_LABEL = FINANCE_TIME_ZONE;
