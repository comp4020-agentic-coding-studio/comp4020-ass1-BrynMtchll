# Process overview

## What I built
For this assignment Claude and I have created a website that illustrates a visual metaphor for the amount of money that is invested in AI that aims to provide some sense of perspective for the massiveness of the number. Throughout this process has been frustations with Claude failing to see what is a very visibly different between what was requested and what it designed. This process documents how these frustations were handled.

## The moments that mattered
### Moment 1: extensive planning
Early brainstorming for the AI-money narrative produced several possible framings for the website and the literature review surfaced sourced figures that didn't all support the same one.

Rather than picking a framing early and building toward it, I worked through the tradeoffs across candidate approaches before writing any implementation, e.g. between an alarmist debt narrative against a more  tranquil framing, and used that to settle on a concrete plan, which was a five-act structure before any code existed. 

I went through the literature review myself and checked the sources it surfaced, rather than taking Claude's synthesis on trust, and separately compared the narrative it brainstormed against my own independent research to see where it agreed or diverged. 
[c1e1b7c](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-BrynMtchll/commit/c1e1b7c4c23aaef8fca6717e344d195f6519443d).

### Moment 2: detailed prompting
I trialled a new approach to rapidly prototype different designs: prompting regular Claude to produce a detailed, staged list of prompts for Claude Code to work from, rather than prompting Claude Code directly.

What I did instead of the obvious thing: The obvious approach is to prompt Claude Code directly and iterate turn by turn, correcting it as problems surface. Instead I used regular Claude as a planning layer, for example, giving it the zoom-effect problem ("it still just looks like circles are zooming in and out, not that the field of view is getting larger") and having it produce a structured six-prompt sequence, staged data model → component → layout engine → sequencing → reuse → QA, for Claude Code to execute against with minimal interference from me. This beat direct iteration because a single detailed plan front-loads the design decisions instead of re-deciding them prompt by prompt, letting Claude Code work through a full implementation in one hands-off pass rather than many small corrected ones.

Here is an example of such a structured prompt set.
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
...

Prompt 4 — Legible labels at every zoom level
Labels need to stay readable while the scene scales, which means they can't
scale down with their object into illegibility, nor stay a fixed screen size
disconnected from the zoom (which would break the illusion). Implement
label counter-scaling:
...

Prompt 6 — QA against the reference site's actual mechanism, plus site invariants
Verify the implementation against these specific checks:
...
```

I compared the output against what my own direct prompting had produced on the same problem earlier - the structured-prompt output was far more complete. The results were far more substansive than my original prompting. This ultimately enabled me to churn through design iterations, from a tower design, to a house of cards design to a zoom out design.
 [f3a490a](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-BrynMtchll/commit/f3a490a1e7b8476d07f09403e25c0a8d2acef97c).

### Moment 3: creative prototyping
I did however run into issues with Claude code, despite having the well detailed prompts from regular Claude, and spending large amounts of time crunching, simply not being able to recognise the very obvious shortcomings in what it was producing. One example of this was it was tasked with creating what looked like a house of cards (which of course looked nothing like a house of cards), or not understanding the concept of zooming out. 

The obvious next step, and the one I'd already tried, was to keep re-prompting with a more detailed text description of the desired effect. That had stopped working; no amount of describing "field of view getting larger, not circles resizing" was landing. Instead I built a small working CSS demo of the actual zoom mechanic myself and gave that to Claude Code directly, asking it to extrapolate the concrete mechanism from working code rather than infer it from a description. This meant taking a heavier-handed role than the hands-off approach in Moment 2, but only after that approach had demonstrably hit its limit on this specific problem.

I checked the extrapolated result by eye against my own demo — scrolling through both side by side and confirming the relative sizing and motion matched what the demo actually did. [3e2175c](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-BrynMtchll/commit/3e2175ce86032182fd50fe73c9efec10eff263d2)