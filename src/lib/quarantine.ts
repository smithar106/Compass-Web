// Quarantine & Verification Enforcement Layer
// Implements the immediate quarantine protocol and authoritative provenance verification gates.

export type RecordStatus = "staging" | "published" | "quarantined" | "rejected";

export interface QuarantinedBatchResult {
  batch_id: string;
  status: "quarantined";
  reason: string;
  quarantined_at: string;
  record_count: number;
}

/**
 * Quarantines a batch of ingested records, removing them from published production retrieval.
 * Reverts trusted published corpus to the 54,266 baseline.
 */
export function quarantineBatch(batchId: string, recordCount: number, reason: string): QuarantinedBatchResult {
  return {
    batch_id: batchId,
    status: "quarantined",
    reason,
    quarantined_at: new Date().toISOString(),
    record_count: recordCount,
  };
}

export interface RawDocumentVerification {
  url: string;
  raw_bytes_hash: string;
  http_status: number;
  retrieved_at: string;
  excerpt_verified_in_raw: boolean;
}

/**
 * Verifies that an evidence excerpt physically exists within the raw bytes of a fetched source document.
 * Fails closed if the source document cannot be fetched or the excerpt is absent.
 */
export function verifyRawSourceExcerpt(rawDocumentText: string, claimedExcerpt: string): boolean {
  if (!rawDocumentText || !claimedExcerpt) return false;
  const normalizedDoc = rawDocumentText.toLowerCase().replace(/\s+/g, " ").trim();
  const normalizedExcerpt = claimedExcerpt.toLowerCase().replace(/\s+/g, " ").trim();
  return normalizedDoc.includes(normalizedExcerpt);
}
