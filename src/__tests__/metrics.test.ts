import { describe, it, expect } from "vitest";
import {
  inferMetricType,
  validateMetric,
  validateByType,
  normalizeDirection,
  metricClaim,
} from "@/lib/metrics";

describe("inferMetricType", () => {
  it("classifies type-aware semantics, not a 0-100 rule", () => {
    expect(inferMetricType("Annual cost savings", "USD")).toBe("cost_savings");
    expect(inferMetricType("Hours saved", "hours")).toBe("hours_saved");
    expect(inferMetricType("Revenue uplift", "$")).toBe("revenue");
    expect(inferMetricType("Invoice processing time", "hours")).toBe("duration");
    expect(inferMetricType("Error rate", "%")).toBe("percentage");
    expect(inferMetricType("NPS", "score")).toBe("score");
    expect(inferMetricType("ROI", "%")).toBe("ratio");
  });
});

describe("validateMetric is type-aware", () => {
  it("allows currency/count/hours savings above 100", () => {
    expect(validateMetric("Annual cost savings", 2_400_000, "USD", "increase").status).toBe("valid");
    expect(validateMetric("Hours saved", 4000, "hours", "increase").status).toBe("valid");
    expect(validateMetric("Invoices processed", 500, "count", "increase").status).toBe("valid");
  });

  it("rejects negative values", () => {
    expect(validateMetric("Invoices", -5, "count", "increase").status).toBe("invalid");
    expect(validateMetric("Hours saved", -10, "hours", "increase").status).toBe("invalid");
  });

  it("flags only genuinely unusual metrics (scores > 100)", () => {
    expect(validateMetric("Satisfaction score", 150, "score", "improvement").status).toBe("unusual");
    expect(validateMetric("Satisfaction score", 85, "score", "improvement").status).toBe("valid");
  });

  it("permits percentage increases over 100 but flags with reason", () => {
    const r = validateMetric("Error rate", 130, "%", "increase");
    expect(r.status).toBe("unusual");
    expect(r.reason).toContain("exceed 100");
  });
});

describe("normalizeDirection", () => {
  it("maps language to a canonical direction", () => {
    expect(normalizeDirection("reduce").direction).toBe("decrease");
    expect(normalizeDirection("Reduced").direction).toBe("decrease");
    expect(normalizeDirection("improvement").direction).toBe("improvement");
    expect(normalizeDirection("savings").direction).toBe("savings");
    expect(normalizeDirection("increase capacity").direction).toBe("capacity_gain");
    expect(normalizeDirection("bogus").direction).toBe("ambiguous");
  });
});

describe("metricClaim is direction-safe", () => {
  it("never emits a contradictory 'reduce hours saved' claim", () => {
    const m = {
      canonical_name: "Hours saved",
      metric_type: "hours_saved" as const,
      value: 120,
      unit: "hours",
      direction: "decrease" as const,
      validation_status: "valid" as const,
    };
    expect(metricClaim(m)).toBe("Save 120 hours annually");
  });
});