// Statements that pop up along the squares zoom, each keyed to the dollar
// amount (1 square === $1) where the cumulative tally first reaches it —
// see square-tally.ts's amountToProgress, which turns amountUSD into a
// scroll progress at render time (never stored here).
//
// Two kinds, mixed across the scroll on purpose (the user asked for "both"):
// - "analogy": a relatable comparison for a big number. Illustrative, not a
//   claim — no citation, same spirit as scale-points.ts's reference notes.
// - "fact": a real, sourced figure about money moving into AI, reusing
//   scale-points.ts's existing ai-money dataset (same citations) plus the
//   final Gartner forecast this page's tally is built to land on exactly.
import {
  aiMoneyPoints,
  referencePoints,
  type ScalePointCitation,
} from "./scale-points";

export type SquareMilestoneKind = "analogy" | "fact";

export interface SquareMilestone {
  id: string;
  amountUSD: number;
  kind: SquareMilestoneKind;
  statement: string;
  citation?: ScalePointCitation;
}

// apple-market-cap, us-gdp, and ai-etf-market are all bigger than this page's
// $2.5T target and measure something other than "money invested in AI" — see
// the plan's framing note — so they're dropped here even though the shared
// dataset keeps them for the (unrelated) full scale-points ladder.
const DROPPED_IDS = new Set(["apple-market-cap", "us-gdp", "ai-etf-market"]);

const REFERENCE_STATEMENTS: Record<string, string> = {
  "dollar-bill": "One square. One dollar bill.",
  coffee: "Five squares now — that's a cup of coffee.",
  "takeout-dinner": "Twenty squares — dinner for one, delivered.",
  "running-shoes": "150 squares — a pair of running shoes.",
  smartphone: "1,000 squares — a new smartphone.",
  car: "30,000 squares — a new car, driven off the lot.",
  house: "500,000 squares — the median US house.",
  "small-company-revenue": "5 million squares — a small company's entire annual revenue.",
  "series-c": "100 million squares — a well-funded startup's Series C round.",
  unicorn: "1 billion squares — a unicorn startup's whole valuation.",
};

const AI_MONEY_STATEMENTS: Record<string, string> = {
  "your-exposure":
    "3,500 squares — roughly what a typical S&P 500 index fund now has riding on AI stocks, for every $10,000 invested.",
  "coreweave-debt":
    "8.5 billion squares — CoreWeave's chip-collateralized loan, rated investment grade and eligible for pension funds.",
  "meta-hyperion-spv":
    "30 billion squares — a private-credit deal that keeps most of its debt off Meta's own balance sheet.",
  "aws-openai": "38 billion squares — AWS's cloud-compute capacity deal with OpenAI.",
  "amd-openai": "90 billion squares — AMD's AI accelerator supply deal with OpenAI.",
  "nvidia-openai": "100 billion squares — Nvidia's compute investment in OpenAI.",
  "msft-openai": "250 billion squares — Microsoft's compute commitment to OpenAI.",
  "oracle-openai": "300 billion squares — Oracle's compute-capacity deal with OpenAI.",
  broadcom: "350 billion squares — Broadcom's custom AI chip supply deal with OpenAI.",
};

function fromSeeds(
  seeds: typeof referencePoints,
  statements: Record<string, string>,
  kind: SquareMilestoneKind,
): SquareMilestone[] {
  return seeds
    .filter((seed) => !DROPPED_IDS.has(seed.id))
    .map((seed) => ({
      id: seed.id,
      amountUSD: seed.amountUSD,
      kind,
      statement: statements[seed.id],
      citation: seed.citation,
    }));
}

const analogyMilestones: SquareMilestone[] = [
  {
    id: "everyone-on-earth",
    amountUSD: 1_000_000_000_000,
    kind: "analogy",
    statement: "1 trillion squares — enough to hand about $125 to every person on Earth.",
  },
  {
    id: "manhattan-real-estate",
    amountUSD: 1_500_000_000_000,
    kind: "analogy",
    statement: "1.5 trillion squares — around what all of Manhattan's real estate is worth.",
  },
];

const targetMilestone: SquareMilestone = {
  id: "global-ai-spending-2026",
  amountUSD: 2_500_000_000_000,
  kind: "fact",
  statement: "2.5 trillion squares — Gartner's forecast for worldwide AI spending in 2026.",
  citation: {
    source: "Gartner press release, worldwide AI spending forecast",
    url: "https://www.gartner.com/en/newsroom/press-releases/2026-1-15-gartner-says-worldwide-ai-spending-will-total-2-point-5-trillion-dollars-in-2026",
    quote: "Worldwide AI spending will total $2.5 trillion in 2026.",
  },
};

export const squareMilestones: SquareMilestone[] = [
  ...fromSeeds(referencePoints, REFERENCE_STATEMENTS, "analogy"),
  ...fromSeeds(aiMoneyPoints, AI_MONEY_STATEMENTS, "fact"),
  ...analogyMilestones,
  targetMilestone,
].sort((a, b) => a.amountUSD - b.amountUSD);
