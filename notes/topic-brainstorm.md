# Topic brainstorm: the web of AI money

Working title. Raw idea: explain the current AI infrastructure boom as a
financial system — circular deals between chipmakers, hyperscalers, and AI
labs, the debt financing datacenter buildouts, and the off-balance-sheet
structures (SPVs, vendor financing) that keep it out of plain sight.

## Feasibility against the brief

The brief wants **one strong idea, one dataset or mechanic, and nothing
else** — static, client-side, works at both viewports. Three things to watch:

- **This topic is naturally a system, not a single number.** That's good —
  it maps to an explorable mechanic rather than a scroll-through-facts page —
  but it means the real risk is trying to model the *whole* industry. Scope
  to 10–15 entities and the handful of flows that are actually illustrative
  (see "Cutting the dataset" below), not a comprehensive map.
- **Numbers need sourcing.** Claims like "sneaky loans" are fine as a point
  of view, but every figure on the page should trace to public reporting
  (an SEC filing, an earnings call, a WSJ/FT/The Information piece). Bake a
  small citation into each entity's detail view — this is also exactly the
  kind of thing `PROCESS.md` can cite as a moment ("verified figure X against
  source Y before shipping it").
- **Static-compatible.** No live financial API, no backend. A hand-curated
  JSON/TS dataset baked into the build at compile time is the right shape —
  same category as any dataviz explainer here, and keeps the invariants
  (build must succeed, no server) trivially satisfied.

Verdict: feasible, and a strong fit for the genre — but only if you pick
**one** mechanic below and cut the rest, not all four.

## Cutting the dataset

Rather than modelling "the AI economy," anchor on the deals that are already
publicly reported and visually tell the story on their own:

- Microsoft ↔ OpenAI (equity + compute credits, both directions)
- Nvidia → OpenAI (chip supply, reported equity/investment interest)
- Nvidia → CoreWeave (investment, then CoreWeave leases capacity back to
  Nvidia's own customers)
- Oracle ↔ OpenAI (the large compute-capacity commitment, debt-financed
  datacenter buildout)
- SoftBank / other financiers ↔ the above (where debt or SPV structures are
  reported)

That's roughly 6–8 entities and ~10 flows — enough to show the circularity
(money often arrives back at its source through a different door) without
needing an industry-wide graph.

## Template / structure options

**A. Explorable web (network diagram)**
A node-link diagram: entities as nodes, money/compute flows as directed
edges. Click a node → detail panel with the flow, the amount, the source.
Closest analogue to *Human Terrain*, but keep the layout hand-positioned
rather than physics-simulated — a force-directed layout looks impressive but
is slow to make legible, hard to keep stable across two viewports, and
awkward for keyboard/screen-reader navigation (the invariants already check
for a nav landmark and alt text, so accessibility isn't optional here).
Hand-placed nodes on an SVG/CSS grid is both cheaper to build and easier to
keep readable.

**B. The stack / tower**
A single strong visual metaphor: a tower or stacked-bar that grows as the
visitor scrolls through examples of committed spend or debt — each new fact
adds a block, and the tower's growing height *is* the argument. Closest to
*The Deep Sea*'s "scroll is the data" trick. Simpler to build than A, and the
"is this stable?" anxiety can be made literal (a slightly leaning tower).

**C. The lever / simulator**
One slider — "assumed future AI revenue growth" — that recalculates whether
reported debt/capex commitments look serviceable, and visibly changes a
result (a gauge, a colour, a number turning red). Closest to *Elevators*:
the mechanic itself is the explanation, not a supplement to one. Narrower
scope than A or B, and the most "interactive" in the sense the brief singles
out (the visitor's input changes what they see, testably).

**D. The loop, animated**
Take just the circular flows (Microsoft → OpenAI → Microsoft, etc.) and
animate money/compute moving around a small closed loop on click or scroll.
Very narrow, very legible, probably too thin on its own to carry a whole
page — best as a component *inside* A or B rather than the whole prototype.

## Recommendation

**B or C** are the safer choices for a first prototype under this course's
time and scope: single strong mechanic, one dataset, testable interaction,
low risk of an unreadable graph. **A** is the highest-ceiling option (closest
to the "web of money" framing that's driving the idea) but budget real time
for making the diagram legible at 390px width — a network diagram is the
first thing that breaks on a phone viewport, and that's one of the two
marked viewports.

A combination that stays inside "one idea, one mechanic": use B's scroll
structure as the spine (narrative order: buildout → financing → circularity
→ the question), with C's single slider as the payoff at the end — the
mechanic the visitor actually operates, not just watches.

## Point of view (needs to be decided, not just data)

The brief marks response-to-the-brief on having an actual point of view, not
neutral data display. Candidate framings — pick one and let it drive every
caption:

- "This looks like vendor financing dressed up as growth" (a specific,
  contestable claim)
- "The debt is the bet that AI revenue arrives on time — here's what happens
  if it's late" (frames C as the whole point)
- "Nobody in this web is really taking the risk alone" (frames the
  circularity in A/D as the punchline)

## Open questions to resolve before building

- Which single mechanic (B, C, or B+C) — decide before writing any interaction
  test, since the spec line "state the core interaction plainly enough to
  write a test for it" needs a concrete answer first.
- Which 6–8 entities/flows make the final cut, and what's the source for each
  figure.
- The one-sentence point of view the whole page argues for.
