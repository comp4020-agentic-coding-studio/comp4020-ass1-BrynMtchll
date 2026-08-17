import { describe, expect, it } from "vitest";
import {
  amountToProgress,
  FINAL_LOOP_LOCAL_END_COUNT,
  LOOP_COUNT,
  loopCount,
  loopPositionForProgress,
  SCALE_START,
  SQUARES_PER_GRID,
  TARGET_AMOUNT_USD,
  visibleSquareCount,
} from "./square-tally";

describe("loopCount", () => {
  it("starts at 1 square", () => {
    expect(loopCount(0)).toBeCloseTo(1, 6);
  });

  it("ends at the given endCount", () => {
    expect(loopCount(1, SQUARES_PER_GRID)).toBeCloseTo(SQUARES_PER_GRID, 6);
  });

  it("defaults endCount to a full grid", () => {
    expect(loopCount(1)).toBeCloseTo(SQUARES_PER_GRID, 6);
  });

  it("clamps out-of-range local progress", () => {
    expect(loopCount(-1)).toBeCloseTo(1, 6);
    expect(loopCount(2)).toBeCloseTo(SQUARES_PER_GRID, 6);
  });

  it("is monotonically increasing", () => {
    const steps = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1];
    const values = steps.map((step) => loopCount(step));
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});

describe("visibleSquareCount", () => {
  it("starts at exactly 1 visible square", () => {
    expect(visibleSquareCount(0)).toBeCloseTo(1, 6);
  });

  it("ends at exactly the target amount", () => {
    expect(visibleSquareCount(1)).toBeCloseTo(TARGET_AMOUNT_USD, 3);
  });

  it("clamps out-of-range progress", () => {
    expect(visibleSquareCount(-1)).toBeCloseTo(1, 6);
    expect(visibleSquareCount(2)).toBeCloseTo(TARGET_AMOUNT_USD, 3);
  });

  it("reaches exactly one full grid at the loop 1/2 boundary", () => {
    expect(visibleSquareCount(1 / LOOP_COUNT)).toBeCloseTo(SQUARES_PER_GRID, 3);
  });

  it("reaches exactly one squared grid at the loop 2/3 boundary", () => {
    expect(visibleSquareCount(2 / LOOP_COUNT)).toBeCloseTo(SQUARES_PER_GRID ** 2, 0);
  });

  it("is continuous across loop boundaries (no jump or reset)", () => {
    const epsilon = 1e-6;
    const boundaries = [1 / LOOP_COUNT, 2 / LOOP_COUNT];
    for (const boundary of boundaries) {
      const before = visibleSquareCount(boundary - epsilon);
      const at = visibleSquareCount(boundary);
      const after = visibleSquareCount(boundary + epsilon);
      // A tiny step in progress should only move the count a tiny relative
      // amount — no discrete jump or reset back down to 1 at the seam.
      expect(Math.abs(at - before) / at).toBeLessThan(0.01);
      expect(after).toBeGreaterThan(at);
    }
  });

  it("is monotonically increasing across the whole scroll", () => {
    const steps = Array.from({ length: 21 }, (_, i) => i / 20);
    const values = steps.map((step) => visibleSquareCount(step));
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });

  it("the final loop's local end count lands the total on the target", () => {
    expect(SQUARES_PER_GRID ** (LOOP_COUNT - 1) * FINAL_LOOP_LOCAL_END_COUNT).toBeCloseTo(
      TARGET_AMOUNT_USD,
      3,
    );
  });
});

describe("loopPositionForProgress", () => {
  it("starts loop 0 at the full starting scale", () => {
    const { loopIndex, scale } = loopPositionForProgress(0);
    expect(loopIndex).toBe(0);
    expect(scale).toBeCloseTo(SCALE_START, 6);
  });

  it("matches visibleSquareCount's count via (scale_start / scale)^2", () => {
    const progresses = [0.1, 0.2, 0.4, 0.5, 0.6, 0.9];
    for (const progress of progresses) {
      const { loopIndex, scale } = loopPositionForProgress(progress);
      const localCount = (SCALE_START / scale) ** 2;
      const total = SQUARES_PER_GRID ** loopIndex * localCount;
      expect(total).toBeCloseTo(visibleSquareCount(progress), 0);
    }
  });

  it("shrinks the scale as progress advances within a loop", () => {
    const early = loopPositionForProgress(0.05);
    const late = loopPositionForProgress(0.3);
    expect(late.scale).toBeLessThan(early.scale);
  });

  it("resets to loop 1 with the full starting scale just after a boundary", () => {
    const { loopIndex, scale } = loopPositionForProgress(1 / LOOP_COUNT + 1e-6);
    expect(loopIndex).toBe(1);
    expect(scale).toBeCloseTo(SCALE_START, 1);
  });
});

describe("amountToProgress", () => {
  it("maps $1 to progress 0", () => {
    expect(amountToProgress(1)).toBeCloseTo(0, 6);
  });

  it("maps the target amount to progress 1", () => {
    expect(amountToProgress(TARGET_AMOUNT_USD)).toBeCloseTo(1, 6);
  });

  it("clamps amounts outside the range", () => {
    expect(amountToProgress(0)).toBe(0);
    expect(amountToProgress(TARGET_AMOUNT_USD * 10)).toBe(1);
  });

  it("is the inverse of visibleSquareCount", () => {
    const progresses = [0.05, 0.2, 1 / 3, 0.5, 2 / 3, 0.8, 0.95];
    for (const progress of progresses) {
      const amount = visibleSquareCount(progress);
      expect(amountToProgress(amount)).toBeCloseTo(progress, 3);
    }
  });

  it("is monotonically increasing with amount", () => {
    const amounts = [1, 100, 3_500, 91_809, 1_000_000, SQUARES_PER_GRID ** 2, 1e12];
    const values = amounts.map((amount) => amountToProgress(amount));
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});
