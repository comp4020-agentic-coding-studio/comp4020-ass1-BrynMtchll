import { describe, expect, it } from "vitest";
import { formatSquares } from "./scale-math";

describe("formatSquares", () => {
  it("groups thousands and carries no currency marker", () => {
    expect(formatSquares(250_000_000_000)).toBe("250,000,000,000");
    expect(formatSquares(1)).toBe("1");
    expect(formatSquares(3_500)).toBe("3,500");
  });

  it("rounds the fractional counts the zoom curve produces", () => {
    expect(formatSquares(5_273.6)).toBe("5,274");
    expect(formatSquares(0.4)).toBe("0");
  });
});
