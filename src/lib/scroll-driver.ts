// Pinned+scrubbed timeline driver.
//
// anime.js v4 ships its own scroll-scrubbing mechanism (onScroll() + .link(),
// see node_modules/animejs/dist/modules/events/scroll.js) — with
// `sync: true` it computes 0-1 progress through a target element and calls
// `linked.seek(linked.duration * progress)` on whatever timeline it's linked
// to, every scroll-synced frame. That's the same "seek() driven by scroll
// progress" approach used elsewhere in this project's scroll math (see
// getScrollProgress in ./scroll-state), just delegated to anime's own engine
// instead of us calling .seek() ourselves from a hand-rolled scroll listener.
//
// Build the timeline with `autoplay: false` — it must never play on its own,
// only ever move because .link() seeks it — and hand it to pinnedScrub()
// below. When a linked timeline "doesn't move" while debugging, check
// whether its ScrollObserver ever synced (pass `debug: true` here to render
// anime's own on-page threshold markers) before suspecting the seek math,
// since anime owns that part now.

import { onScroll, type Timeline } from "animejs";
import { prefersReducedMotion } from "./scroll-state";

export interface PinnedScrubOptions {
  /**
   * anime.js scroll-threshold syntax: "container-edge target-edge", e.g.
   * "start start" (confirmed from animejs/dist/modules/events/scroll.js's
   * parsing — the first token binds the container/viewport edge, the second
   * the target edge). The default ("end start") is tuned for an element
   * scrolling up into view from below, not for a tall pinned wrapper whose
   * top starts the pin — pass "start start"/"end end" explicitly for that
   * case, or the scrub starts partway through on page load.
   */
  enter?: string;
  /** Same syntax as enter, for when the scrub ends. */
  leave?: string;
  debug?: boolean;
  /**
   * Called with raw 0-1 scroll progress on every scroll-synced frame where
   * that progress actually changed. Use this — not `timeline.onUpdate` —
   * for any derived state that must be correct at progress exactly 0.
   *
   * Traced in node_modules/animejs/dist/modules/core/render.js: the
   * timeline's own onUpdate is gated by `isCurrentTimeAboveZero`
   * (`tickableCurrentTime > 0`, strictly), so seeking to exactly time 0 —
   * which is exactly what happens scrubbing back to the very top of a
   * pinned section — updates `timeline.progress`/`currentTime` correctly
   * but silently skips the onUpdate callback. The ScrollObserver's own
   * onUpdate (scroll.js's handleScroll, gated only by "did raw progress
   * change") has no such gate, so it fires at progress 0 too.
   */
  onUpdate?: (progress: number) => void;
}

/**
 * Links a timeline's playhead to scroll progress through sectionEl.
 *
 * Returns null and sets up nothing under prefers-reduced-motion — callers
 * must render their static fallback in that case (no pin, no scrub at all),
 * not just a shorter animation. Exact enter/leave threshold values are
 * deliberately left to each call site: the right values depend on that
 * Act's pinned-wrapper height and are verified per-Act by scrubbing forward
 * and backward in the browser, not guessed here.
 */
export function pinnedScrub(
  sectionEl: HTMLElement,
  timeline: Timeline,
  { enter, leave, debug, onUpdate }: PinnedScrubOptions = {},
) {
  if (prefersReducedMotion()) return null;
  return onScroll({
    target: sectionEl,
    sync: true,
    enter,
    leave,
    debug,
    onUpdate: onUpdate ? (self) => onUpdate(self.progress) : undefined,
  }).link(timeline);
}
