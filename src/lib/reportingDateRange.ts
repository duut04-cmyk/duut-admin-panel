export type ReportingDateRangeKey = "7d" | "30d" | "month";

const REPORTING_TIME_ZONE = "Asia/Kolkata";

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
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  return { year, month, day };
}

function zonedMidnightToUtcIso(parts: ZonedParts, timeZone: string): string {
  const utcGuess = Date.UTC(parts.year, parts.month - 1, parts.day, 0, 0, 0);
  const offsetMinutes = getTimeZoneOffsetMinutes(new Date(utcGuess), timeZone);
  return new Date(utcGuess - offsetMinutes * 60_000).toISOString();
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

export function resolveReportingWindow(
  range: ReportingDateRangeKey,
  now = new Date(),
): {
  from: string;
  to: string;
} {
  const today = getZonedParts(now, REPORTING_TIME_ZONE);
  const startOfTomorrow: ZonedParts = { ...today };
  const startOfPeriod: ZonedParts = { ...today };

  if (range === "7d") {
    const anchor = zonedMidnightToUtcIso(today, REPORTING_TIME_ZONE);
    const anchorDate = new Date(anchor);
    anchorDate.setUTCDate(anchorDate.getUTCDate() - 6);
    const parts = getZonedParts(anchorDate, REPORTING_TIME_ZONE);
    startOfPeriod.year = parts.year;
    startOfPeriod.month = parts.month;
    startOfPeriod.day = parts.day;
  } else if (range === "30d") {
    const anchor = zonedMidnightToUtcIso(today, REPORTING_TIME_ZONE);
    const anchorDate = new Date(anchor);
    anchorDate.setUTCDate(anchorDate.getUTCDate() - 29);
    const parts = getZonedParts(anchorDate, REPORTING_TIME_ZONE);
    startOfPeriod.year = parts.year;
    startOfPeriod.month = parts.month;
    startOfPeriod.day = parts.day;
  } else {
    startOfPeriod.day = 1;
  }

  const tomorrow = new Date(zonedMidnightToUtcIso(today, REPORTING_TIME_ZONE));
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const tomorrowParts = getZonedParts(tomorrow, REPORTING_TIME_ZONE);
  startOfTomorrow.year = tomorrowParts.year;
  startOfTomorrow.month = tomorrowParts.month;
  startOfTomorrow.day = tomorrowParts.day;

  return {
    from: zonedMidnightToUtcIso(startOfPeriod, REPORTING_TIME_ZONE),
    to: zonedMidnightToUtcIso(startOfTomorrow, REPORTING_TIME_ZONE),
  };
}
