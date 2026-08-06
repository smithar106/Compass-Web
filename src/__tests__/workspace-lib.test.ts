import { describe, it, expect, beforeEach } from "vitest";
import {
  DECISION_REGISTRY_KEY,
  loadDecisionRegistry,
  recordDecision,
  workspaceStatusFromAnalysis,
  rowFromDecision,
  fallbackRow,
  expectedImpactFromTop,
  formatDate,
} from "@/lib/workspace";

describe("workspace registry", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("round-trips recorded decisions deterministically", () => {
    recordDecision("rec-1", "2026-08-01T12:00:00Z");
    recordDecision("rec-2", "2026-08-02T12:00:00Z");
    expect(loadDecisionRegistry()).toEqual([
      { id: "rec-2", createdAt: "2026-08-02T12:00:00Z" },
      { id: "rec-1", createdAt: "2026-08-01T12:00:00Z" },
    ]);
  });

  it("dedupes by id and keeps the newest entry", () => {
    recordDecision("rec-1", "2026-08-01T12:00:00Z");
    recordDecision("rec-1", "2026-08-03T12:00:00Z");
    expect(loadDecisionRegistry()).toEqual([{ id: "rec-1", createdAt: "2026-08-03T12:00:00Z" }]);
  });

  it("ignores corrupted storage", () => {
    localStorage.setItem(DECISION_REGISTRY_KEY, "{not-json");
    expect(loadDecisionRegistry()).toEqual([]);
  });
});

describe("workspace status mapping", () => {
  it("maps awaiting_answers to draft", () => {
    expect(workspaceStatusFromAnalysis({ status: "awaiting_answers" })).toBe("draft");
  });

  it("maps generated recommendations to under review", () => {
    expect(workspaceStatusFromAnalysis({ status: "decision_ready" })).toBe("under_review");
    expect(workspaceStatusFromAnalysis({ status: "insufficient_evidence" })).toBe("under_review");
    expect(workspaceStatusFromAnalysis({})).toBe("under_review");
    expect(workspaceStatusFromAnalysis(null)).toBe("under_review");
  });
});

describe("row mapping", () => {
  it("builds a row from a persisted decision payload", () => {
    const row = rowFromDecision("rec-1", {
      analysis: {
        status: "decision_ready",
        created_at: "2026-08-01T12:00:00Z",
        decision: {
          recommendation_id: "rec-1",
          recommendations: [
            {
              title: "AI Implementation",
              outcome_ranges: [{ metric_label: "Processing Cost", low: 40, high: 60, unit: "%" }],
              next_validation_step: { action: "Measure a 4-week baseline" },
            },
          ],
          assessment_summary: {
            problem_statement: "Our finance team manually reconciles invoices",
            business_function: "finance",
          },
        },
      },
    });
    expect(row.id).toBe("rec-1");
    expect(row.title).toBe("Our finance team manually reconciles invoices");
    expect(row.businessFunction).toBe("finance");
    expect(row.recommendation).toBe("AI Implementation");
    expect(row.status).toBe("under_review");
    expect(row.createdAt).toBe("2026-08-01T12:00:00Z");
    expect(row.expectedImpact).toBe("Processing Cost: 40–60%");
    expect(row.nextAction).toBe("Measure a 4-week baseline");
    expect(row.owner).toBe("—");
  });

  it("falls back to explicit placeholders for sparse records", () => {
    const row = rowFromDecision("rec-2", { analysis: {} });
    expect(row.title).toBe("Operational decision");
    expect(row.businessFunction).toBe("—");
    expect(row.recommendation).toBe("Recommendation available");
    expect(row.createdAt).toBe(null);
    expect(row.expectedImpact).toBe("—");
  });

  it("fallbackRow keeps the registry entry visible", () => {
    const row = fallbackRow({ id: "rec-x", createdAt: "2026-08-01T12:00:00Z" });
    expect(row.id).toBe("rec-x");
    expect(row.status).toBe("under_review");
    expect(row.createdAt).toBe("2026-08-01T12:00:00Z");
  });
});

describe("expected impact formatting", () => {
  it("prefers evidence-derived outcome ranges", () => {
    expect(
      expectedImpactFromTop({ outcome_ranges: [{ metric_label: "Cost", low: 40, high: 60, unit: "%" }] })
    ).toBe("Cost: 40–60%");
  });

  it("formats annual savings when present", () => {
    expect(
      expectedImpactFromTop({
        impact: { annual_savings: { low: 150000, high: 250000, currency: "USD" } },
      })
    ).toBe("$150K–$250K/yr");
  });

  it("returns an explicit dash when nothing is available", () => {
    expect(expectedImpactFromTop({})).toBe("—");
    expect(expectedImpactFromTop({ impact: { annual_savings: { low: null, high: null } } })).toBe("—");
  });
});

describe("date formatting", () => {
  it("formats ISO dates and degrades gracefully", () => {
    expect(formatDate("2026-08-01T12:00:00Z")).toMatch(/Aug 1, 2026/);
    expect(formatDate(null)).toBe("—");
    expect(formatDate("not-a-date")).toBe("—");
  });
});
