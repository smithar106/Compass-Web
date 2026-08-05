// Decision Brief — four-section data helpers

import type { DecisionRec } from "@/lib/decision-package";

// ---- Section 1: Decision Recommendation ----

export interface ImpactCard {
  metric: string;
  label: string;
  context: string;
}

export function actionTitle(top: DecisionRec): string {
  const t = top.title || "the recommended intervention";
  return `Approve ${t}`;
}

export function recommendationExplanation(top: DecisionRec, summary: any): { one: string; two: string; three: string } {
  const title = top.title || "this approach";
  const reasons = top.why_ranked_first?.supporting_reasons || [];
  const altCount = (top.alternatives_considered || []).length;

  const one = reasons.length > 0
    ? `${reasons[0].charAt(0).toUpperCase() + reasons[0].slice(1).toLowerCase().replace(/\.$/, "")}.`
    : `${title} is supported by comparable implementations with measurable outcomes.`;

  const two = altCount > 0
    ? `${altCount} alternative approach${altCount > 1 ? "s were" : " was"} evaluated and set aside due to lower expected impact.`
    : "Alternative approaches were evaluated against expected impact on the primary outcome.";

  const three = reasons.length > 1
    ? `${reasons[1].charAt(0).toUpperCase() + reasons[1].slice(1).toLowerCase().replace(/\.$/, "")}.`
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
    const metric = (r.metric_label || "processing cost").replace(/_/g, " ").toLowerCase();
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
    const m2 = (r2.metric_label || "capacity").replace(/_/g, " ").toLowerCase();
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
  implementation: string;
  result: string;
}

export function evidenceCards(top: DecisionRec): EvidenceCard[] {
  const raw = (top.comparable_implementations || []).slice(0, 3);
  const seen = new Set<string>();
  return raw
    .filter((c) => {
      const key = (c.organization || "") + "|" + (c.outcome_summary || "");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((c) => {
      const org = c.organization || "A comparable organization";
      const impl = c.intervention_description || c.intervention || "Implemented a closely related solution across their operational workflow.";
      const outcome = c.outcome_summary || c.observed_outcome || "";
      const metrics = outcome.split(/[.;]/).map((s) => s.trim()).filter((s) => s.length > 3 && /%|reduction|increase|improvement|up|down/i.test(s));
      const cleanResult = metrics.length > 0
        ? metrics.map((m) => {
            const parts = m.split(/:/).map((p) => p.trim());
            if (parts.length >= 2) {
              const metric = parts[0].replace(/\b\w/g, (ch) => ch.toUpperCase());
              const val = parts[parts.length - 1];
              const lc = metric.toLowerCase();
              if (/cost|error|manual|effort|time|processing|handle|turnaround/i.test(lc)) return `${val} lower ${lc}`;
              if (/capacity|throughput|fraud|detection|accuracy|satisfaction|automation|rate|volume|invoices/i.test(lc)) return `${val} improvement in ${lc}`;
              return `${val} improvement in ${lc}`;
            }
            return m.replace(/\b(Cost down|Throughput up|Processing time|Error rate)\b/g, (mm) => mm.charAt(0).toUpperCase() + mm.slice(1));
          }).join(". ") + "."
        : "Measurable operational improvement observed.";
      return { company: org, implementation: impl, result: cleanResult };
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
  const title = top.title || "this solution";
  const problem = "manual processing";
  return [
    {
      heading: "Reduce Manual Effort",
      description: `Automate repeatable ${problem} steps while routing exceptions through a controlled human review process.`,
      objective: `Reduce manual processing effort without weakening controls.`,
    },
    {
      heading: "Increase Processing Capacity",
      description: `Scale volume through automation rather than headcount. ${title} handles higher throughput while maintaining quality.`,
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
  const sc = top.next_validation_step?.success_criteria || "At least 90% of workflow instances captured with complete timestamps";
  return [
    {
      name: "Establish the Baseline",
      timeline: "Weeks 1 to 2",
      detail: `Measure workflow volume, handling time, labor cost, error rate, and exception frequency. ${sc}.`,
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
