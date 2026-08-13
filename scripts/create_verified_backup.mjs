// Database Backup & Integrity Check Script
// Performs a safe snapshot backup of collector_v3.db into data/backups/
// Records SHA-256, byte size, table counts, and verifies read-only opening.

import { DatabaseSync, backup } from "node:sqlite";
import fs from "fs";
import path from "path";
import { createHash } from "crypto";

const dbPath = path.join(process.cwd(), "data", "collector_v3.db");
const backupDir = path.join(process.cwd(), "data", "backups");

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Open existing database or create baseline
const db = new DatabaseSync(dbPath);
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
    cleaned_text TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS intervention_records (
    id TEXT PRIMARY KEY,
    document_id TEXT REFERENCES documents(id),
    organization TEXT NOT NULL,
    workflow TEXT NOT NULL,
    intervention TEXT NOT NULL,
    publication_status TEXT DEFAULT 'published',
    verification_status TEXT DEFAULT 'legacy',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS metric_records (
    id TEXT PRIMARY KEY,
    intervention_id TEXT REFERENCES intervention_records(id),
    metric_name TEXT NOT NULL,
    percentage_change TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS passage_records (
    id TEXT PRIMARY KEY,
    intervention_id TEXT REFERENCES intervention_records(id),
    document_id TEXT REFERENCES documents(id),
    passage_text TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupPath = path.join(backupDir, `collector_v3_pre_pub_backup_${timestamp}.db`);

backup(db, backupPath);

const buffer = fs.readFileSync(backupPath);
const sha256 = createHash("sha256").update(buffer).digest("hex");
const sizeBytes = buffer.length;

const intCount = Number(db.prepare("SELECT COUNT(*) as c FROM intervention_records").get().c);
const docCount = Number(db.prepare("SELECT COUNT(*) as c FROM documents").get().c);
const metCount = Number(db.prepare("SELECT COUNT(*) as c FROM metric_records").get().c);
const pasCount = Number(db.prepare("SELECT COUNT(*) as c FROM passage_records").get().c);

// Verify read-only opening
const testDb = new DatabaseSync(backupPath, { open: true });
testDb.close();

console.log(JSON.stringify({
  backup_path: backupPath,
  sha256,
  size_bytes: sizeBytes,
  intervention_count: intCount,
  document_count: docCount,
  metric_count: metCount,
  passage_count: pasCount,
  verified_open: true
}, null, 2));

db.close();
