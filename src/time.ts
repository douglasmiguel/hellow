const CLOCK_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
};

const TIME_ZONE_ABBREVIATION_LOCALES: Record<string, string> = {
  "Africa/Johannesburg": "en-ZA",
  "America/Chicago": "en-US",
  "America/Los_Angeles": "en-US",
  "America/Mexico_City": "en-US",
  "America/New_York": "en-US",
  "America/Sao_Paulo": "pt-BR",
  "Asia/Dubai": "en-AE",
  "Asia/Hong_Kong": "en-HK",
  "Asia/Kolkata": "en-IN",
  "Asia/Singapore": "en-SG",
  "Asia/Tokyo": "ja-JP",
  "Australia/Melbourne": "en-AU",
  "Australia/Sydney": "en-AU",
  "Europe/Berlin": "en-GB",
  "Europe/Lisbon": "en-GB",
  "Europe/London": "en-GB",
  "Europe/Paris": "en-GB",
  "Pacific/Auckland": "en-NZ",
};

const TIME_ZONE_ABBREVIATION_FALLBACKS: Record<string, string> = {
  "Asia/Seoul": "KST",
  "Asia/Shanghai": "CST",
};

function timeZoneName(
  date: Date,
  timeZone: string,
  timeZoneName: "short" | "shortOffset",
  locale = "en-US",
): string {
  return (
    new Intl.DateTimeFormat(locale, { timeZone, timeZoneName })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? ""
  );
}

export function greetingForHour(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  if (hour >= 18 && hour < 23) return "Good evening";
  return "Good night";
}

export function greetingFor(date: Date, name: string): string {
  const greeting = greetingForHour(date.getHours());
  const trimmedName = name.trim();
  return trimmedName ? `${greeting}, ${trimmedName}.` : `${greeting}.`;
}

export function formatTime(date: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat(undefined, {
    ...CLOCK_FORMAT_OPTIONS,
    ...(timeZone ? { timeZone } : {}),
  }).format(date);
}

export function formatDate(date: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(timeZone ? { timeZone } : {}),
  }).format(date);
}

export function formatShortDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone,
  }).format(date);
}

export function formatTimeZoneInfo(date: Date, timeZone: string): string {
  const abbreviationLocale = TIME_ZONE_ABBREVIATION_LOCALES[timeZone] ?? "en-US";
  const resolvedAbbreviation = timeZoneName(date, timeZone, "short", abbreviationLocale);
  const abbreviation = /^GMT(?:[+-]|$)/.test(resolvedAbbreviation)
    ? TIME_ZONE_ABBREVIATION_FALLBACKS[timeZone] ?? ""
    : resolvedAbbreviation;
  const resolvedOffset = timeZoneName(date, timeZone, "shortOffset");
  const offset = resolvedOffset === "GMT" ? "GMT+0" : resolvedOffset;

  return [abbreviation, offset].filter((part, index, parts) => part && parts.indexOf(part) === index).join(" · ");
}

export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}

export function labelForTimeZone(timeZone: string): string {
  const finalPart = timeZone.split("/").at(-1) ?? timeZone;
  return finalPart.replaceAll("_", " ");
}

export function dailyIndex(date: Date, itemCount: number): number {
  if (itemCount <= 0) return 0;
  const calendarDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(calendarDay / 86_400_000) % itemCount;
}
