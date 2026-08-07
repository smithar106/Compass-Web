// Decision Brief — four-section data helpers
//
// Copy helpers here turn raw engine data into a tight executive memo:
// every sentence is deliberately short, domain-neutral (no hardcoded
// "finance" language), and free of duplicated noun phrases.

import type { DecisionRec } from "@/lib/decision-package";

// ---- Sanitization: strip run-ons, malformed JSON, and stray artifacts ----

function asString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function firstSentence(value: unknown): string {
  const raw = asString(value);
  if (!raw) return "";
  return raw
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[.\s]+/, "")
    .replace(/[`'"]{2,}/g, "")
    .replace(/\s*,?\s*\.$/, "")
    .trim()
    .split(/\s*([.!?]\s*)/)[0]
    .trim()
    .replace(/[,;-]+\s*$/, "")
    .trim();
}

// ---- Copy helpers: turn raw engine titles into natural executive language ----

// Generic domain words that clutter an executive title (e.g. "Finance" in "AI-powered Finance").
const DOMAIN_NOISE = /\b(finance|financial|solution|solutions|department|departments|function|functions|tool|tools|system|systems|platform|platforms|initiative|program)\b/gi;

// Intervention family names that stand alone as noun phrases (no problem noun needed).
const NOUN_PHRASE = /(automation|software|platform|system|solution|redesign|staffing|hybrid|implementation|workflow)/i;

// Words that already make a solution phrase read as a complete noun phrase,
// so we never append the problem focus to it ("Automated Invoice Matching
// invoice processing" must never happen).
const SOLUTION_NOUN =
  /(automation|matching|processing|redesign|optimization|scoring|routing|review|platform|system|solution|software|tooling|workflow|intelligence|analytics|management|onboarding|scheduling|reconciliation|documentation|triage|qualification|health|support|service|reporting|ingestion|extraction|validation|tracking|monitoring)$/i;

function titleCasePhrase(value: string): string {
  const small = new Set(["a", "an", "the", "and", "or", "of", "for", "in", "on", "with", "to", "vs"]);
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word, i) => {
      if (i > 0 && small.has(word.toLowerCase())) return word.toLowerCase();
      return word
        .split("-")
        .map((part, j) => (j === 0 || part.length > 1 ? part[0].toUpperCase() + part.slice(1) : part))
        .join("-");
    })
    .join(" ");
}

function cleanModifier(value: string): string {
  return value
    .replace(DOMAIN_NOISE, "")
    .replace(/\s+/g, " ")
    .replace(/\s+$/g, "")
    .trim();
}

function stripManual(value: string): string {
  return value.replace(/^(manual|the)\s+/i, "").trim();
}

interface TitleParts {
  solution: string; // e.g. "AI-powered Finance"
  problem: string; // e.g. "Manual invoice processing"
}

function titleParts(top: DecisionRec, summary?: any): TitleParts {
  const t = firstSentence(top.title) || "";
  const idx = t.indexOf(":");
  if (idx > 0) {
    return { solution: t.slice(0, idx).trim(), problem: t.slice(idx + 1).trim() };
  }
  return { solution: t, problem: firstSentence(summary?.problem_statement) || "" };
}

/**
 * Build a standalone solution phrase for a sentence.
 * "AI-powered" + focus "invoice processing" → "AI-powered invoice processing".
 * "Automated Invoice Matching" (already a noun phrase) stays as-is.
 */
function solutionPhraseFor(top: DecisionRec, summary?: any): string {
  const { solution, problem } = titleParts(top, summary);
  const modifier = cleanModifier(solution);
  const focus = stripManual(problem);
  if (!modifier) return focus || "This solution";
  if (SOLUTION_NOUN.test(modifier)) return modifier;
  if (focus) return `${modifier} ${focus}`;
  return modifier;
}

/** Lower-case problem focus ("Manual invoice processing" → "invoice processing"). */
export function problemFocus(top: DecisionRec, summary?: any): string {
  return stripManual(titleParts(top, summary).problem) || "the workflow";
}

// ---- Section 1: Decision Recommendation (Purpose) ----

export interface ImpactCard {
  metric: string;
  label: string;
  context: string;
}

export function actionTitle(top: DecisionRec): string {
  const t = firstSentence(top.title) || "the recommended intervention";
  const idx = t.indexOf(":");
  if (idx > 0) {
    const solution = t.slice(0, idx).trim();
    const problem = t.slice(idx + 1).trim();
    if (solution && problem) {
      const modifier = cleanModifier(solution);
      const focus = stripManual(problem);
      if (modifier && focus) return `Approve ${titleCasePhrase(modifier)} ${titleCasePhrase(focus)}`;
      if (focus) return `Approve ${titleCasePhrase(focus)}`;
    }
  }
  return `Approve ${titleCasePhrase(t)}`;
}

export function recommendationExplanation(top: DecisionRec, summary: any): { one: string; two: string; three: string } {
  const solutionPhrase = solutionPhraseFor(top, summary);

  return {
    one: "This workflow is consuming the most manual effort and operational risk in your organization today.",
    two: `${solutionPhrase} is the highest-value, lowest-risk fix identified — this decision funds a bounded pilot, not a full rollout.`,
    three: "A go/no-go decision at the end of the pilot gates any wider deployment on measured results.",
  };
}

function compactCurrency(n: number | null | undefined, currency?: string): string {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  const sym = currency === "USD" || !currency ? "$" : "";
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${sym}${Math.round(n / 1_000)}K`;
  return `${sym}${Math.round(n)}`;
}

export function impactCards(top: DecisionRec): ImpactCard[] {
  const cards: ImpactCard[] = [];
  const ranges = top.outcome_ranges || [];
  const tl = top.impact?.implementation_timeline;

  // Organization-specific dollar impact leads the board summary when the
  // assessment collected volume / handling time / loaded labor cost.
  const savings = top.impact?.annual_savings;
  if (savings?.status === "estimated" && typeof savings.expected === "number" && savings.expected > 0) {
    const low = compactCurrency(savings.low, savings.currency);
    const high = compactCurrency(savings.high, savings.currency);
    cards.push({
      metric: compactCurrency(savings.expected, savings.currency),
      label: "Expected annual savings",
      context: low !== high ? `Range ${low}–${high}` : "Estimated from your volume, cost, and evidence",
    });
  }

  const metricFor = (r: any, fallback: string) => (asString(r.metric_label) || fallback).replace(/_/g, " ").toLowerCase().trim() || fallback;
  const valueFor = (r: any) => (r.median != null ? `${r.median}%` : r.low != null && r.high != null ? `${r.low}%–${r.high}%` : "Measurable");
  // Direction-aware labels: cost/effort metrics go down, capability metrics go up.
  // e.g. "fraud detection rate" → "Improved fraud detection", "processing cost" → "Lower processing cost".
  const labelFor = (r: any, fallback: string) => {
    const m = metricFor(r, fallback);
    if (/cost|error|manual|effort|time|turnaround|expense|cycle|delay|backlog/i.test(m)) return `Lower ${m}`;
    const clean = m.replace(/\s*rate\s*$/, "").trim();
    return `Improved ${clean || m}`;
  };

  if (ranges.length > 0) {
    const r = ranges[0];
    cards.push({
      metric: valueFor(r),
      label: labelFor(r, "processing cost"),
      context: "Primary outcome of this initiative.",
    });
  } else {
    cards.push({ metric: "Measurable", label: "Reduced processing cost", context: "Primary outcome of this initiative." });
  }

  if (ranges.length > 1) {
    const r2 = ranges[1];
    cards.push({
      metric: valueFor(r2),
      label: labelFor(r2, "capacity"),
      context: "Secondary outcome tracked alongside the primary goal.",
    });
  } else {
    cards.push({ metric: "Pilot before scale", label: "Initial commitment", context: "Approval funds a measured pilot; full deployment is gated on results." });
  }

  if (tl?.min_weeks && tl?.max_weeks) {
    const fmt = (w: number) => (w >= 12 ? `${Math.round(w / 4.33)} months` : `${w} weeks`);
    cards.push({ metric: `${fmt(tl.min_weeks)} to ${fmt(tl.max_weeks)}`, label: "Time to measurable value", context: "From kickoff to validated pilot results." });
  } else {
    cards.push({ metric: "8 to 16 weeks", label: "Time to measurable value", context: "From kickoff to validated pilot results." });
  }

  return cards.slice(0, 3);
}

// ---- Section 2: Evidence ----

export interface EvidenceCard {
  company: string;
  context?: string;
  bullets: string[];
}

function cleanMetric(metricRaw: string, val: string): string {
  const lc = metricRaw.toLowerCase();
  if (/cost|error|manual|effort|time|processing|handle|turnaround|expense/i.test(lc)) return `${val} lower ${lc}`;
  if (/capacity|throughput|fraud|detection|accuracy|satisfaction|automation|rate|volume|invoices|quality/i.test(lc)) return `${val} improvement in ${lc}`;
  return `${val} ${lc}`;
}

export function evidenceCards(top: DecisionRec, summary?: any): EvidenceCard[] {
  const raw = (top.comparable_implementations || []).slice(0, 3);
  const seen = new Set<string>();
  const focus = problemFocus(top, summary);
  return raw
    .filter((c) => {
      const key = asString(c.organization).trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((c) => {
      const org = asString(c.organization).trim() || "An organization with a similar workflow";
      const outcome = asString(c.outcome_summary || c.observed_outcome);
      // One context sentence so each card explains what the comparable actually did.
      const intervention = asString(c.intervention || c.intervention_description);
      const context = intervention
        ? `Implemented ${intervention.toLowerCase()} to streamline ${focus}.`
        : "Deployed this approach to address the same operational challenge.";
      const bullets: string[] = [];
      outcome.split(/[.;]/).map((s) => s.trim()).filter((s) => s.length > 3 && /%|reduction|increase|improvement|up|down/i.test(s)).forEach((s) => {
        const parts = s.split(/[:=]/).map((p) => p.trim());
        if (parts.length >= 2) {
          const metricRaw = parts[0].replace(/\b\w/g, (ch) => ch.toUpperCase());
          const val = parts[parts.length - 1].replace(/^(\d+\.?\d*)\s*%?.*$/, "$1%");
          bullets.push(cleanMetric(metricRaw, val));
        } else {
          const dash = s.match(/^([^0-9]+)\s*[:=]?\s*(\d+\.?\d*)%?/i);
          if (dash) bullets.push(cleanMetric(dash[1], `${dash[2]}%`));
        }
      });
      // De-dupe identical bullets and collapse to the strongest 3.
      const unique = [...new Set(bullets)];
      if (unique.length === 0) unique.push("Reported measurable operational improvement.");
      return { company: org, context, bullets: unique.slice(0, 3) };
    });
}

export function evidenceIntro(top: DecisionRec): string {
  return "The evidence below comes from organizations that implemented this approach and measured the outcomes — observed results, not projections.";
}

// ---- Section 3: Objectives ----

export interface StrategyCard {
  heading: string;
  description: string;
  objective: string;
}

export function strategyCards(top: DecisionRec): StrategyCard[] {
  const focus = problemFocus(top);
  return [
    {
      heading: "Reduce Manual Effort",
      description: `Automate repeatable steps in ${focus} while routing exceptions through controlled human review.`,
      objective: "Cut manual effort without weakening controls.",
    },
    {
      heading: "Increase Processing Capacity",
      description: "Absorb higher volume through automation rather than headcount, holding quality steady.",
      objective: "Grow throughput without adding headcount.",
    },
    {
      heading: "Strengthen Controls",
      description: "Standardize processing rules and keep a consistent, auditable record of every step.",
      objective: "Reduce risk and audit exposure.",
    },
    {
      heading: "Validate Before Scaling",
      description: "Run a bounded pilot against a clear baseline before committing to full deployment.",
      objective: "Confirm value before committing to scale.",
    },
  ];
}

// ---- Section 4: Next Steps ----

export interface ImplementationStep {
  name: string;
  timeline: string;
  detail: string;
  team: string;
}

export function implementationSteps(top: DecisionRec): ImplementationStep[] {
  const sc = firstSentence(top.next_validation_step?.success_criteria) || "at least 90% of workflow instances captured with complete timestamps";
  const criteria = sc ? ` Success criteria: ${sc.charAt(0).toLowerCase() + sc.slice(1)}.` : "";
  return [
    {
      name: "Establish the Baseline",
      timeline: "Weeks 1 to 2",
      detail: `Measure workflow volume, handling time, labor cost, error rate, and exception frequency.${criteria}`,
      team: "Operations and Finance",
    },
    {
      name: "Configure the Solution",
      timeline: "Weeks 3 to 6",
      detail: "Connect required systems, configure processing rules, and document exception paths and escalation procedures.",
      team: "Implementation Team and IT",
    },
    {
      name: "Run the Pilot",
      timeline: "Weeks 7 to 10",
      detail: "Test the configured solution in a controlled environment and compare results against the established baseline.",
      team: "Operations Lead and Implementation Team",
    },
    {
      name: "Scale Deployment",
      timeline: "Weeks 11 to 16",
      detail: "Expand the solution after the pilot meets agreed performance and control thresholds across the full workflow.",
      team: "Executive Sponsor, Operations, and Implementation Partner",
    },
  ];
}
