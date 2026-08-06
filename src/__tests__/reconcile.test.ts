import { describe, it, expect } from "vitest";
import {
  reconcilePathway,
  normalizeOrg,
  titleTooWeak,
  synthesizeTitle,
  computeQuality,
  applyReconciliation,
  reconcileEvidence,
  type ComparableEvidenceRaw,
} from "@/lib/reconcile";

const mkEvidence = (overrides: Partial<ComparableEvidenceRaw>): ComparableEvidenceRaw => ({
  organization: "Acme Inc",
  intervention: "AI invoice matching",
  intervention_description: "Automated two-way invoice matching and exception handling for AP teams",
  outcome_summary: "Reduced processing time by 40% and saved $1.2M annually",
  evidence_tier: "gold",
  source_url: "https://example.com/case",
  workflow: "invoice_processing",
  ...overrides,
});

describe("reconcilePathway", () => {
  it("canonicalizes raw category strings", () => {
    expect(reconcilePathway("Process_Redesign", "", "").pathway).toBe("Process_Redesign");
    expect(reconcilePathway("", "Deterministic Software", "").pathway).toBe("Software");
    expect(reconcilePathway("", "", "AI Implementation").pathway).toBe("AI");
    expect(reconcilePathway("", "", "").pathway).toBe("No_Action");
    expect(reconcilePathway("Quark Processing", "", "").pathway_score).toBe(0.4);
  });
});

describe("normalizeOrg", () => {
  it("collapses legal suffixes and case for dedup identity", () => {
    expect(normalizeOrg("Acme Inc")).toBe("acme");
    expect(normalizeOrg("Acme Corp")).toBe("acme");
    expect(normalizeOrg("ACME LLC")).toBe("acme");
    expect(normalizeOrg("Acme Technologies")).toBe("acme");
  });
});

describe("reconcileEvidence dedupes companies", () => {
  it("keeps only the highest-quality record per org", () => {
    const rec = applyReconciliation(
      {
        category: "AI",
        specific_action: "AI invoice matching",
        comparable_implementations: [
          mkEvidence({ organization: "Acme Inc", evidence_tier: "bronze", record_id: "r1" }),
          mkEvidence({ organization: "Acme Technologies", evidence_tier: "gold", record_id: "r2" }),
          mkEvidence({ organization: "Beta Company", outcome: "Reduced cost by 20%", record_id: "r3" }),
        ],
      },
      { problem: "Manual invoice processing", department: "Finance", objective: "Cost reduction" },
    );
    const orgs = rec.evidence.map((e) => normalizeOrg(e.organization));
    expect(orgs).toContain("acme");
    expect(orgs).toContain("beta");
    expect(new Set(orgs).size).toBe(orgs.length);
    const acme = rec.evidence.find((e) => normalizeOrg(e.organization) === "acme");
    expect(acme?.tier).toBe("gold");
  });
});

describe("title synthesis", () => {
  it("flags weak/generic titles", () => {
    expect(titleTooWeak("Multi-phased corporate transformation", "Manual invoice processing", "AI")).toBe(true);
    expect(titleTooWeak("", "Manual invoice processing", "AI")).toBe(true);
    expect(titleTooWeak("AI invoice matching platform", "Manual invoice processing", "AI")).toBe(false);
  });

  it("synthesizes a pathway-specific title when the raw title is weak", () => {
    const rec = applyReconciliation(
      {
        category: "AI Implementation",
        specific_action: "Incorporation of additional AI",
        comparable_implementations: [mkEvidence({})],
      },
      { problem: "Manual invoice processing", department: "Finance" },
    );
    expect(rec.title).toContain("invoic");
    expect(rec.title).toMatch(/ai/i);
  });
});

describe("computeQuality", () => {
  it("is Ready when all dimensions are strong", () => {
    const q = computeQuality({
      pathwayScore: 1,
      evidence: [
        {
          organization: "Acme",
          intervention: "AI invoice matching",
          description: "Automated AP invoice matching for enterprise accounting teams",
          outcome: "Reduced processing time by 40%",
          pathway: "AI",
          tier: "gold",
          similarity: 1,
          specificity: 0.9,
          relevance_score: 0.9,
          quality_score: 0.9,
          frequency_penalty: 0,
          final_score: 0.9,
          eligible: true,
        },
      ],
      titleOk: true,
      titleSpecificity: 0.9,
      metricsOk: true,
    });
    expect(q.status).toBe("Ready");
    expect(q.weak_dimensions).toEqual([]);
  });

  it("is Needs validation when evidence and title are weak", () => {
    const q = computeQuality({
      pathwayScore: 0.4,
      evidence: [],
      titleOk: false,
      titleSpecificity: 0.2,
      metricsOk: false,
    });
    expect(q.status).toBe("Needs validation");
    expect(q.weak_dimensions).toContain("pathway");
  });
});