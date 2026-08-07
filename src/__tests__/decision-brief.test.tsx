import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DecisionPackageView } from "@/components/analyze/DecisionPackageView";
import { actionTitle, impactCards } from "@/lib/brief-text";

const mockRec = {
  category: "Workflow_Automation",
  title: "Automated Invoice Matching",
  rationale: "Manual matching is the top driver of processing cost and errors.",
  confidence: { score: 0.82, label: "high", explanation: "Strong comparable evidence." },
  evidence_summary: { overall_tier: "gold", total_comparables: 24, gold_count: 5, silver_count: 12, bronze_count: 7, average_evidence_score: 61 },
  outcome_ranges: [
    { metric_label: "processing cost", low: 40, high: 60, median: 50, sample_size: 24, unit: "%", directly_comparable: true },
  ],
  comparable_implementations: [
    { organization: "Acme Corp", intervention: "Automated matching", outcome_summary: "Cost down 45%", evidence_tier: "gold", similarity_score: 71, source_url: "https://example.com" },
    { organization: "Beta Inc", intervention: "Rules-based routing", outcome_summary: "Throughput up 30%", evidence_tier: "silver", similarity_score: 63 },
  ],
  risks: [{ title: "Exception handling", explanation: "Exceptions remain manual.", mitigation: "Hybrid review queue." }],
  assumptions_detail: [{ title: "Volume stays stable", explanation: "If volume drops 30%, deferral becomes viable." }],
  information_gaps: [],
  alternatives_considered: [{ family: "AI-only extraction", reason: "Thinner evidence; hallucination risk." }],
  why_ranked_first: { supporting_reasons: ["Highest confidence", "Best outcome evidence"] },
  next_validation_step: { action: "Measure baseline", purpose: "Lock baseline before build.", success_criteria: "Baseline within 10%", owner: "Ops lead", duration: "2 weeks" },
  impact: { implementation_timeline: { min_weeks: 8, max_weeks: 12, expected_weeks: 10 } },
};

describe("actionTitle", () => {
  it("formats titles as natural executive initiatives", () => {
    expect(actionTitle({ title: "AI-powered Finance: Manual invoice processing" } as any)).toBe(
      "Approve AI-Powered Invoice Processing"
    );
    expect(actionTitle({ title: "Software solution for Sales: Lead qualification" } as any)).toBe(
      "Approve Software for Sales Lead Qualification"
    );
  });

  it("falls back to 'Approve {title}' when there is no colon split", () => {
    expect(actionTitle({ title: "Automated Invoice Matching" } as any)).toBe("Approve Automated Invoice Matching");
  });
});

describe("DecisionPackageView executive memo", () => {
  it("renders the four-section Decision Report structure", () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as any);
    render(
      <DecisionPackageView
        recs={[mockRec as any]}
        meta={{ evidence_count: { unique_organizations: 18 } }}
        summary={{ problem_statement: "Manual invoice processing" }}
        status="decision_ready"
      />
    );
    expect(screen.getByText("Approve Automated Invoice Matching")).toBeTruthy();
    expect(screen.getByText("01 — Decision Recommendation")).toBeTruthy();
    expect(screen.getByText("02 — Evidence")).toBeTruthy();
    expect(screen.getByText("03 — Strategy & Objectives")).toBeTruthy();
    expect(screen.getByText("04 — Implementation")).toBeTruthy();
  });

  it("renders the refreshed executive copy", () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as any);
    render(
      <DecisionPackageView
        recs={[mockRec as any]}
        meta={{ evidence_count: { unique_organizations: 18 } }}
        summary={{ problem_statement: "Manual invoice processing" }}
        status="decision_ready"
      />
    );
    // Authored recommendation paragraph + controlled-pilot close (no hardcoded domain).
    expect(screen.getByText(/workflow is consuming the most manual effort and operational risk/i)).toBeTruthy();
    expect(screen.getByText(/Automated Invoice Matching is the highest-value, lowest-risk fix identified/i)).toBeTruthy();
    expect(
      screen.getByText(/A go\/no-go decision at the end of the pilot gates any wider deployment on measured results/i)
    ).toBeTruthy();
    // Evidence intro no longer advertises the engine.
    expect(screen.queryByText(/Over 5,000 solutions analyzed/)).toBeNull();
    expect(screen.getByText(/observed results, not projections/i)).toBeTruthy();
    // Evidence cards carry a one-sentence context.
    expect(screen.getByText("Implemented automated matching to streamline invoice processing.")).toBeTruthy();
    // Implementation steps read as phases (now linear timeline with "01" prefix).
    expect(screen.getByText("Establish the Baseline")).toBeTruthy();
    expect(screen.getByText("Scale Deployment")).toBeTruthy();
  });

  it("opens the print preview with four-section layout", () => {
    render(
      <DecisionPackageView
        recs={[mockRec as any]}
        meta={{ evidence_count: { unique_organizations: 18 } }}
        summary={{ problem_statement: "Manual invoice processing" }}
        status="decision_ready"
      />
    );
    const buttons = screen.getAllByText("Download Brief as PDF");
    fireEvent.click(buttons[0]);
    expect(screen.getAllByText((content) => content.includes("Executive Decision Brief")).length).toBeGreaterThanOrEqual(1);
  });
});

describe("impactCards dollar estimates", () => {
  it("leads with expected annual savings when the engine estimates them", () => {
    const cards = impactCards({
      title: "AI Implementation",
      outcome_ranges: [{ metric_label: "processing cost", low: 40, high: 60, median: 50, unit: "%" }],
      impact: {
        annual_savings: { status: "estimated", low: 5062500, expected: 7045312, high: 8015625, currency: "USD" },
      },
    } as any);
    expect(cards[0]).toMatchObject({ metric: "$7.0M", label: "Expected annual savings" });
    expect(cards[0].context).toContain("$5.1M–$8.0M");
  });

  it("does not add a savings card when the engine could not estimate", () => {
    const cards = impactCards({
      title: "AI Implementation",
      outcome_ranges: [{ metric_label: "processing cost", low: 40, high: 60, median: 50, unit: "%" }],
      impact: { annual_savings: { status: "insufficient_input" } },
    } as any);
    expect(cards[0].label).not.toBe("Expected annual savings");
  });
});
