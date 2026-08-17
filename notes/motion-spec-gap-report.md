# Motion-spec gap report (Prompt 6)

Honest accounting against the real motion-spec table extracted from
`getty.edu/tracingart` (Prompt 1), built via `agent-browser` devtools access —
not inferred from watching the reference site visually. Reference stack:
GSAP 3.10.4 + Lenis 1.1.9; zero `position:sticky`, zero `IntersectionObserver`,
zero `prefers-reduced-motion` anywhere in the bundle; pinning via
`position:fixed` full-viewport layers + GSAP tweening inline transform/opacity
keyed to `window.scrollY` (`trigger: window`, `pin:false` on all 15 live
ScrollTrigger instances).

## The Prompt 1 table

| # | Getty technique | Trigger mechanism | Duration/distance | Easing | Properties | Staging |
|---|---|---|---|---|---|---|
| 1 | Opening thumbnail-grid intro | pinned+scrubbed (fixed layer, `trigger:window`) | ≈1901vh | `power2.out` / `none` / `sine.inOut` | `zoomInGridPr`, `alpha`, `y`, `dimImagesPr` | simultaneous, grid-wide |
| 2 | assetZoom painting zoom | pinned+scrubbed | ≈300vh | `power2.out` in / `power2.in` out | `scale`, `alpha` | sequential (zoom in, hold, out) |
| 3 | Staggered name/text reveal | pinned+scrubbed, repeated | ≈400vh × 2 | `power2.out` / `power2.inOut` / `power2.in` | `y`, `scale` | staggered/sequential |
| 4 | Chapter-nav progress bars | unclear — low-confidence attribution (container always `opacity:0;visibility:hidden` when sampled) | n/a | n/a | `scaleX` fill | ambiguous |
| 5 | WebGL/canvas closing scene | pinned+scrubbed, WebGL uniforms | ≈4000vh | mixed `power2.inOut`/`power3.inOut`/`power3.out`/`sine.out` | `cameraDist`, `inProgress`, `repelRadiusPr` | sequential camera moves |

## Row-by-row verdict

**Row 1 (opening grid) — not implemented.** No equivalent beat exists in our
narrative. Our page opens on a static `.hero` with no scroll-scrubbed intro.
Judgment call: Getty's opening is a decorative thumbnail-grid spectacle with
no informational content; our brief is about debt/AI money, not a gallery, so
there was nothing to port here rather than something skipped for time.

**Row 2 (assetZoom scale/alpha zoom) — not implemented, deliberately.**
Nothing in our page zooms an image. Not a gap against our own content — Getty
has no equivalent to "reveal tower blocks one at a time," so this row doesn't
map onto anything we needed to build.

**Row 3 (staggered name/text reveal) — implemented, adapted.** This is the
closest real analogue to what we built: Act 1's tower (`pinnedScrub` +
`createTimeline`, `src/pages/index.astro:356-395`) and Act 3's loop
(`index.astro:431-489`) both do sequential/staggered reveals on one
continuous scrubbed timeline, matching the "one timeline, labeled offsets,
sequential not simultaneous" pattern. Deviation: we used CSS `position:
sticky` for the pin (`src/styles/global.css:83,164,377`) where Getty uses
`position:fixed` layers + `trigger:window`. That's a deliberate simplification
per Prompt 2's own text (sticky is "the simplest, no-JS-cost option") —
genuinely simpler and works for our content, but it means we didn't replicate
Getty's actual pinning mechanism, just its scrubbed-sequential effect.

**Row 4 (chapter-nav progress bars) — not implemented.** We have no
chapter-navigation UI at all, so there's no equivalent to build. Also worth
noting for the record: Getty's own attribution here was low-confidence
(flagged already in Prompt 1) — the container was
`opacity:0;visibility:hidden` every time it was sampled, so it's unclear this
was even genuinely scroll-driven on the reference site itself.

**Row 5 (WebGL closing scene) — not implemented.** No WebGL/canvas layer
anywhere in our build. This is the single biggest capability gap: we never
attempted a shader/uniform-driven scene. Reason: out of scope for the
assignment's content and well beyond a "match the mechanic, not the medium"
reading of the brief — Act 5 (`.freeze`) is our closing beat instead, built as
a plain DOM fade+rise, not WebGL.

## Beyond the 5 rows

Things Prompt 1 surfaced that don't have their own row but matter for an
honest accounting:

- **Lenis smooth-scroll layer — implemented.** Matches Getty's real stack
  (Lenis 1.1.9 there vs. `lenis@1.3.26` here), wired via `initLenis()` in
  `src/lib/scroll-state.ts`.
- **`prefers-reduced-motion` — implemented, and exceeds the reference site.**
  Getty has zero handling of this (confirmed via bundle grep, 0 hits). Ours
  checks it before any pin/scrub setup on Acts 1, 3, and 5, per Prompt 4's
  explicit requirement — a deliberate improvement beyond what Getty itself
  does, not something "matched" from the table.
- **Act 2 (lean) — partially implemented relative to Prompt 5's literal
  ask.** Prompt 5 asked for the lean driven by "an anime.js tween seeked to
  scroll progress" as its own thing. What actually ships: the lean is
  recomputed from Act 1's `pinnedScrub` `onUpdate` callback
  (`updateLeanFromRevealed`), not a separate anime.js tween of its own. It is
  continuous and scroll-driven (satisfies the underlying goal — "should feel
  continuous, not stepped"), but it's a derived side-effect of Act 1's
  timeline rather than an independently seeked anime.js animation. Judgment
  call, not an oversight: building a second parallel timeline for the same
  scroll range Act 1 already tracks would have been redundant machinery for
  no visible difference.
- **Act 4 (slider entrance) — implemented, but by inheritance rather than
  new code.** The tower's entrance into Act 4's view rides Act 1's own
  existing pinned timeline (the "your block" list item is one more beat on
  that same timeline, `beats = commitments.length + 1`), not a separately
  built pinned-timeline pattern for Act 4 specifically. This technically
  satisfies Prompt 5's "the tower's entrance ... should still use the
  pinned-timeline pattern for consistency" — it does use that pattern — but
  no new work exists under an "Act 4" label because none was needed.
- **Act 5 (freeze + quote) — partially implemented relative to Prompt 5's
  literal ask.** Prompt 5 said "pin the freeze frame, then scrub the quote's
  fade-in ... across the extended blank scroll distance." What shipped: the
  quote's fade+rise is genuinely scrubbed via `pinnedScrub`
  (`index.astro:508-531`), but `.freeze` is **not pinned** — no `position:
  sticky`, no forced runway height. This was a deliberate deviation,
  documented in the approved plan: `.freeze` sits close enough to the end of
  the page that there wasn't enough remaining scroll budget to build a real
  pinned runway without hitting the document's bottom (confirmed empirically
  — the first attempt at a full-exit leave threshold stalled at ~0.82
  progress and never reached 1). So the "scrub the fade-in" half is real; the
  "pin the freeze frame" half is not — it's a scroll-triggered reveal, not a
  held/pinned frame.
