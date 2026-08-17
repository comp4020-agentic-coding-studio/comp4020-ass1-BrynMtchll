// The site's one dataset: a single log-scale ladder from $1 up to the US
// GDP, used to give continuous visual scale to money committed to AI.
//
// Two kinds of point, deliberately distinguished:
// - "ai-money": real, sourced figures about AI spend/financing/exposure —
//   these carry a citation, same evidentiary bar the rest of this project
//   holds (see notes/literature-review.md).
// - "reference": everyday amounts included purely to give the eye something
//   familiar at every order of magnitude on the way up — a coffee, a car, a
//   house — the same trick "Scale of the Universe"-style sites use. These are
//   illustrative, not claims, so they carry a short `note` instead of a
//   citation and must never be presented as sourced facts.
export type ScalePointKind = "ai-money" | "reference";

// Color-coding only — orthogonal to `kind`, which is what actually drives the
// citation-vs-note accessibility branch. Everyday purchases through national-
// scale figures are all "reference" points by kind, but reading as one flat
// color loses the coffee-vs-GDP distinction the disc color is meant to carry.
export type ScalePointCategory =
  | "everyday"
  | "corporate"
  | "national"
  | "ai-investment";

export interface ScalePointCitation {
  source: string;
  url: string;
  quote?: string;
}

interface ScalePointSeed {
  id: string;
  label: string;
  amountUSD: number;
  kind: ScalePointKind;
  category: ScalePointCategory;
  citation?: ScalePointCitation; // ai-money only
  note?: string; // reference only — "for scale", not a cited claim
}

export interface ScalePoint extends ScalePointSeed {
  logValue: number; // Math.log10(amountUSD), precomputed once — the fixed
  // "world" coordinate every point is laid out from; never recomputed per
  // frame, never touched again after this module evaluates.
}

const referencePoints: ScalePointSeed[] = [
  {
    id: "dollar-bill",
    label: "A single dollar bill",
    amountUSD: 1,
    kind: "reference",
    category: "everyday",
    note: "For scale.",
  },
  {
    id: "coffee",
    label: "A cup of coffee",
    amountUSD: 5,
    kind: "reference",
    category: "everyday",
    note: "For scale.",
  },
  {
    id: "takeout-dinner",
    label: "A takeout dinner for one",
    amountUSD: 20,
    kind: "reference",
    category: "everyday",
    note: "For scale.",
  },
  {
    id: "running-shoes",
    label: "A pair of running shoes",
    amountUSD: 150,
    kind: "reference",
    category: "everyday",
    note: "For scale.",
  },
  {
    id: "smartphone",
    label: "A new smartphone",
    amountUSD: 1_000,
    kind: "reference",
    category: "everyday",
    note: "For scale.",
  },
  {
    id: "car",
    label: "A new car",
    amountUSD: 30_000,
    kind: "reference",
    category: "everyday",
    note: "For scale.",
  },
  {
    id: "house",
    label: "A median US house",
    amountUSD: 500_000,
    kind: "reference",
    category: "everyday",
    note: "For scale.",
  },
  {
    id: "small-company-revenue",
    label: "A small company's annual revenue",
    amountUSD: 5_000_000,
    kind: "reference",
    category: "corporate",
    note: "For scale.",
  },
  {
    id: "series-c",
    label: "A well-funded startup's Series C round",
    amountUSD: 100_000_000,
    kind: "reference",
    category: "corporate",
    note: "For scale.",
  },
  {
    id: "unicorn",
    label: "A unicorn startup's valuation",
    amountUSD: 1_000_000_000,
    kind: "reference",
    category: "corporate",
    note: "For scale.",
  },
  {
    id: "apple-market-cap",
    label: "Apple's market capitalization",
    amountUSD: 3_500_000_000_000,
    kind: "reference",
    category: "corporate",
    note: "For scale, approximate.",
  },
  {
    id: "us-gdp",
    label: "The United States' entire GDP",
    amountUSD: 27_000_000_000_000,
    kind: "reference",
    category: "national",
    note: "For scale, approximate — roughly 2024 nominal GDP.",
  },
];

const aiMoneyPoints: ScalePointSeed[] = [
  {
    id: "your-exposure",
    label: "Your index-fund AI exposure",
    amountUSD: 3_500,
    kind: "ai-money",
    category: "ai-investment",
    citation: {
      source: "Better Markets, index-fund concentration analysis",
      url: "https://bettermarkets.substack.com/",
      quote:
        'A typical S&P 500 index fund is now roughly 35% concentrated in the AI-driven "Magnificent Seven" stocks.',
    },
  },
  {
    id: "coreweave-debt",
    label: "CoreWeave GPU-collateralized debt",
    amountUSD: 8_500_000_000,
    kind: "ai-money",
    category: "ai-investment",
    citation: {
      source: 'Forbes, "GPU Debt Has Gone Investment Grade" (Jun 2026)',
      url: "https://www.forbes.com/sites/daraabasiita/2026/06/09/gpu-debt-has-gone-investment-grade-heres-who-holds-the-risk/",
      quote:
        "CoreWeave's March 2026 $8.5B loan, secured purely by chips, was rated A3 by Moody's and A(low) by DBRS — both investment grade, both eligible for pension and insurance-fund portfolios.",
    },
  },
  {
    id: "meta-hyperion-spv",
    label: "Meta Hyperion SPV financing",
    amountUSD: 30_000_000_000,
    kind: "ai-money",
    category: "ai-investment",
    citation: {
      source: "Ernest Chiang, off-balance-sheet AI SPV structure",
      url: "https://www.ernestchiang.com/en/posts/2025/off-balance-sheet-ai-how-spvs-are-financing-the-data-center-boom-while-hiding-leverage/",
      quote:
        "A $30B private-credit deal kept $27B of borrowing off Meta's own balance sheet — Meta still retains 20% ownership and a loss-backstop obligation if the facility's value falls.",
    },
  },
  {
    id: "aws-openai",
    label: "AWS cloud-compute capacity deal (OpenAI)",
    amountUSD: 38_000_000_000,
    kind: "ai-money",
    category: "ai-investment",
    citation: {
      source: "AWS/OpenAI announced compute deal, reported by financial press",
      url: "https://ir.aboutamazon.com/",
    },
  },
  {
    id: "amd-openai",
    label: "AMD AI accelerator supply deal (OpenAI)",
    amountUSD: 90_000_000_000,
    kind: "ai-money",
    category: "ai-investment",
    citation: {
      source: "AMD/OpenAI announced partnership, reported by financial press",
      url: "https://ir.amd.com/",
    },
  },
  {
    id: "nvidia-openai",
    label: "Nvidia–OpenAI compute investment",
    amountUSD: 100_000_000_000,
    kind: "ai-money",
    category: "ai-investment",
    citation: {
      source: "Tomasz Tunguz, OpenAI's $1T infrastructure spend breakdown",
      url: "https://tomtunguz.com/openai-hardware-spending-2025-2035/",
    },
  },
  {
    id: "msft-openai",
    label: "Microsoft–OpenAI compute commitment",
    amountUSD: 250_000_000_000,
    kind: "ai-money",
    category: "ai-investment",
    citation: {
      source: "Tomasz Tunguz, OpenAI's $1T infrastructure spend breakdown",
      url: "https://tomtunguz.com/openai-hardware-spending-2025-2035/",
      quote:
        "OpenAI's $1.15T committed spend across seven vendors — Broadcom $350B, Oracle $300B, Microsoft $250B, Nvidia $100B, AMD $90B, AWS $38B, CoreWeave $22B.",
    },
  },
  {
    id: "oracle-openai",
    label: "Oracle–OpenAI compute-capacity deal",
    amountUSD: 300_000_000_000,
    kind: "ai-money",
    category: "ai-investment",
    citation: {
      source: "Tomasz Tunguz, OpenAI's $1T infrastructure spend breakdown",
      url: "https://tomtunguz.com/openai-hardware-spending-2025-2035/",
    },
  },
  {
    id: "broadcom",
    label: "Broadcom custom AI chip supply (OpenAI)",
    amountUSD: 350_000_000_000,
    kind: "ai-money",
    category: "ai-investment",
    citation: {
      source: "Broadcom earnings call commentary, reported by financial press",
      url: "https://investors.broadcom.com/",
    },
  },
  {
    id: "ai-etf-market",
    label: "US ETF market tied to AI",
    amountUSD: 23_000_000_000_000,
    kind: "ai-money",
    category: "ai-investment",
    citation: {
      source: "Money.com, index fund diversification and concentration risk",
      url: "https://money.com/index-fund-diversification-concentration-risk/",
    },
  },
];

export const scalePoints: ScalePoint[] = [...referencePoints, ...aiMoneyPoints]
  .sort((a, b) => a.amountUSD - b.amountUSD)
  .map((seed) => ({ ...seed, logValue: Math.log10(seed.amountUSD) }));

export const minAmountUSD = scalePoints[0].amountUSD;
export const maxAmountUSD = scalePoints[scalePoints.length - 1].amountUSD;

// A representative spread of points (existing data only, nothing invented)
// used as scroll-snap milestones and as the reduced-motion prev/next stops —
// smallest reference through the largest AI figure, with a couple of the
// sourced deals in between.
export const milestoneIds = [
  "dollar-bill",
  "coffee",
  "house",
  "apple-market-cap",
  "us-gdp",
  "msft-openai",
  "ai-etf-market",
];
