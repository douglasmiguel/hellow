const CLOCK_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
};

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
