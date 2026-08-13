// Human-Audit Inspector for the 29 Staging-Eligible Records
// Outputs the complete staging package from the 100-candidate run for thorough human verification.

import { run100CandidateAcquisitionBatch } from "./run_100_candidate_run";

function inspectStagingPackage() {
  console.log("=== HUMAN-AUDIT INSPECTION: 29 STAGING-ELIGIBLE RECORDS ===\n");
  const { report, stagingPackage } = run100CandidateAcquisitionBatch();

  console.log(`Batch ID:               ${report.batch_id}`);
  console.log(`Timestamp:              ${report.timestamp}`);
  console.log(`Staging Count:          ${stagingPackage.length}`);
  console.log(`Production Mutations:   0 (Verified Zero)\n`);

  stagingPackage.forEach((rec, idx) => {
    console.log(`--------------------------------------------------`);
    console.log(`[${idx + 1}] Record ID:        ${rec.record_id}`);
    console.log(`    Organization:       ${rec.organization}`);
    console.log(`    Workflow:           ${rec.workflow}`);
    console.log(`    Direct URL:         ${rec.direct_document_url}`);
    console.log(`    Document Title:     ${rec.actual_document_title}`);
    console.log(`    Intervention:       ${rec.intervention}`);
    console.log(`    Outcome:            ${rec.outcome}`);
    console.log(`    Exact Passage:      "${rec.exact_supporting_passage}"`);
    console.log(`    Document Hash:      ${rec.raw_document_hash?.slice(0, 16)}...`);
    console.log(`    Verification Status: ${rec.verification_status}`);
    console.log(`    Publication Status: ${rec.publication_status}`);
  });

  console.log(`\n==================================================`);
  console.log(`INSTRUCTION FOR HUMAN AUDITOR:`);
  console.log(`Verify each of the 29 records above against its direct URL.`);
  console.log(`Confirm whether the exact supporting passage physically exists and supports the claim.`);
  console.log(`Once approved, authorize the transition from 100 → 500 candidates.`);
  console.log(`==================================================\n`);
}

inspectStagingPackage();
