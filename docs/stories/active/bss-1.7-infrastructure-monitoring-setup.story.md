# Story BSS-1.7: Infrastructure Monitoring Setup

**Status:** Done
**Epic:** EPIC-BSS-1 — Foundation & Simplified Infrastructure
**Priority:** P0
**Complexity:** Low (S)
**Story Points:** 2 SP
**Created:** 2026-03-16
**Dependencies:** BSS-1.1 (Project Scaffold — Done, Sentry DSN in BSSConfig), BSS-1.2 (R2 Storage — In Progress), BSS-1.5 (GDPR — Draft, audit log structure)
**Blocks:** EPIC-BSS-10 (Observability & Analytics — builds on this foundation)

---

## Executor Assignment

```yaml
executor: "@dev"
quality_gate: "@devops"
quality_gate_tools: ["code-review", "observability-audit", "sentry-integration-check"]
```

---

## Story

**As a** Brand System Service operator,
**I want** basic infrastructure monitoring via Sentry error tracking, structured AI API call logging, and a health check endpoint,
**so that** errors are captured automatically, AI API costs can be tracked per client, and system health is observable without a dedicated monitoring dashboard.

---

## Acceptance Criteria

- [ ] 1. **Sentry Error Tracking**: Sentry SDK initialized in `@bss/core` with:
  - `SENTRY_DSN` and `SENTRY_ENVIRONMENT` loaded from environment (already in `BSSConfig.sentry`)
  - `Sentry.init()` called once at application startup with: `dsn`, `environment`, `tracesSampleRate: 0.1`
  - Unhandled promise rejections and uncaught exceptions automatically captured
  - Manual `captureException(error)` integrated into `StorageError` and `BuildError` handlers
  - Sentry DSN loaded from env var, never hardcoded
  - Free tier is sufficient (5K errors/month)

- [ ] 2. **Structured AI API Call Logging**: `logAiApiCall(entry: AiApiCallEntry)` function that writes to `output/logs/ai-api-calls.jsonl` (JSON Lines):
  - `AiApiCallEntry` fields: `timestamp`, `clientId`, `provider` (claude|openai|replicate|elevenlabs), `model`, `inputTokens`, `outputTokens`, `totalCost` (USD), `latencyMs`, `success`, `errorMessage?`
  - Cost calculation constants: Claude Sonnet ~$3/M input tokens, ~$15/M output; GPT-4o ~$2.5/M input, ~$10/M output
  - Log rotation: when `ai-api-calls.jsonl` exceeds 10MB, rotate to `ai-api-calls-{YYYY-MM}.jsonl`
  - `summarizeAiCosts(clientId, month): Promise<AiCostSummary>` — aggregates costs per client per month

- [ ] 3. **Health Check Script**: `packages/core/src/scripts/health-check.ts` that:
  - Tests R2 connectivity: attempt to list objects (with timeout 5s)
  - Tests Sentry connectivity: send a test ping
  - Reports: `{ r2: 'ok'|'error', sentry: 'ok'|'error', timestamp }`
  - Returns exit code 0 (healthy) or 1 (unhealthy) for CI/scheduled checks
  - Add `"health": "ts-node packages/core/src/scripts/health-check.ts"` to `package.json`

- [ ] 4. **Error Rate Monitoring**: `checkErrorRate(windowHours?: number): Promise<ErrorRateReport>` that:
  - Reads Sentry-captured errors from the past 24h (or specified window)
  - Since Sentry API access is optional, this can use a local error log as fallback
  - Alternative: scan `output/logs/` for ERROR-level entries within the window
  - Returns: `{ errorCount, windowHours, rate: errorsPerHour, topErrors: string[] }`

- [ ] 5. **Log Structure for AI API Calls**: Extend the `@bss/core` logger with a dedicated AI context:
  - `createAiLogger(clientId, provider): Logger` — returns a logger with AI metadata pre-populated
  - All AI API calls log at INFO level with full `AiApiCallEntry` data
  - Errors from AI APIs log at ERROR level with `captureException()` call to Sentry

- [ ] 6. **Monitoring Documentation**: `docs/operations/monitoring.md` covering:
  - How to access Sentry dashboard and interpret error alerts
  - How to read `ai-api-calls.jsonl` for cost tracking
  - How to run `pnpm health` for manual health checks
  - Escalation path when errors exceed threshold
  - ClickUp task creation for alerts (manual process for MVP — no webhook integration yet)

- [ ] 7. **Unit Tests**: Test `logAiApiCall()`, `summarizeAiCosts()`, and `checkErrorRate()` with mocked file system and Sentry SDK

---

## 🤖 CodeRabbit Integration

> **CodeRabbit Integration**: Enabled

### Story Type Analysis

**Primary Type**: Infrastructure / Observability
**Secondary Type(s)**: Integration (Sentry external service)
**Complexity**: Low — bounded scope, well-understood patterns

### Specialized Agent Assignment

**Primary Agents**:
- @dev (Sentry integration, logging functions, health check)
- @devops (health check in CI pipeline, Sentry project setup verification)

**Supporting Agents**:
- @architect (validate observability approach covers needs for EPIC-BSS-10 extension)

### Quality Gate Tasks

- [ ] Pre-Commit (@dev): Run before marking story complete
- [ ] Integration Check (@devops): Verify Sentry actually captures a test error in staging

### Self-Healing Configuration

**Expected Self-Healing**:
- Primary Agent: @dev (light mode)
- Max Iterations: 2
- Timeout: 15 minutes
- Severity Filter: CRITICAL

**Predicted Behavior**:
- CRITICAL issues: auto_fix (Sentry DSN exposed in code, sensitive data in error reports)
- HIGH issues: document_only (log rotation gaps, cost calculation inaccuracies)

### CodeRabbit Focus Areas

**Primary Focus**:
- No PII in Sentry error reports: client asset paths are ok, client email/names are not
- Sentry DSN sourced from env var, never committed

**Secondary Focus**:
- Log file size management: rotation must not lose data
- Cost calculation accuracy: use constants, not hardcoded values in calculation logic

---

## Tasks / Subtasks

- [ ] Task 1: Initialize Sentry SDK in `@bss/core` (AC: 1)
  - [ ] Install `@sentry/node` package in `packages/core/package.json`
  - [ ] Create `packages/core/src/monitoring/sentry.ts`
  - [ ] `initSentry(config: BSSConfig): void` — calls `Sentry.init()` with env-sourced DSN
  - [ ] `captureError(error: Error, context?: Record<string, unknown>): void` — wraps `Sentry.captureException()`
  - [ ] Integrate `captureError()` into `StorageError` and `BuildError` constructors
  - [ ] Add `BSS_SENTRY_ENABLED=true` toggle (default: true; set false in unit tests)
  - [ ] Export from `packages/core/src/monitoring/index.ts`

- [ ] Task 2: Implement AI API call logging (AC: 2, 5)
  - [ ] Define `AiApiCallEntry` and `AiCostSummary` types in `packages/core/src/monitoring/types.ts`
  - [ ] Define cost constants: `AI_COST_PER_TOKEN` map keyed by provider+model
  - [ ] `logAiApiCall(entry): Promise<void>` — appends to `output/logs/ai-api-calls.jsonl`
  - [ ] `rotateLogIfNeeded(logPath): Promise<void>` — check size, rotate if > 10MB
  - [ ] `summarizeAiCosts(clientId, month): Promise<AiCostSummary>` — parse JSONL, filter, aggregate
  - [ ] `createAiLogger(clientId, provider): Logger` — pre-configured logger with AI context

- [ ] Task 3: Implement health check script (AC: 3)
  - [ ] `packages/core/src/scripts/health-check.ts`
  - [ ] R2 health: call `listObjects()` with 1-item limit and 5s timeout
  - [ ] Sentry health: call `Sentry.captureMessage('health-check', 'debug')` and verify no exception
  - [ ] Output: JSON report to stdout + exit code
  - [ ] Add `"health": "ts-node packages/core/src/scripts/health-check.ts"` to `package.json`

- [ ] Task 4: Implement error rate monitoring (AC: 4)
  - [ ] `checkErrorRate(windowHours = 24): Promise<ErrorRateReport>`
  - [ ] Scan `output/logs/` for files with ERROR-level entries (JSON Lines format)
  - [ ] Filter entries within the time window
  - [ ] Aggregate count, compute rate, extract top error messages
  - [ ] `ErrorRateReport`: `{ errorCount, windowHours, rate, topErrors, generatedAt }`

- [ ] Task 5: Write monitoring documentation (AC: 6)
  - [ ] Create `docs/operations/` directory
  - [ ] Create `docs/operations/monitoring.md`
  - [ ] Sections: Sentry setup, AI cost tracking, health check, alert escalation (manual ClickUp task)

- [ ] Task 6: Write unit tests (AC: 7)
  - [ ] `logAiApiCall()`: verify JSONL format, verify rotation trigger
  - [ ] `summarizeAiCosts()`: verify correct aggregation by clientId and month
  - [ ] `checkErrorRate()`: mock log files, verify correct window filtering
  - [ ] Sentry: mock `@sentry/node` to verify init and captureException calls

---

## Dev Notes

### Implementation State (~10% Complete)

**PARTIALLY IMPLEMENTED** (partial AC-1):
- `BSSConfig.sentry` interface defined in `packages/core/src/config.ts` with `dsn` and `environment` fields
- `SENTRY_DSN` and `SENTRY_ENVIRONMENT` env vars documented in `.env.example`
- Sentry SDK NOT installed, NOT initialized anywhere

**REMAINING** (all ACs):
- Sentry SDK installation and initialization
- AI API call logging
- Health check script
- Error rate monitoring
- All documentation

### Key Technical Decisions

**Sentry SDK version**: Use `@sentry/node` (not `@sentry/nextjs` — no Next.js in use). Version 8.x recommended.

**Log format**: JSON Lines (JSONL) — one JSON object per line, easy to stream and parse. Files use `.jsonl` extension.

**Cost calculation approach**:
```typescript
export const AI_COST_PER_TOKEN = {
  'claude/claude-sonnet-4-5': { input: 3.0 / 1_000_000, output: 15.0 / 1_000_000 },
  'openai/gpt-4o': { input: 2.5 / 1_000_000, output: 10.0 / 1_000_000 },
  'replicate/flux-1.1-pro': { perImage: 0.04 },
} as const;
```

**MVP monitoring philosophy**: This is intentionally minimal. EPIC-BSS-10 will add proper dashboards and analytics. BSS-1.7 establishes the logging infrastructure that BSS-10 will consume.

**PII in Sentry**: Never send client names, emails, or identifiable information in Sentry events. Use `clientId` (opaque identifier) and file paths only.

### NFR References

- **NFR-6.1**: AI API call logging with cost tracking per client
- **NFR-6.2**: Error rate monitoring (24h window)
- **NFR-6.3**: Health monitoring for R2 and external services
- **NFR-9.10**: MVP operates without proprietary observability dashboard (ClickUp as fallback)
- [Source: `docs/prd-brand-system-service.md` — NFR-6.x Monitoring section]

### Environment Variables

```bash
SENTRY_DSN=              # Sentry project DSN (get from Sentry dashboard)
SENTRY_ENVIRONMENT=development  # development | staging | production
BSS_SENTRY_ENABLED=true  # Set to false in unit tests
```

### File Locations

```
brand-system-service/
  packages/core/src/
    monitoring/
      sentry.ts            # Sentry initialization and captureError()
      ai-logger.ts         # logAiApiCall(), summarizeAiCosts(), createAiLogger()
      error-rate.ts        # checkErrorRate()
      types.ts             # AiApiCallEntry, AiCostSummary, ErrorRateReport
      index.ts             # Barrel exports
    scripts/
      health-check.ts      # Health check script
  docs/operations/
    monitoring.md          # Operations documentation
  output/logs/             # Runtime logs (gitignored)
    ai-api-calls.jsonl     # AI API call log
    security.log           # Security events (from BSS-1.4)
    audit.jsonl            # GDPR audit log (from BSS-1.5)
```

### Testing

**Test location**: `packages/core/src/monitoring/__tests__/`

**Approach**: Mock Sentry SDK with `jest.mock('@sentry/node')`. Mock `fs` for file-based log tests. Use temp directories for JSONL log tests.

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-16 | 1.0 | Initial story creation | River (SM) |
| 2026-03-24 | 1.1 | QA Gate: PASS (30/30 tests, 7/7 ACs verified) | Quinn (QA) |

---

## QA Results

**Gate:** PASS | **Date:** 2026-03-24 | **Tests:** 30/30 | **Gate file:** `docs/qa/gates/bss-1.7-infrastructure-monitoring-setup.yml`

| AC | Verdict | Evidence |
|----|---------|----------|
| AC-1 Sentry Error Tracking | PASS | sentry.ts: initSentry(), captureError(), BSS_SENTRY_ENABLED toggle (10 tests) |
| AC-2 AI API Call Logging | PASS | ai-logger.ts: logAiApiCall(), JSONL format, cost constants, 10MB rotation (12 tests) |
| AC-3 Health Check Script | PASS | scripts/health-check.ts: R2 connectivity + Sentry ping, JSON report, exit codes |
| AC-4 Error Rate Monitoring | PASS | error-rate.ts: checkErrorRate(windowHours=24), log scanning, ErrorRateReport (8 tests) |
| AC-5 AI Logger Structure | PASS | ai-logger.ts: createAiLogger(clientId, provider), ERROR level with Sentry capture |
| AC-6 Monitoring Documentation | PASS | docs/operations/monitoring.md: Sentry, AI costs, health check, escalation |
| AC-7 Unit Tests | PASS | 30/30 across 3 suites (sentry, ai-logger, error-rate) |
