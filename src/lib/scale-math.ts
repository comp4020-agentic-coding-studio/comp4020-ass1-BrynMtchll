// Pure, DOM-free math for the zoom: a continuous scroll progress (0..1) maps
// to a "camera amount" evenly in log space (so equal scroll = equal order of
// magnitude, not equal dollars), and every scale point's on-screen size is
// computed from how many decades it sits above/below that camera amount.
// Kept DOM-free and unit-tested, same split this project has used throughout
// (previously tower-math.ts/house-layout.ts, now this module's job).

/**
 * Input: scroll progress in [0, 1] and the ladder's amount range.
 * Output: the dollar amount the camera is currently centered on, moving
 * linearly through log10(amount) as progress goes 0 to 1 — so scrolling
 * through the first 10% of the page covers the same number of orders of
 * magnitude as the last 10%, not the same number of dollars.
 */
export function progressToCameraAmount(
  progress: number,
  minAmount: number,
  maxAmount: number,
): number {
  const clamped = Math.max(0, Math.min(1, progress));
  const minLog = Math.log10(minAmount);
  const maxLog = Math.log10(maxAmount);
  const exponent = minLog + clamped * (maxLog - minLog);
  return 10 ** exponent;
}

/**
 * Input: a scale point's real amount, the camera's current amount, and the
 * on-screen size (px) a point exactly at the camera's amount should render
 * at.
 * Output: that point's actual on-screen size right now — referencePx when
 * the point IS the camera's amount, shrinking 10x per decade of distance in
 * EITHER direction (bigger or smaller than the camera). This is symmetric,
 * not one-directional growth: it's what makes the zoom a single moving
 * spotlight (one point in focus at a time, everything else receding toward
 * a dot whether it's "still approaching" or "already passed") rather than
 * every point above the camera simultaneously exploding to an unbounded
 * size — referencePx is a hard ceiling here, never exceeded.
 */
export function computeOnScreenPx(
  objectAmount: number,
  cameraAmount: number,
  referencePx: number,
): number {
  const decadesAway = Math.abs(
    Math.log10(objectAmount) - Math.log10(cameraAmount),
  );
  return referencePx * 10 ** -decadesAway;
}

/**
 * Input: the camera's current amount and every point's amount, sorted
 * ascending.
 * Output: the camera's position expressed as a fractional index into that
 * sorted list — 2 means "exactly at sortedAmounts[2]", 2.5 means "midway
 * between sortedAmounts[2] and sortedAmounts[3]" (interpolated in log
 * space, consistent with progressToCameraAmount). This is deliberately
 * rank-based rather than dollar-based: two points can sit only a fraction
 * of a decade apart (several of the AI deals do), and positioning by raw
 * decades-away would place them almost exactly on top of each other. Rank
 * guarantees any two distinct points are always at least 1 apart.
 */
export function computeCameraRank(
  cameraAmount: number,
  sortedAmounts: number[],
): number {
  const logs = sortedAmounts.map((amount) => Math.log10(amount));
  const cameraLog = Math.log10(cameraAmount);

  if (cameraLog <= logs[0]) return 0;
  const lastIndex = logs.length - 1;
  if (cameraLog >= logs[lastIndex]) return lastIndex;

  for (let i = 0; i < lastIndex; i++) {
    if (cameraLog >= logs[i] && cameraLog <= logs[i + 1]) {
      const span = logs[i + 1] - logs[i];
      const frac = span === 0 ? 0 : (cameraLog - logs[i]) / span;
      return i + frac;
    }
  }
  return lastIndex;
}

/**
 * Input: the camera's fractional rank (from computeCameraRank).
 * Output: the single point-index currently "in focus". Scale of the
 * Universe (the reference this project is matching) never shows more than
 * one object's caption at a time — everything else is just a receding or
 * approaching shape with no label. Rounding the camera's fractional rank
 * to the nearest whole point (rather than, say, showing both neighbors
 * whenever the camera sits between them) is what gives that single-focus
 * feel: exactly one point is "nearest" at any instant, and it swaps to the
 * next one only once the camera crosses the midpoint between them.
 */
export function computeFocusedRank(cameraRank: number): number {
  return Math.round(cameraRank);
}

/**
 * World-space spacing (px) per order of magnitude. Purely a tuning constant —
 * how far apart, in the fixed scene, two points one decade apart in value
 * sit. Nothing else about the scene depends on it changing.
 */
export const PIXELS_PER_DECADE = 600;

/**
 * Input: a point's precomputed logValue and the shared spacing constant.
 * Output: that point's fixed position in world-space — computed once, never
 * touched again. This is the "fixed scene" half of the camera mechanism:
 * every point sits at exactly this world x-coordinate regardless of scroll.
 */
export function computeWorldX(logValue: number, pixelsPerDecade: number): number {
  return logValue * pixelsPerDecade;
}

/**
 * Input: the camera's current amount and the same shared spacing constant.
 * Output: the camera's own position in that same world-space. Combined with
 * computeWorldX at render time (stageCenterX - computeCameraWorldX(...)),
 * this gives the single translate applied uniformly to every point each
 * frame — the one shared transform that "flies" the camera over the fixed
 * scene, rather than moving any individual point.
 */
export function computeCameraWorldX(
  cameraAmount: number,
  pixelsPerDecade: number,
): number {
  return Math.log10(cameraAmount) * pixelsPerDecade;
}

export type LodBucket = "hidden" | "dot" | "detail";

const HIDDEN_BELOW_PX = 2;
const DETAIL_MIN_FRACTION_OF_REFERENCE = 0.4;

/**
 * Input: a point's current on-screen size (from computeOnScreenPx) and the
 * SAME referencePx passed to that call (the peak size a point renders at
 * when it exactly matches the camera).
 * Output: which level of detail it should render as this frame — too small
 * to see at all, a growing/shrinking disc + label, or full detail (label,
 * amount, citation/note, disc near its peak size). The threshold is a
 * fraction of referencePx rather than of viewport size so the "detail"
 * window covers the same number of decades regardless of viewport shape —
 * referencePx itself is what's set from the viewport (see index.astro), so
 * a fraction of viewport size here would double-apply that scaling and
 * widen/narrow the window depending on aspect ratio.
 */
export function classifyLod(onScreenPx: number, referencePx: number): LodBucket {
  if (onScreenPx < HIDDEN_BELOW_PX) return "hidden";
  if (onScreenPx < referencePx * DETAIL_MIN_FRACTION_OF_REFERENCE) return "dot";
  return "detail";
}

export function formatDollars(amountUSD: number): string {
  return `$${Math.round(amountUSD).toLocaleString("en-US")}`;
}
