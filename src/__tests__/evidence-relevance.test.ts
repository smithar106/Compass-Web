import { describe, it, expect } from "vitest";
import { classifyEvidence, selectBriefEvidence } from "@/lib/decision-package";

const salesCallEvidence = [
  {
    organization: "VoiceCo",
    workflow: "inbound_sales",
    intervention: "AI voice agents for inbound sales calls",
    intervention_description: "Deployed AI voice agents to handle inbound sales inquiries automatically",
    similarity_score: 78,
    evidence_tier: "gold",
  },
  {
    organization: "SupportAI",
    workflow: "customer_support",
    intervention: "AI voice agent for call handling",
    intervention_description: "AI voice agent for customer support call triage",
    similarity_score: 62,
    evidence_tier: "silver",
  },
  {
    organization: "FlowCo",
    workflow: "process_automation",
    intervention: "Workflow automation for high-volume interactions",
    intervention_description: "Automated high-volume customer interaction routing",
    similarity_score: 55,
    evidence_tier: "silver",
  },
  {
    organization: "Deloitte",
    workflow: "finance",
    intervention: "AI fraud detection",
    intervention_description: "AI-assisted duplicate detection and AP fraud prevention",
    similarity_score: 68,
    evidence_tier: "gold",
  },
  {
    organization: "Accenture",
    workflow: "ai_development",
    intervention: "Azure AI Foundry",
    intervention_description: "Azure AI Foundry to accelerate AI tool development",
    similarity_score: 71,
    evidence_tier: "gold",
  },
];

const invoiceEvidence = [
  {
    organization: "APQC",
    workflow: "invoice_processing",
    intervention: "AI-based extraction, three-way matching, touchless routing",
    similarity_score: 82,
    evidence_tier: "gold",
  },
  {
    organization: "Deloitte",
    workflow: "finance",
    intervention: "AI fraud detection",
    similarity_score: 68,
    evidence_tier: "gold",
  },
];

describe("evidence relevance classification", () => {
  it("ranks sales-call evidence correctly — AP fraud and AI tooling are tier D/E, not A-C", () => {
    const scored = classifyEvidence(
      salesCallEvidence,
      "inbound_sales",
      "AI voice agents for inbound sales",
    );

    const tiers = scored.map((e) => ({
      org: e.organization,
      tier: e.relevanceTier,
      score: e.relevanceScore,
      reason: e.relevanceReason,
    }));

    // VoiceCo: same workflow, same intervention → tier A
    expect(tiers[0].tier).toBe("A");
    // SupportAI: overlapping intervention, different but related workflow → tier B or C
    expect(["B", "C"]).toContain(tiers[1].tier);
    // Deloitte fraud and Accenture AI tools: unrelated → tier D or E
    const deloitte = tiers.find((t) => t.org === "Deloitte")!;
    expect(["D", "E"]).toContain(deloitte.tier);
    const accenture = tiers.find((t) => t.org === "Accenture")!;
    expect(["D", "E"]).toContain(accenture.tier);
  });

  it("selectBriefEvidence only includes tiers A–C, never D or E", () => {
    const scored = classifyEvidence(
      salesCallEvidence,
      "inbound_sales",
      "AI voice agents for sales",
    );
    const selected = selectBriefEvidence(scored);

    const orgs = selected.map((e) => e.organization);
    // Should include VoiceCo and maybe SupportAI/FlowCo, but NOT Deloitte or Accenture
    expect(orgs).toContain("VoiceCo");
    expect(orgs).not.toContain("Deloitte");
    expect(orgs).not.toContain("Accenture");
  });

  it("never returns more than 3 evidence records", () => {
    const scored = classifyEvidence(
      salesCallEvidence,
      "inbound_sales",
      "AI voice agents",
    );
    const selected = selectBriefEvidence(scored);
    expect(selected.length).toBeLessThanOrEqual(3);
  });

  it("returns fewer cards when evidence is limited — no padding", () => {
    // Only one relevant record for invoice processing
    const scored = classifyEvidence(
      invoiceEvidence,
      "invoice_processing",
      "invoice automation",
    );
    const selected = selectBriefEvidence(scored);

    // APQC is relevant, Deloitte fraud is not
    expect(selected.length).toBe(1);
    expect(selected[0].organization).toBe("APQC");
  });

  it("scores direct workflow + intervention matches as tier A", () => {
    const scored = classifyEvidence(
      [{ organization: "TestCo", workflow: "invoice_processing", intervention: "invoice automation", similarity_score: 85 }],
      "invoice_processing",
      "invoice automation",
    );
    expect(scored[0].relevanceTier).toBe("A");
    expect(scored[0].relevanceScore).toBeGreaterThanOrEqual(0.9);
  });

  it("classifies completely unrelated evidence as tier E", () => {
    const scored = classifyEvidence(
      [{ organization: "UnrelatedCo", workflow: "hr_onboarding", intervention: "employee portal", similarity_score: 20 }],
      "invoice_processing",
      "invoice automation",
    );
    expect(scored[0].relevanceTier).toBe("E");
    // Tier E should never be selected
    expect(selectBriefEvidence(scored)).toHaveLength(0);
  });
});
