import { describe, it, expect } from "vitest";
import { isDirectDocumentUrl, verifyStrictCandidate, computeRawDocumentHash } from "@/lib/strict-verify";

describe("Strict Provenance Verification Standard", () => {
  it("rejects EDGAR browse/search landing pages as direct document URLs", () => {
    expect(isDirectDocumentUrl("https://www.sec.gov/edgar/browse/?CIK=0000320193")).toBe(false);
    expect(isDirectDocumentUrl("https://www.sec.gov/edgar/searchedgar/companysearch")).toBe(false);
  });

  it("accepts direct SEC accession, GAO report, and DOI URLs", () => {
    expect(isDirectDocumentUrl("https://www.sec.gov/Archives/edgar/data/320193/000032019323000106/aapl-20230930.htm")).toBe(true);
    expect(isDirectDocumentUrl("https://www.gao.gov/products/gao-23-106132")).toBe(true);
    expect(isDirectDocumentUrl("https://doi.org/10.1016/j.omega.2025.1045")).toBe(true);
  });

  it("fails closed when exact supporting passage is absent from raw document", () => {
    const rawText = "Apple Inc. reported quarterly financial results with strong iPhone revenue growth.";
    const candidate = {
      record_id: "rec_001",
      direct_document_url: "https://www.sec.gov/Archives/edgar/data/320193/000032019323000106/aapl-20230930.htm",
      actual_document_title: "Apple Form 10-K",
      organization: "Apple Inc.",
      workflow: "supply_chain",
      intervention: "Automated inventory tracking",
      outcome: "Reduced processing cycle time by 41%",
      exact_supporting_passage: "Reduced processing cycle time by 41% across factories", // absent in rawText
      raw_document_text: rawText,
    };

    const result = verifyStrictCandidate(candidate);
    expect(result.is_verified).toBe(false);
    expect(result.failures).toContain("Exact supporting passage is missing or not found verbatim in the raw fetched document.");
  });

  it("passes successfully when all 8 provenance checks are met", () => {
    const rawText = "Apple Inc. announced that it deployed automated inventory tracking which reduced processing cycle time by 41% during fiscal year 2025.";
    const candidate = {
      record_id: "rec_002",
      direct_document_url: "https://www.sec.gov/Archives/edgar/data/320193/000032019323000106/aapl-20230930.htm",
      actual_document_title: "Apple Form 10-K",
      organization: "Apple Inc.",
      workflow: "supply_chain",
      intervention: "automated inventory tracking",
      outcome: "reduced processing cycle time by 41%",
      metric_value: "41%",
      exact_supporting_passage: "deployed automated inventory tracking which reduced processing cycle time by 41%",
      raw_document_text: rawText,
    };

    const result = verifyStrictCandidate(candidate);
    expect(result.is_verified).toBe(true);
    expect(result.failures).toHaveLength(0);
    expect(result.raw_document_hash).toBeDefined();
  });
});
