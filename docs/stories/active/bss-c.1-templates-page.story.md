# Story BSS-C.1: Templates Page

**Status:** Done
**Epic:** EPIC-BSS-C -- Templates & SEO (Advanced Features)
**Priority:** P1 (promoted from P2 by PM -- executable alongside Epic A)
**Complexity:** Low (L)
**Story Points:** 2 SP
**Created:** 2026-04-01
**Dependencies:** FR-1.7 (brand book pages), NFR-9.1 (local package), NFR-9.2 (relative paths)
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
**I want** a Templates page with 3 page layout templates (Page Shell, Dashboard Grid, Content Grid) with visual previews and copyable code snippets,
**so that** I can quickly reuse standardized layout patterns that follow the brand design system.

---

## Context

The BSS brand book includes a "Templates" slot registered in BRAND_BOOK_PAGES and the navigation tree (Foundations section), but the existing template (`templates.eta`) contained only a placeholder with basic text descriptions. This story replaces it with a rich, interactive Templates page featuring:

1. **Page Shell** -- sticky nav, section dividers, footer pattern
2. **Dashboard Grid** -- bento-style asymmetric 4-column layout
3. **Content Grid** -- auto-fit minmax(340px, 1fr) responsive grid

Each template shows a visual preview (HTML/CSS inline), name, description, features list, and copyable HTML + CSS code snippets with dark code blocks and vanilla JS copy-to-clipboard (CON-22 offline compatible).

---

## Acceptance Criteria

- [x] 1. **Page Shell Template**: Preview, description, and code snippet for sticky header + section dividers + footer pattern
- [x] 2. **Dashboard Grid Template**: Preview, description, and code snippet for bento-style asymmetric 4-column layout
- [x] 3. **Content Grid Template**: Preview, description, and code snippet for auto-fit minmax(340px, 1fr) responsive grid
- [x] 4. **Visual Previews**: Each template has an inline HTML/CSS preview rendered in the page
- [x] 5. **Code Snippets**: Each template has copyable HTML and CSS code blocks with dark styling
- [x] 6. **Copy-to-Clipboard**: Vanilla JS copy buttons (CON-22 offline compatible, no CDN)
- [x] 7. **HTML Page Output**: Generates `templates.html` in brand book output directory
- [x] 8. **Navigation Integration**: Page accessible under Foundations section in navigation tree
- [x] 9. **Responsive**: Page and previews adapt at 768px breakpoint
- [x] 10. **Tests**: Unit tests covering page data extraction, BRAND_BOOK_PAGES registration, nav integration, all 3 templates, CSS, and search index

---

## Tasks / Subtasks

- [x] Task 1: Create templates page data extractor (`templates-page-data.ts`) with interfaces and 3 template builders (AC: 1, 2, 3)
- [x] Task 2: Replace placeholder templates.eta with rich Eta template -- TOC, preview sections, code blocks, copy-to-clipboard JS (AC: 4, 5, 6)
- [x] Task 3: Wire data extractor into static-generator.ts -- import, call, pass to templateData (AC: 7)
- [x] Task 4: Add templates-specific CSS to generateCSS() -- TOC, showcase, features, code blocks, responsive (AC: 9)
- [x] Task 5: Update pages/index.ts and src/index.ts re-exports (AC: 7)
- [x] Task 6: Verify navigation integration -- templates already in Foundations section of nav-tree.ts (AC: 8)
- [x] Task 7: Write comprehensive unit tests (AC: 10)

---

## Dev Notes

### Architecture References

- **FR-1.7**: Brand book pages -- templates page is part of the standard brand book page set.
- **NFR-9.1**: Local package -- all assets self-contained, no external dependencies.
- **NFR-9.2**: Relative paths -- all paths use `./` for file:// portability.
- **CON-22**: Offline compatible -- copy-to-clipboard uses vanilla JS, no CDN libraries.

### Implementation Pattern

Follows the same pattern as BSS-C.2 (SEO Documentation) and BSS-C.3 (Editorial Strategy):
1. Data extractor in `src/pages/templates-page-data.ts`
2. Eta template in `templates/templates.eta`
3. Wired in `static-generator.ts` via import + call + templateData
4. CSS in `generateCSS()` method
5. Re-exported from `pages/index.ts` and `src/index.ts`

### Pre-existing State

The templates slug was already registered in:
- `BRAND_BOOK_PAGES` (line 171 of static-generator.ts)
- Navigation tree (Foundations section, line 96 of nav-tree.ts)
- A basic `templates.eta` existed with placeholder content

This story replaces the placeholder with a fully functional data-driven page.

---

## File List

| File | Action | Description |
|------|--------|-------------|
| `brand-system-service/packages/static-generator/src/pages/templates-page-data.ts` | CREATE | Templates page data extractor (interfaces + extractTemplatesPageData + 3 template builders) |
| `brand-system-service/packages/static-generator/templates/templates.eta` | MODIFY | Rich Eta template with TOC, preview sections, code blocks, copy-to-clipboard JS |
| `brand-system-service/packages/static-generator/src/__tests__/templates-page.test.ts` | CREATE | Comprehensive unit tests (40+ tests covering all templates, integration, CSS, search) |
| `brand-system-service/packages/static-generator/src/static-generator.ts` | MODIFY | Import extractor, call extractTemplatesPageData(), add to templateData, add CSS |
| `brand-system-service/packages/static-generator/src/pages/index.ts` | MODIFY | Re-export extractTemplatesPageData and types |
| `brand-system-service/packages/static-generator/src/index.ts` | MODIFY | Re-export templates page types from pages module |

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-04-01 | 0.1 | Story draft created | Dex (@dev) |
| 2026-04-01 | 1.0 | Implementation complete: data extractor, Eta template, 40+ tests, CSS, wiring | Dex (@dev) |
| 2026-04-02 | 1.1 | QA Gate PASS (68/68 tests, 11/11 checks). Status: Done | Quinn (@qa) |

---

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
N/A

### Completion Notes
- All 7 tasks completed
- Data extractor follows established pattern (editorial-strategy, seo-documentation)
- Templates page was already registered in BRAND_BOOK_PAGES and nav-tree (Foundations section)
- Replaced placeholder template with data-driven rich template
- Copy-to-clipboard uses vanilla JS with clipboard API fallback (CON-22)
- Dark code blocks with monospace font and language labels
- Responsive at 768px breakpoint
- All CSS uses BEM naming and CSS custom properties for brand token integration
