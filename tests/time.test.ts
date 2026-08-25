import { describe, expect, it } from "vitest";
import { dailyIndex, greetingForHour, isValidTimeZone, labelForTimeZone } from "../src/time";

describe("greetingForHour", () => {
  it("returns the expected greeting throughout the day", () => {
    expect(greetingForHour(8)).toBe("Good morning");
    expect(greetingForHour(13)).toBe("Good afternoon");
    expect(greetingForHour(20)).toBe("Good evening");
    expect(greetingForHour(1)).toBe("Good night");
  });
});

describe("timezones", () => {
  it("recognises IANA timezones and produces a readable label", () => {
    expect(isValidTimeZone("America/New_York")).toBe(true);
    expect(isValidTimeZone("Somewhere/Imaginary")).toBe(false);
    expect(labelForTimeZone("America/New_York")).toBe("New York");
  });
});

describe("dailyIndex", () => {
  it("is stable during the same local day", () => {
    expect(dailyIndex(new Date(2026, 7, 25, 1), 6)).toBe(dailyIndex(new Date(2026, 7, 25, 23), 6));
  });

  it("always returns a valid index", () => {
    expect(dailyIndex(new Date(), 6)).toBeGreaterThanOrEqual(0);
    expect(dailyIndex(new Date(), 6)).toBeLessThan(6);
  });
});
