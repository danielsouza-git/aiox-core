# Story BSS-1.4: Basic Security Hardening

**Status:** Done
**Epic:** EPIC-BSS-1 — Foundation & Simplified Infrastructure
**Priority:** P0
**Complexity:** Medium (M)
**Story Points:** 5 SP
**Created:** 2026-03-16
**Dependencies:** BSS-1.1 (Project Scaffold — Done), BSS-1.2 (R2 Storage — In Progress, path-validator and signed-urls modules)
**Blocks:** None within EPIC-BSS-1

---

## Executor Assignment

```yaml
executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["security-audit", "code-review", "penetration-test-simulation"]
```

---

## Story

**As a** Brand System Service administrator,
**I want** basic security hardening including malware scanning, API key protection, signed URL expiration enforcement, and abuse detection,
**so that** client assets and system credentials are protected from unauthorized access and malicious uploads.

---

## Acceptance Criteria

- [ ] 1. **Malware Scanning**: ClamAV integration for uploaded client assets (logos, photos, documents). Infected files automatically rejected before storage in R2. Scanning runs in the upload pipeline, not post-storage. Log all scan results (clean/infected, filename, timestamp) per NFR-5.5

- [ ] 2. **API Key Encryption**: All API keys (`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `CLAUDE_API_KEY`, `REPLICATE_API_KEY`, `ELEVENLABS_API_KEY`, etc.) loaded exclusively via environment variables. No API key ever appears in source code, build output, or logs. `@bss/core` `loadConfig()` masks sensitive fields in log output

- [ ] 3. **Signed URL Expiration Enforcement**: Automatic expiry already implemented in BSS-1.2 (`SIGNED_URL_EXPIRY`: 15min API, 1h download). This AC validates: (a) no endpoint exists to refresh/extend a signed URL without re-generating, (b) expired URLs return 403 (verified by R2 behavior), (c) no server-side URL override mechanism exists

- [ ] 4. **Abuse Detection**: Rate limiting on signed URL generation: max 100 requests per `{clientId}` per rolling 1-hour window. Requests exceeding the limit: log the abuse event, return 429 with `Retry-After` header, trigger manual review alert (ClickUp task creation or log-based alert). No in-memory rate limiter — use a persistent counter (file-based or environment-appropriate store)

- [ ] 5. **Upload Size Enforcement**: Pre-upload validation enforces 50MB maximum per file (already in `validateFile()` from BSS-1.2). Add a second check at the HTTP layer: if `Content-Length` header exceeds 50MB, reject before streaming to R2

- [ ] 6. **Content Security Policy Headers**: Extend `vercel.json` and `netlify.toml` with CSP headers for brand book static sites: `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:`

- [ ] 7. **Security Audit Logging**: Structured security log events for: malware detection, path traversal attempts, rate limit breaches, invalid credential attempts. Log format: `{ event, severity, clientId, timestamp, details }`. Written to `output/logs/security.log` (or stdout for cloud deployment)

- [ ] 8. **Dependency Vulnerability Check**: `npm audit` / `pnpm audit` passes with zero CRITICAL or HIGH vulnerabilities. Add `pnpm audit --audit-level=high` to CI pipeline (pre-commit or package.json script)

---

## 🤖 CodeRabbit Integration

> **CodeRabbit Integration**: Enabled

### Story Type Analysis

**Primary Type**: Security
**Secondary Type(s)**: Infrastructure / Deployment
**Complexity**: Medium — multiple security layers, some requiring external service (ClamAV)

### Specialized Agent Assignment

**Primary Agents**:
- @dev (implementation of all security features)
- @architect (security model review, threat model validation)

**Supporting Agents**:
- @devops (CI pipeline integration for audit check)
- @qa (security test scenarios — path traversal, rate limit bypass)

### Quality Gate Tasks

- [ ] Pre-Commit (@dev): Run before marking story complete — focus: credential exposure, hardcoded secrets
- [ ] Pre-PR (@devops): Run before creating PR — full security scan
- [ ] Security Review (@architect): Threat model review for abuse detection and ClamAV integration

### Self-Healing Configuration

**Expected Self-Healing**:
- Primary Agent: @dev (light mode)
- Max Iterations: 2
- Timeout: 15 minutes
- Severity Filter: CRITICAL

**Predicted Behavior**:
- CRITICAL issues: auto_fix (hardcoded secrets, path traversal gaps, missing input validation)
- HIGH issues: document_only (rate limiter implementation gaps, logging completeness)

### CodeRabbit Focus Areas

**Primary Focus**:
- OWASP Top 10: No injection vulnerabilities in filename/path handling
- No credential logging: mask `accessKeyId`, `secretAccessKey` in all log output
- Rate limiter correctness: rolling window, not fixed window

**Secondary Focus**:
- ClamAV timeout handling: scanning must not block uploads indefinitely
- CSP header completeness: no `unsafe-eval`, minimal `unsafe-inline`
- Dependency audit: zero CRITICAL/HIGH CVEs

---

## Tasks / Subtasks

- [ ] Task 1: ClamAV Integration (AC: 1)
  - [ ] Install `clamscan` or `clamav` npm package
  - [ ] Create `packages/core/src/security/malware-scanner.ts`
  - [ ] `scanBuffer(buffer, filename): Promise<ScanResult>` — returns `{ clean, threat, filename, scannedAt }`
  - [ ] Integrate into upload pipeline: scan before `PutObjectCommand`
  - [ ] Timeout: 30s max scan time; on timeout, reject upload with error (do not skip scan)
  - [ ] Log all scan results to security log
  - [ ] Add `BSS_CLAMAV_ENABLED=true` env var toggle (default: true in production, false in test)

- [ ] Task 2: API Key masking in logger (AC: 2)
  - [ ] Extend `@bss/core` logger to redact sensitive fields: `accessKeyId`, `secretAccessKey`, `apiKey`, `token`, `password`
  - [ ] Add `maskSensitiveFields(obj): obj` utility
  - [ ] Verify `loadConfig()` does not log raw credentials
  - [ ] Add lint rule or comment noting sensitive field handling

- [ ] Task 3: Validate signed URL non-extendability (AC: 3)
  - [ ] Code review to confirm no `/refresh-url` or `/extend-url` endpoint exists
  - [ ] Verify R2 signed URLs are HMAC-signed and cannot be tampered with
  - [ ] Document in security notes: "Signed URLs cannot be extended. Re-generate as needed."
  - [ ] Add integration test: verify expired URL structure does not accept modified expiry param

- [ ] Task 4: Implement abuse detection / rate limiter (AC: 4)
  - [ ] Create `packages/core/src/security/rate-limiter.ts`
  - [ ] `RateLimiter` class: `checkLimit(clientId): { allowed, remaining, resetAt }`
  - [ ] Rolling 1-hour window, max 100 requests per clientId
  - [ ] Persistent counter: JSON file at `output/.rate-limits/{clientId}.json` (or in-process Map for serverless)
  - [ ] On limit breach: log `{ event: 'RATE_LIMIT_BREACH', clientId, timestamp }`; return 429 response structure
  - [ ] Alert mechanism: write to `output/logs/security.log` (ClickUp task creation is BSS-6.x scope)

- [ ] Task 5: HTTP-layer upload size check (AC: 5)
  - [ ] Add `Content-Length` pre-check in the upload handler (if any HTTP layer exists)
  - [ ] If no HTTP layer yet: document that the check belongs in the API handler (BSS-6.x or BSS-7.x)
  - [ ] Ensure `validateFile()` size check is called before any R2 write

- [ ] Task 6: Extend CSP headers in static hosting configs (AC: 6)
  - [ ] Add `Content-Security-Policy` to `vercel.json` headers array
  - [ ] Add `Content-Security-Policy` to `netlify.toml` headers
  - [ ] Policy: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:`
  - [ ] Document in README why `unsafe-inline` is used (embedded tokens in CSS/JS)

- [ ] Task 7: Security audit logging (AC: 7)
  - [ ] Create `packages/core/src/security/security-logger.ts`
  - [ ] `logSecurityEvent(event: SecurityEvent)` — structured JSON output
  - [ ] `SecurityEvent` type: `{ event: string, severity: 'INFO'|'WARN'|'CRITICAL', clientId?: string, timestamp: string, details: Record<string, unknown> }`
  - [ ] Events: `MALWARE_DETECTED`, `PATH_TRAVERSAL_ATTEMPT`, `RATE_LIMIT_BREACH`, `INVALID_CREDENTIALS`
  - [ ] Export from `packages/core/src/security/index.ts`

- [ ] Task 8: Add dependency audit to CI (AC: 8)
  - [ ] Add `"audit": "pnpm audit --audit-level=high"` to root `package.json` scripts
  - [ ] Verify current state passes: `pnpm audit --audit-level=high` returns zero issues
  - [ ] Document in README: "Run `pnpm audit` regularly to check for vulnerabilities"

---

## Dev Notes

### Implementation State

**NOT STARTED** — No security hardening implemented beyond what came from BSS-1.2 (path validation, signed URL expiry).

### Key Technical Decisions

**ClamAV in Node.js**:
- Option A: `clamscan` npm package — wraps ClamAV daemon or binary
- Option B: `clamav.js` — alternative wrapper
- Option C: External scanning service (VirusTotal API) — requires API key
- [AUTO-DECISION-NEEDED]: Use `clamscan` with `BSS_CLAMAV_ENABLED` toggle. In development/CI, scanner can be disabled. In production, ClamAV must be installed on the host.

**Rate Limiter Storage**:
- For MVP (static-first, no persistent server): file-based rate limiter using JSON files in `output/.rate-limits/`
- For serverless deployments: in-process Map (resets on cold start — acceptable for MVP abuse detection)
- For production scale: Redis or Cloudflare KV (post-MVP concern)

**CSP and `unsafe-inline`**:
Brand Book static sites use inline CSS for token values (generated by Style Dictionary). `unsafe-inline` is required unless tokens are refactored to external stylesheets. Document this trade-off.

### Architecture References

- **NFR-5.2**: API keys never exposed client-side
- **NFR-5.3**: Signed URL expiration enforcement (already done in BSS-1.2)
- **NFR-5.5**: Malware scanning for uploads
- **NFR-8.2**: Rate limiting on signed URL generation (100/hr per client)
- [Source: `docs/prd-brand-system-service.md` — NFR-5.x Security section]

### File Locations

```
brand-system-service/packages/core/src/
  security/
    malware-scanner.ts      # ClamAV integration
    rate-limiter.ts         # Rolling window rate limiter
    security-logger.ts      # Structured security event logging
    index.ts                # Barrel exports
  logger.ts                 # Extend: add maskSensitiveFields()
  index.ts                  # Re-export from security/
```

### Testing

**Security tests** (unit tests with mocks):
- Malware scanner: mock ClamAV to return infected/clean results
- Rate limiter: verify rolling window (not fixed window), boundary conditions
- Security logger: verify event structure, no sensitive data in output

**Manual verification**:
- Generate a signed URL, wait for expiry, verify it returns 403
- Attempt path traversal via `buildR2Key()` — verify rejection
- Submit a rate limit burst — verify 429 and retry-after header

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-16 | 1.0 | Initial story creation | River (SM) |
| 2026-03-24 | 1.1 | QA Gate: PASS (39/39 tests, 8/8 ACs verified) | Quinn (QA) |

---

## QA Results

**Gate:** PASS | **Date:** 2026-03-24 | **Tests:** 39/39 | **Gate file:** `docs/qa/gates/bss-1.4-basic-security-hardening.yml`

| AC | Verdict | Evidence |
|----|---------|----------|
| AC-1 Malware Scanning | PASS | malware-scanner.ts: scanBuffer(), ClamAV toggle, timeout handling (10 tests) |
| AC-2 API Key Masking | PASS | mask-sensitive.ts: maskSensitiveFields(), nested object + array support (10 tests) |
| AC-3 Signed URL Expiration | PASS | No refresh/extend endpoint. HMAC signature from BSS-1.2 verified |
| AC-4 Abuse Detection | PASS | rate-limiter.ts: rolling 1h window, 100 req/clientId, persistent JSON, 429+Retry-After (10 tests) |
| AC-5 Upload Size | PASS | validateFile() in BSS-1.2. HTTP-layer check documented for API handler |
| AC-6 CSP Headers | PASS | vercel.json + netlify.toml with full CSP policy |
| AC-7 Security Logging | PASS | security-logger.ts: 4 event types, 3 severity levels (9 tests) |
| AC-8 Dependency Audit | PASS | pnpm audit script documented, zero CRITICAL/HIGH |
