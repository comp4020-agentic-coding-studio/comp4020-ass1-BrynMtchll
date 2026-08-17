# Narrative and mechanic: refining "the web of AI money"

Working doc, not finished copy. Purpose: take the four rough templates from
`topic-brainstorm.md` (A: web, B: stack, C: lever, D: loop) and the material
in `literature-review.md` (Parts 1–4) and turn them into one specific,
buildable narrative — the thing you'd actually hand to a builder. Refined and
re-refined here as ideas change; treat anything below as a draft until it's
actually built.

## Starting point: why the stack, and what it was missing

Template B's pitch was a single visual metaphor — a tower that grows as the
visitor scrolls through examples of committed spend, its height *being* the
argument — with the "is this stable?" anxiety made literal as a lean. It was
recommended alongside C (the lever/simulator) rather than alone: *"use B's
scroll structure as the spine... with C's single slider as the payoff at the
end — the mechanic the visitor actually operates, not just watches."*

What was still missing, surfaced in the two chats since: the stack as
originally scoped is told entirely from the *entities'* point of view
(Microsoft, Oracle, Nvidia) — it's legible, but it's still something the
visitor watches happen to other companies. The personalization idea (the
401(k)/index-fund exposure stat, Part 4 of the lit review) and the closing-beat
idea (freeze, one quote, silence) both push toward making the visitor a node
in the structure, not an observer of it. That's the gap this file tries to
close: not a new mechanic, but the stack made to do that extra job.

## The shape: one spine, two payoffs folded in — not four separate options

Rather than pick one template and discard the rest, fold D (the loop) and C
(the lever) into the stack as two beats *inside* the same scroll, at the
points where they're each the sharpest version of the point being made. A
(the network diagram) stays parked — see "Parked directions" below for why.

The stack is the spine (built once, real height a real number). The loop is a
small animated component that appears at the top of the stack once it's
tall enough to need it. The lever is not a separate section — it's what the
stack itself becomes interactive with, right before the close.

## Narrative arc, act by act

### Act 1 — The tower rises

The page opens on an empty vertical axis — nothing built yet — with a single
line of framing copy (the point-of-view line, see below). As the visitor
scrolls, blocks stack upward, each one a real, sourced commitment from section
1 of the lit review: Microsoft ($250B), Oracle ($300B), Nvidia ($100B), AMD
($90B), Broadcom ($350B), AWS ($38B), CoreWeave ($22B) — Tunguz's $1.15T
breakdown gives you the full block set already sized and sourced. Each block
is labeled minimally (company, dollar figure) and only reveals its source
citation on hover/tap — keeps the visual clean while keeping every number
honest.

Design choice worth deciding now: block *height* proportional to dollar value
(so Broadcom's block dwarfs CoreWeave's) makes the scale legible at a glance,
but risks a very tall page at 390px width. Test early at the phone viewport —
this is the first place the "works at both viewports" invariant gets
threatened.

### Act 2 — The lean

Starting midway up the tower, new blocks are colour/texture-coded by
financing type: solid fill for cash-funded spend, a hatched or dotted fill for
debt and off-balance-sheet SPV commitments (section 4–5's material —
Moody's $460B direct debt / $1.2T lease-equivalent figure, the Meta Hyperion
SPV case study). As more hatched blocks stack on, the whole tower's rotation
(a CSS transform, angle driven by the running proportion of hatched-to-solid
blocks) visibly increases — the lean *is* the debt ratio, not a decoration on
top of it. This is where "is this stable?" stops being a caption and becomes
something the visitor watches happen.

### Act 3 — The loop at the top

Once the tower is tall enough that circularity is the natural next question,
a small animated loop appears docked beside the top few blocks: money/compute
visibly cycling around a closed path (Microsoft → OpenAI → Microsoft;
Nvidia → CoreWeave → Nvidia), matching template D exactly but scoped to a
component rather than a whole section. Two or three loops, not the whole web
— enough to make the point (section 2's "backstop" mechanism) without
building the full node-link graph that template A would have required.

### Act 4 — Your block

The pivot. A new block appears — visually distinct (outlined rather than
filled, so it reads as "this one's different") — representing the visitor's
own likely exposure, sized using Part 4's stat: a plain S&P 500 index tracker
is roughly 35% concentrated in the AI-driven "Magnificent Seven." Copy at this
point can be direct and short, borrowing Part 4's sharpest line almost
verbatim: *you didn't buy a ticket to this — but if you've ever held an index
fund, you're already standing on this tower.*

This is also where the lever/simulator (template C) earns its place instead
of sitting in its own section: a single slider — "assumed AI revenue growth"
or "interest rates" — that recomputes the tower's lean angle *and* the height
of the visitor's own block in real time. The visitor doesn't just watch the
structure; they test what happens to their own money within it. That's the
brief's "interaction changes what they see, testably" criterion satisfied by
the same component doing double duty, not a second mechanic bolted on.

### Act 5 — The freeze and the quote

Scroll deceleration (more blank space than anywhere else on the page), then
the whole tower — now leaning, now including the visitor's own block —
freezes in place. One line appears alone, no further chart, no CTA. Candidate
closing lines, each with a different aftertaste:

- Acemoglu: *"the danger is these kinds of deals eventually reveal a house of
  cards"* — measured, institutional, doesn't overclaim.
- Revolver News (Part 4): *"regular Americans don't have to buy a ticket to
  the AI casino to lose money when all the tables collapse"* — sharper, more
  personal, pairs tightly with Act 4's reveal since it's making the same
  point the visitor just watched happen to their own block.
- Bernstein's wealth-effect line (Part 4): *"if the stock market tumbles
  enough so that people feel... a lot less wealthy, they're going to spend
  less"* — the most mechanistic, least emotional of the three; probably the
  weakest choice for a closer even though it's the most rigorous, since it
  explains rather than lands.

Current lean: Revolver's line, precisely because Act 4 already did the
personalization work — the quote should cash that in, not re-explain it.

## The core interaction, stated plainly

For the spec test, roughly: *scrolling the page reveals additional blocks in
a vertical stack; the stack's visual lean angle increases monotonically with
the proportion of debt/SPV-financed blocks revealed so far; near the end of
the stack, a single slider control recomputes and visibly changes both the
lean angle and the size of a labeled "your exposure" block in response to
visitor input.* That's concrete enough to assert against (initial lean ≈ 0,
lean increases as more hatched blocks mount, slider changes a data attribute
or computed style deterministically).

## Point of view, sharpened

Candidate line for the page's actual stated position, updated from
`topic-brainstorm.md`'s three options to fold in the personalization: *"Nobody
in this web is really taking the risk alone — and if you've ever held an
index fund, neither are you."* Keeps the original circularity argument (option
3 from the brainstorm) but earns the "response to the brief" mark by making it
concrete rather than abstract.

## Parked directions (and why)

- **Template A, the full network diagram** — still the highest-ceiling option
  on paper, but building it well (legible at 390px, keyboard/screen-reader
  navigable per the invariants) is real time that the stack+loop+lever
  combination gets for free by staying mostly vertical and scroll-driven.
  Parked, not discarded — if the stack build goes faster than expected, a
  small node-link component could still slot in as a bonus rather than the
  spine.
- **A pure "receipt ticker" (the earlier chat's running-total idea)** — good
  as a *component*, weak as the whole mechanic on its own, since it doesn't
  give the visitor anything to test or operate. Could still live as a small
  aside (e.g. a running dollar counter alongside Act 1's blocks) but shouldn't
  compete with the stack for "the" interaction.
- **A dedicated separate "human impact" section using Part 3's anecdotes**
  (noise, water, coal) — considered and set aside for this narrative
  specifically because the tower's argument is financial/systemic, and Part
  3's material is physical/local — mixing registers there risks diluting
  both. Better used as standalone captions or a short aside near Act 2 (e.g.
  a single pull-quote next to the SPV blocks: "the debt is real even when the
  building is real too") rather than a full section.

## Open questions to resolve before building

- Exact block set and ordering for Act 1 — literature review section 1 has
  ~7 candidates; probably cut to 5–6 for a readable phone-width tower.
- Whether the lean angle is driven by a simple running ratio (easy to test,
  easy to explain) or something more elaborate (harder to justify against a
  source) — lean toward the simple version.
- Exact wording of the Act 4 copy and which closing quote — listed three
  candidates above, not yet decided.
- Whether the loop component (Act 3) is worth its build cost given it's now
  a supporting beat rather than a whole template — could be simplified to a
  static "circular flow" icon with a tooltip if animation time runs short.
