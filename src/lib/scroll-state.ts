// Pure, DOM-free scroll-progress math (same split as tower-math.ts: pure
// functions unit-tested in isolation, DOM-touching wrappers kept thin), plus
// the single shared scroll-reading helper every Act uses instead of each one
// computing its own scroll math.

import Lenis from "lenis";

let lenis: Lenis | null = null;

/**
 * Input: a pinned wrapper's document-relative top offset and total height,
 * the current scroll position, and the viewport height.
 * Output: 0 at the moment the wrapper's top reaches the viewport top (the
 * pin begins), 1 once scroll has advanced through the wrapper's full extra
 * height (the pin ends), clamped to [0, 1] outside that range.
 *
 * A wrapper no taller than the viewport has no scroll distance to scrub
 * across, so it steps straight from 0 to 1 at wrapperTop rather than
 * dividing by zero.
 */
export function computeScrollProgress(
  wrapperTop: number,
  wrapperHeight: number,
  scrollY: number,
  viewportHeight: number,
): number {
  const scrollableDistance = wrapperHeight - viewportHeight;
  if (scrollableDistance <= 0) {
    return scrollY >= wrapperTop ? 1 : 0;
  }
  const progress = (scrollY - wrapperTop) / scrollableDistance;
  return Math.max(0, Math.min(1, progress));
}

/**
 * Shared scroll-progress reader every Act calls instead of computing its own
 * scroll math. wrapperEl is the tall pin-and-scrub wrapper (not the sticky
 * inner stage) — reads its live position off the DOM and the current
 * scroll position (Lenis-smoothed once initLenis() has run, falling back to
 * raw window.scrollY otherwise).
 */
export function getScrollProgress(wrapperEl: HTMLElement): number {
  const rect = wrapperEl.getBoundingClientRect();
  const scrollY = lenis ? lenis.scroll : window.scrollY;
  const wrapperTop = scrollY + rect.top;
  return computeScrollProgress(
    wrapperTop,
    wrapperEl.offsetHeight,
    scrollY,
    window.innerHeight,
  );
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Creates the page's single Lenis instance (idempotent — safe to call from
 * more than one Act's setup code). autoRaf: true so Lenis pumps its own
 * requestAnimationFrame loop; anime.js's engine runs its own loop too, and
 * the two don't need to share one.
 */
export function initLenis(): Lenis {
  if (!lenis) {
    lenis = new Lenis({ autoRaf: true });
  }
  return lenis;
}
