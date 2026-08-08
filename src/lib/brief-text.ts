// Decision Brief — four-section data helpers
//
// Copy helpers here turn raw engine data into a tight executive memo:
// every sentence is deliberately short, domain-neutral (no hardcoded
// "finance" language), and free of duplicated noun phrases.

import type { DecisionRec } from "@/lib/decision-package";
import { classifyEvidence, selectBriefEvidence, selectRelevantImpactMetrics } from "@/lib/decision-package";

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
  /(automation|implementation|matching|processing|redesign|optimization|scoring|routing|review|platform|system|solution|software|tooling|workflow|intelligence|analytics|management|onboarding|scheduling|reconciliation|documentation|triage|qualification|health|support|service|reporting|ingestion|extraction|validation|tracking|monitoring)$/i;

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

/** Truncate verbose user problem statements to a clean executive phrase. */
function shortenProblem(value: string): string {
  const cleaned = stripManual(value)
    .replace(/^(my|our|we|the)\s+/i, "")
    .trim();
  if (cleaned.length <= 38) return cleaned;
  // Cut at the last complete word before 38 chars, append ellipsis.
  const cut = cleaned.slice(0, 35);
  const lastSpace = cut.lastIndexOf(" ");
  return lastSpace > 10 ? cleaned.slice(0, lastSpace) + "…" : cleaned.slice(0, 35) + "…";
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
  const rawProblem = firstSentence(summary?.problem_statement) || "";
  return { solution: t, problem: shortenProblem(rawProblem) || "" };
}

 /**
 * Build a standalone solution phrase for a sentence.
 * "AI-powered" + focus "invoice processing" → "AI-powered invoice processing".
 * "Automated Invoice Matching" (already a noun phrase) stays as-is.
 * When the title lacks a colon and the problem is too verbose, keeps the title alone.
 */
function solutionPhraseFor(top: DecisionRec, summary?: any): string {
  // Prefer the engine's specific action or intervention title when available.
  const specific = firstSentence((top as any).specific_action);
  if (specific && specific.length > 10) return specific;

  const { solution, problem } = titleParts(top, summary);
  const modifier = cleanModifier(solution);
  const focus = stripManual(problem);
  if (!modifier) return focus || "This solution";
  if (SOLUTION_NOUN.test(modifier)) return modifier;
  if (focus && focus.length <= 45) return `${modifier} ${focus}`;
  return modifier;
}

/** Lower-case problem focus — shortened for use in evidence card context lines. */
export function problemFocus(top: DecisionRec, summary?: any): string {
  const raw = stripManual(titleParts(top, summary).problem);
  return shortenProblem(raw) || "the workflow";
}

// ---- Section 1: Decision Recommendation (Purpose) ----

export interface ImpactCard {
  metric: string;
  label: string;
  context: string;
}

export function actionTitle(top: DecisionRec): string {
  const t = firstSentence(top.title) || "";
  const idx = t.indexOf(":");
  if (idx > 0) {
    const solution = t.slice(0, idx).trim();
    const problem = t.slice(idx + 1).trim();
    if (solution && problem) {
      const focus = stripManual(problem);
      if (focus) return `Approve ${titleCasePhrase(solution)} ${titleCasePhrase(focus)}`;
      return `Approve ${titleCasePhrase(solution)}`;
    }
  }
  // No colon — the engine returned a generic title. Use specific_action
  // if available; otherwise build from category.
  const specific = firstSentence((top as any).specific_action || "");
  if (specific && specific.length > 10) {
    return titleCasePhrase(specific);
  }

  const desc = firstSentence(top.description || "");
  if (desc && desc.length > 10 && desc.length < 100) {
    const action = desc.charAt(0).toUpperCase() + desc.slice(1);
    return action + (action.endsWith(".") ? "" : ".");
  }

  // Fallback: use category to build a meaningful action phrase
  const cat = (top.category || "").toLowerCase();
  if (cat.includes("ai")) return "Implement AI-powered solution for this workflow";
  if (cat.includes("software")) return "Implement software-driven solution for this workflow";
  if (cat.includes("process")) return "Redesign workflow with a focus on quality and efficiency";
  if (cat.includes("workflow") || cat.includes("automation")) return "Automate this workflow with a focus on consistency";
  if (cat.includes("staffing")) return "Expand team capacity with a focus on throughput";
  if (cat.includes("hybrid")) return "Implement hybrid solution combining automation and human review";
  if (cat.includes("no_action")) return "Maintain current process \u2014 no implementation recommended";
  return `Approve ${titleCasePhrase(t)}`;
}

export function recommendationExplanation(top: DecisionRec, summary: any): { one: string; two: string; three: string } {
  const cat = (top.category || "").toLowerCase();
  const specificAction = firstSentence((top as any).specific_action);
  const workflow = summary?.workflow || top.pathway_label || "";
  const wfLabel = workflow.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "this workflow";

  // Sentence 1 — Operating-model change. Describes what shifts in the
  // business, not what technology is used.
  const operatingChange = (() => {
    if (cat.includes("ai")) return `Move ${wfLabel} from manual handling to exception-based management.`;
    if (cat.includes("software")) return `Replace manual ${wfLabel} with a purpose-built software solution.`;
    if (cat.includes("process")) return `Redesign ${wfLabel} to eliminate unnecessary steps and clarify ownership before introducing new technology.`;
    if (cat.includes("workflow") || cat.includes("automation")) return `Automate the repeatable steps in ${wfLabel} while routing exceptions to human review.`;
    if (cat.includes("staffing")) return `Add capacity in ${wfLabel} through additional staffing rather than technology investment.`;
    if (cat.includes("hybrid")) return `Combine automation for routine work with human expertise for exceptions in ${wfLabel}.`;
    if (cat.includes("no_action")) return `Do not invest in new technology for ${wfLabel} at this stage.`;
    return `Improve ${wfLabel} with the recommended intervention.`;
  })();

  // Sentence 2 — What actually changes. Uses specific_action if available,
  // otherwise infers from the pathway.
  const mechanism = specificAction && specificAction.length > 10
    ? specificAction.charAt(0).toLowerCase() + specificAction.slice(1) + (specificAction.endsWith(".") ? "" : ".")
    : (() => {
        if (cat.includes("ai")) return "Automate the highest-volume, most repeatable steps while keeping human judgment on exceptions and high-risk decisions.";
        if (cat.includes("software")) return "Deploy purpose-built software to handle routine processing while the team focuses on higher-value work.";
        if (cat.includes("process")) return "Simplify responsibilities, approvals, and exception paths before considering technology investment.";
        if (cat.includes("workflow") || cat.includes("automation")) return "Route repeatable work through deterministic rules and surface only exceptions for human review.";
        return "Implement the recommended changes to improve throughput and consistency.";
      })();

  // Sentence 3 — Why leadership should care. Describes the business effect
  // without enumerating KPI labels (the cards do that separately).
  const businessEffect = cat.includes("no_action")
    ? "Establish the baseline so leadership can determine whether intervention is economically justified."
    : "The evidence indicates this operating model can materially reduce cost and manual effort while strengthening controls.";

  // Sentence 4 — Decision condition.
  const condition = cat.includes("no_action")
    ? "Reassess only if volume or complexity increases."
    : "Begin with a bounded pilot and scale only after the economics, accuracy, and control performance are validated against your current baseline.";

  const one = `${operatingChange} ${mechanism} ${businessEffect} ${condition}`;

  return { one, two: "", three: "" };
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
  // Filter to only metrics relevant to this decision context.
  const workflow = top.pathway_label || (top as any).workflow || "";
  const ranges = selectRelevantImpactMetrics(top.outcome_ranges || [], workflow);
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

  // Sort outcome ranges: Economics → Capacity → Control.
  // Cost, savings, and effort metrics lead. Throughput and capacity follow.
  // Quality, detection, and compliance metrics come last.
  const sortedRanges = [...ranges].sort((a: any, b: any) => {
    const aLabel = (a.metric_label || "").toLowerCase();
    const bLabel = (b.metric_label || "").toLowerCase();
    const isCost = (l: string) => /cost|savings|saving|expense|spend/i.test(l);
    const isCapacity = (l: string) => /capacity|throughput|volume|time|cycle|delay|backlog|processed/i.test(l);
    const aRank = isCost(aLabel) ? 1 : isCapacity(aLabel) ? 2 : 3;
    const bRank = isCost(bLabel) ? 1 : isCapacity(bLabel) ? 2 : 3;
    return aRank - bRank;
  });

  if (sortedRanges.length > 0) {
    const r = sortedRanges[0];
    cards.push({
      metric: valueFor(r),
      label: labelFor(r, "processing cost"),
      context: "Primary outcome of this initiative.",
    });
  } else {
    cards.push({ metric: "Measurable", label: "Reduced processing cost", context: "Primary outcome of this initiative." });
  }

  if (sortedRanges.length > 1) {
    const r2 = sortedRanges[1];
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
  isSupporting?: boolean;
}

function cleanMetric(metricRaw: string, val: string): string {
  const lc = metricRaw.toLowerCase();
  if (/cost|error|manual|effort|time|processing|handle|turnaround|expense/i.test(lc)) return `${val} lower ${lc}`;
  if (/capacity|throughput|fraud|detection|accuracy|satisfaction|automation|rate|volume|invoices|quality/i.test(lc)) return `${val} improvement in ${lc}`;
  return `${val} ${lc}`;
}

export function evidenceCards(top: DecisionRec, summary?: any): EvidenceCard[] {
  const raw = (top.comparable_implementations || []);

  // Classify evidence by relevance to this decision. Only tiers A–C qualify
  // for the Executive Brief. Never show irrelevant records just to fill slots.
  const workflow = summary?.workflow || top.pathway_label || "";
  const intervention = top.category || (top as any).specific_action || top.title || "";
  const scored = classifyEvidence(raw, workflow, intervention);
  const relevant = selectBriefEvidence(scored);

  const seen = new Set<string>();
  return relevant
    .filter((c) => {
      const key = asString(c.organization).trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((c) => {
      const org = asString(c.organization).trim() || "An organization with a similar workflow";
      const outcome = asString(c.outcome_summary || c.observed_outcome);
      const impl = asString(c.intervention_description || c.intervention);
      const context = impl
        ? `Implemented ${impl.toLowerCase()}.`
        : "Deployed this approach.";
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
      const unique = [...new Set(bullets)];
      if (unique.length === 0) unique.push("Reported measurable operational improvement.");
      return { company: org, context, bullets: unique.slice(0, 3), isSupporting: !c.isDirect };
    });
}

export function evidenceIntro(top: DecisionRec): string {
  const solutionPhrase = solutionPhraseFor(top).toLowerCase();
  return `The organizations below implemented ${solutionPhrase} and reported measurable business outcomes — observed results, not projections.`;
}

// ---- Section 3: Objectives ----

export interface StrategyCard {
  heading: string;
  description: string;
  objective: string;
}

export function strategyCards(top: DecisionRec): StrategyCard[] {
  const focus = problemFocus(top);
  // Only interpolate the focus when it's a clean short phrase.
  // Truncated problem fragments and generic fallbacks degrade the prose.
  const workflow = focus.includes("…") || focus === "the workflow" ? "the workflow" : focus;
  return [
    {
      heading: "Reduce Manual Effort",
      description: `Automate repeatable steps in ${workflow} while routing exceptions through controlled human review.`,
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
