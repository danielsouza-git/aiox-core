# Story BSS-A.5: Semantic Tokens Dedicated Page

**Status:** Done
**Epic:** EPIC-BSS-A — Complete Brand Book (MVP Enhancement)
**Priority:** P0 (Wave 1)
**Complexity:** Low (S)
**Story Points:** 2 SP
**Created:** 2026-03-26
**Dependencies:** BSS-A.8 (Navigation Enhancement — soft)
**Blocks:** None

---

## Executor Assignment

```yaml
executor: "@dev"
quality_gate: "@qa"
quality_gate_tools: ["code-review", "visual-validation"]
```

---

## Story

**As a** brand book consumer,
**I want** a dedicated Semantic Tokens page showing semantic backgrounds, text tokens, glow/neon tokens, interactive states, font weights, and a shadcn/ui mapping table,
**so that** I can correctly use semantic token aliases for consistent UI implementation.

---

## Context

The BSS token schema (FR-1.2) already generates semantic tokens, but there is no dedicated brand book page showcasing them. The AIOX brand book (`/brandbook/semantic-tokens`) displays semantic aliases, glow/neon tokens, interactive states, and a shadcn/ui component-to-token mapping table.

This story extracts existing semantic token data and renders it as a dedicated HTML page with interactive state previews.

**AIOX Reference:** See `docs/research/aiox-brand-book-full-analysis.md` Section [10] Semantic Tokens.

---

## Acceptance Criteria

- [x] 1. **Semantic Background Tokens**: Render 6 semantic background tokens (e.g., bg-primary, bg-secondary, bg-muted, bg-accent, bg-destructive, bg-success) with visual swatches and CSS custom property names
- [x] 2. **Semantic Text Tokens**: Render 4 semantic text tokens (text-primary, text-secondary, text-muted, text-accent) with typography previews
- [x] 3. **Glow/Neon Tokens**: Render 5 glow/neon tokens (glow-primary, glow-accent, glow-success, glow-warning, glow-error) with visual glow effect previews
- [x] 4. **Interactive States Showcase**: Render interactive state tokens (hover, focus, active, disabled) with live CSS examples showing state transitions
- [x] 5. **Font Weight Tokens**: Render font weight semantic tokens (thin, regular, medium, bold, black) with typography examples
- [x] 6. **shadcn/ui Mapping Table**: Render a table mapping ~20 shadcn/ui component tokens to BSS semantic tokens (e.g., `--background` → `var(--bg-primary)`, `--foreground` → `var(--text-primary)`)
- [x] 7. **Token Data Source**: All data extracted from existing `tokens.json` / `design-tokens.json` output (FR-1.2 deliverable)
- [x] 8. **HTML Page Output**: Generates `foundations/semantic-tokens.html` in brand book output directory
- [x] 9. **Navigation Integration**: Page accessible under Foundations section in navigation tree
- [x] 10. **Tests**: Unit tests for semantic token extraction, shadcn mapping table generation

---

## CodeRabbit Integration

> **CodeRabbit Integration**: Enabled

### Story Type Analysis

**Primary Type**: Frontend
**Complexity**: Low — token extraction from existing schema + mapping table

### Specialized Agent Assignment

**Primary Agents**:
- @dev (implementation)

**Supporting Agents**:
- @qa (token accuracy validation)

### Quality Gate Tasks

- [ ] Pre-Commit (@dev): Run before marking story complete

### Self-Healing Configuration

**Expected Self-Healing**:
- Primary Agent: @dev (light mode)
- Max Iterations: 2
- Timeout: 15 minutes
- Severity Filter: CRITICAL

**Predicted Behavior**:
- CRITICAL issues: auto_fix (incorrect token mappings)
- HIGH issues: document_only

### CodeRabbit Focus Areas

**Primary Focus**:
- Token value accuracy against source tokens.json
- shadcn/ui mapping correctness

**Secondary Focus**:
- Interactive state CSS transitions (no JS required)
- Glow effect visual accuracy

---

## Tasks / Subtasks

- [x] Task 1: Create semantic token extractor — backgrounds, text, glow, interactive states, font weights from `tokens.json` (AC: 1, 2, 3, 4, 5, 7)
- [x] Task 2: Create semantic tokens page template with all sections (AC: 1, 2, 3, 4, 5, 6)
- [x] Task 3: Implement visual swatch components for background and text tokens (AC: 1, 2)
- [x] Task 4: Implement glow/neon effect previews with CSS box-shadow/filter examples (AC: 3)
- [x] Task 5: Implement interactive states showcase — CSS-only hover/focus/active/disabled demos (AC: 4)
- [x] Task 6: Implement font weight token display with typography samples (AC: 5)
- [x] Task 7: Create shadcn/ui mapping table — hardcoded mapping of ~20 component tokens with auto-filled BSS values from tokens.json (AC: 6)
- [x] Task 8: Implement page generator function in `@bss/static-generator` (AC: 8)
- [x] Task 9: Register page in navigation tree under Foundations (AC: 9)
- [x] Task 10: Write unit tests for semantic token extraction and shadcn mapping (AC: 10)

---

## Dev Notes

### Architecture References

- **Token Schema (FR-1.2)**: Design tokens include semantic layer with aliases. Semantic tokens map to primitive tokens. [Source: prd-brand-system-service.md]
- **AIOX Semantic Tokens Page**: Semantic backgrounds, text, glow/neon, interactive states, font weights, shadcn/ui mapping. See `docs/research/aiox-brand-book-full-analysis.md` [10] Semantic Tokens.
- **shadcn/ui Integration**: The AIOX reference maps shadcn/ui CSS variables to brand tokens. The BSS should do the same for clients using shadcn/ui. [Source: evolution plan Section B, BSS-A.5]

### shadcn/ui Mapping Reference (from AIOX)

```
shadcn CSS Variable     → BSS Semantic Token
--background            → var(--bg-primary)
--foreground            → var(--text-primary)
--card                  → var(--bg-card)
--card-foreground       → var(--text-primary)
--popover               → var(--bg-elevated)
--popover-foreground    → var(--text-primary)
--primary               → var(--color-accent)
--primary-foreground    → var(--text-on-accent)
--secondary             → var(--bg-secondary)
--secondary-foreground  → var(--text-secondary)
--muted                 → var(--bg-muted)
--muted-foreground      → var(--text-muted)
--accent                → var(--bg-accent)
--accent-foreground     → var(--text-on-accent)
--destructive           → var(--color-error)
--destructive-foreground → var(--text-on-error)
--border                → var(--border-default)
--input                 → var(--bg-input)
--ring                  → var(--glow-primary)
--radius                → var(--radius-md)
```

### PM Adjustment Notes

- Estimate reduced from 4-6h to 3-5h: "Same data source as A.4, clean extraction + shadcn mapping table"

---

## File List

| File | Action | Description |
|------|--------|-------------|
| `packages/static-generator/src/pages/semantic-tokens-page-data.ts` | CREATE | Semantic token data extractor (backgrounds, text, glow, interactive states, font weights, shadcn mappings) |
| `packages/static-generator/templates/semantic-tokens.eta` | CREATE | Eta template with 6 sections for the semantic tokens page |
| `packages/static-generator/src/__tests__/semantic-tokens-page.test.ts` | CREATE | 22 unit + integration tests for semantic token extraction |
| `packages/static-generator/src/pages/index.ts` | MODIFY | Added semantic tokens re-exports to pages barrel |
| `packages/static-generator/src/static-generator.ts` | MODIFY | Import, BRAND_BOOK_PAGES entry, data extraction, templateData, CSS |
| `packages/static-generator/src/navigation/nav-tree.ts` | MODIFY | Activated semantic-tokens in Foundations nav (removed placeholder) |
| `packages/static-generator/src/index.ts` | MODIFY | Added semantic tokens + surfaces exports from pages barrel |

---

## QA Results

### Review 1 — Date: 2026-03-27

**Reviewed By:** Quinn (Test Architect)
**Verdict:** FAIL — Code not present in working tree at time of review (stale branch state).

### Review 2 — Date: 2026-03-30

**Reviewed By:** Re-validation (automated)
**Verdict:** PASS

**Summary:** All 7 files present in working tree. 22 tests passing (semantic-tokens-page.test.ts). All integration points wired: static-generator.ts import (L7), BRAND_BOOK_PAGES entry, nav-tree.ts entry (L98 under Foundations), index.ts re-exports (L49-60).

**AC Traceability:**

| AC | Status | Evidence |
|----|--------|----------|
| AC-1 Semantic Background Tokens (6) | PASS | `semantic-tokens-page-data.ts` exists with background token extraction |
| AC-2 Semantic Text Tokens (4) | PASS | Text token extraction implemented |
| AC-3 Glow/Neon Tokens (5) | PASS | Glow token extraction implemented |
| AC-4 Interactive States Showcase | PASS | Interactive state tokens with CSS examples |
| AC-5 Font Weight Tokens | PASS | Font weight token display |
| AC-6 shadcn/ui Mapping Table (~20) | PASS | `buildShadcnMappings` exported, mapping table in template |
| AC-7 Token Data Source | PASS | Data extracted from tokens.json schema |
| AC-8 HTML Page Output | PASS | BRAND_BOOK_PAGES entry in static-generator.ts |
| AC-9 Navigation Integration | PASS | nav-tree.ts L98: semantic-tokens under Foundations |
| AC-10 Tests (22) | PASS | 22 tests in semantic-tokens-page.test.ts, all passing |

### Gate Status

Gate: PASS -> docs/qa/gates/bss-a.5-semantic-tokens-page.yml

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-26 | 0.1 | Story draft created | River (@sm) |
| 2026-03-27 | 0.2 | Implementation complete — all 10 AC met, 22 tests pass, 0 regressions | Dex (@dev) |
