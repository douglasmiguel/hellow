import { describe, expect, it } from "vitest";
import { moveItem } from "../src/order";

describe("moveItem", () => {
  it("moves an item one position in either direction", () => {
    expect(moveItem(["London", "Chennai", "Johannesburg"], 1, -1)).toEqual([
      "Chennai",
      "London",
      "Johannesburg",
    ]);
    expect(moveItem(["London", "Chennai", "Johannesburg"], 1, 1)).toEqual([
      "London",
      "Johannesburg",
      "Chennai",
    ]);
  });

  it("keeps the order unchanged at either boundary", () => {
    expect(moveItem(["London", "Chennai"], 0, -1)).toEqual(["London", "Chennai"]);
    expect(moveItem(["London", "Chennai"], 1, 1)).toEqual(["London", "Chennai"]);
  });
});
