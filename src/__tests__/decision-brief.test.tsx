import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DecisionPackageView } from "@/components/analyze/DecisionPackageView";

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

describe("DecisionPackageView executive memo", () => {
  it("renders the Prepared by Compass masthead and memo sections", () => {
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
    expect(screen.getByText("Executive Decision Brief")).toBeTruthy();
    expect(screen.getByText("Why this recommendation")).toBeTruthy();
    expect(screen.getByText("Conditions for approval")).toBeTruthy();
    expect(screen.getByText("For approval")).toBeTruthy();
  });

  it("opens the print preview with the McKinsey memo structure", () => {
    render(
      <DecisionPackageView
        recs={[mockRec as any]}
        meta={{ evidence_count: { unique_organizations: 18 } }}
        summary={{ problem_statement: "Manual invoice processing" }}
        status="decision_ready"
      />
    );
    const buttons = screen.getAllByText("Download PDF");
    fireEvent.click(buttons[0]);
    expect(screen.getAllByText((content) => content.includes("Prepared by Compass")).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Why we can defend this").length).toBeGreaterThanOrEqual(1);
  });
});
