# Process overview

## What I built
For this assignment Claude and I have created a website that illustrates a visual metaphor for the amount of money that is invested in AI that aims to provide some sense of perspective for the massiveness of the number. Throughout this process has been frustations with Claude failing to see what is a very visibly different between what was requested and what it designed. This process documents how these frustations were handled.
[sentence on waht apperaed]

## The moments that mattered

Early brainstorming for the AI-money narrative produced several possible framings for the website and the literature review surfaced sourced figures that didn't all support the same one.

Rather than picking a framing early and building toward it, I worked through the tradeoffs across candidate approaches before writing any implementation, e.g. between an alarmist debt narrative against a more  tranquil framing, and used that to settle on a concrete plan, which was a five-act structure before any code existed. To check the work done by Claude, I went through the literature review and reviewed the sources it found. I also compared the narrative it brainstormed against my own independant research. [c1e1b7c](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-BrynMtchll/commit/c1e1b7c4c23aaef8fca6717e344d195f6519443d).

I've then gone on to trial a new approach to rapidy prototype different designs. I've adopted the strategy of prompting regular claude to provide claude code a detailed list of prompts so that it can work off a clear detailed plan without requiring my interference. For example, I provided regular Claude the prompt "write a list of prompts to claude code for imitating the effect of the scale of the universe website https://scaleofuniverse.com/en since it still just looks like circles are zooming in and out, not that the field of view is is getting larger, and so everything is getting smaller. the goal is for a visual zoom out metaphor to demonstrate the amount of money that 2 trillion ish (whaterver the number) is that is invested in ai" 
It then provided the promts
```Prompt 1 — Reference dataset in real log-scale units
Create a data module of reference objects spanning many orders of magnitude
of dollar value, each with:

{
  id: string,
  label: string,
  value: number,       // real dollar amount — this is the object's fixed
                        // "true size," never animated directly
  logValue: number,     // Math.log10(value), precomputed
  category: string,     // for color-coding, e.g. "everyday", "corporate",
                         // "national", "ai-investment"
  citation?: { source: string, url: string }
}

Populate with a spread of real reference points bridging small everyday
amounts up through the ~$2T AI investment figure and beyond, e.g.: cost of a
coffee, US federal minimum wage/hour, median US house price, a mid-cap
company's market cap, a large tech company's market cap, annual US federal
discretionary spending, US GDP, global GDP — plus the AI investment figures
themselves (the ~$2T total, and its component deals from the existing
literature review). Use the same sourced figures already compiled for the
site; do not invent numbers for anything above "everyday" scale.

Sort ascending by logValue. This dataset is the fixed "universe" — nothing
about these objects will change as the user scrolls. Only the camera will
move over them.
Prompt 2 — Shared coordinate space, not per-object animation
Build a single canvas/SVG scene where every reference object from Prompt 1
is placed once, at a fixed position derived purely from its logValue (e.g.
x = logValue * PIXELS_PER_DECADE), with a fixed radius also derived purely
from logValue on the same log scale (so relative size differences are real,
not designed). Render all objects into this one coordinate space up front.

Do NOT give any per-object component its own scroll-triggered size, opacity,
or position animation. Objects are static content; only their container will
be transformed. This is the core constraint for the rest of the build — if a
later prompt's implementation ends up keyframing individual circles again,
stop and flag it rather than proceeding.
Prompt 3 — Camera transform driven by scroll
Add a single "camera" transform (CSS transform: scale() + translate(), or an
SVG viewBox that changes) applied to the scene's parent container only.
Drive its scale and translate-origin from scroll position:

- scale = a continuous function mapping scroll progress (0 to 1) to a zoom
  factor covering the full logValue range in the dataset, e.g. starting
  zoomed in tight on the smallest-value object and ending zoomed out enough
  to fit the largest.
- translate = keep whichever object is the current "focus" (nearest to
  center) centered in the viewport as scale changes, so the zoom feels
  anchored rather than drifting.
- Use requestAnimationFrame to apply the transform smoothly on scroll,
  not discrete step jumps.

Confirm objects visually shrink/grow ONLY because the shared transform's
scale changed — inspect that no individual object's own width/height/radius
attributes are being written to during scroll.
Prompt 4 — Legible labels at every zoom level
Labels need to stay readable while the scene scales, which means they can't
scale down with their object into illegibility, nor stay a fixed screen size
disconnected from the zoom (which would break the illusion). Implement
label counter-scaling: apply an inverse scale transform to each label
(1 / camera.scale) so label text stays a roughly constant screen size
regardless of zoom level, while its anchor point still tracks its object's
position in the scaled scene.

Fade a label in as its object approaches a size where it would plausibly be
readable/relevant at the current zoom (e.g. object's on-screen radius
crosses a threshold), and fade it out once the object leaves the viewport
or once so many objects are visible at once that labels would overlap.
Prioritize fading in the AI-investment category objects and their component
deals when they're in view, since that's the section's payoff.
Prompt 5 — Milestone snap points
Define scroll-snap milestones at meaningful reference objects (coffee ->
minimum wage/hour -> median house -> large-cap company -> US federal budget
-> US GDP -> the ~$2T AI investment figure -> its component deals). At each
milestone, scroll should ease toward a scale/position that frames that
object centered with 2-3 neighboring objects visible for context, then
continue smoothly to the next on further scroll rather than jumping.
Use the same easing/duration conventions as the site's existing act
transitions.
Prompt 6 — QA against the reference site's actual mechanism, plus site invariants
Verify the implementation against these specific checks:

- Pick any two objects; confirm the ratio of their on-screen sizes at any
  given scroll position always equals the ratio implied by their real
  logValue difference and the current camera scale — not an
  independently-tuned animation value.
- Scroll rapidly back and forth; confirm no visual "pop" from objects
  having been keyframed to different states — everything should derive
  purely from current scroll position each frame.
- prefers-reduced-motion: provide a fallback that lets users jump between
  milestones via buttons/keyboard rather than requiring continuous scroll,
  still using the same shared-transform mechanism (just changing scale
  discretely instead of animating it).
- 390px mobile width: confirm the camera scale range and label
  counter-scaling still produce legible text and correctly framed objects.
- Every AI-investment-category object retains its citation, reachable via
  keyboard focus per the site's existing pattern.

Report any object still being individually size-animated before fixing it —
that's the bug this whole approach exists to avoid.
```

Giving Claude Code a structured manifold to work off of. This enabled me to be much more hands free in the approach with Claude code and thus trial different designs more quickly. The results were far more substansive than my original prompting. [f3a490a](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-BrynMtchll/commit/f3a490a1e7b8476d07f09403e25c0a8d2acef97c).

I did however run into issues with Claude code, despite having the well detailed prompts from regular Claude, and spending large amounts of time crunching, simply not being able to recognise the very obvious shortcomings in what it was producing. One example of this was it was tasked with creating what looked like a house of cards (which of course looked nothing like a house of cards), or not understanding the concept of zooming out. So I found myself having to have a heavy handed role in the process for the mechanics for zooming out using css, which involved me creating a demo of the effect, and then giving Claude Code that demo and telling it how to extrapolate that effect.
