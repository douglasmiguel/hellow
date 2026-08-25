export type ClockFont = {
  id: string;
  label: string;
  fontFamily: string;
  fontWeight: number;
  letterSpacing: string;
};

export const clockFonts = [
  {
    id: "modern",
    label: "Modern",
    fontFamily: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontWeight: 180,
    letterSpacing: "-0.075em",
  },
  {
    id: "helvetica",
    label: "Helvetica",
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 300,
    letterSpacing: "-0.065em",
  },
  {
    id: "avenir",
    label: "Avenir",
    fontFamily: '"Avenir Next", Avenir, "Segoe UI", sans-serif',
    fontWeight: 300,
    letterSpacing: "-0.055em",
  },
  {
    id: "futura",
    label: "Futura",
    fontFamily: 'Futura, "Century Gothic", "Trebuchet MS", sans-serif',
    fontWeight: 400,
    letterSpacing: "-0.06em",
  },
  {
    id: "rounded",
    label: "Rounded",
    fontFamily: '"Avenir Next Rounded", "Arial Rounded MT Bold", ui-rounded, sans-serif',
    fontWeight: 400,
    letterSpacing: "-0.055em",
  },
  {
    id: "verdana",
    label: "Verdana",
    fontFamily: "Verdana, Geneva, sans-serif",
    fontWeight: 400,
    letterSpacing: "-0.06em",
  },
  {
    id: "georgia",
    label: "Georgia",
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 400,
    letterSpacing: "-0.06em",
  },
  {
    id: "didot",
    label: "Didot",
    fontFamily: 'Didot, "Bodoni 72", "Bodoni MT", Georgia, serif',
    fontWeight: 400,
    letterSpacing: "-0.055em",
  },
  {
    id: "palatino",
    label: "Palatino",
    fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
    fontWeight: 400,
    letterSpacing: "-0.055em",
  },
  {
    id: "monospace",
    label: "Monospace",
    fontFamily: 'ui-monospace, "SFMono-Regular", "Cascadia Code", "Roboto Mono", Consolas, monospace',
    fontWeight: 300,
    letterSpacing: "-0.065em",
  },
] as const satisfies readonly ClockFont[];

export type ClockFontId = (typeof clockFonts)[number]["id"];

export const DEFAULT_CLOCK_FONT_ID: ClockFontId = "modern";

export function isClockFontId(value: unknown): value is ClockFontId {
  return typeof value === "string" && clockFonts.some((font) => font.id === value);
}

export function normalizeClockFontId(value: unknown): ClockFontId {
  return isClockFontId(value) ? value : DEFAULT_CLOCK_FONT_ID;
}

export function getClockFont(id: ClockFontId): (typeof clockFonts)[number] {
  return clockFonts.find((font) => font.id === id) ?? clockFonts[0];
}
