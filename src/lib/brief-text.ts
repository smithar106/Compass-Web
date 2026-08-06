// Decision Brief — four-section data helpers

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

// ---- Section 1: Decision Recommendation ----

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
  const { solution, problem } = titleParts(top, summary);

  const problemPhrase = problem || "The current process";
  const modifier = cleanModifier(solution);
  const focus = stripManual(problemPhrase);
  const solutionPhrase =
    !problem
      ? modifier || focus || "This solution"
      : modifier && focus && !NOUN_PHRASE.test(modifier)
        ? `${modifier} ${focus}`
        : modifier
          ? modifier
          : focus || "This solution";

  const one = `${problemPhrase} is consuming valuable finance capacity and creating unnecessary operational friction. ${solutionPhrase} offers the strongest opportunity to reduce manual effort, accelerate processing, and improve financial controls while limiting implementation risk through a phased rollout.`;

  const two = "Approval authorizes a bounded pilot measured against a clear baseline, with a go/no-go decision before any wider deployment.";

  const three = "We recommend approving a controlled pilot, with expansion contingent on achieving predefined operational and financial success criteria.";

  return { one, two, three };
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
      context: low !== high ? `Range ${low}–${high} across comparable implementations` : "Estimated from your volume, cost, and evidence",
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
  const focus = stripManual(titleParts(top, summary).problem) || "operations";
  return raw
    .filter((c) => {
      const key = asString(c.organization).trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((c) => {
      const org = asString(c.organization).trim() || "A comparable organization";
      const outcome = asString(c.outcome_summary || c.observed_outcome);
      // One context sentence so each card explains what the comparable actually did.
      const intervention = asString(c.intervention || c.intervention_description);
      const context = intervention
        ? `Implemented ${intervention.toLowerCase()} to streamline ${focus}.`
        : "Deployed a comparable solution to address the same operational challenge.";
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
  return "Comparable organizations have successfully implemented similar solutions and reported measurable improvements in cost, processing speed, and operational performance. Compass recommends this approach because organizations facing similar operational challenges consistently achieved the strongest business outcomes with this implementation strategy.";
}

// ---- Section 3: Strategy and Objectives ----

export interface StrategyCard {
  heading: string;
  description: string;
  objective: string;
}

export function strategyCards(top: DecisionRec): StrategyCard[] {
  const problem = "manual processing";
  return [
    {
      heading: "Reduce Manual Effort",
      description: `Automate repeatable ${problem} steps while routing exceptions through a controlled human review process.`,
      objective: `Reduce manual processing effort without weakening controls.`,
    },
    {
      heading: "Increase Processing Capacity",
      description: `Scale volume through automation rather than headcount. The solution handles higher throughput while maintaining quality.`,
      objective: `Improve processing capacity while maintaining service quality.`,
    },
    {
      heading: "Strengthen Compliance",
      description: `Standardize processing rules and create a consistent, auditable record for every transaction.`,
      objective: `Improve compliance and reduce audit risk.`,
    },
    {
      heading: "Validate Before Scaling",
      description: `Begin with a bounded pilot measured against a clear baseline before committing to full deployment.`,
      objective: `Confirm value before committing to full deployment.`,
    },
  ];
}

// ---- Section 4: Implementation ----

export interface ImplementationStep {
  name: string;
  timeline: string;
  detail: string;
  team: string;
}

export function implementationSteps(top: DecisionRec): ImplementationStep[] {
  const sc = firstSentence(top.next_validation_step?.success_criteria) || "At least 90% of workflow instances captured with complete timestamps";
  return [
    {
      name: "Establish the Baseline",
      timeline: "Weeks 1 to 2",
      detail: `Measure workflow volume, handling time, labor cost, error rate, and exception frequency.${sc ? ` Success requires that ${sc.charAt(0).toLowerCase() + sc.slice(1)}.` : ""}`,
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
