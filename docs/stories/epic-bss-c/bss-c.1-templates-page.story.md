# Story BSS-C.1: Templates Page

## Status

Ready for Review

## Executor Assignment

executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["coderabbit", "architecture-review"]

## Story

**As a** developer implementing landing pages and marketing sites,
**I want** a templates page documenting 3 page layout templates (Page Shell, Dashboard Grid, Content Grid) with usage guidelines, code examples, and visual previews,
**so that** I can quickly implement consistent page layouts across all deliverables.

## Acceptance Criteria

- [ ] AC-1: Page Shell template documented - sticky nav, section dividers, sticky footer layout
- [ ] AC-2: Dashboard Grid template documented - bento-style asymmetric 4-column grid
- [ ] AC-3: Content Grid template documented - auto-fit minmax(340px, 1fr) responsive grid
- [ ] AC-4: Usage guidelines for each template specifying ideal use cases
- [ ] AC-5: Code examples (HTML structure + Tailwind classes) for each template
- [ ] AC-6: Visual previews or wireframes for each template
- [ ] AC-7: NFR-9.1: Page functional in local package (no server dependencies)
- [ ] AC-8: Page integrated into brand book navigation under "Templates" section

## Technical Notes

### Architecture Context
[Source: docs/epics-brand-system-service.md#EPIC-BSS-C]

Templates page documents reusable page layout templates. Part of advanced features that can execute alongside EPIC-BSS-A.

- Implementation file: `brand-system-service/packages/static-generator/src/pages/templates-page-data.ts`
- Test file: `brand-system-service/packages/static-generator/src/__tests__/templates-page.test.ts`

### 3 Template Types

**1. Page Shell**
- Sticky navigation header (z-index layering)
- Main content area with section dividers
- Sticky footer
- Use case: Landing pages, institutional sites

**2. Dashboard Grid**
- Bento-style asymmetric 4-column grid
- Spanning cells for featured content
- Responsive collapse to 1-2 columns on mobile
- Use case: Analytics dashboards, admin panels

**3. Content Grid**
- `grid-template-columns: repeat(auto-fit, minmax(340px, 1fr))`
- Equal-height cards
- Responsive without media queries
- Use case: Blog listings, product grids, portfolio galleries

### Code Example Format
```html
<!-- Page Shell Template -->
<div class="min-h-screen flex flex-col">
  <header class="sticky top-0 z-50 bg-white border-b">
    <!-- Nav -->
  </header>
  <main class="flex-1">
    <section class="border-b py-16"><!-- Section 1 --></section>
    <section class="border-b py-16"><!-- Section 2 --></section>
  </main>
  <footer class="sticky bottom-0 bg-gray-50 border-t">
    <!-- Footer -->
  </footer>
</div>
```

### Testing
- Test file: `src/__tests__/templates-page.test.ts`
- Test: All 3 templates documented
- Test: Usage guidelines present
- Test: Code examples valid HTML
- Test: Visual previews rendered

## PRD Traceability

| Requirement | Description | Covered by AC |
|-------------|-------------|---------------|
| FR-1.8 | Page templates documentation | AC 1-3 |
| NFR-9.1 | Local package functionality | AC 7 |

## Dependencies

- **Depends on:** EPIC-BSS-2 (Brand Book Static Site Generator - BSS-2.6), EPIC-BSS-A (Navigation - BSS-A.8)
- **Consumed by:** Brand book navigation

## Tasks / Subtasks

- [x] Task 1: Define templates page data schema (AC: 1-3)
  - [x] Create TemplateType enum (PageShell, DashboardGrid, ContentGrid)
  - [x] Create TemplateDefinition interface
  - [x] Create UsageGuideline interface
  - [x] Create CodeExample interface

- [x] Task 2: Implement templates page data generator (AC: 1-6)
  - [x] Create `templates-page-data.ts` with generateTemplatesPage()
  - [x] Define Page Shell template
  - [x] Define Dashboard Grid template
  - [x] Define Content Grid template
  - [x] Generate usage guidelines for each
  - [x] Generate code examples with HTML + Tailwind
  - [x] Generate visual preview wireframes

- [ ] Task 3: Integrate into brand book navigation (AC: 8)
  - [ ] Add templates page under "Templates" section

- [ ] Task 4: Write unit tests (AC: 1-8)
  - [ ] Test: All 3 templates present
  - [ ] Test: Usage guidelines for each template
  - [ ] Test: Code examples valid
  - [ ] Test: Visual previews rendered

## Dev Notes

### Monorepo Location
Module files go in `brand-system-service/packages/static-generator/src/pages/`.

### Visual Preview Strategy
Generate SVG wireframes or use Satori to render mini-previews of each template layout.

### Tailwind Classes
Use Tailwind utility classes in code examples. Include responsive variants (sm:, md:, lg:) where applicable.

### Testing
- Test framework: Jest
- Test location: `src/__tests__/templates-page.test.ts`
- Coverage: All templates, usage guidelines, code examples, visual previews

## File List

### New Files
- `brand-system-service/packages/static-generator/src/pages/templates-page-data.ts` - Templates page generator
- `brand-system-service/packages/static-generator/src/__tests__/templates-page.test.ts` - Tests (to be written)

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-04-02 | 1.0 | Initial story creation (retroactive - code exists, awaiting QA) | River (SM) |

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (Dex / @dev)

### Completion Notes
- Story created retroactively to document existing implementation
- Code exists at `templates-page-data.ts`
- Awaiting QA gate before marking Done

## QA Results

**Status:** Awaiting QA review
