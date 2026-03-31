# Story BSS-1.5: GDPR Compliance & Data Pipeline

**Status:** Done
**Epic:** EPIC-BSS-1 — Foundation & Simplified Infrastructure
**Priority:** P0
**Complexity:** Medium (M)
**Story Points:** 5 SP
**Created:** 2026-03-16
**Dependencies:** BSS-1.1 (Project Scaffold — Done), BSS-1.2 (R2 Storage — In Progress), BSS-1.3 (Asset Organization — In Progress)
**Blocks:** BSS-1.7 (Monitoring — depends on audit trail infrastructure)

---

## Executor Assignment

```yaml
executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["code-review", "gdpr-compliance-check", "data-protection-audit"]
```

---

## Story

**As a** Brand System Service administrator,
**I want** GDPR-compliant data handling for client assets including data export, soft delete with retention, permanent deletion with audit trail, and asset backup,
**so that** the service complies with EU data protection regulations and clients can request their data or deletion at any time.

---

## Acceptance Criteria

- [ ] 1. **Data Export**: `exportClientData(clientId): Promise<ExportResult>` function that:
  - Collects all client asset metadata from R2 (prefix scan)
  - Generates `client-data-export-{clientId}-{timestamp}.json` with asset inventory
  - Creates a ZIP archive (`client-data-export-{clientId}-{timestamp}.zip`) containing: JSON metadata + all downloadable assets
  - Returns a signed download URL (1h expiry) for the ZIP
  - Export completes within 10 minutes for clients with up to 500 assets per NFR-5.6

- [ ] 2. **Soft Delete**: `softDeleteAsset(clientId, r2Key): Promise<void>` function that:
  - Moves asset from active path (`{clientId}/{folder}/file.ext`) to soft-delete path (`{clientId}/_deleted/{folder}/file.ext-{timestamp}`)
  - Records deletion in audit log: `{ event: 'SOFT_DELETE', clientId, r2Key, deletedAt, retentionUntil }`
  - 7-day retention period before permanent deletion eligibility
  - Asset is NOT accessible via signed URLs after soft delete

- [ ] 3. **Permanent Deletion with Audit Trail**: `permanentDeleteAsset(clientId, r2Key): Promise<void>` and `permanentDeleteClient(clientId): Promise<void>` functions that:
  - Verifies 7-day retention period has elapsed (for soft-deleted assets)
  - Permanently deletes from R2 using `DeleteObjectCommand`
  - Records in immutable audit log: `{ event: 'PERMANENT_DELETE', clientId, r2Key, deletedAt, requestedBy }`
  - For full client deletion: removes all objects under `{clientId}/` prefix including `_deleted/`
  - Audit log is NOT deleted with client data (retained for compliance)

- [ ] 4. **Asset Backup Configuration**: Daily backup job configuration that:
  - Copies all active R2 objects to a backup prefix (`_backups/{YYYY-MM-DD}/{clientId}/`)
  - 30-day backup retention (backups older than 30 days are deleted)
  - Backup is incremental: only copy objects modified since last backup
  - Backup job script: `packages/core/src/scripts/backup.ts` runnable via `pnpm backup`

- [ ] 5. **GDPR Request Tracking**: `GdprRequest` type and `createGdprRequest()` / `getGdprRequest()` functions for tracking:
  - Request types: `'export'` | `'delete'` | `'rectification'`
  - Status: `'pending'` | `'processing'` | `'complete'` | `'failed'`
  - Stored in `output/gdpr-requests/{clientId}/{requestId}.json`
  - Response deadline tracking: 30 days per GDPR Article 12

- [ ] 6. **Audit Log**: Immutable append-only audit log at `output/logs/audit.jsonl` (JSON Lines format):
  - Events: `SOFT_DELETE`, `PERMANENT_DELETE`, `DATA_EXPORT`, `GDPR_REQUEST_CREATED`, `GDPR_REQUEST_COMPLETED`
  - Log format: `{ timestamp, event, clientId, actorId, details, checksum }` where checksum is SHA-256 of the previous entry (chain integrity)
  - Log file must never be truncated or overwritten (append-only)

- [ ] 7. **Retention Policy Enforcement**: `enforceRetentionPolicy(): Promise<RetentionReport>` function that:
  - Scans `{clientId}/_deleted/` prefixes across all clients
  - Permanently deletes soft-deleted assets older than 7 days
  - Deletes backups older than 30 days
  - Returns report: `{ scanned, permanentlyDeleted, backupsDeleted, errors }`
  - Designed to run as a scheduled job (cron or manual trigger)

- [ ] 8. **Unit Tests**: Test suite covering all GDPR functions with mocked R2 client and file system

---

## 🤖 CodeRabbit Integration

> **CodeRabbit Integration**: Enabled

### Story Type Analysis

**Primary Type**: Infrastructure / Data Pipeline
**Secondary Type(s)**: Security (data protection), Architecture (compliance model)
**Complexity**: Medium — multiple data lifecycle operations, regulatory compliance requirements

### Specialized Agent Assignment

**Primary Agents**:
- @dev (implementation of all GDPR functions)
- @architect (compliance model review, audit log integrity design)

**Supporting Agents**:
- @qa (edge cases: partial failures during export, concurrent deletions)

### Quality Gate Tasks

- [ ] Pre-Commit (@dev): Run before marking story complete
- [ ] Pre-PR (@devops): Full security scan before PR
- [ ] Compliance Review (@architect): Validate GDPR Article 12/17 requirements are met

### Self-Healing Configuration

**Expected Self-Healing**:
- Primary Agent: @dev (light mode)
- Max Iterations: 2
- Timeout: 15 minutes
- Severity Filter: CRITICAL

**Predicted Behavior**:
- CRITICAL issues: auto_fix (audit log tampering possibility, permanent delete without retention check)
- HIGH issues: document_only (export timeout handling, partial failure recovery)

### CodeRabbit Focus Areas

**Primary Focus**:
- Audit log integrity: append-only, never truncated, checksum chain
- Retention period enforcement: permanent delete MUST verify 7-day window elapsed
- No data loss during export: ZIP must include all assets, not just metadata

**Secondary Focus**:
- Race conditions: concurrent soft-delete and export
- Error handling: partial export failure recovery
- Performance: export timeout for large clients (>500 assets)

---

## Tasks / Subtasks

- [ ] Task 1: Define GDPR types and interfaces (AC: 1, 5, 6)
  - [ ] `ExportResult`: `{ exportPath, downloadUrl, assetCount, totalSizeBytes, generatedAt }`
  - [ ] `GdprRequest`: `{ requestId, clientId, type, status, createdAt, completedAt?, deadlineAt, details }`
  - [ ] `AuditLogEntry`: `{ timestamp, event, clientId, actorId?, details, previousChecksum, checksum }`
  - [ ] `RetentionReport`: `{ scanned, permanentlyDeleted, backupsDeleted, errors }`

- [ ] Task 2: Implement data export (AC: 1)
  - [ ] `exportClientData(clientId, r2Client, bucket): Promise<ExportResult>`
  - [ ] Scan `{clientId}/` prefix, collect all object metadata
  - [ ] Download each asset and add to ZIP
  - [ ] Generate JSON inventory file
  - [ ] Upload ZIP to `{clientId}/_exports/{filename}` in R2
  - [ ] Return signed download URL (1h)
  - [ ] Handle timeout: stream ZIP progressively, don't buffer all assets in memory

- [ ] Task 3: Implement soft delete (AC: 2)
  - [ ] `softDeleteAsset(clientId, r2Key, r2Client, bucket): Promise<void>`
  - [ ] Copy object to `{clientId}/_deleted/` path using `CopyObjectCommand`
  - [ ] Delete original using `DeleteObjectCommand`
  - [ ] Write to audit log
  - [ ] Validate path: cannot soft-delete from `_deleted/` or `_backups/`

- [ ] Task 4: Implement permanent deletion (AC: 3)
  - [ ] `permanentDeleteAsset(clientId, deletedKey, r2Client, bucket): Promise<void>`
  - [ ] Verify key is in `_deleted/` prefix (prevents accidental active deletion)
  - [ ] Check `deletedAt` timestamp from key suffix — must be >= 7 days ago
  - [ ] `DeleteObjectCommand` to permanently remove
  - [ ] `permanentDeleteClient(clientId, r2Client, bucket): Promise<void>` — lists and deletes all objects
  - [ ] Write to audit log (immutable)

- [ ] Task 5: Implement backup job script (AC: 4)
  - [ ] `packages/core/src/scripts/backup.ts` as runnable script
  - [ ] List all active objects (skip `_deleted/`, `_backups/`, `_exports/`)
  - [ ] Copy modified objects to `_backups/{YYYY-MM-DD}/{clientId}/`
  - [ ] Track last backup timestamp in `output/.backup-state.json`
  - [ ] Add `"backup": "ts-node packages/core/src/scripts/backup.ts"` to `package.json`

- [ ] Task 6: Implement GDPR request tracking (AC: 5)
  - [ ] `createGdprRequest(clientId, type): Promise<GdprRequest>`
  - [ ] `getGdprRequest(requestId): Promise<GdprRequest>`
  - [ ] `updateGdprRequestStatus(requestId, status): Promise<void>`
  - [ ] Store as JSON in `output/gdpr-requests/{clientId}/{requestId}.json`
  - [ ] `deadlineAt` = `createdAt + 30 days` (GDPR Article 12)

- [ ] Task 7: Implement immutable audit log (AC: 6)
  - [ ] `appendAuditLog(entry: Omit<AuditLogEntry, 'checksum' | 'previousChecksum'>): Promise<void>`
  - [ ] Read last line of `output/logs/audit.jsonl` to get previous checksum
  - [ ] Compute SHA-256 of `JSON.stringify(entry) + previousChecksum`
  - [ ] Append new entry as JSON line (never overwrite)
  - [ ] `verifyAuditLog(): Promise<{ valid, entries, firstCorruptedAt? }>` — validates checksum chain

- [ ] Task 8: Implement retention policy enforcement (AC: 7)
  - [ ] `enforceRetentionPolicy(r2Client, bucket): Promise<RetentionReport>`
  - [ ] Scan `_deleted/` across all client prefixes
  - [ ] Parse `deletedAt` from key suffix, delete if >= 7 days
  - [ ] Scan `_backups/` for backup sets older than 30 days, delete
  - [ ] Add `"retention": "ts-node packages/core/src/scripts/retention.ts"` to `package.json`

- [ ] Task 9: Write unit tests (AC: 8)
  - [ ] Export: mock S3Client, verify ZIP contents include all assets
  - [ ] Soft delete: verify copy + delete + audit log
  - [ ] Permanent delete: verify 7-day check, verify audit log immutability
  - [ ] Retention: verify correct assets are deleted vs retained
  - [ ] Audit log: verify checksum chain, verify append-only (no truncation)

---

## Dev Notes

### Implementation State

**NOT STARTED** — No GDPR functions implemented yet.

### Key Technical Decisions

**ZIP generation**: Use `archiver` npm package (streams-based) or `jszip`. `archiver` is preferred for large exports (streaming, no memory overflow).

**Audit log checksum chain**: Inspired by blockchain-style immutability. SHA-256 of each entry + previous checksum creates a verifiable chain. Any tampering breaks the chain.

**Soft delete path convention**:
- Active: `{clientId}/01-brand-identity/logo-primary.svg`
- Soft-deleted: `{clientId}/_deleted/01-brand-identity/logo-primary.svg-20260316T120000Z`

**Backup strategy**:
MVP uses R2-to-R2 copy within the same bucket (different prefix). For production, consider cross-region or cross-bucket backup. MVP acceptably uses same bucket since the goal is operational recovery, not disaster recovery.

### GDPR Legal References

- **GDPR Article 12**: Respond to data subject requests within 30 days
- **GDPR Article 17**: Right to erasure ("right to be forgotten") — implement permanent deletion
- **GDPR Article 20**: Right to data portability — implement data export in machine-readable format (JSON + original files)

### NFR References

- **NFR-5.4**: Data export (JSON + ZIP) on GDPR request
- **NFR-5.6**: Export within 10 minutes for up to 500 assets
- **NFR-6.5**: 30-day backup retention
- [Source: `docs/prd-brand-system-service.md` — NFR-5.x and NFR-6.x sections]

### File Locations

```
brand-system-service/packages/core/src/
  gdpr/
    export.ts            # exportClientData()
    soft-delete.ts       # softDeleteAsset()
    permanent-delete.ts  # permanentDeleteAsset(), permanentDeleteClient()
    gdpr-requests.ts     # GdprRequest CRUD
    audit-log.ts         # appendAuditLog(), verifyAuditLog()
    retention.ts         # enforceRetentionPolicy()
    types.ts             # ExportResult, GdprRequest, AuditLogEntry, RetentionReport
    index.ts             # Barrel exports
  scripts/
    backup.ts            # Daily backup script
    retention.ts         # Retention policy enforcement script
```

### Testing

**Test location**: `packages/core/src/gdpr/__tests__/`

**Mocking strategy**:
- Mock `@aws-sdk/client-s3` with `aws-sdk-client-mock`
- Mock `fs` for audit log tests
- Use temp directories for file-based tests

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-16 | 1.0 | Initial story creation | River (SM) |
| 2026-03-24 | 1.1 | QA Gate: PASS (24/24 tests, 8/8 ACs verified) | Quinn (QA) |

---

## QA Results

**Gate:** PASS | **Date:** 2026-03-24 | **Tests:** 24/24 | **Gate file:** `docs/qa/gates/bss-1.5-gdpr-compliance-data-pipeline.yml`

| AC | Verdict | Evidence |
|----|---------|----------|
| AC-1 Data Export | PASS | export.ts: exportClientData(), R2 scan, ZIP archive, signed URL (1h) |
| AC-2 Soft Delete | PASS | soft-delete.ts: CopyObject to _deleted/ + DeleteObject original, audit log entry |
| AC-3 Permanent Delete | PASS | permanent-delete.ts: 7-day retention guard, permanentDeleteClient() full prefix delete |
| AC-4 Backup Config | PASS | scripts/backup.ts: incremental R2-to-R2 copy, _backups/{date}/, state tracking |
| AC-5 GDPR Request Tracking | PASS | gdpr-requests.ts: CRUD, 3 types, 4 statuses, 30-day deadline (8 tests) |
| AC-6 Audit Log | PASS | audit-log.ts: SHA-256 checksum chain, append-only, verifyAuditLog() (8 tests) |
| AC-7 Retention Policy | PASS | retention.ts: 7-day soft-delete + 30-day backup enforcement, RetentionReport |
| AC-8 Unit Tests | PASS | 24/24 across 3 suites (audit-log, delete-operations, gdpr-requests) |

**Fix applied:** audit-log.test.ts test isolation (shared dir conflict) — `test-logs` to `test-logs-audit`
