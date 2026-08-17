import { describe, expect, it } from "vitest";
import {
  classifyLod,
  computeCameraRank,
  computeCameraWorldX,
  computeFocusedRank,
  computeOnScreenPx,
  computeWorldX,
  formatDollars,
  progressToCameraAmount,
} from "./scale-math";

describe("progressToCameraAmount", () => {
  it("maps progress 0 to the minimum amount", () => {
    expect(progressToCameraAmount(0, 1, 1000)).toBeCloseTo(1, 6);
  });

  it("maps progress 1 to the maximum amount", () => {
    expect(progressToCameraAmount(1, 1, 1000)).toBeCloseTo(1000, 6);
  });

  it("moves linearly through orders of magnitude, not linearly through dollars", () => {
    // log10(1) = 0, log10(10000) = 4 — halfway through progress should land
    // at 10^2 = 100, not (1 + 10000) / 2.
    expect(progressToCameraAmount(0.5, 1, 10_000)).toBeCloseTo(100, 6);
  });

  it("clamps out-of-range progress", () => {
    expect(progressToCameraAmount(-1, 1, 1000)).toBeCloseTo(1, 6);
    expect(progressToCameraAmount(2, 1, 1000)).toBeCloseTo(1000, 6);
  });
});

describe("computeOnScreenPx", () => {
  it("renders at exactly referencePx when the object equals the camera amount", () => {
    expect(computeOnScreenPx(100, 100, 300)).toBeCloseTo(300, 6);
  });

  it("renders 10x smaller one decade above the camera amount", () => {
    expect(computeOnScreenPx(1_000, 100, 300)).toBeCloseTo(30, 6);
  });

  it("renders 10x smaller one decade below the camera amount", () => {
    expect(computeOnScreenPx(10, 100, 300)).toBeCloseTo(30, 6);
  });

  it("falls off symmetrically — two decades away shrinks 100x either direction", () => {
    expect(computeOnScreenPx(10_000, 100, 300)).toBeCloseTo(3, 6);
    expect(computeOnScreenPx(1, 100, 300)).toBeCloseTo(3, 6);
  });

  it("never exceeds referencePx, no matter how far away the object is", () => {
    expect(computeOnScreenPx(27_000_000_000_000, 1, 220)).toBeLessThan(220);
  });
});

describe("classifyLod", () => {
  it("hides anything below the fixed pixel floor", () => {
    expect(classifyLod(0, 1000)).toBe("hidden");
    expect(classifyLod(1.9, 1000)).toBe("hidden");
  });

  it("shows a dot between the hidden floor and the reference-relative detail threshold", () => {
    expect(classifyLod(2, 1000)).toBe("dot");
    expect(classifyLod(399, 1000)).toBe("dot");
  });

  it("shows full detail once a point crosses the reference-relative threshold", () => {
    expect(classifyLod(400, 1000)).toBe("detail");
    expect(classifyLod(1000, 1000)).toBe("detail");
  });

  it("scales the detail threshold with referencePx, not with a fixed pixel value", () => {
    expect(classifyLod(300, 500)).toBe("detail");
    expect(classifyLod(300, 5000)).toBe("dot");
  });
});

describe("computeCameraRank", () => {
  const amounts = [1, 10, 100, 1_000];

  it("returns the exact index when the camera sits on a point", () => {
    expect(computeCameraRank(100, amounts)).toBeCloseTo(2, 6);
  });

  it("interpolates fractionally between two points, in log space", () => {
    // log10(31.6) is almost exactly halfway between log10(10) and log10(100).
    expect(computeCameraRank(31.6, amounts)).toBeCloseTo(1.5, 1);
  });

  it("clamps to 0 below the smallest amount", () => {
    expect(computeCameraRank(0.001, amounts)).toBe(0);
  });

  it("clamps to the last index above the largest amount", () => {
    expect(computeCameraRank(1_000_000, amounts)).toBe(3);
  });

  it("gives unevenly-spaced points a rank difference of exactly 1, not proportional to their dollar gap", () => {
    const clustered = [1, 1_000, 1_010, 1_000_000];
    expect(computeCameraRank(1_010, clustered)).toBeCloseTo(2, 6);
    expect(computeCameraRank(1_000, clustered)).toBeCloseTo(1, 6);
  });
});

describe("computeFocusedRank", () => {
  it("focuses the exact point when the camera sits on it", () => {
    expect(computeFocusedRank(2)).toBe(2);
  });

  it("rounds to the nearer neighbor before the midpoint", () => {
    expect(computeFocusedRank(2.3)).toBe(2);
  });

  it("swaps focus to the next point once past the midpoint", () => {
    expect(computeFocusedRank(2.7)).toBe(3);
  });

  it("never returns focus to two points at once, even exactly at the midpoint", () => {
    // JS rounds .5 up — the exact midpoint deterministically resolves to one
    // point, never both, matching the "always exactly one caption" rule.
    expect(computeFocusedRank(2.5)).toBe(3);
  });
});

describe("computeWorldX", () => {
  it("places logValue 0 at world x 0", () => {
    expect(computeWorldX(0, 600)).toBeCloseTo(0, 6);
  });

  it("scales linearly with logValue", () => {
    expect(computeWorldX(2, 600)).toBeCloseTo(1200, 6);
  });

  it("places two points one decade apart exactly pixelsPerDecade apart", () => {
    const a = computeWorldX(3, 600);
    const b = computeWorldX(4, 600);
    expect(b - a).toBeCloseTo(600, 6);
  });
});

describe("computeCameraWorldX", () => {
  it("matches computeWorldX for the camera's own logValue", () => {
    expect(computeCameraWorldX(100, 600)).toBeCloseTo(computeWorldX(2, 600), 6);
  });

  it("moves by exactly pixelsPerDecade per decade the camera amount changes", () => {
    const a = computeCameraWorldX(100, 600);
    const b = computeCameraWorldX(1_000, 600);
    expect(b - a).toBeCloseTo(600, 6);
  });
});

describe("formatDollars", () => {
  it("formats with a dollar sign and thousands separators", () => {
    expect(formatDollars(250_000_000_000)).toBe("$250,000,000,000");
    expect(formatDollars(1)).toBe("$1");
    expect(formatDollars(3_500)).toBe("$3,500");
  });
});
