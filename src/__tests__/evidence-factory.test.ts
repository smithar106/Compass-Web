import { describe, it, expect } from "vitest";
import { processEvidenceCandidate, runEvidenceBatch, runDeterministicProvenanceBackfill } from "@/lib/evidence-factory";

describe("Evidence Factory & Deterministic Pipeline", () => {
  const validCandidate = {
    record_id: "cand_001",
    organization: "Apple Inc.",
    workflow: "supply_chain",
    intervention: "automated inventory tracking",
    outcome: "reduced processing cycle time by 41%",
    metric_value: "41%",
    direct_document_url: "https://www.sec.gov/Archives/edgar/data/320193/000032019323000106/aapl-20230930.htm",
    actual_document_title: "Apple Form 10-K",
    raw_document_text: "Apple Inc. announced that it deployed automated inventory tracking which reduced processing cycle time by 41% across regional distribution centers.",
    source_family: "sec_filing",
  };

  it("processes a valid candidate successfully through the 11-step factory pipeline", () => {
    const result = processEvidenceCandidate(validCandidate);
    expect(result.stage).toBe("published");
    expect(result.source_verified).toBe(true);
    expect(result.claim_verified).toBe(true);
    expect(result.raw_document_hash).toBeDefined();
    expect(result.exact_supporting_passage).toBeDefined();
  });

  it("quarantines a candidate with missing source text or invalid URL", () => {
    const invalid = { ...validCandidate, raw_document_text: "" };
    const result = processEvidenceCandidate(invalid);
    expect(result.stage).toBe("rejected");
    expect(result.source_verified).toBe(false);
  });

  it("triggers hard kill condition when batch error rate exceeds threshold", () => {
    const badCandidates = Array.from({ length: 10 }, (_, i) => ({
      ...validCandidate,
      record_id: `bad_${i}`,
      raw_document_text: "", // all fail
    }));

    const { ledger } = runEvidenceBatch("batch_test_kill", "sec_filing", badCandidates);
    expect(ledger.is_killed).toBe(true);
    expect(ledger.interventions_published).toBe(0);
    expect(ledger.kill_reason).toContain("Batch terminated: error rate");
  });

  it("performs deterministic provenance backfill against cleaned document text", () => {
    const interventions = [
      { intervention_id: "int_1", organization: "Apple Inc.", intervention: "automated inventory tracking" },
    ];
    const documents = [
      { document_id: "doc_1", cleaned_text: "Apple Inc. deployed automated inventory tracking which successfully optimized supply chains." },
    ];

    const result = runDeterministicProvenanceBackfill(interventions, documents);
    expect(result.backfilled_count).toBe(1);
    expect(result.passages).toHaveLength(1);
    expect(result.passages[0].intervention_id).toBe("int_1");
  });
});
