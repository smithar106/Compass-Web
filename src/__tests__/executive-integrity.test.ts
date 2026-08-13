import { describe, it, expect } from "vitest";
import { actionTitle, impactCards, evidenceCards } from "@/lib/brief-text";
import { classifyEvidence, selectBriefEvidence } from "@/lib/decision-package";

describe("Executive Integrity and Messaging Rules", () => {
  it("ensures recommendation titles are business-readable and do not default to raw evidence titles", () => {
    const recWithRawEvidenceTitle = {
      title: "Bulk SMS Broadcast for Lead Pruning and Re-Engagement",
      category: "Workflow_Automation",
      description: "Automate initial lead outreach and qualification.",
    };
    const title = actionTitle(recWithRawEvidenceTitle as any);
    // Should be formatted as an executive action title, not raw evidence record title
    expect(title).toContain("Automate");
    expect(title).not.toBe("Bulk SMS Broadcast for Lead Pruning and Re-Engagement");
  });

  it("separates observed comparable outcomes from customer-specific financial projections", () => {
    const rec = {
      impact: {
        annual_savings: { status: "estimated", low: 200000, expected: 350000, high: 500000, currency: "USD" },
      },
      outcome_ranges: [
        { metric_label: "processing cost", median: 45, unit: "%", directly_comparable: true }
      ],
    };
    const cards = impactCards(rec as any);
    // Customer savings card should reflect expected annual savings
    expect(cards[0].label).toBe("Expected annual savings");
    expect(cards[0].context).toContain("Range $200K–$500K");
    // Comparable outcome card should explicitly state it is observed across comparable implementations
    const outcomeCard = cards.find(c => c.label.includes("Lower processing cost"));
    expect(outcomeCard?.context).toContain("Observed across comparable implementations — not a projection");
  });

  it("supports 0, 1, 2, or 3 evidence cards without forcing padding or lowering relevance threshold", () => {
    const evidenceList = [
      { organization: "Org1", workflow: "invoice_processing", intervention: "automation", similarity_score: 90 },
      { organization: "Org2", workflow: "unrelated", intervention: "nothing", similarity_score: 10 },
    ];
    const scored = classifyEvidence(evidenceList, "invoice_processing", "automation");
    const selected = selectBriefEvidence(scored);
    // Exactly 1 valid evidence card passes threshold; should not pad to 3
    expect(selected.length).toBe(1);
    expect(selected[0].organization).toBe("Org1");
  });
});
