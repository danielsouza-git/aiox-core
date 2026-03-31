# Story BSS-1.3: Asset Organization & Naming Convention

**Status:** Done
**Epic:** EPIC-BSS-1 — Foundation & Simplified Infrastructure
**Priority:** P0
**Complexity:** Low (S)
**Story Points:** 2 SP
**Created:** 2026-03-16
**Dependencies:** BSS-1.1 (Project Scaffold — Done), BSS-1.2 (R2 Storage — In Progress, path-validator and types available)
**Blocks:** BSS-1.4 (Security Hardening uses folder structure), BSS-1.5 (GDPR pipeline uses folder structure)

---

## Executor Assignment

```yaml
executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["code-review", "naming-convention-audit"]
```

---

## Story

**As a** Brand System Service developer,
**I want** a standardized folder structure and naming conventions for R2 client assets,
**so that** assets are consistently organized, discoverable, and the folder structure is automatically created when a new client is set up.

---

## Acceptance Criteria

- [x] 1. **Folder Structure Constants**: `ASSET_FOLDERS` constant defined with the 10 required subdirectories per FR-8.8:
  - `01-brand-identity/` — logos, brand guidelines, identity assets
  - `02-design-system/` — design system exports, token files
  - `03-social-media/` — social media creatives
  - `04-marketing/` — marketing materials
  - `05-documents/` — PDFs, presentations, proposals
  - `06-video/` — video assets and thumbnails
  - `07-audio/` — audio files
  - `08-fonts/` — font files (woff, woff2, ttf)
  - `09-templates/` — reusable templates
  - `10-misc/` — miscellaneous assets

- [x] 2. **Path Validation**: `validatePath(clientId, r2Key)` enforces that all asset keys start with `{clientId}/` prefix and reside in one of the 10 ASSET_FOLDERS. `buildR2Key(clientId, folder, filename)` builds safe keys automatically

- [x] 3. **File Type Allowlist**: `DEFAULT_FILE_VALIDATION` defines allowed extensions and MIME types. `validateFile(filename, sizeBytes, mimeType)` validates before upload. Max file size: 50MB

- [x] 4. **Automated Folder Creation**: `createClientFolderStructure(clientId)` function that creates placeholder objects in R2 for all 10 ASSET_FOLDERS, establishing the client's directory structure on first setup. Function called during client onboarding (BSS-7.9)

- [x] 5. **Naming Convention Enforcement**: File naming function `normalizeAssetFilename(filename, options)` that: lowercases, replaces spaces with hyphens, removes special characters (except `.`, `-`, `_`), appends timestamp suffix to prevent collisions (e.g., `logo-primary-20260316.svg`)

- [x] 6. **Asset Metadata Schema**: `AssetMetadata` interface with required fields: `clientId`, `folder`, `originalFilename`, `uploadedAt`, `uploadedBy`, `assetType` (brand-identity|design-system|social|etc). Stored as R2 object metadata

- [x] 7. **Folder Listing Utility**: `listClientAssets(clientId, folder?)` function that lists objects under a client prefix (optionally scoped to a folder), returning `ObjectInfo[]` with pagination support via `ListOptions`

- [x] 8. **Unit Tests**: Test suite for `createClientFolderStructure()`, `normalizeAssetFilename()`, `validatePath()` edge cases, and `listClientAssets()` with mocked S3Client

---

## 🤖 CodeRabbit Integration

> **CodeRabbit Integration**: Enabled

### Story Type Analysis

**Primary Type**: Infrastructure / Storage
**Secondary Type(s)**: Architecture (naming conventions establish system-wide contracts)
**Complexity**: Low — bounded scope, builds on BSS-1.2 foundation

### Specialized Agent Assignment

**Primary Agents**:
- @dev (folder creation, naming enforcement, listing utilities)
- @architect (validate naming conventions are extensible for future asset types)

**Supporting Agents**:
- @qa (unit tests for naming edge cases)

### Quality Gate Tasks

- [ ] Pre-Commit (@dev): Run before marking story complete
- [ ] Architecture Review (@architect): Confirm folder structure covers all planned asset types across all epics

### Self-Healing Configuration

**Expected Self-Healing**:
- Primary Agent: @dev (light mode)
- Max Iterations: 2
- Timeout: 15 minutes
- Severity Filter: CRITICAL

**Predicted Behavior**:
- CRITICAL issues: auto_fix (path traversal bypass in naming function, missing validation)
- HIGH issues: document_only (naming edge cases, character encoding)

### CodeRabbit Focus Areas

**Primary Focus**:
- `normalizeAssetFilename()` must not produce paths with `../` or leading `/`
- `createClientFolderStructure()` must be idempotent (safe to call multiple times)

**Secondary Focus**:
- Timestamp collision prevention: ensure suffix is unique enough
- Character encoding: handle Unicode filenames safely

---

## Tasks / Subtasks

- [x] Task 1: Define `ASSET_FOLDERS` constant (10 folders) and `AssetFolder` type in `types.ts` (AC: 1)
- [x] Task 2: Verify `validatePath()` enforces ASSET_FOLDERS membership (AC: 2)
  - Note: current `validatePath()` enforces client prefix but does NOT validate folder membership — AC-2 requires this check
- [x] Task 3: Define `DEFAULT_FILE_VALIDATION` with extension/MIME allowlist; implement `validateFile()` (AC: 3)
- [x] Task 4: Implement `createClientFolderStructure(clientId, r2Client, bucket)` (AC: 4)
  - [x] Upload a `.keep` placeholder object to each of the 10 ASSET_FOLDERS
  - [x] Make function idempotent (use PutObject, not conditional create)
  - [x] Log each folder creation
  - [x] Export from `packages/core/src/r2/index.ts`
- [x] Task 5: Implement `normalizeAssetFilename(filename, options?)` (AC: 5)
  - [x] Lowercase transformation
  - [x] Replace spaces with hyphens
  - [x] Remove special characters (keep `.`, `-`, `_`)
  - [x] Append date-based suffix (`-YYYYMMDD`) to prevent collisions
  - [x] Preserve file extension
- [x] Task 6: Define `AssetMetadata` interface and `buildAssetMetadata()` helper (AC: 6)
  - [x] Fields: `clientId`, `folder`, `originalFilename`, `normalizedFilename`, `uploadedAt` (ISO 8601), `uploadedBy`, `assetType`, `fileSize`, `contentType`
  - [x] Metadata stored as R2 object user-metadata (string values only)
- [x] Task 7: Implement `listClientAssets(clientId, options?)` using `ListObjectsV2Command` (AC: 7)
  - [x] Support optional `folder` filter via prefix
  - [x] Return paginated `ListResult` using `ListOptions.continuationToken`
- [x] Task 8: Write unit tests for all new functions (AC: 8)
  - [x] `normalizeAssetFilename()` — spaces, special chars, Unicode, collision suffix
  - [x] `createClientFolderStructure()` — idempotency, all 10 folders created
  - [x] `listClientAssets()` — with and without folder filter, pagination
  - [x] `validatePath()` — folder membership enforcement (extend existing tests)

---

## Dev Notes

### Implementation State (~50% Complete)

**IMPLEMENTED** (ACs 1-3 partially):
- `ASSET_FOLDERS` constant and `AssetFolder` type in `packages/core/src/r2/types.ts`
- `validatePath()`, `buildR2Key()`, `validateFile()` in `packages/core/src/r2/path-validator.ts`
- `DEFAULT_FILE_VALIDATION` with 50MB limit, extension allowlist, MIME allowlist

**GAP IDENTIFIED** — AC-2 requires `validatePath()` to check folder membership against `ASSET_FOLDERS`. Current implementation only checks client prefix. Needs extension.

**REMAINING** (ACs 4-8):
- `createClientFolderStructure()` — not implemented
- `normalizeAssetFilename()` — not implemented
- `AssetMetadata` interface — not defined
- `listClientAssets()` — not implemented (only `listObjects()` exists in operations.ts)
- Unit tests — none exist yet

### Key Technical Notes

**Folder membership validation** (extend `validatePath()`):
```typescript
import { ASSET_FOLDERS } from './types';

// After existing checks, add:
const parts = r2Key.split('/');
// parts[0] = clientId, parts[1] = folder
if (parts.length >= 2) {
  const folder = parts[1] as string;
  if (!ASSET_FOLDERS.includes(folder as any)) {
    return { valid: false, error: `Invalid folder "${folder}". Must be one of: ${ASSET_FOLDERS.join(', ')}` };
  }
}
```

**Placeholder object for folder creation**:
R2 does not have real folders — create a `.keep` object at `{clientId}/{folder}/.keep` with empty content to establish the prefix.

**R2 metadata constraints**:
R2 inherits S3 metadata constraints: keys must be ASCII, values are URL-encoded strings. Store timestamps as ISO 8601 strings.

### PRD/NFR References

- **FR-8.8**: Folder structure specification (10 folders: 01-brand-identity through 10-misc)
- **NFR-5.3**: Path validation security
- **BSS-1.2**: `ASSET_FOLDERS` already defined there; this story formalizes the rest of the naming layer

### File Locations

```
brand-system-service/packages/core/src/r2/
  types.ts            # ASSET_FOLDERS, AssetFolder, AssetMetadata (add here)
  path-validator.ts   # validatePath(), buildR2Key(), validateFile() — extend
  operations.ts       # createClientFolderStructure(), listClientAssets() (add here)
  index.ts            # Re-export new functions
  __tests__/          # Unit tests (create directory)
    path-validator.test.ts
    operations.test.ts
```

### Testing

**Test location**: `packages/core/src/r2/__tests__/`

**Approach**: Unit tests with mocked `S3Client` (use `@aws-sdk/client-s3` mock or `jest.mock()`). No real R2 credentials needed for unit tests.

```typescript
// Example mock pattern
import { mockClient } from 'aws-sdk-client-mock';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Mock = mockClient(S3Client);
s3Mock.on(PutObjectCommand).resolves({});
```

---

## File List

| File | Action | Description |
|------|--------|-------------|
| `brand-system-service/packages/core/src/r2/path-validator.ts` | Modified | Added ASSET_FOLDERS membership check to `validatePath()` |
| `brand-system-service/packages/core/src/r2/asset-naming.ts` | Created | `normalizeAssetFilename()`, `AssetMetadata` interface, `buildAssetMetadata()`, `assetMetadataToRecord()`, `folderToAssetType()` |
| `brand-system-service/packages/core/src/r2/operations.ts` | Modified | Added `createClientFolderStructure()`, `listClientAssets()`, fixed `listAssets()` validation for folder membership |
| `brand-system-service/packages/core/src/r2/index.ts` | Modified | Re-exports for all new functions, types, and interfaces |
| `brand-system-service/packages/core/src/r2/__tests__/path-validator.test.ts` | Modified | Added folder membership enforcement tests, fixed existing tests for new validation |
| `brand-system-service/packages/core/src/r2/__tests__/asset-naming.test.ts` | Created | Tests for `normalizeAssetFilename()`, `buildAssetMetadata()`, `assetMetadataToRecord()`, `folderToAssetType()` |
| `brand-system-service/packages/core/src/r2/__tests__/operations.test.ts` | Created | Tests for `createClientFolderStructure()` and `listClientAssets()` with mocked S3Client |
| `brand-system-service/jest.config.js` | Created | JS version of Jest config (ts-node not installed for .ts config) |
| `brand-system-service/package.json` | Modified | Updated test scripts to use jest.config.js |

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-16 | 1.0 | Formal story creation reflecting ~50% implementation state | River (SM) |
| 2026-03-16 | 2.0 | Completed ACs 4-8: folder creation, naming conventions, metadata, listing, tests (116 tests passing) | Dex (Dev) |

---

## QA Results

### Review Date: 2026-03-30

### Reviewed By: Quinn (Test Architect)

**Verdict: PASS**

**Test Execution:**

Tests for BSS-1.3 are part of the R2 module test suite (shared with BSS-1.2): 175 tests, 7 suites, ALL PASS.

Key suites covering BSS-1.3 ACs:
- `path-validator.test.ts` (50 tests): ASSET_FOLDERS membership enforcement
- `asset-naming.test.ts` (52 tests): normalizeAssetFilename(), buildAssetMetadata(), folderToAssetType()
- `operations.test.ts` (15 tests): createClientFolderStructure(), listClientAssets()

**AC Traceability:**

| AC | Status | Evidence |
|----|--------|----------|
| AC-1 Folder Structure Constants | MET | `types.ts`: ASSET_FOLDERS with 10 folders (01-brand-identity through 10-misc) |
| AC-2 Path Validation | MET | `path-validator.ts`: validatePath() enforces clientId prefix AND ASSET_FOLDERS membership; buildR2Key() builds safe keys |
| AC-3 File Type Allowlist | MET | `path-validator.ts`: DEFAULT_FILE_VALIDATION with extension/MIME allowlist, 50MB max |
| AC-4 Automated Folder Creation | MET | `operations.ts`: createClientFolderStructure() creates .keep placeholders in all 10 folders |
| AC-5 Naming Convention | MET | `asset-naming.ts`: normalizeAssetFilename() with lowercase, hyphens, special char removal, date suffix |
| AC-6 Asset Metadata Schema | MET | `asset-naming.ts`: AssetMetadata interface with all required fields; buildAssetMetadata(), assetMetadataToRecord() |
| AC-7 Folder Listing Utility | MET | `operations.ts`: listClientAssets() with optional folder filter and pagination via ListOptions |
| AC-8 Unit Tests | MET | 117+ tests covering all new functions with mocked S3Client |

### Gate Status

Gate: PASS -> docs/qa/gates/bss-1.3-asset-organization-naming.yml
