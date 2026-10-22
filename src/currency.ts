export const MAX_CONVERSIONS = 5;
export const RATE_TTL = 6 * 60 * 60 * 1_000;
export const currencyCodes = [
  "AUD", "BRL", "CAD", "CHF", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD",
  "HUF", "IDR", "ILS", "INR", "ISK", "JPY", "KRW", "MXN", "MYR", "NOK",
  "NZD", "PHP", "PLN", "RON", "SEK", "SGD", "THB", "TRY", "USD", "ZAR",
] as const;

export const currencyFlags: Record<(typeof currencyCodes)[number], string> = {
  AUD: "🇦🇺", BRL: "🇧🇷", CAD: "🇨🇦", CHF: "🇨🇭", CNY: "🇨🇳", CZK: "🇨🇿",
  DKK: "🇩🇰", EUR: "🇪🇺", GBP: "🇬🇧", HKD: "🇭🇰", HUF: "🇭🇺", IDR: "🇮🇩",
  ILS: "🇮🇱", INR: "🇮🇳", ISK: "🇮🇸", JPY: "🇯🇵", KRW: "🇰🇷", MXN: "🇲🇽",
  MYR: "🇲🇾", NOK: "🇳🇴", NZD: "🇳🇿", PHP: "🇵🇭", PLN: "🇵🇱", RON: "🇷🇴",
  SEK: "🇸🇪", SGD: "🇸🇬", THB: "🇹🇭", TRY: "🇹🇷", USD: "🇺🇸", ZAR: "🇿🇦",
};

export type Conversion = { id: string; amount: number; from: string; to: string };
export type Rate = { base: string; quote: string; rate: number; date: string; fetchedAt: number };
export type RateCache = Record<string, Rate>;

export function pairKey(pair: Pick<Conversion, "from" | "to">): string {
  return `${pair.from}/${pair.to}`;
}

export function validCurrency(code: unknown): code is (typeof currencyCodes)[number] {
  return typeof code === "string" && currencyCodes.some((item) => item === code);
}

export function validAmount(amount: unknown): amount is number {
  return typeof amount === "number" && Number.isFinite(amount) && amount > 0 && amount <= 1_000_000_000;
}

export function sanitizeConversions(value: unknown): Conversion[] {
  if (!Array.isArray(value)) return [];
  const result: Conversion[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    if (typeof item.id !== "string" || !item.id || !validAmount(item.amount) ||
        !validCurrency(item.from) || !validCurrency(item.to) || item.from === item.to ||
        result.some((saved) => saved.id === item.id || pairKey(saved) === pairKey(item))) continue;
    result.push({ id: item.id, amount: item.amount, from: item.from, to: item.to });
    if (result.length === MAX_CONVERSIONS) break;
  }
  return result;
}

export function parseRate(value: unknown, from: string, to: string, fetchedAt: number): Rate {
  if (!value || typeof value !== "object") throw new Error("Missing exchange rate");
  const data = value as Partial<Rate>;
  const date = data.date;
  if (data.base !== from || data.quote !== to || typeof data.rate !== "number" ||
      !Number.isFinite(data.rate) || data.rate <= 0 || typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date || Date.parse(date) > fetchedAt) {
    throw new Error("Invalid exchange rate");
  }
  return { base: from, quote: to, rate: data.rate, date, fetchedAt };
}

export function sanitizeRateCache(value: unknown, now = Date.now()): RateCache {
  const cache: RateCache = {};
  if (!value || typeof value !== "object") return cache;
  for (const [key, item] of Object.entries(value)) {
    if (!item || typeof item !== "object") continue;
    const data = item as Partial<Rate>;
    if (!validCurrency(data.base) || !validCurrency(data.quote) ||
        key !== `${data.base}/${data.quote}` || typeof data.fetchedAt !== "number" ||
        !Number.isFinite(data.fetchedAt) || data.fetchedAt < 0 || data.fetchedAt > now) continue;
    try { cache[key] = parseRate(data, data.base, data.quote, data.fetchedAt); } catch { /* Ignore damaged cache entries. */ }
  }
  return cache;
}

export function isFreshRate(rate: Rate | undefined, now = Date.now()): boolean {
  return Boolean(rate && now >= rate.fetchedAt && now - rate.fetchedAt < RATE_TTL);
}

export async function fetchRate(from: string, to: string): Promise<Rate> {
  if (!validCurrency(from) || !validCurrency(to) || from === to) throw new Error("Invalid currency pair");
  const response = await fetch(`https://api.frankfurter.dev/v2/rate/${from}/${to}`, {
    cache: "no-cache",
    credentials: "omit",
    referrerPolicy: "no-referrer",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Exchange rates unavailable");
  return parseRate(await response.json(), from, to, Date.now());
}

export function formatCurrencyAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency", currency, currencyDisplay: "code", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(amount);
}
