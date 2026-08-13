import { describe, it, expect } from "vitest";
import {
  validateEvidenceProvenance,
  filterPublishedRecords,
  generateBatchLedger,
  CURRENT_VALIDATION_VERSION,
} from "@/lib/governance";

describe("Evidence Governance & Provenance Enforcement", () => {
  const validRecord = {
    organization: "Acme Corp",
    workflow: "invoice_processing",
    intervention: "Automated invoice matching with OCR",
    source_type: "sec_filing",
    source_url: "https://sec.gov/Archives/edgar/data/1234/0001234.txt",
    source_document_title: "Form 10-K Annual Report 2025",
    source_date: "2025-03-15",
    source_excerpt: "We deployed automated invoice matching which reduced processing cycle time by 45% and cut costs.",
    outcome_classification: "cost_reduction",
    ingestion_batch_id: "batch_sec_2026_001",
    status: "staging" as const,
    audit_metadata: {
      batch_id: "batch_sec_2026_001",
      source_url: "https://sec.gov/Archives/edgar/data/1234/0001234.txt",
      source_document_id: "sec_10k_2025_acme",
      source_excerpt: "We deployed automated invoice matching which reduced processing cycle time by 45%.",
      extraction_timestamp: "2026-08-13T00:00:00Z",
      extractor_version: "extractor_v3.2",
      validation_version: CURRENT_VALIDATION_VERSION,
      source_hash: "sha256_abcdef123456",
    },
  };

  it("validates a fully-compliant provenance record successfully", () => {
    const res = validateEvidenceProvenance(validRecord);
    expect(res.isValid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it("fails closed when mandatory provenance fields are missing", () => {
    const invalid = { ...validRecord, source_url: "", source_excerpt: "short" };
    const res = validateEvidenceProvenance(invalid);
    expect(res.isValid).toBe(false);
    expect(res.errors.some((e) => e.includes("source URL"))).toBe(true);
    expect(res.errors.some((e) => e.includes("source evidence excerpt"))).toBe(true);
  });

  it("fails closed when audit metadata is missing", () => {
    const invalid = { ...validRecord, audit_metadata: undefined };
    const res = validateEvidenceProvenance(invalid as any);
    expect(res.isValid).toBe(false);
    expect(res.errors.some((e) => e.includes("audit_metadata"))).toBe(true);
  });

  it("rejects records containing synthetic or mock markers", () => {
    const synthetic = {
      ...validRecord,
      intervention: "Synthetic mock data test",
      source_excerpt: "This is a synthetic placeholder record generated for testing.",
    };
    const res = validateEvidenceProvenance(synthetic);
    expect(res.isValid).toBe(false);
    expect(res.errors.some((e) => e.includes("synthetic"))).toBe(true);
  });

  it("filters records to ensure only status === 'published' enters production retrieval", () => {
    const records = [
      { id: 1, status: "published" },
      { id: 2, status: "staging" },
      { id: 3, status: "rejected" },
      { id: 4, status: "published" },
    ];
    const pub = filterPublishedRecords(records);
    expect(pub).toHaveLength(2);
    expect(pub.map((r) => r.id)).toEqual([1, 4]);
  });

  it("generates a trustworthy batch ingestion ledger and verified delta", () => {
    const candidates = [
      validRecord,
      { ...validRecord, organization: "" }, // invalid
    ];
    const { ledger, publishedRecords } = generateBatchLedger("batch_sec_2026_001", candidates, 54266);

    expect(ledger.candidate_records).toBe(2);
    expect(ledger.published_records).toBe(1);
    expect(ledger.production_before).toBe(54266);
    expect(ledger.production_after).toBe(54267);
    expect(ledger.verified_delta).toBe(1);
    expect(publishedRecords).toHaveLength(1);
    expect(publishedRecords[0].status).toBe("published");
  });
});
