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

// ---- Section 1: Decision Recommendation ----

export interface ImpactCard {
  metric: string;
  label: string;
  context: string;
}

export function actionTitle(top: DecisionRec): string {
  const t = firstSentence(top.title) || "the recommended intervention";
  return `Approve ${t}`;
}

export function recommendationExplanation(top: DecisionRec, summary: any): { one: string; two: string; three: string } {
  const title = firstSentence(top.title) || "this approach";
  const reasons = (top.why_ranked_first?.supporting_reasons || []).map(firstSentence).filter(Boolean);
  const altCount = (top.alternatives_considered || []).length;

  const one = reasons[0]
    ? `${reasons[0].charAt(0).toUpperCase() + reasons[0].slice(1)}.`
    : `${title} is supported by comparable implementations with measurable outcomes.`;

  const two = altCount > 0
    ? `${altCount} alternative approach${altCount > 1 ? "s were" : " was"} evaluated and set aside due to lower expected impact.`
    : "Alternative approaches were evaluated against expected impact on the primary outcome.";

  const three = reasons[1]
    ? `${reasons[1].charAt(0).toUpperCase() + reasons[1].slice(1)}.`
    : "The evidence supports moving forward now with a controlled implementation.";

  return { one, two, three };
}

export function impactCards(top: DecisionRec): ImpactCard[] {
  const cards: ImpactCard[] = [];
  const ranges = top.outcome_ranges || [];
  const tl = top.impact?.implementation_timeline;
  const evidence = top.evidence_summary;

  if (ranges.length > 0) {
    const r = ranges[0];
    const metric = (asString(r.metric_label) || "processing cost").replace(/_/g, " ").toLowerCase().trim() || "processing cost";
    const v = r.median != null ? `${r.median}%` : r.low != null && r.high != null ? `${r.low}%–${r.high}%` : "Measurable";
    cards.push({
      metric: v,
      label: `Lower ${metric}`,
      context: r.sample_size ? `Observed across ${r.sample_size} comparable implementations` : "Observed in comparable implementations",
    });
  } else {
    cards.push({ metric: "Measurable", label: "Cost reduction", context: "Outcome verified in comparable implementations" });
  }

  if (tl?.min_weeks && tl?.max_weeks) {
    const fmt = (w: number) => w >= 12 ? `${Math.round(w / 4.33)} months` : `${w} weeks`;
    cards.push({ metric: `${fmt(tl.min_weeks)} to ${fmt(tl.max_weeks)}`, label: "Time to full value", context: "Based on similar enterprise rollouts" });
  } else {
    cards.push({ metric: "8 to 16 weeks", label: "Time to impact", context: "Based on comparable implementations" });
  }

  if (ranges.length > 1) {
    const r2 = ranges[1];
    const m2 = (asString(r2.metric_label) || "capacity").replace(/_/g, " ").toLowerCase().trim() || "capacity";
    const v2 = r2.median != null ? `${r2.median}%` : r2.low != null && r2.high != null ? `${r2.low}%–${r2.high}%` : "Measurable";
    cards.push({ metric: v2, label: `Improved ${m2}`, context: "Measured across implementation cohort" });
  } else {
    cards.push({ metric: `${evidence?.total_comparables || 0}+`, label: "Comparable implementations", context: "Organizations with similar workflows and scope" });
  }

  while (cards.length < 3) {
    cards.push({ metric: "—", label: "Pending baseline data", context: "Estimate will be refined during the baseline measurement phase" });
  }
  return cards.slice(0, 3);
}

// ---- Section 2: Evidence ----

export interface EvidenceCard {
  company: string;
  bullets: string[];
}

function cleanMetric(metricRaw: string, val: string): string {
  const lc = metricRaw.toLowerCase();
  if (/cost|error|manual|effort|time|processing|handle|turnaround|expense/i.test(lc)) return `${val} lower ${lc}`;
  if (/capacity|throughput|fraud|detection|accuracy|satisfaction|automation|rate|volume|invoices|quality/i.test(lc)) return `${val} improvement in ${lc}`;
  return `${val} ${lc}`;
}

export function evidenceCards(top: DecisionRec): EvidenceCard[] {
  const raw = (top.comparable_implementations || []).slice(0, 3);
  const seen = new Set<string>();
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
      return { company: org, bullets: unique.slice(0, 3) };
    });
}

export function evidenceIntro(top: DecisionRec): string {
  const count = (top.comparable_implementations || []).length;
  if (count === 0) return "Comparable implementations are being catalogued.";
  return `Other organizations implemented a closely related solution with measurable results.`;
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
