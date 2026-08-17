/**
 * Input: a count of squares.
 * Output: it grouped for reading, with no currency marker.
 *
 * The readout counts squares, not dollars. One square is one dollar, but the
 * page's whole move is to make you look at a quantity of *things* rather than
 * a price — a "$" in front of the figure quietly turns it back into a number
 * you skim past. The milestone statements carry the dollar framing in words
 * where it belongs.
 */
export function formatSquares(count: number): string {
  return Math.round(count).toLocaleString("en-US");
}
