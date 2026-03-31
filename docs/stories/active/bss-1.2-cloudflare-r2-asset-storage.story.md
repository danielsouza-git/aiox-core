# Story BSS-1.2: Cloudflare R2 Asset Storage [CRITICAL PATH]

**Status:** Done
**Epic:** EPIC-BSS-1 — Foundation & Simplified Infrastructure
**Priority:** P0
**Complexity:** Medium (M)
**Story Points:** 5 SP
**Created:** 2026-03-16
**Dependencies:** BSS-1.1 (Project Scaffold — Done)
**Blocks:** BSS-1.3, BSS-1.4, BSS-1.5, BSS-1.7
**Critical Path:** YES — Wave 2 Gate

---

## Executor Assignment

```yaml
executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["code-review", "architecture-validation", "s3-compatibility-check", "security-audit"]
```

---

## Story

**As a** Brand System Service administrator,
**I want** a secure, cost-effective asset storage system using Cloudflare R2,
**so that** client brand assets can be stored with zero egress fees, served via signed URLs, and isolated per client path.

---

## Acceptance Criteria

- [x] 1. **R2 Bucket Setup**: Cloudflare R2 bucket `brand-assets` created with client-specific path structure `r2://brand-assets/{client-id}/` per FR-8.8. Bucket name configurable via `R2_BUCKET_NAME` env var
- [x] 2. **S3-Compatible Client**: `createR2Client(config: R2Config)` implemented using `@aws-sdk/client-s3` v3, configured for Cloudflare R2 endpoint (`https://{accountId}.r2.cloudflarestorage.com`), path-style addressing, 30s request timeout
- [x] 3. **Signed URL Generation**: `generateSignedDownloadUrl()` and `generateSignedUploadUrl()` with two-tier expiry: 15min (`api`) for API/preview, 1h (`download`) for client downloads per NFR-1.6 and NFR-5.3
- [x] 4. **Upload Utility**: `uploadObject()` and `uploadBuffer()` functions with path validation, content-type detection, metadata support, and `UploadResult` return type
- [x] 5. **Download Utility**: `downloadObject()` function returning `Buffer`, with path validation scoped to client prefix
- [x] 6. **Error Handling & Retry**: Exponential backoff retry logic (`withRetry()`): max 3 retries, 200ms base delay, 5s max delay. Proper error propagation via `StorageError`
- [x] 7. **Path Validation**: `validatePath(clientId, r2Key)` enforcing: no path traversal (`../`), no absolute paths, no double slashes, no null bytes, mandatory `{clientId}/` prefix. `buildR2Key()` for safe key construction. `validateFile()` for extension/size/MIME validation (max 50MB, allowlist of extensions)
- [x] 8. **Configuration**: R2 credentials (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`) in `.env`, never exposed client-side per NFR-5.2. `r2ConfigFromEnv()` helper
- [x] 9. **Integration Tests**: Test suite covering: upload/download round-trip, signed URL generation (both tiers), path validation (all attack vectors), error scenarios (invalid credentials, missing object), retry behavior
- [x] 10. **Documentation**: API documentation for all exported functions, including usage examples, error codes, and R2 bucket setup instructions in `packages/core/src/r2/README.md`

---

## 🤖 CodeRabbit Integration

> **CodeRabbit Integration**: Enabled

### Story Type Analysis

**Primary Type**: Infrastructure / Storage
**Secondary Type(s)**: Security, API Integration
**Complexity**: Medium — critical path, security-sensitive, but well-bounded scope

### Specialized Agent Assignment

**Primary Agents**:
- @dev (R2 client implementation and utilities)
- @architect (S3 compatibility review, security model validation)

**Supporting Agents**:
- @qa (integration test design and coverage validation)

### Quality Gate Tasks

- [ ] Pre-Commit (@dev): Run before marking story complete
- [ ] Pre-PR (@devops): Run before creating pull request
- [ ] Security Review (@architect): Validate path validation covers all attack vectors

### Self-Healing Configuration

**Expected Self-Healing**:
- Primary Agent: @dev (light mode)
- Max Iterations: 2
- Timeout: 15 minutes
- Severity Filter: CRITICAL

**Predicted Behavior**:
- CRITICAL issues: auto_fix (credential exposure, path traversal gaps, missing validation)
- HIGH issues: document_only (retry logic gaps, error handling gaps)

### CodeRabbit Focus Areas

**Primary Focus**:
- Path traversal prevention: all 5 attack vectors covered in `validatePath()`
- No credential exposure: `accessKeyId`/`secretAccessKey` never logged or exposed

**Secondary Focus**:
- Retry idempotency: only safe to retry read operations and pre-signed URL generation
- Error specificity: `StorageError` vs generic `Error` — use domain-specific errors

---

## Tasks / Subtasks

- [x] Task 1: Create `R2Config`, `UploadResult`, `UploadOptions`, `ListResult`, `ObjectInfo`, `RetryConfig`, `FileValidationConfig` types; `SIGNED_URL_EXPIRY` and `ASSET_FOLDERS` constants (AC: 1, 7, 8)
- [x] Task 2: Implement `createR2Client()` with validation and `r2ConfigFromEnv()` (AC: 2, 8)
- [x] Task 3: Implement `generateSignedDownloadUrl()` and `generateSignedUploadUrl()` with path validation (AC: 3)
- [x] Task 4: Implement `uploadObject()` and `uploadBuffer()` (AC: 4)
- [x] Task 5: Implement `downloadObject()` (AC: 5)
- [x] Task 6: Implement `withRetry()` with exponential backoff (AC: 6)
- [x] Task 7: Implement `validatePath()`, `buildR2Key()`, `validateFile()`, `sanitizeFilename()` (AC: 7)
- [x] Task 8: Export all functions via `packages/core/src/r2/index.ts` (AC: 2-7)
- [x] Task 9: Write integration tests in `packages/core/src/r2/__tests__/` (AC: 9)
  - [x] Upload + download round-trip test
  - [x] Signed URL generation (api tier: 15min, download tier: 1h)
  - [x] Path validation: 5 attack vectors (traversal, absolute, double-slash, null byte, wrong prefix)
  - [x] File validation: allowed/denied extensions, size limits, MIME types
  - [x] Retry behavior: mock transient failures, verify backoff
  - [x] Error scenario: invalid credentials, missing object
- [x] Task 10: Write `packages/core/src/r2/README.md` with API docs and R2 bucket setup instructions (AC: 10)

---

## Dev Notes

### Implementation State (100% Complete)

**IMPLEMENTED** (ACs 1-10):
- `packages/core/src/r2/types.ts` — all types, `SIGNED_URL_EXPIRY`, `ASSET_FOLDERS`, `DEFAULT_RETRY_CONFIG`, `DEFAULT_FILE_VALIDATION`
- `packages/core/src/r2/client.ts` — `createR2Client()`, `r2ConfigFromEnv()`, `validateR2Config()`
- `packages/core/src/r2/signed-urls.ts` — `generateSignedDownloadUrl()`, `generateSignedUploadUrl()`
- `packages/core/src/r2/upload.ts` — upload functions
- `packages/core/src/r2/download.ts` — download functions
- `packages/core/src/r2/retry.ts` — `withRetry()` exponential backoff
- `packages/core/src/r2/path-validator.ts` — `validatePath()`, `buildR2Key()`, `validateFile()`, `sanitizeFilename()` + ASSET_FOLDERS enforcement
- `packages/core/src/r2/operations.ts` — delete, list, `createClientFolderStructure()`, `listClientAssets()`
- `packages/core/src/r2/asset-naming.ts` — `normalizeAssetFilename()`, `buildAssetMetadata()`, `assetMetadataToRecord()`, `folderToAssetType()`
- `packages/core/src/r2/index.ts` — barrel exports
- `packages/core/src/r2/__tests__/` — 7 test suites, 175 tests
- `packages/core/src/r2/README.md` — API documentation with setup instructions
- `packages/core/src/index.ts` — re-exports `export * from './r2'`

### Key Technical Decisions

- **AWS SDK v3**: Used `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` (Cloudflare R2 is S3-compatible)
- **Path-style addressing**: `forcePathStyle: true` required for R2
- **Region**: `'auto'` (Cloudflare uses this as the R2 region value)
- **Endpoint format**: `https://{accountId}.r2.cloudflarestorage.com`
- **Client-id format**: alphanumeric + hyphens/underscores, 1-64 chars (`/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/`)

### PRD/NFR References

- **NFR-1.6**: Signed URL expiry — 15min API, 1h download (implemented as `SIGNED_URL_EXPIRY` constant)
- **NFR-5.2**: Credentials never client-side (enforced: env vars only, `r2ConfigFromEnv()`)
- **NFR-5.3**: Signed URL expiration enforcement (implemented: no override capability)
- **FR-8.8**: Folder structure with `ASSET_FOLDERS` constant (10 folders: 01-brand-identity through 10-misc)

### Environment Variables Required

```bash
R2_ACCOUNT_ID=           # Cloudflare account ID
R2_ACCESS_KEY_ID=        # R2 API token access key
R2_SECRET_ACCESS_KEY=    # R2 API token secret
R2_BUCKET_NAME=brand-assets  # Defaults to brand-assets
R2_REGION=auto           # Defaults to auto
R2_PUBLIC_URL=           # Optional: public URL for bucket
```

### Testing

**Test location**: `brand-system-service/packages/core/src/r2/__tests__/`

**Test framework**: Use the project's existing test framework (check `package.json` for Jest/Vitest config)

**Testing approach for integration tests**:
- Use `@aws-sdk/client-s3` mock or a local MinIO/R2-compatible endpoint for CI
- Alternatively, use environment-gated tests (`if (!process.env.R2_ACCOUNT_ID) skip()`)
- Unit tests for `validatePath()`, `validateFile()`, `buildR2Key()` can run without credentials

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-16 | 1.0 | Formal story creation reflecting ~70% implementation state | River (SM) |
| 2026-03-16 | 2.0 | Completed ACs 9-10: tests (175 passing), README, path-validator ASSET_FOLDERS enforcement, asset-naming module, createClientFolderStructure, listClientAssets | Dex (Dev) |

---

## File List

| File | Status | Description |
|------|--------|-------------|
| `brand-system-service/packages/core/src/r2/types.ts` | Modified | Added AssetFolder type export |
| `brand-system-service/packages/core/src/r2/client.ts` | Existing | S3Client creation |
| `brand-system-service/packages/core/src/r2/signed-urls.ts` | Existing | Signed URL generation |
| `brand-system-service/packages/core/src/r2/upload.ts` | Existing | Upload utilities |
| `brand-system-service/packages/core/src/r2/download.ts` | Existing | Download utilities |
| `brand-system-service/packages/core/src/r2/retry.ts` | Existing | Retry with exponential backoff |
| `brand-system-service/packages/core/src/r2/path-validator.ts` | Modified | Added ASSET_FOLDERS enforcement (FR-8.8) |
| `brand-system-service/packages/core/src/r2/operations.ts` | Modified | Added createClientFolderStructure, listClientAssets, ListClientAssetsOptions |
| `brand-system-service/packages/core/src/r2/asset-naming.ts` | New | Filename normalization, metadata builder, folder-to-type mapping |
| `brand-system-service/packages/core/src/r2/index.ts` | Modified | Added exports for new functions and types |
| `brand-system-service/packages/core/src/r2/README.md` | New | API documentation with setup instructions |
| `brand-system-service/packages/core/src/r2/__tests__/path-validator.test.ts` | New | 50 tests: 5 attack vectors, folder enforcement, file validation |
| `brand-system-service/packages/core/src/r2/__tests__/retry.test.ts` | New | 20 tests: retryable errors, backoff, exhaustion, logging |
| `brand-system-service/packages/core/src/r2/__tests__/client.test.ts` | New | 14 tests: client creation, env config, validation |
| `brand-system-service/packages/core/src/r2/__tests__/signed-urls.test.ts` | New | 10 tests: URL generation, expiry tiers, validation |
| `brand-system-service/packages/core/src/r2/__tests__/upload-download.test.ts` | New | 14 tests: round-trip, error scenarios |
| `brand-system-service/packages/core/src/r2/__tests__/operations.test.ts` | New | 15 tests: delete, list, folder creation, pagination |
| `brand-system-service/packages/core/src/r2/__tests__/asset-naming.test.ts` | New | 52 tests: normalization, metadata, edge cases |
| `brand-system-service/jest.config.js` | New | Jest configuration with ts-jest |
| `brand-system-service/package.json` | Modified | Added test scripts, jest/ts-jest devDependencies |

---

## QA Results

### Review Date: 2026-03-30

### Reviewed By: Quinn (Test Architect)

**Verdict: PASS**

**Test Execution:**

| Suite | Tests | Status |
|-------|-------|--------|
| path-validator.test.ts | 50 | PASS |
| asset-naming.test.ts | 52 | PASS |
| retry.test.ts | 20 | PASS |
| operations.test.ts | 15 | PASS |
| client.test.ts | 14 | PASS |
| upload-download.test.ts | 14 | PASS |
| signed-urls.test.ts | 10 | PASS |
| **Total** | **175** | **ALL PASS** |

**AC Traceability:**

| AC | Status | Evidence |
|----|--------|----------|
| AC-1 R2 Bucket Setup | MET | `types.ts`: ASSET_FOLDERS constant with 10 folders; path structure `{clientId}/` |
| AC-2 S3-Compatible Client | MET | `client.ts`: createR2Client() with @aws-sdk/client-s3 v3, forcePathStyle, 30s timeout |
| AC-3 Signed URL Generation | MET | `signed-urls.ts`: two-tier expiry (15min api, 1h download) per NFR-1.6 |
| AC-4 Upload Utility | MET | `upload.ts`: uploadObject(), uploadBuffer() with path validation |
| AC-5 Download Utility | MET | `download.ts`: downloadObject() with client prefix scoping |
| AC-6 Error Handling & Retry | MET | `retry.ts`: withRetry() exponential backoff, 3 retries, 200ms base, 5s max |
| AC-7 Path Validation | MET | `path-validator.ts`: 5 attack vectors, ASSET_FOLDERS enforcement, validateFile() |
| AC-8 Configuration | MET | `client.ts`: r2ConfigFromEnv() reads from env vars only |
| AC-9 Integration Tests | MET | 7 test suites, 175 tests covering all scenarios |
| AC-10 Documentation | MET | `README.md` with API docs and setup instructions |

### Gate Status

Gate: PASS -> docs/qa/gates/bss-1.2-cloudflare-r2-asset-storage.yml
