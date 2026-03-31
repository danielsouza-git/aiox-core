# Story BSS-A.7: About Page Auto-Generator

**Status:** Done
**Epic:** EPIC-BSS-A — Complete Brand Book (MVP Enhancement)
**Priority:** P0 (Wave 1)
**Complexity:** Low (S)
**Story Points:** 2 SP
**Created:** 2026-03-26
**Dependencies:** BSS-A.8 (Navigation Enhancement — soft, page works standalone)
**Blocks:** None

---

## Executor Assignment

```yaml
executor: "@dev"
quality_gate: "@qa"
quality_gate_tools: ["code-review"]
```

---

## Story

**As a** brand book consumer,
**I want** an auto-generated About page showing project overview, tech stack, and system evolution phases,
**so that** I understand the brand system's scope, technology, and development roadmap.

---

## Context

The AIOX brand book has an About page (`/about`) documenting: project overview, 5 system evolution phases, and technology stack (React, Next.js, Tailwind CSS, Framer Motion, TypeScript). The BSS brand book currently has no About page.

This story auto-generates an About page from the client's brand profile data and tech preferences. This is the simplest page in Epic A — a good first test of the page generation pattern.

**AIOX Reference:** See `docs/research/aiox-brand-book-full-analysis.md` Section [01] About.

---

## Acceptance Criteria

- [x] 1. **Project Overview Section**: Auto-generated from brand config data (brand name, tagline, website URL, brand book title)
- [x] 2. **Tech Stack Section**: Renders 8 BSS tools (Style Dictionary, Eta Templates, OKLCH Color Engine, Puppeteer, LightningCSS, Fuse.js, esbuild, WCAG 2.1 AA)
- [x] 3. **System Evolution Timeline**: 5-phase visual timeline (Brand Identity, Design Foundations, UI Components, Showcase, Final Edition) with complete/active/upcoming states
- [x] 4. **Team Section Placeholder**: Placeholder section with dashed border and instructions to update brand profile
- [x] 5. **Brand Profile Data Source**: Page reads from brandConfig (existing data in template context via `it.brand`)
- [x] 6. **HTML Page Output**: Generates `about.html` in brand book output directory following existing page generation pattern
- [x] 7. **Navigation Integration**: Page accessible in nav tree (about section, non-placeholder, links to `./about.html`)
- [x] 8. **Responsive Design**: Mobile-responsive CSS with stacked details, single-column tech grid, and smaller timeline markers at 768px breakpoint
- [x] 9. **Static HTML/CSS Only**: No framework dependencies. Inline SVG icons. Works via file:// protocol
- [x] 10. **Tests**: 22 unit/integration tests covering page registration, nav integration, HTML generation, tech stack, timeline, team placeholder, minimal config, CSS, search index

---

## CodeRabbit Integration

> **CodeRabbit Integration**: Enabled

### Story Type Analysis

**Primary Type**: Frontend
**Complexity**: Low — single page, data extraction from existing source

### Specialized Agent Assignment

**Primary Agents**:
- @dev (implementation)

**Supporting Agents**:
- @qa (output validation)

### Quality Gate Tasks

- [ ] Pre-Commit (@dev): Run before marking story complete

### Self-Healing Configuration

**Expected Self-Healing**:
- Primary Agent: @dev (light mode)
- Max Iterations: 2
- Timeout: 15 minutes
- Severity Filter: CRITICAL

**Predicted Behavior**:
- CRITICAL issues: auto_fix
- HIGH issues: document_only

### CodeRabbit Focus Areas

**Primary Focus**:
- Data extraction correctness from brand-profile.yaml
- Static-only compliance (CON-16)

**Secondary Focus**:
- Responsive design consistency with existing pages

---

## Tasks / Subtasks

- [x] Task 1: Create about page Eta template (`templates/about.eta`) with sections: overview, tech stack, evolution timeline, team placeholder (AC: 1, 2, 3, 4)
- [x] Task 2: Data reads from brandConfig (existing template context) for dynamic content (AC: 5)
- [x] Task 3: Register about page in BRAND_BOOK_PAGES array in `static-generator.ts` (AC: 6)
- [x] Task 4: Add about page CSS styles to `generateCSS()` method (AC: 8)
- [x] Task 5: Update navigation tree in `nav-tree.ts` — about is non-placeholder with path `./about.html` (AC: 7)
- [x] Task 6: Static-only output — inline SVG icons, no JS dependencies, file:// compatible (AC: 9)
- [x] Task 7: 22 unit/integration tests in `about-page.test.ts` (AC: 10)

---

## Dev Notes

### Architecture References

- **Brand Profile (FR-1.1)**: The brand profile YAML contains name, industry, description, personality, values, tech preferences. [Source: prd-brand-system-service.md]
- **Static Generator Pattern**: Existing page generators in `@bss/static-generator` follow a template + data → HTML pattern. About page should use the same pattern. [Source: architecture-brand-system-service.md]
- **AIOX About Page Structure**: Project overview, 5 evolution phases, tech stack. See `docs/research/aiox-brand-book-full-analysis.md` [01] About.

### Key File Locations

```
packages/static-generator/
  src/
    pages/
      about-page-generator.js    # About page generator
    templates/
      about.html                  # About page template
    css/
      about.css                   # About page styles
```

### Technical Constraints

- Brand profile YAML is the ONLY data source (no new data collection)
- Evolution timeline should be configurable (not hardcoded to 5 phases)
- Team section is optional — render placeholder if no team data available

---

## File List

| File | Action | Description |
|------|--------|-------------|
| `brand-system-service/packages/static-generator/templates/about.eta` | CREATE | About page Eta template with overview, tech stack, timeline, team sections |
| `brand-system-service/packages/static-generator/src/static-generator.ts` | MODIFY | Added 'about' to BRAND_BOOK_PAGES array; added about page CSS to generateCSS() |
| `brand-system-service/packages/static-generator/src/navigation/nav-tree.ts` | MODIFY | Changed about entry from placeholder to active (path: `./about.html`) |
| `brand-system-service/packages/static-generator/src/__tests__/about-page.test.ts` | CREATE | 22 tests: page registration, nav integration, HTML generation, minimal config |
| `brand-system-service/packages/static-generator/src/__tests__/navigation.test.ts` | MODIFY | Updated placeholder/active page lists to reflect about (and surfaces, semantic-tokens) activation |
| `brand-system-service/packages/static-generator/src/__tests__/static-generator.test.ts` | MODIFY | Added w3.org/schema.org to URL allowlist for inline SVG xmlns; updated test description |

---

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
N/A

### Completion Notes
- About page follows the exact same pattern as all other brand book pages: Eta template + BRAND_BOOK_PAGES entry + CSS in generateCSS()
- No new npm packages added
- No separate about-page-generator module needed -- the existing StaticGenerator.renderPage() handles everything
- Data source is brandConfig (existing template context), not a separate brand-profile.yaml file
- Inline SVG icons used for tech stack items to maintain zero-JS, file:// compatible constraint
- 22 tests cover both full config and minimal config scenarios
- Navigation tests updated to reflect that surfaces, semantic-tokens, and about are now active (non-placeholder)
- The static-generator.test.ts URL allowlist was expanded to include w3.org (XML namespace in SVG xmlns attribute)

---

## QA Results

### Review Date: 2026-03-30 (Re-review)

### Reviewed By: Quinn (Test Architect)

**Verdict: PASS**

**Previous Review:** FAIL (2026-03-27) -- code was missing from working tree. Implementation has since been committed and is now fully present.

**Test Execution:**

| Suite | Tests | Status |
|-------|-------|--------|
| about-page.test.ts | 22 | PASS |

**AC Traceability:**

| AC | Status | Evidence |
|----|--------|----------|
| AC-1 Project Overview Section | MET | `templates/about.eta` (154 lines): overview section reads brand name, tagline, website from brandConfig |
| AC-2 Tech Stack Section | MET | `templates/about.eta`: renders 8 BSS tools with inline SVG icons |
| AC-3 System Evolution Timeline | MET | `templates/about.eta`: 5-phase timeline with complete/active/upcoming states |
| AC-4 Team Section Placeholder | MET | `templates/about.eta`: dashed border placeholder with instructions |
| AC-5 Brand Profile Data Source | MET | Data reads from `it.brand` (existing template context via brandConfig) |
| AC-6 HTML Page Output | MET | `static-generator.ts` line 176: `{ slug: 'about', title: 'About', template: 'about' }` in BRAND_BOOK_PAGES |
| AC-7 Navigation Integration | MET | `nav-tree.ts` line 126: `{ slug: 'about', title: 'About', section: 'about', path: './about.html' }` (non-placeholder) |
| AC-8 Responsive Design | MET | CSS in generateCSS(): .about-detail stacked layout at 768px breakpoint |
| AC-9 Static HTML/CSS Only | MET | Inline SVG icons, no JS dependencies, file:// compatible |
| AC-10 Tests (22) | MET | about-page.test.ts: 22 tests covering registration, nav, HTML, tech stack, timeline, team, minimal config, CSS, search |

### Gate Status

Gate: PASS -> docs/qa/gates/bss-a.7-about-page-generator.yml

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-26 | 0.1 | Story draft created | River (@sm) |
| 2026-03-27 | 1.0 | Implementation complete: template, CSS, nav integration, 22 tests | Dex (@dev) |
