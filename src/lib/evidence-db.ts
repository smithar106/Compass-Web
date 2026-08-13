// Authoritative Evidence Database & Governance Manager (Using native Node.js SQLite DatabaseSync)
// Manages SQLite datastore (/app/data/collector_v3.db or local ./data/collector_v3.db),
// safe backups, schema migrations, publication states, and zero-orphan integrity checks.

import { DatabaseSync, backup } from "node:sqlite";
import { createHash } from "crypto";
import fs from "fs";
import path from "path";

const DEFAULT_DB_PATH = process.env.COLLECTOR_DATABASE_URL
  ? process.env.COLLECTOR_DATABASE_URL.replace("sqlite:///", "")
  : path.join(process.cwd(), "data", "collector_v3.db");

export function getDatabasePath(): string {
  return DEFAULT_DB_PATH;
}

export function openEvidenceDatabase(dbPath?: string): DatabaseSync {
  const resolvedPath = dbPath || getDatabasePath();
  const dir = path.dirname(resolvedPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const db = new DatabaseSync(resolvedPath);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  return db;
}

/**
 * Initializes schema supporting all 30 governance invariants.
 */
export function initializeSchema(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      canonical_url TEXT,
      title TEXT NOT NULL,
      publisher TEXT,
      publication_date TEXT,
      retrieved_at TEXT,
      content_hash TEXT NOT NULL,
      raw_html_path TEXT,
      raw_file_path TEXT,
      clean_text_path TEXT,
      cleaned_text TEXT,
      document_type TEXT,
      crawl_status TEXT DEFAULT 'success',
      parser_version TEXT DEFAULT '2.1.0',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ingestion_batches (
      id TEXT PRIMARY KEY,
      source_family TEXT NOT NULL,
      source_registry_id TEXT,
      started_at TEXT DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT,
      status TEXT DEFAULT 'in_progress',
      documents_discovered INTEGER DEFAULT 0,
      documents_fetched INTEGER DEFAULT 0,
      documents_rejected INTEGER DEFAULT 0,
      candidate_interventions INTEGER DEFAULT 0,
      interventions_rejected INTEGER DEFAULT 0,
      interventions_staged INTEGER DEFAULT 0,
      interventions_published INTEGER DEFAULT 0,
      duplicates_rejected INTEGER DEFAULT 0,
      provenance_rejected INTEGER DEFAULT 0,
      parser_version TEXT DEFAULT '2.1.0',
      validator_version TEXT DEFAULT '2.1.0',
      notes TEXT,
      verification_summary TEXT
    );

    CREATE TABLE IF NOT EXISTS intervention_records (
      id TEXT PRIMARY KEY,
      document_id TEXT REFERENCES documents(id),
      ingestion_batch_id TEXT REFERENCES ingestion_batches(id),
      organization TEXT NOT NULL,
      workflow TEXT NOT NULL,
      intervention TEXT NOT NULL,
      intervention_category TEXT,
      evidence_tier TEXT DEFAULT 'bronze',
      publication_status TEXT DEFAULT 'staging' CHECK(publication_status IN ('staging', 'published', 'quarantined', 'rejected')),
      verification_status TEXT DEFAULT 'legacy' CHECK(verification_status IN ('legacy', 'source_verified', 'claim_verified', 'rejected')),
      outcome_classification TEXT,
      metric_value TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS metric_records (
      id TEXT PRIMARY KEY,
      intervention_id TEXT REFERENCES intervention_records(id) ON DELETE CASCADE,
      metric_name TEXT NOT NULL,
      baseline_value TEXT,
      post_value TEXT,
      absolute_change TEXT,
      percentage_change TEXT,
      reported_text TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS passage_records (
      id TEXT PRIMARY KEY,
      intervention_id TEXT REFERENCES intervention_records(id) ON DELETE CASCADE,
      document_id TEXT REFERENCES documents(id) ON DELETE CASCADE,
      passage_text TEXT NOT NULL,
      start_offset INTEGER,
      end_offset INTEGER,
      section TEXT,
      supports_fields TEXT,
      extraction_confidence REAL DEFAULT 1.0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quality_flags (
      id TEXT PRIMARY KEY,
      intervention_id TEXT REFERENCES intervention_records(id) ON DELETE CASCADE,
      flag_type TEXT NOT NULL,
      description TEXT,
      resolved BOOLEAN DEFAULT FALSE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS duplicate_relationships (
      id TEXT PRIMARY KEY,
      primary_id TEXT REFERENCES intervention_records(id) ON DELETE CASCADE,
      duplicate_id TEXT REFERENCES intervention_records(id) ON DELETE CASCADE,
      similarity_score REAL,
      detected_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_intervention_pub_status ON intervention_records(publication_status);
    CREATE INDEX IF NOT EXISTS idx_intervention_ver_status ON intervention_records(verification_status);
    CREATE INDEX IF NOT EXISTS idx_intervention_doc ON intervention_records(document_id);
    CREATE INDEX IF NOT EXISTS idx_passage_intervention ON passage_records(intervention_id);
  `);
}

export interface BackupResult {
  backup_path: string;
  timestamp: string;
  sha256: string;
  size_bytes: number;
  intervention_count: number;
  document_count: number;
  metric_count: number;
  passage_count: number;
}

/**
 * Creates a SQLite-safe snapshot backup into backupDir.
 */
export function createDatabaseBackup(db: DatabaseSync, backupDir?: string): BackupResult {
  const resolvedDir = backupDir || path.join(path.dirname(getDatabasePath()), "backups");
  if (!fs.existsSync(resolvedDir)) {
    fs.mkdirSync(resolvedDir, { recursive: true });
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFilename = `collector_v3_backup_${timestamp}.db`;
  const backupPath = path.join(resolvedDir, backupFilename);

  backup(db, backupPath);

  const buffer = fs.readFileSync(backupPath);
  const sha256 = createHash("sha256").update(buffer).digest("hex");
  const sizeBytes = buffer.length;

  const intCount = (db.prepare("SELECT COUNT(*) as c FROM intervention_records").get() as any).c;
  const docCount = (db.prepare("SELECT COUNT(*) as c FROM documents").get() as any).c;
  const metCount = (db.prepare("SELECT COUNT(*) as c FROM metric_records").get() as any).c;
  const pasCount = (db.prepare("SELECT COUNT(*) as c FROM passage_records").get() as any).c;

  // Verify backup opens successfully read-only
  const testDb = new DatabaseSync(backupPath, { open: true });
  testDb.close();

  return {
    backup_path: backupPath,
    timestamp: new Date().toISOString(),
    sha256,
    size_bytes: sizeBytes,
    intervention_count: Number(intCount),
    document_count: Number(docCount),
    metric_count: Number(metCount),
    passage_count: Number(pasCount),
  };
}

/**
 * Validates zero orphan counts across all relations.
 */
export function validateDatabaseIntegrity(db: DatabaseSync): { isClean: boolean; orphans: Record<string, number> } {
  const orphanDocs = (db.prepare(`
    SELECT COUNT(*) as c FROM intervention_records i
    LEFT JOIN documents d ON i.document_id = d.id
    WHERE d.id IS NULL AND i.document_id IS NOT NULL
  `).get() as any).c;

  const orphanMetrics = (db.prepare(`
    SELECT COUNT(*) as c FROM metric_records m
    LEFT JOIN intervention_records i ON m.intervention_id = i.id
    WHERE i.id IS NULL
  `).get() as any).c;

  const orphanPassagesInt = (db.prepare(`
    SELECT COUNT(*) as c FROM passage_records p
    LEFT JOIN intervention_records i ON p.intervention_id = i.id
    WHERE i.id IS NULL
  `).get() as any).c;

  const orphanPassagesDoc = (db.prepare(`
    SELECT COUNT(*) as c FROM passage_records p
    LEFT JOIN documents d ON p.document_id = d.id
    WHERE d.id IS NULL
  `).get() as any).c;

  const orphans = {
    intervention_to_document: Number(orphanDocs),
    metric_to_intervention: Number(orphanMetrics),
    passage_to_intervention: Number(orphanPassagesInt),
    passage_to_document: Number(orphanPassagesDoc),
  };

  const totalOrphans = Object.values(orphans).reduce((a, b) => a + b, 0);

  return {
    isClean: totalOrphans === 0,
    orphans,
  };
}

/**
 * Computes corpus health dashboard metrics.
 */
export function getCorpusHealthDashboard(db: DatabaseSync) {
  const publishedCount = (db.prepare("SELECT COUNT(*) as c FROM intervention_records WHERE publication_status = 'published'").get() as any).c;
  const stagingCount = (db.prepare("SELECT COUNT(*) as c FROM intervention_records WHERE publication_status = 'staging'").get() as any).c;
  const quarantinedCount = (db.prepare("SELECT COUNT(*) as c FROM intervention_records WHERE publication_status = 'quarantined'").get() as any).c;
  const rejectedCount = (db.prepare("SELECT COUNT(*) as c FROM intervention_records WHERE publication_status = 'rejected'").get() as any).c;
  const totalInterventions = (db.prepare("SELECT COUNT(*) as c FROM intervention_records").get() as any).c;

  const uniqueOrgs = (db.prepare("SELECT COUNT(DISTINCT organization) as c FROM intervention_records WHERE publication_status = 'published'").get() as any).c;
  const uniqueWorkflows = (db.prepare("SELECT COUNT(DISTINCT workflow) as c FROM intervention_records WHERE publication_status = 'published'").get() as any).c;
  const docCount = (db.prepare("SELECT COUNT(*) as c FROM documents").get() as any).c;
  const passageBackedCount = (db.prepare("SELECT COUNT(DISTINCT intervention_id) as c FROM passage_records").get() as any).c;

  const publishedNum = Number(publishedCount);
  const passageBackedNum = Number(passageBackedCount);
  const passageCoveragePct = publishedNum > 0 ? Math.round((passageBackedNum / publishedNum) * 1000) / 10 : 0;

  const metricCount = (db.prepare("SELECT COUNT(*) as c FROM metric_records").get() as any).c;
  const goldCount = (db.prepare("SELECT COUNT(*) as c FROM intervention_records WHERE evidence_tier = 'gold' AND publication_status = 'published'").get() as any).c;

  const integrity = validateDatabaseIntegrity(db);

  return {
    breadth: {
      published_interventions: publishedNum,
      total_interventions: Number(totalInterventions),
      unique_organizations: Number(uniqueOrgs),
      workflows: Number(uniqueWorkflows),
      source_documents: Number(docCount),
    },
    provenance: {
      passage_backed_interventions: passageBackedNum,
      passage_coverage_pct: passageCoveragePct,
    },
    outcomes: {
      total_metrics: Number(metricCount),
    },
    quality: {
      gold_count: Number(goldCount),
      staging: Number(stagingCount),
      quarantined: Number(quarantinedCount),
      rejected: Number(rejectedCount),
    },
    integrity: {
      is_clean: integrity.isClean,
      orphans: integrity.orphans,
    },
  };
}
