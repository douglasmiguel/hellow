import { describe, expect, it } from "vitest";
import { photos } from "../src/photos";

describe("background catalog", () => {
  it("provides 20 choices including the daily mix", () => {
    expect(photos).toHaveLength(19);
    expect(photos.length + 1).toBe(20);
  });

  it("uses unique ids, files, and source links", () => {
    expect(new Set(photos.map((photo) => photo.id)).size).toBe(photos.length);
    expect(new Set(photos.map((photo) => photo.file)).size).toBe(photos.length);
    expect(new Set(photos.map((photo) => photo.source)).size).toBe(photos.length);
  });
});
