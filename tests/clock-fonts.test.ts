import { describe, expect, it } from "vitest";
import {
  clockFonts,
  DEFAULT_CLOCK_FONT_ID,
  getClockFont,
  isClockFontId,
  normalizeClockFontId,
} from "../src/clock-fonts";

describe("clock fonts", () => {
  it("offers exactly ten unique choices", () => {
    expect(clockFonts).toHaveLength(10);
    expect(new Set(clockFonts.map((font) => font.id)).size).toBe(10);
    expect(new Set(clockFonts.map((font) => font.label)).size).toBe(10);
  });

  it("recognizes supported font identifiers", () => {
    expect(isClockFontId("georgia")).toBe(true);
    expect(isClockFontId("comic-sans")).toBe(false);
    expect(isClockFontId(null)).toBe(false);
  });

  it("falls back to the current modern clock style", () => {
    expect(normalizeClockFontId("unknown")).toBe(DEFAULT_CLOCK_FONT_ID);
    expect(getClockFont(DEFAULT_CLOCK_FONT_ID)).toBe(clockFonts[0]);
  });
});
