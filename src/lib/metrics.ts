// Typed metric system — deterministic validation and business-safe language.
//
// Every metric is classified by type so validation depends on semantics rather
// than a universal 0–100 rule, and so direction language never produces
// contradictions like "reduce hours saved".

export type MetricType =
  | "percentage"
  | "currency"
  | "duration"
  | "count"
  | "rate"
  | "ratio"
  | "score"
  | "capacity"
  | "productivity"
  | "cost_savings"
  | "revenue"
  | "hours_saved"
  | "throughput";

export type MetricDirection =
  | "increase"
  | "decrease"
  | "reduction"
  | "improvement"
  | "avoidance"
  | "savings"
  | "capacity_gain"
  | "ambiguous";

export type ValidationStatus = "valid" | "unusual" | "needs_review" | "invalid";

export interface Metric {
  canonical_name: string;
  metric_type: MetricType;
  value: number | string;
  unit: string;
  direction: MetricDirection;
  timeframe?: string;
  baseline?: number | string;
  source_record_id?: string;
  confidence?: string;
  validation_status: ValidationStatus;
  validation_reason?: string;
}

// Resource/label heuristics -> metric type.
const TYPE_KEYWORDS: Array<[MetricType, RegExp]> = [
  ["hours_saved", /hours?\s+saved|hrs?\s+returned|hours?\s+returned|hours?\s+saved/i],
  ["cost_savings", /cost\s+saving|savings|cost\s+reduction|annual\s+cost|cost\s+benefit/i],
  ["revenue", /revenue|arr|uplift|sales\s+revenue|additional\s+revenue/i],
  ["currency", /\$|usd|eur|gbp|annual .*cost|budget/i],
  ["duration", /days?|weeks?|months?|hours?\s+per|cycle\s+time|turnaround|time\s+to|processing\s+time/i],
  ["percentage", /%|percent|percentage|rate|ratio/i],
  ["count", /count|number|leads|invoices|tickets|records|cases|requests|null/i],
  ["rate", /rate|per\s+(day|hour|week|month|year)|frequency/i],
  ["ratio", /ratio|per|:|\bvs\b|multiplier|return|roi/i],
  ["score", /score|rating|index|nps|satisfaction/i],
  ["capacity", /capacity|throughput|volume|load|scale/i],
  ["productivity", /productivity|cpp|per\s+person|per\s+employee|output|efficiency/i],
];

export function inferMetricType(metricName: string, unit: string): MetricType {
  const nameLow = metricName.toLowerCase();
  const unitLow = (unit || "").toLowerCase();
  if (/roi/i.test(nameLow) || /return on/i.test(nameLow)) return "ratio";
  for (const [type, re] of TYPE_KEYWORDS) {
    if (re.test(nameLow) || (unitLow && re.test(unitLow))) return type;
  }
  if (/%/.test(unit)) return "percentage";
  return "count";
}

/**
 * Validation is type-aware. Returns a validation status and reason.
 * Values above 100 are NEVER rejected for currency/count/duration/ROI/hours.
 */
export function validateMetric(
  name: string,
  value: number,
  unit: string,
  direction: MetricDirection
): { status: ValidationStatus; reason: string } {
  const type = inferMetricType(name, unit);
  return validateByType(type, name, value, unit, direction);
}

export function validateByType(
  type: MetricType,
  name: string,
  value: number,
  unit: string,
  direction: MetricDirection
): { status: ValidationStatus; reason: string } {
  if (!isFinite(value) || Number.isNaN(value)) {
    return { status: "invalid", reason: "value is not a finite number" };
  }
  if (value < 0) {
    return { status: "invalid", reason: "negative value for non-negative metric" };
  }

  switch (type) {
    case "percentage": {
      if (value > 100) {
        if (direction === "increase" || direction === "improvement") {
          return { status: "unusual", reason: "percentage increase may legitimately exceed 100" };
        }
        return { status: "unusual", reason: "percentage above 100; check whether it is a ratio or an increase" };
      }
      return { status: "valid", reason: "percentage within 0–100" };
    }
    case "currency":
    case "cost_savings":
    case "revenue":
    case "hours_saved":
    case "count":
    case "capacity":
    case "throughput":
    case "productivity":
      return { status: "valid", reason: `${type} any non-negative value is allowable` };
    case "duration": {
      if (value < 0) return { status: "invalid", reason: "duration must be positive" };
      return { status: "valid", reason: `duration in ${unit || "time unit"}` };
    }
    case "ratio": {
      return { status: "valid", reason: "ratio any positive numeric value" };
    }
    case "rate": {
      // Validate using unit + context, not a 0–100 rule.
      return { status: "valid", reason: `rate validated by unit (${unit || "unknown"})` };
    }
    case "score": {
      if (value > 100) return { status: "unusual", reason: "score exceeds 100; verify scale" };
      return { status: "valid", reason: "score within 0–100" };
    }
    default:
      return { status: "valid", reason: "numeric within expected range" };
  }
}

// ---- Direction-safe language -------------------------------------------------

export interface DirectionChoice {
  direction: MetricDirection;
  confidence: "high" | "low";
}

export function normalizeDirection(raw: string | undefined): DirectionChoice {
  const d = (raw || "").trim().toLowerCase().replace(/\s+/g, " ");
  const map: Record<string, MetricDirection> = {
    increase: "increase",
    decreasing: "decrease",
    decreased: "decrease",
    reduce: "decrease",
    reduced: "decrease",
    reduction: "decrease",
    lower: "decrease",
    lowering: "decrease",
    improvement: "improvement",
    improved: "improvement",
    improve: "improvement",
    raises: "increase",
    raised: "increase",
    mitigate: "improvement",
    avoidance: "avoidance",
    avoided: "avoidance",
    avoid: "avoidance",
    prevented: "avoidance",
    savings: "savings",
    saved: "savings",
    saving: "savings",
    "capacity_gain": "capacity_gain",
    "capacity gain": "capacity_gain",
    "increase capacity": "capacity_gain",
  };
  const direct = map[d];
  if (direct) return { direction: direct, confidence: "high" };
  return { direction: "ambiguous", confidence: "low" };
}

// Direction should be business-safe for a metric type.
function safeDirection(type: MetricType, direction: MetricDirection): MetricDirection {
  if (direction === "ambiguous") return "ambiguous";
  if (type === "hours_saved" || type === "cost_savings" || type === "revenue") {
    // "reduce hours saved" is a language error; treat as gain/savings.
    if (direction === "decrease" || direction === "reduction" || direction === "avoidance") {
      return "savings";
    }
    return direction;
  }
  return direction;
}

export function metricClaim(metric: Metric): string {
  const name = metric.canonical_name;
  const direction = safeDirection(metric.metric_type, metric.direction);
  if (direction === "ambiguous") return "";
  const value = displayValue(metric.value, metric.unit);
  switch (direction) {
    case "increase":
    case "improvement": {
      if (metric.metric_type === "hours_saved") return `Save ${displayValue(metric.value, "")} hours annually`;
      if (metric.metric_type === "cost_savings") return `Generate ${value} in annual savings`;
      return `Improve ${name} by ${value}`;
    }
    case "savings": {
      if (metric.metric_type === "hours_saved") return `Save ${displayValue(metric.value, "")} hours annually`;
      if (metric.metric_type === "cost_savings") return `Generate ${value} in annual savings`;
      return `Achieve ${value} in ${name}`;
    }
    case "decrease":
      return `Reduce ${name} by ${value}`;
    case "avoidance":
      return `Avoid ${value} in ${name}`;
    case "capacity_gain":
      return `Increase ${name} by ${value}`;
    default:
      return "";
  }
}

export function displayValue(value: number | string, unit: string): string {
  const unitLow = (unit || "").toLowerCase();
  if (typeof value === "string") return value;
  if (unitLow === "usd" || unitLow === "$" || unitLow === "currency") {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(value >= 1000000000 ? 1 : 0)} million`;
    return `$${Math.round(value).toLocaleString()}`;
  }
  if (unitLow === "percent" || unitLow === "%") return `${value}%`;
  if (unitLow) return `${value} ${unit}`;
  return `${value}`;
}