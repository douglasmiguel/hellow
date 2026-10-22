import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchRate, formatCurrencyAmount, isFreshRate, parseRate, RATE_TTL,
  sanitizeConversions, sanitizeRateCache,
} from "../src/currency";

const now = Date.parse("2026-10-08T12:00:00Z");
const quote = { base: "USD", quote: "BRL", rate: 5.12, date: "2026-10-08" };
const conversion = { id: "usd", amount: 1, from: "USD", to: "BRL" };
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("currency settings", () => {
  it("migrates existing settings without enabling external requests", () => {
    expect(sanitizeConversions(undefined)).toEqual([]);
    expect(sanitizeConversions(null)).toEqual([]);
    expect(sanitizeConversions([])).toEqual([]);
  });
  it("keeps valid settings while discarding malformed values and duplicate pairs or ids", () => {
    expect(sanitizeConversions([
      null, conversion, { ...conversion, id: "duplicate" },
      { ...conversion, from: "EUR" },
      { ...conversion, id: "bad", amount: -1 },
      { ...conversion, id: "bad", amount: Infinity },
      { ...conversion, id: "bad", amount: 1e10 },
      { ...conversion, id: "bad", from: "XYZ" },
      { ...conversion, id: "bad", to: "USD" },
      { ...conversion, id: "eur", from: "EUR", amount: 12.5 },
    ])).toEqual([conversion, { ...conversion, id: "eur", from: "EUR", amount: 12.5 }]);
  });
  it("limits cards to five without changing their order", () => {
    const items = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"].map((from) => ({ ...conversion, id: from, from }));
    expect(sanitizeConversions(items)).toEqual(items.slice(0, 5));
  });
});

describe("exchange rates and cache", () => {
  it("rejects mismatched currencies, invalid dates and invalid numeric rates", () => {
    for (const invalid of [null, { ...quote, base: "EUR" }, { ...quote, quote: "GBP" },
      { ...quote, rate: -1 }, { ...quote, rate: Infinity }, { ...quote, rate: "5" },
      { ...quote, date: "2026-02-30" }, { ...quote, date: "2026-10-09" }]) {
      expect(() => parseRate(invalid, "USD", "BRL", now)).toThrow();
    }
  });
  it("retains expired rates for offline use but requires a refresh after six hours", () => {
    const rate = parseRate(quote, "USD", "BRL", now);
    expect(isFreshRate(rate, now + RATE_TTL - 1)).toBe(true);
    expect(isFreshRate(rate, now + RATE_TTL)).toBe(false);
    expect(isFreshRate(rate, now - 1)).toBe(false);
    expect(sanitizeRateCache({ "USD/BRL": rate }, now + RATE_TTL)).toEqual({ "USD/BRL": rate });
  });
  it("discards corrupt cache entries and future fetch timestamps", () => {
    const rate = { ...quote, fetchedAt: now };
    expect(sanitizeRateCache({ "EUR/BRL": rate, "USD/BRL": { ...rate, fetchedAt: now + 1 } }, now)).toEqual({});
  });
  it("fetches only currency codes with no credentials, referrer, or amount", async () => {
    vi.spyOn(Date, "now").mockReturnValue(now);
    const request = vi.fn().mockResolvedValue({ ok: true, json: async () => quote });
    vi.stubGlobal("fetch", request);
    const rate = await fetchRate("USD", "BRL");
    expect(rate.rate).toBe(5.12);
    expect(request).toHaveBeenCalledWith("https://api.frankfurter.dev/v2/rate/USD/BRL", expect.objectContaining({ cache: "no-cache", credentials: "omit", referrerPolicy: "no-referrer", signal: expect.any(AbortSignal) }));
  });
  it("rejects HTTP failures and invalid pairs", async () => {
    const request = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", request);
    await expect(fetchRate("USD", "BRL")).rejects.toThrow("unavailable");
    request.mockClear();
    await expect(fetchRate("XYZ", "BRL")).rejects.toThrow("Invalid currency pair");
    expect(request).not.toHaveBeenCalled();
  });
  it("formats converted amounts with an unambiguous currency code and exactly two decimal places", () => {
    expect(formatCurrencyAmount(12.5 * 5.12, "BRL")).toContain("64.00");
    expect(formatCurrencyAmount(0.0067, "GBP")).toContain("0.01");
    expect(formatCurrencyAmount(64, "BRL")).toContain("BRL");
    expect(formatCurrencyAmount(64, "JPY")).toContain("64.00");
    expect(formatCurrencyAmount(1.234, "KWD")).toContain("1.23");
  });
});
