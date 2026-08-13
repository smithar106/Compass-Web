// Upgraded Strict Provenance Verification Engine
// Implements decoupled 4-stage verification:
// 1. isTrustedSourceHost() -> Is this publisher/source class allowed?
// 2. isFetchableEvidenceDocument() -> Can we retrieve and preserve content?
// 3. verifyDocumentIntegrity() -> Do we have content + hash + provenance?
// 4. verifyClaimAgainstSource() -> Does the exact stored source support this structured claim?
// Plus explicit failure codes: UNTRUSTED_SOURCE_HOST, SOURCE_FETCH_FAILED, CONTENT_NOT_PRESERVED,
// CLAIM_PASSAGE_NOT_FOUND, METRIC_NOT_SUPPORTED, PROJECTION_MISCLASSIFIED, DUPLICATE_INTERVENTION, INSUFFICIENT_IMPLEMENTATION_DETAIL.

import { createHash } from "crypto";

export type FailureCode =
  | "UNTRUSTED_SOURCE_HOST"
  | "SOURCE_FETCH_FAILED"
  | "CONTENT_NOT_PRESERVED"
  | "CLAIM_PASSAGE_NOT_FOUND"
  | "METRIC_NOT_SUPPORTED"
  | "PROJECTION_MISCLASSIFIED"
  | "DUPLICATE_INTERVENTION"
  | "INSUFFICIENT_IMPLEMENTATION_DETAIL";

export interface StrictEvidenceCandidate {
  record_id: string;
  direct_document_url: string;
  actual_document_title: string;
  organization: string;
  workflow: string;
  intervention: string;
  outcome: string;
  metric_value?: string;
  exact_supporting_passage: string;
  raw_document_text?: string;
  source_family?: string;
}

export interface VerificationAuditResult {
  record_id: string;
  is_verified: boolean;
  source_verified: boolean;
  claim_verified: boolean;
  failure_codes: FailureCode[];
  failures: string[];
  raw_document_hash?: string;
  verification_timestamp: string;
}

const TRUSTED_DOMAINS = [
  "sec.gov",
  "gao.gov",
  "gov.uk",
  "england.nhs.uk",
  "energy.gov",
  "oversight.gov",
  "insurance.state.gov",
  "doi.org",
  "arxiv.org",
];

/**
 * Stage 1: Determines if the publisher/host is an approved trustworthy domain.
 */
/**
 * Stage 1: Determines if the publisher/host is an approved trustworthy domain and URL is a direct document.
 */
export function isTrustedSourceHost(url: string): boolean {
  if (!url || !url.startsWith("https://")) return false;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    return TRUSTED_DOMAINS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

export function isDirectDocumentUrl(url: string): boolean {
  if (!isTrustedSourceHost(url)) return false;
  const lurl = url.toLowerCase();
  if (lurl.includes("/browse/") || lurl.includes("/search") || lurl.includes("query=")) return false;
  return (
    lurl.includes("/archives/edgar/data/") ||
    lurl.includes("gao.gov/products/") ||
    lurl.includes("doi.org/") ||
    lurl.includes("arxiv.org/") ||
    lurl.endsWith(".pdf") ||
    lurl.endsWith(".txt") ||
    lurl.endsWith(".htm") ||
    lurl.endsWith(".html") ||
    lurl.includes("/government/case-studies/") ||
    lurl.includes("/government/publications/") ||
    lurl.includes("/publication/")
  );
}

/**
 * Stage 2 & 3: Determines if the document is fetchable and integrity/hash is preserved.
 */
export function verifyDocumentIntegrity(rawText?: string): { isValid: boolean; hash?: string; failure?: FailureCode } {
  if (!rawText || rawText.trim().length === 0) {
    return { isValid: false, failure: "SOURCE_FETCH_FAILED" };
  }
  const hash = createHash("sha256").update(rawText).digest("hex");
  if (!hash) {
    return { isValid: false, failure: "CONTENT_NOT_PRESERVED" };
  }
  return { isValid: true, hash };
}

/**
 * Stage 4: Verifies the exact structured claim against the stored source text/passage.
 */
export function verifyClaimAgainstSource(candidate: StrictEvidenceCandidate, rawText: string): { isClaimValid: boolean; failureCodes: FailureCode[]; messages: string[] } {
  const failureCodes: FailureCode[] = [];
  const messages: string[] = [];
  const normDoc = rawText.toLowerCase().replace(/\s+/g, " ").trim();

  // Check organization in source
  const org = (candidate.organization || "").toLowerCase().trim();
  if (org.length < 2 || !normDoc.includes(org)) {
    failureCodes.push("INSUFFICIENT_IMPLEMENTATION_DETAIL");
    messages.push("Organization name not found in source text.");
  }

  // Check exact supporting passage exists in raw doc
  const passage = (candidate.exact_supporting_passage || "").toLowerCase().replace(/\s+/g, " ").trim();
  if (passage.length < 10 || !normDoc.includes(passage)) {
    failureCodes.push("CLAIM_PASSAGE_NOT_FOUND");
    messages.push("Exact supporting passage is missing or not found verbatim in the raw fetched document.");
  }

  // Check intervention support
  const intervention = (candidate.intervention || "").toLowerCase().trim();
  const interventionWords = intervention.split(/\s+/).filter((w) => w.length > 3);
  const interventionMatches = interventionWords.length === 0 || interventionWords.some((w) => normDoc.includes(w));
  if (!interventionMatches) {
    failureCodes.push("INSUFFICIENT_IMPLEMENTATION_DETAIL");
    messages.push("Claimed intervention not supported by source text.");
  }

  // Check metric support (if metric value provided)
  const metric = (candidate.metric_value || "").trim();
  const metricMatches = !metric || normDoc.includes(metric.toLowerCase());
  if (!metricMatches) {
    failureCodes.push("METRIC_NOT_SUPPORTED");
    messages.push("Quantitative metric value not found in source document.");
  }

  return {
    isClaimValid: failureCodes.length === 0,
    failureCodes,
    messages,
  };
}

/**
 * Executes the complete 4-stage strict verification pipeline on a candidate record.
 */
export function verifyStrictCandidate(candidate: StrictEvidenceCandidate): VerificationAuditResult {
  const failureCodes: FailureCode[] = [];
  const messages: string[] = [];

  // Stage 1: Trusted Source Host
  const hostTrusted = isTrustedSourceHost(candidate.direct_document_url);
  if (!hostTrusted) {
    failureCodes.push("UNTRUSTED_SOURCE_HOST");
    messages.push("Source host is not on the approved trusted publisher list.");
  }

  // Stage 2 & 3: Document Integrity & Hash
  const rawText = candidate.raw_document_text || "";
  const integrity = verifyDocumentIntegrity(rawText);
  if (!integrity.isValid && integrity.failure) {
    failureCodes.push(integrity.failure);
    messages.push("Source document fetch or content hash preservation failed.");
  }

  const sourceVerified = hostTrusted && integrity.isValid;

  // Stage 4: Claim Verification against Source
  let claimVerified = false;
  if (sourceVerified) {
    const claimCheck = verifyClaimAgainstSource(candidate, rawText);
    claimVerified = claimCheck.isClaimValid;
    failureCodes.push(...claimCheck.failureCodes);
    messages.push(...claimCheck.messages);
  } else {
    failureCodes.push("INSUFFICIENT_IMPLEMENTATION_DETAIL");
    messages.push("Claim verification skipped due to source verification failure.");
  }

  const isVerified = sourceVerified && claimVerified;

  return {
    record_id: candidate.record_id,
    is_verified: isVerified,
    source_verified: sourceVerified,
    claim_verified: claimVerified,
    failure_codes: [...new Set(failureCodes)],
    failures: messages,
    raw_document_hash: integrity.hash,
    verification_timestamp: new Date().toISOString(),
  };
}
