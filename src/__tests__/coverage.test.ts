import { describe, it, expect } from "vitest";
import {
  computeCoverageReport,
  computeDecisionCoverage,
  sliceCoverage,
  tierOf,
  businessFunctionOf,
  headlineFromMetadata,
  uncoveredWorkflows,
  type CoverageRecord,
} from "@/lib/coverage";

const mk = (overrides: Partial<CoverageRecord>): CoverageRecord => ({
  record_id: "r1",
  organization: "Acme Inc",
  intervention: "AI invoice matching",
  workflow: "invoice_processing",
  industry: "Logistics",
  business_function: "Finance",
  evidence_tier: "silver",
  outcome_summary: "Reduced processing time by 40%",
  source_url: "https://example.com/case",
  ...overrides,
});

describe("tierOf", () => {
  it("maps evidence tier strings", () => {
    expect(tierOf(mk({ evidence_tier: "gold" }))).toBe("gold");
    expect(tierOf(mk({ evidence_tier: "Silver" }))).toBe("silver");
    expect(tierOf(mk({ evidence_tier: "bronze" }))).toBe("bronze");
    expect(tierOf(mk({ evidence_tier: "" }))).toBe("rejected");
  });
});

describe("businessFunctionOf", () => {
  it("prefers the explicit field and falls back to workflow mapping", () => {
    expect(businessFunctionOf(mk({ business_function: "Legal" }))).toBe("Legal");
    expect(businessFunctionOf(mk({ business_function: "", workflow: "ci_cd" }))).toBe("Engineering");
    expect(businessFunctionOf(mk({ business_function: "", workflow: "unknown" }))).toBe("Unknown");
  });
});

describe("sliceCoverage", () => {
  it("groups and counts tiers, orgs, and high-quality share", () => {
    const records = [
      mk({ organization: "Acme Inc", evidence_tier: "gold" }),
      mk({ organization: "Acme Technologies", evidence_tier: "gold", record_id: "r2" }),
      mk({ organization: "Beta Co", evidence_tier: "bronze", record_id: "r3" }),
      mk({ organization: "Gamma LLC", record_id: "r4", evidence_tier: "" }),
    ];
    const slices = sliceCoverage(records, (r) => r.business_function || "Finance");
    const finance = slices[0];
    expect(finance.total).toBe(4);
    expect(finance.gold).toBe(2);
    expect(finance.bronze).toBe(1);
    expect(finance.rejected).toBe(1);
    // "Acme Inc" and "Acme Technologies" normalize to the same org.
    expect(finance.organizations).toBe(3);
    expect(finance.high_quality).toBe(2);
    expect(finance.high_quality_percent).toBe(50);
  });
});

describe("computeDecisionCoverage", () => {
  it("rolls up implementations per operational problem", () => {
    const records = [
      mk({ record_id: "a", organization: "Acme", workflow: "invoice_processing", evidence_tier: "gold" }),
      mk({ record_id: "b", organization: "Beta", workflow: "invoice_processing", evidence_tier: "silver" }),
      mk({ record_id: "c", organization: "Gamma", workflow: "ticketing", evidence_tier: "bronze" }),
    ];
    const rows = computeDecisionCoverage(records);
    expect(rows.length).toBe(2);
    const invoice = rows.find((r) => r.workflow === "invoice_processing")!;
    expect(invoice.implementations).toBe(2);
    expect(invoice.high_quality).toBe(2);
    expect(invoice.status).toBe("strong");
    const ticket = rows.find((r) => r.workflow === "ticketing")!;
    expect(ticket.high_quality).toBe(0);
    expect(ticket.status).toBe("none");
  });
});

describe("computeCoverageReport", () => {
  it("produces headline + dimension slices", () => {
    const report = computeCoverageReport([
      mk({ evidence_tier: "gold" }),
      mk({ evidence_tier: "silver", record_id: "r2" }),
      mk({ evidence_tier: "bronze", record_id: "r3" }),
    ]);
    expect(report.headline.implementations).toBe(3);
    expect(report.headline.gold).toBe(1);
    expect(report.headline.silver).toBe(1);
    expect(report.headline.bronze).toBe(1);
    expect(report.headline.high_quality).toBe(2);
    expect(report.by_business_function.length).toBeGreaterThan(0);
    expect(report.decision_coverage.length).toBeGreaterThan(0);
  });

  it("marks workflows without coverage", () => {
    const report = computeCoverageReport([mk({ workflow: "invoice_processing" })]);
    const uncovered = uncoveredWorkflows(report, ["invoice_processing", "contract_review", "onboarding"]);
    expect(uncovered).toEqual(["contract_review", "onboarding"]);
  });
});

describe("headlineFromMetadata", () => {
  it("derives headline numbers from engine metadata", () => {
    const h = headlineFromMetadata({
      published_records: 100,
      unique_organizations: 40,
      industries: 12,
      gold: 10,
      silver: 20,
      bronze: 50,
    });
    expect(h.implementations).toBe(100);
    expect(h.gold).toBe(10);
    expect(h.silver).toBe(20);
    expect(h.bronze).toBe(50);
    expect(h.rejected).toBe(20);
    expect(h.high_quality_percent).toBe(30);
  });
});
