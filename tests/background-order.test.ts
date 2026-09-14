import { describe, expect, it } from "vitest";
import { selectedFirst } from "../src/background-order";

describe("selectedFirst", () => {
  it("moves the selected image to the first position without changing the remaining order", () => {
    const choices = [{ id: "daily" }, { id: "forest" }, { id: "aurora" }];

    expect(selectedFirst(choices, "aurora").map((choice) => choice.id)).toEqual(["aurora", "daily", "forest"]);
  });

  it("uses the first choice when a saved selection is no longer available", () => {
    expect(selectedFirst([{ id: "daily" }, { id: "forest" }], "removed").map((choice) => choice.id)).toEqual([
      "daily",
      "forest",
    ]);
  });
});
