# Story BSS-C.2: SEO Documentation Page

**Status:** Done
**Epic:** EPIC-BSS-C — Templates & SEO (Advanced Features)
**Priority:** P1 (promoted from P2 by PM — executable alongside Epic A)
**Complexity:** Low (L)
**Story Points:** 2 SP
**Created:** 2026-03-26
**Dependencies:** FR-3.7 (SEO framework exists in PRD v1.2)
**Blocks:** None

---

## Executor Assignment

```yaml
executor: "@dev"
quality_gate: "@qa"
quality_gate_tools: ["code-review", "content-validation"]
```

---

## Story

**As a** brand book consumer,
**I want** an SEO Documentation page with meta tags guide, Open Graph properties, Twitter/X Card specifications, and JSON-LD schema examples,
**so that** I can implement proper SEO and social sharing for websites and pages using the brand.

---

## Context

The BSS MVP includes an SEO framework (FR-3.7) that defines SEO best practices for brand-consistent pages. However, there is no dedicated SEO documentation page in the brand book explaining how to implement meta tags, social sharing tags, and structured data.

The AIOX brand book (`/brandbook/seo`) includes comprehensive SEO guidance with meta tags (title, description, robots, canonical), Open Graph (5 properties), Twitter/X Card (3 properties), and JSON-LD structured data (Organization schema).

This story generates an SEO Documentation page from the existing SEO framework (FR-3.7) and brand profile data.

**AIOX Reference:** See `docs/research/aiox-brand-book-full-analysis.md` Section [28] SEO.

**PM Validation:** BSS-C.2 promoted to P1 because it uses existing data (FR-3.7), requires low effort (8-12h), and adds immediate value to brand book deliverable (pushes from 14-16 to 18-20 pages).

---

## Acceptance Criteria

- [x] 1. **Meta Tags Guide**: Code examples and best practices for — `<title>` (max 60 chars, brand name suffix), `<meta name="description">` (max 155 chars, keyword optimization), `<meta name="robots">` (index, follow), `<link rel="canonical">` (absolute URL)
- [x] 2. **Open Graph Guide**: 5 essential properties with code examples — `og:title` (brand-consistent headline), `og:description` (compelling summary), `og:type` (website/article), `og:image` (1200x630px, brand-compliant imagery), `og:url` (canonical URL)
- [x] 3. **Twitter/X Card Guide**: 3 properties with code examples — `twitter:card` (summary_large_image), `twitter:site` (brand handle), `twitter:image` (1200x600px optimized)
- [x] 4. **JSON-LD Schema Examples**: Code examples for structured data — Organization schema (name, URL, logo, social profiles), Product schema (if applicable), Article schema (for blog/editorial pages)
- [x] 5. **Brand Profile Integration**: Auto-populate examples with brand name, domain, logo URL, social handles from brand profile data
- [x] 6. **Image Size Specifications**: Visual reference showing recommended image dimensions for OG and Twitter cards with aspect ratio guides
- [x] 7. **HTML Page Output**: Generates `seo-documentation.html` in brand book output directory
- [x] 8. **Navigation Integration**: Page accessible under Guidelines section in navigation tree
- [x] 9. **Code Snippet Formatting**: All HTML code examples use dark code blocks with copy-to-clipboard (vanilla JS, CON-22 offline)
- [x] 10. **Tests**: Unit tests for SEO tag generation, brand data substitution, schema validation (35 tests)

---

## CodeRabbit Integration

> **CodeRabbit Integration**: Enabled

### Story Type Analysis

**Primary Type**: Frontend + Documentation
**Complexity**: Low — content extraction from existing SEO framework, template-based page generation

### Specialized Agent Assignment

**Primary Agents**:
- @dev (implementation)

**Supporting Agents**:
- @qa (SEO tag validation, schema correctness)

### Quality Gate Tasks

- [ ] Pre-Commit (@dev): Run before marking story complete

### Self-Healing Configuration

**Expected Self-Healing**:
- Primary Agent: @dev (light mode)
- Max Iterations: 1
- Timeout: 10 minutes
- Severity Filter: HIGH

**Predicted Behavior**:
- CRITICAL issues: auto_fix
- HIGH issues: auto_fix
- MEDIUM/LOW: document_only

### CodeRabbit Focus Areas

**Primary Focus**:
- JSON-LD schema syntax correctness
- Meta tag attribute accuracy
- OG/Twitter card property completeness

**Secondary Focus**:
- Code snippet syntax highlighting
- Brand data placeholder substitution

---

## Tasks / Subtasks

- [x] Task 1: Create SEO data extractor — read SEO framework (FR-3.7) and brand profile metadata (AC: 5)
- [x] Task 2: Create SEO page template with sections: meta tags, Open Graph, Twitter/X Card, JSON-LD schema (AC: 1, 2, 3, 4)
- [x] Task 3: Implement Meta Tags Guide section — code examples with best practices and character limits (AC: 1)
- [x] Task 4: Implement Open Graph Guide section — 5 properties with code examples and visual preview (AC: 2)
- [x] Task 5: Implement Twitter/X Card Guide section — 3 properties with code examples (AC: 3)
- [x] Task 6: Implement JSON-LD Schema Examples section — Organization, Product, Article schema templates (AC: 4)
- [x] Task 7: Implement image size specifications visual — aspect ratio guides for OG and Twitter images (AC: 6)
- [x] Task 8: Add code snippet syntax highlighting and copy-to-clipboard buttons (AC: 9)
- [x] Task 9: Implement SEO documentation page generator in `@bss/static-generator` (AC: 7)
- [x] Task 10: Register page in navigation tree under Guidelines section (AC: 8)
- [x] Task 11: Write unit tests (AC: 10)

---

## Dev Notes

### Architecture References

- **SEO Framework (FR-3.7)**: Defines meta tags, OG properties, structured data patterns for brand-consistent pages. See `docs/prd-brand-system-service.md` v1.2.
- **AIOX SEO Page**: Meta tags, OG, Twitter Cards, JSON-LD examples. See `docs/research/aiox-brand-book-full-analysis.md` [28] SEO.
- **Brand Profile**: Contains brand name, domain, logo URL, social handles for auto-population into SEO examples.

### SEO Tag Examples (from AIOX reference)

```html
<!-- Meta Tags -->
<title>AIOX Squad — AI Automation Agency</title>
<meta name="description" content="We build custom AI systems that scale operations 10x with automated workflows, support bots, and data processing." />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://aiox.ai" />

<!-- Open Graph -->
<meta property="og:title" content="AIOX Squad — AI Automation" />
<meta property="og:description" content="Scale operations 10x with custom AI systems." />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://aiox.ai/og-image-1200x630.png" />
<meta property="og:url" content="https://aiox.ai" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@aioxsquad" />
<meta name="twitter:image" content="https://aiox.ai/twitter-image-1200x600.png" />

<!-- JSON-LD Organization Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AIOX Squad",
  "url": "https://aiox.ai",
  "logo": "https://aiox.ai/logo/AIOX-White.svg",
  "sameAs": [
    "https://twitter.com/aioxsquad",
    "https://linkedin.com/company/aiox"
  ]
}
</script>
```

### Image Size Reference

```
OG Image: 1200x630px (1.91:1 aspect ratio)
Twitter Image: 1200x600px (2:1 aspect ratio)
Recommended formats: PNG, JPG (optimized < 5MB)
```

### PM Adjustment Notes

- Story promoted to P1 (from P2) for execution alongside Epic A
- Uses existing FR-3.7 SEO framework — no new data sources needed
- Estimated effort: 8-12h (LOW complexity)
- Adds 1 page to brand book (contributes to 18-20 page target)

---

## File List

| File | Action | Description |
|------|--------|-------------|
| `brand-system-service/packages/static-generator/src/pages/seo-documentation-page-data.ts` | CREATE | SEO documentation page data extractor (interfaces + extractSeoDocumentationPageData function) |
| `brand-system-service/packages/static-generator/templates/seo-documentation.eta` | CREATE | Eta template with 5 sections, dark code blocks, copy-to-clipboard (CON-22 vanilla JS) |
| `brand-system-service/packages/static-generator/src/__tests__/seo-documentation-page.test.ts` | CREATE | 35 unit tests covering all 5 sections + brand profile integration |
| `brand-system-service/packages/static-generator/src/static-generator.ts` | MODIFY | Import extractor, register in BRAND_BOOK_PAGES, wire data into template pipeline |
| `brand-system-service/packages/static-generator/src/navigation/nav-tree.ts` | MODIFY | Add seo-documentation nav item under Guidelines section |
| `brand-system-service/packages/static-generator/src/index.ts` | MODIFY | Re-export all types and extractSeoDocumentationPageData function |

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-26 | 0.1 | Story draft created (promoted to P1 by PM) | River (@sm) |
| 2026-03-26 | 0.2 | PO validation: GO (8.5/10) — 4 should-fixes, 0 must-fixes | Pax (@po) |
| 2026-03-27 | 1.0 | Implementation complete: page data extractor, Eta template, 35 tests, navigation wiring. All SF applied. | Dex (@dev) |

---

## PO Validation

**Date:** 2026-03-26
**Validator:** Pax (@po)
**Mode:** YOLO (autonomous)
**Reference Documents Consulted:**
- `docs/reviews/bss-brand-book-evolution-plan.md` (Section F, Epic C)
- `docs/reviews/bss-evolution-plan-pm-validation.md` (priority adjustments)
- `docs/prd-brand-system-service.md` v1.2 (FR-3.7, CON-16, CON-22, NFR-9.1)
- `docs/research/aiox-brand-book-full-analysis.md` Section [28] SEO
- Actual codebase: `brand-system-service/packages/static-generator/src/`

### 10-Point Checklist

| # | Criterion | Score | Notes |
|---|-----------|-------|-------|
| 1 | **Title & ID** | 9/10 | Clear title "SEO Documentation Page", ID follows BSS-C.{N} convention, matches epic structure precisely. |
| 2 | **Description** | 9/10 | Complete context with motivation (FR-3.7 gap), AIOX reference ([28] SEO verified), PM promotion rationale. Clear scope boundary. |
| 3 | **Acceptance Criteria** | 9/10 | 10 ACs, all specific and testable. Each AC maps to a verifiable output (meta tags with char limits, OG with 5 properties, JSON-LD schemas, HTML output path, tests). |
| 4 | **Tasks** | 8/10 | 11 tasks, well-decomposed with AC traceability (each task references its AC). Tasks 2-6 could potentially be merged (template + sections are one workflow), but granularity is acceptable for low complexity. |
| 5 | **Dependencies** | 8/10 | FR-3.7 dependency correctly identified. Missing: explicit dependency on existing `seo-engine.ts` (which already implements SEO metadata generation at `brand-system-service/packages/static-generator/src/seo/seo-engine.ts`). This is an existing module the story should leverage, not duplicate. |
| 6 | **PRD Traceability** | 9/10 | FR-3.7 is the primary reference and is correctly cited. CON-16 (static HTML), CON-22 (no server for local package), NFR-9.1 (no server deps) are implicitly respected but not explicitly cited. |
| 7 | **File List** | 6/10 | **Multiple path inaccuracies.** See Should-Fix #1 below. The codebase uses TypeScript (.ts) not JavaScript (.js). The project lives under `brand-system-service/` prefix. There is no `brand-book-generator.js` -- the main generator is `static-generator.ts`. Templates use Eta (.eta) not plain HTML. No `src/css/` directory exists. |
| 8 | **Effort Estimate** | 9/10 | 8-12h / 2 SP / Low complexity is well-calibrated. Existing `seo-engine.ts` and Eta template patterns make this straightforward extraction work. PM estimate matches architect estimate. |
| 9 | **Risk/Constraints** | 8/10 | Low-risk story. No external dependencies, uses existing data. Missing: explicit mention of CON-22 (local package must work via index.html) which affects how code snippets are highlighted (must use embedded JS, no CDN). |
| 10 | **Overall Quality** | 10/10 | Ready for @dev implementation with the should-fixes applied. Self-contained context, clear deliverable (1 HTML page), strong AIOX reference with code examples in Dev Notes. |

### Summary

| Metric | Value |
|--------|-------|
| **Average Score** | 8.5/10 |
| **Implementation Readiness** | 8.5/10 |
| **Confidence Level** | High |
| **Must-Fixes** | 0 |
| **Should-Fixes** | 4 |
| **Verdict** | **GO** |

### Should-Fixes (non-blocking improvements)

**SF-1: File List path and extension corrections.** The File List contains multiple inaccuracies that will confuse @dev:

| Current (incorrect) | Corrected | Reason |
|---------------------|-----------|--------|
| `packages/static-generator/src/pages/seo-documentation-page-generator.js` | `brand-system-service/packages/static-generator/src/pages/seo-documentation-page-generator.ts` | Project is under `brand-system-service/` and uses TypeScript |
| `packages/static-generator/src/templates/guidelines/seo-documentation.html` | `brand-system-service/packages/static-generator/templates/guidelines/seo-documentation.eta` | Templates are in `templates/` (not `src/templates/`) and use Eta engine (.eta) |
| `packages/static-generator/src/css/seo-documentation.css` | `brand-system-service/packages/static-generator/templates/shared/seo-documentation.css` or inline in template | No `src/css/` directory exists; styles are either inline or in `templates/shared/` |
| `packages/static-generator/src/brand-book-generator.js` | `brand-system-service/packages/static-generator/src/static-generator.ts` | The main generator is `static-generator.ts`, not `brand-book-generator.js` |
| `tests/static-generator/pages/seo-documentation-page-generator.test.js` | `brand-system-service/packages/static-generator/src/__tests__/seo-documentation-page.test.ts` | Tests are co-located in `src/__tests__/` and use TypeScript |

**SF-2: Acknowledge existing seo-engine.ts.** Dev Notes should mention that `brand-system-service/packages/static-generator/src/seo/seo-engine.ts` already implements SEO metadata generation (FR-3.7 compliance, including OG types, title/description generation, sitemap). This story should build ON TOP of that module, not duplicate it. The SEO documentation page is a brand book page that documents the SEO patterns, while seo-engine.ts is the runtime generator.

**SF-3: Add explicit CON-16/CON-22 constraint note.** The story should explicitly note that code snippet syntax highlighting must work offline (no CDN for highlight.js or Prism). The local package (CON-22) opens via index.html without server. This affects AC 9 (copy-to-clipboard also needs vanilla JS, no framework).

**SF-4: Clarify navigation section placement.** AC 8 says "Guidelines or Advanced section." The existing navigation tree (implemented in `brand-system-service/packages/static-generator/src/navigation/nav-tree.ts`) should be checked for where this page best fits. The AIOX reference places it at `/brandbook/seo` which is a top-level brand book route, not nested under Guidelines. Suggest aligning with AIOX structure.

### Anti-Hallucination Check

| Check | Result |
|-------|--------|
| FR-3.7 exists in PRD v1.2 | VERIFIED (line 86 of PRD) |
| AIOX [28] SEO section exists | VERIFIED (line 977 of analysis doc) |
| Code examples in Dev Notes match AIOX reference | VERIFIED (meta tags, OG, Twitter, JSON-LD all accurate) |
| Existing seo-engine.ts handles FR-3.7 | VERIFIED (file exists at `src/seo/seo-engine.ts`, BSS-5.5 compliance) |
| No invented libraries or patterns | PASS |
| PM validation promotes BSS-C.2 to P1 | VERIFIED (Section 1 of PM validation doc) |

### Executor Assignment Validation

| Check | Result |
|-------|--------|
| executor field present | PASS (@dev) |
| quality_gate field present | PASS (@qa) |
| quality_gate_tools present | PASS (code-review, content-validation) |
| executor != quality_gate | PASS (@dev != @qa) |
| Type-to-executor consistency | PASS (Frontend + Documentation = @dev, QA gate = @qa) |

### Decision

**GO** -- Story is ready for @dev implementation. The 4 should-fixes are non-blocking improvements that @dev can incorporate during implementation. The story provides sufficient context, clear ACs, and strong reference material for successful delivery.

---

## QA Results

### Review Date: 2026-03-27

### Reviewed By: Quinn (Test Architect)

### AC Traceability

| AC | Description | Status | Evidence |
|----|------------|--------|----------|
| 1 | Meta Tags Guide (title, description, robots, canonical) | PASS | `seo-documentation-page-data.ts` L153-208: 4 tags with maxLength, bestPractice, fullSnippet. 8 tests. |
| 2 | Open Graph Guide (5 properties) | PASS | `seo-documentation-page-data.ts` L213-266: og:title, og:description, og:type, og:image, og:url. 6 tests. |
| 3 | Twitter/X Card Guide (3 properties) | PASS | `seo-documentation-page-data.ts` L271-311: twitter:card, twitter:site, twitter:image with @ normalization. 6 tests. |
| 4 | JSON-LD Schema Examples (Organization, Article, Product) | PASS | `seo-documentation-page-data.ts` L316-407: 3 schemas with valid JSON, description, useCase. 7 tests. |
| 5 | Brand Profile Integration (auto-populate) | PASS | `seo-documentation-page-data.ts` L467-504: SeoBrandProfile with defaults fallback. 2 integration tests. |
| 6 | Image Size Specifications (OG 1200x630, Twitter 1200x600) | PASS | `seo-documentation-page-data.ts` L412-456: 4 specs with SVG diagrams in template. 5 tests. |
| 7 | HTML Page Output (seo-documentation.html) | PASS | `static-generator.ts` L174 BRAND_BOOK_PAGES entry + L561-564 page generation loop. 1 integration test. |
| 8 | Navigation Integration (Guidelines section) | PASS | `nav-tree.ts` L83: Guidelines section entry. 35/35 navigation tests passing. |
| 9 | Code Snippet Formatting (dark blocks, copy-to-clipboard, CON-22) | PASS | `seo-documentation.eta` L42-128: dark blocks (#1e1e2e). L279-310: vanilla JS clipboard. No CDN. |
| 10 | Tests (35 unit tests) | PASS | `seo-documentation-page.test.ts`: 36 tests (35 + 1 BRAND_BOOK_PAGES integration), all passing. |

### Integration Verification

- **static-generator.ts**: Import (L12), BRAND_BOOK_PAGES (L174), data extractor call (L518-522), templateData (L550) -- all wired correctly
- **nav-tree.ts**: seo-documentation entry in Guidelines section (L83), correct path
- **index.ts**: 13 re-exports (1 function + 12 types) at L197-212
- **Navigation regression**: 35/35 navigation tests passing after modification

### Test Results

- **Total**: 36 tests
- **Passing**: 36
- **Failing**: 0

### Gate Status

Gate: PASS -> docs/qa/gates/bss-c.2-seo-documentation-page.yml
