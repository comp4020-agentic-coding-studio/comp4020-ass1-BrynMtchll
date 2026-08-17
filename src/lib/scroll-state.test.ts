import { describe, expect, it } from "vitest";
import { computeScrollProgress } from "./scroll-state";

describe("computeScrollProgress", () => {
  it("is 0 before the wrapper's top reaches the viewport top", () => {
    expect(computeScrollProgress(1000, 3000, 500, 800)).toBe(0);
  });

  it("is 0 exactly at the wrapper's top", () => {
    expect(computeScrollProgress(1000, 3000, 1000, 800)).toBe(0);
  });

  it("is 1 exactly at the end of the scrollable distance", () => {
    // scrollableDistance = 3000 - 800 = 2200
    expect(computeScrollProgress(1000, 3000, 3200, 800)).toBe(1);
  });

  it("is linear at the midpoint", () => {
    expect(computeScrollProgress(1000, 3000, 2100, 800)).toBeCloseTo(0.5);
  });

  it("clamps beyond the end of the scrollable distance", () => {
    expect(computeScrollProgress(1000, 3000, 5000, 800)).toBe(1);
  });

  it("clamps before the wrapper (negative progress)", () => {
    expect(computeScrollProgress(1000, 3000, 0, 800)).toBe(0);
  });

  it("steps straight from 0 to 1 when the wrapper is no taller than the viewport", () => {
    expect(computeScrollProgress(1000, 600, 999, 800)).toBe(0);
    expect(computeScrollProgress(1000, 600, 1000, 800)).toBe(1);
  });
});
