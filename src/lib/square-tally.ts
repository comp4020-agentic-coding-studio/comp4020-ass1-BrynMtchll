// Pure, DOM-free math for the squares zoom's cumulative tally. Each of the
// 3 scroll-driven loops (see the .cycle keyframes in global.css) is its own
// fractal level: loop 1 zooms 1 square out to a full 9-tile grid of 91,809;
// loop 2's "1 square" stands for that entire finished grid, so it climbs from
// 91,809 to 91,809²; loop 3 is a partial loop that only needs to climb far
// enough to land the running total on the final target. Keeping the curve
// here in sync with the CSS keyframes' own geometric shape is what makes the
// on-screen zoom and the tally read as the same number, not two
// independently-tuned approximations.

/** The scale (CSS transform: scale(...)) a loop's grid starts each pass at. */
export const SCALE_START = 101;

/** Squares in one fully zoomed-out 3x3 tiled grid: (101 / (1/3))^2. */
export const SQUARES_PER_GRID = 91_809;

/** The scroll is split into this many equal loops. */
export const LOOP_COUNT = 3;

/** Gartner's "worldwide AI spending will total $2.5 trillion in 2026" forecast. */
export const TARGET_AMOUNT_USD = 2_500_000_000_000;

/**
 * The final (partial) loop only needs to climb its own local count to this
 * value — far short of a full SQUARES_PER_GRID loop — for the cumulative
 * total to land exactly on TARGET_AMOUNT_USD at progress 1.
 */
export const FINAL_LOOP_LOCAL_END_COUNT =
  TARGET_AMOUNT_USD / SQUARES_PER_GRID ** (LOOP_COUNT - 1);

/**
 * Input: a loop-local progress in [0, 1] and the count that loop ends on.
 * Output: the geometric 1 -> endCount curve one loop's zoom follows — the
 * same constant-perceived-speed shape as the CSS keyframes' evenly-spaced
 * geometric scale steps.
 */
export function loopCount(localProgress: number, endCount = SQUARES_PER_GRID): number {
  const clamped = Math.max(0, Math.min(1, localProgress));
  return endCount ** clamped;
}

/**
 * Input: overall scroll progress in [0, 1].
 * Output: the cumulative number of squares visible on screen right now —
 * splits progress into LOOP_COUNT equal thirds, works out which loop that
 * falls in and that loop's own local progress, then multiplies the fully
 * completed loops' grids (each SQUARES_PER_GRID) by the current loop's own
 * geometric count. The last loop is shortened (FINAL_LOOP_LOCAL_END_COUNT
 * instead of a full SQUARES_PER_GRID) so the total lands exactly on
 * TARGET_AMOUNT_USD at progress 1.
 */
export function visibleSquareCount(progress: number): number {
  const clamped = Math.max(0, Math.min(1, progress));
  const loopSpan = 1 / LOOP_COUNT;
  const loopIndex = Math.min(LOOP_COUNT - 1, Math.floor(clamped / loopSpan));
  const localProgress = (clamped - loopIndex * loopSpan) / loopSpan;
  const isFinalLoop = loopIndex === LOOP_COUNT - 1;
  const localEndCount = isFinalLoop ? FINAL_LOOP_LOCAL_END_COUNT : SQUARES_PER_GRID;
  const completedLoopsMultiplier = SQUARES_PER_GRID ** loopIndex;
  return completedLoopsMultiplier * loopCount(localProgress, localEndCount);
}

export interface LoopPosition {
  /** Which of the LOOP_COUNT loops (0-indexed) is currently showing. */
  loopIndex: number;
  /** The CSS transform: scale(...) value that loop's own grid is at. */
  scale: number;
}

/**
 * Input: overall scroll progress in [0, 1].
 * Output: which loop is active and the scale its single grid should render
 * at — the same (101 / scale)^2 = count relationship the CSS keyframes and
 * visibleSquareCount both follow, solved for scale instead of count. Used by
 * the reduced-motion path to render one static grid per milestone (no
 * animation, no crossfade — just the matching loop and scale for that
 * milestone's amount).
 */
export function loopPositionForProgress(progress: number): LoopPosition {
  const clamped = Math.max(0, Math.min(1, progress));
  const loopSpan = 1 / LOOP_COUNT;
  const loopIndex = Math.min(LOOP_COUNT - 1, Math.floor(clamped / loopSpan));
  const localProgress = (clamped - loopIndex * loopSpan) / loopSpan;
  const isFinalLoop = loopIndex === LOOP_COUNT - 1;
  const localEndCount = isFinalLoop ? FINAL_LOOP_LOCAL_END_COUNT : SQUARES_PER_GRID;
  const localCount = loopCount(localProgress, localEndCount);
  return { loopIndex, scale: SCALE_START / Math.sqrt(localCount) };
}

/**
 * Input: a dollar amount (1 square === $1).
 * Output: the overall scroll progress in [0, 1] where the cumulative tally
 * first reaches that amount — the inverse of visibleSquareCount, used to
 * place popup statements at the right point along the scroll. Amounts
 * outside [1, TARGET_AMOUNT_USD] clamp to the nearest end.
 */
export function amountToProgress(amountUSD: number): number {
  const loopSpan = 1 / LOOP_COUNT;
  if (amountUSD <= 1) return 0;
  if (amountUSD >= TARGET_AMOUNT_USD) return 1;

  let loopIndex = 0;
  while (
    loopIndex < LOOP_COUNT - 1 &&
    amountUSD > SQUARES_PER_GRID ** (loopIndex + 1)
  ) {
    loopIndex++;
  }

  const isFinalLoop = loopIndex === LOOP_COUNT - 1;
  const localEndCount = isFinalLoop ? FINAL_LOOP_LOCAL_END_COUNT : SQUARES_PER_GRID;
  const loopStartAmount = SQUARES_PER_GRID ** loopIndex;
  const localCount = amountUSD / loopStartAmount;
  const localProgress = Math.log(localCount) / Math.log(localEndCount);
  return loopIndex * loopSpan + localProgress * loopSpan;
}
