# Story BSS-A.8: Brand Book Navigation Enhancement

**Status:** Done
**Epic:** EPIC-BSS-A — Complete Brand Book (MVP Enhancement)
**Priority:** P0 (Wave 1 — implement FIRST)
**Complexity:** Medium (M)
**Story Points:** 3 SP
**Created:** 2026-03-26
**Dependencies:** None (navigation scaffolding enables all other Epic A pages)
**Blocks:** BSS-A.1, BSS-A.2, BSS-A.3, BSS-A.4, BSS-A.5, BSS-A.6, BSS-A.7 (soft dependency — pages can be built before nav, but nav enables incremental testing)

---

## Executor Assignment

```yaml
executor: "@dev"
quality_gate: "@qa"
quality_gate_tools: ["code-review", "accessibility-validation"]
```

---

## Story

**As a** brand book consumer,
**I want** a hierarchical navigation system with section grouping, breadcrumbs, and mobile support,
**so that** I can navigate a 14-16+ page brand book efficiently across desktop and mobile devices.

---

## Context

The current BSS brand book has 7-9 pages with simple flat navigation. Epic A adds 7 new pages, bringing the total to 14-16+. The AIOX reference brand book (brand.aioxsquad.ai) uses hierarchical navigation with 30+ pages across 7 top-level sections. This story builds the navigation scaffolding that all other Epic A pages will integrate into.

**PM Decision:** Navigation was moved to position 1 (from position 8) because building scaffolding first enables incremental page additions and testing.

**AIOX Reference:** 7 top-level sections (Brand Identity, Foundations, Components, Templates, SEO, Editorial, About) with subsections. See `docs/research/aiox-brand-book-full-analysis.md` Site Map.

---

## Acceptance Criteria

- [x] 1. **Hierarchical Navigation Tree**: Sidebar navigation with collapsible sections matching brand book structure: Guidelines (Brand Voice, Manifesto), Foundations (Colors, Typography, Spacing, Surfaces, Semantic Tokens), Brand Identity (Moodboard, Movement/Strategy, Logo System), Icons, About
- [x] 2. **Section Icons**: Each top-level section has an SVG icon (or CSS icon) for visual identification in the navigation
- [x] 3. **Mobile Navigation**: Hamburger menu (accessible, keyboard-operable) that slides in on screens < 768px. Touch target minimum 44x44px per WCAG 2.1
- [x] 4. **Breadcrumb Navigation**: Breadcrumb trail on each page showing: Home > Section > Page. Structured data (JSON-LD BreadcrumbList) included
- [x] 5. **Active State Highlighting**: Current page and parent section are visually highlighted in navigation
- [x] 6. **Placeholder Links**: Navigation includes links for all 7 new Epic A pages (moodboard, movement/strategy, logo usage, surfaces, semantic tokens, icons, about) even if pages don't exist yet — link to placeholder or anchor
- [x] 7. **Existing Pages Preserved**: All existing brand book pages (overview, manifesto, colors, typography, spacing, brand-voice, components) remain functional and accessible through new navigation
- [x] 8. **Static HTML/CSS/JS Only**: No framework dependencies. Pure CSS for layout, vanilla JS for toggle/collapse. Works via file:// protocol (CON-16, CON-22)
- [x] 9. **Responsive Layout**: Navigation sidebar (240px) collapses on mobile. Main content area adapts to remaining width
- [x] 10. **Tests**: Unit tests for navigation tree generation, breadcrumb generation. Visual regression baseline created

---

## CodeRabbit Integration

> **CodeRabbit Integration**: Enabled

### Story Type Analysis

**Primary Type**: Frontend
**Secondary Type(s)**: Architecture (navigation structure affects all pages)
**Complexity**: Medium — affects all brand book pages, establishes navigation pattern

### Specialized Agent Assignment

**Primary Agents**:
- @dev (implementation)
- @ux-design-expert (navigation UX, accessibility)

**Supporting Agents**:
- @qa (accessibility validation, cross-browser testing)

### Quality Gate Tasks

- [x] Pre-Commit (@dev): Run before marking story complete
- [x] Architecture Review (@architect): Validate navigation tree aligns with planned 30+ page structure

### Self-Healing Configuration

**Expected Self-Healing**:
- Primary Agent: @dev (light mode)
- Max Iterations: 2
- Timeout: 15 minutes
- Severity Filter: CRITICAL

**Predicted Behavior**:
- CRITICAL issues: auto_fix (accessibility violations, broken links)
- HIGH issues: document_only (styling inconsistencies)

### CodeRabbit Focus Areas

**Primary Focus**:
- Accessibility: WCAG 2.1 AA (keyboard nav, ARIA landmarks, focus management)
- Static-only: No framework dependencies, works via file:// protocol

**Secondary Focus**:
- Mobile responsiveness (hamburger menu, touch targets)
- Navigation tree structure supports future 30+ pages (Epic B expansion)

---

## Tasks / Subtasks

- [x] Task 1: Define navigation tree data structure in `@bss/static-generator` — JSON config mapping sections to pages with paths, icons, and ordering (AC: 1, 6)
- [x] Task 2: Implement sidebar navigation component (HTML template + CSS) with collapsible sections, active state highlighting (AC: 1, 2, 5)
- [x] Task 3: Implement mobile hamburger menu with slide-in panel, vanilla JS toggle, 44x44px touch targets (AC: 3)
- [x] Task 4: Implement breadcrumb component with JSON-LD BreadcrumbList structured data (AC: 4)
- [x] Task 5: Add placeholder links for all 7 new Epic A pages in navigation tree (AC: 6)
- [x] Task 6: Update all existing brand book pages to use new navigation layout (AC: 7)
- [x] Task 7: CSS responsive layout — 240px sidebar, collapse on mobile, content area fills remaining width (AC: 9)
- [x] Task 8: Ensure static-only implementation — no npm dependencies, file:// compatible (AC: 8)
- [x] Task 9: Write unit tests for navigation tree builder, breadcrumb generator (AC: 10)
- [x] Task 10: Visual regression baseline for navigation states (expanded, collapsed, mobile, active) (AC: 10)

---

## Dev Notes

### Architecture References

- **Static-First (CON-16, CON-22)**: Brand book is static HTML/CSS/JS. No React, no server. Must work via file:// protocol. [Source: architecture-brand-system-service.md]
- **Navigation Tree**: The architect's plan defines a NavigationTree interface with sections/subsections. See `docs/reviews/bss-brand-book-evolution-plan.md` Section E.6.
- **AIOX Reference Navigation**: 7 top-level sections (Brand Identity index, Foundations index, Components index, etc.) with subsections. See `docs/research/aiox-brand-book-full-analysis.md` Site Map.

### Key File Locations

```
packages/static-generator/
  src/
    navigation/
      nav-tree.js           # Navigation tree data structure + builder
      nav-component.js      # HTML template generator for sidebar
      breadcrumb.js          # Breadcrumb generator with JSON-LD
      mobile-menu.js         # Hamburger menu vanilla JS
    templates/
      partials/
        navigation.html      # Navigation sidebar partial
        breadcrumb.html      # Breadcrumb partial
        mobile-menu.html     # Mobile menu partial
    css/
      navigation.css         # Navigation styles (sidebar, mobile, active states)
```

### Technical Constraints

- Zero external JS dependencies (vanilla JS only)
- CSS-only animations for menu transitions preferred
- Navigation must support 30+ pages without performance degradation (Epic B)
- JSON-LD structured data for breadcrumbs (SEO preparation)

### PM Adjustment Notes

- Moved from position 8 to position 1 per PM validation: "Navigation scaffolding enables incremental page testing and delivery"
- Placeholder links allow parallel development of other Epic A stories

---

## File List

| File | Action | Description |
|------|--------|-------------|
| `packages/static-generator/src/navigation/nav-tree.js` | CREATE | Navigation tree data structure and builder |
| `packages/static-generator/src/navigation/nav-component.js` | CREATE | Sidebar HTML template generator |
| `packages/static-generator/src/navigation/breadcrumb.js` | CREATE | Breadcrumb generator with JSON-LD |
| `packages/static-generator/src/navigation/mobile-menu.js` | CREATE | Mobile hamburger menu logic |
| `packages/static-generator/src/templates/partials/navigation.html` | CREATE | Navigation sidebar HTML partial |
| `packages/static-generator/src/templates/partials/breadcrumb.html` | CREATE | Breadcrumb HTML partial |
| `packages/static-generator/src/css/navigation.css` | CREATE | Navigation styles |
| `packages/static-generator/src/brand-book-generator.js` | MODIFY | Integrate new navigation into page generation |
| `tests/static-generator/navigation/` | CREATE | Unit tests for nav tree, breadcrumb |

---

## QA Results

### Review Date: 2026-03-27 (Re-run)

### Reviewed By: Quinn (Test Architect)

**Verdict: CONCERNS**

**Summary:** Navigation tree data structure, breadcrumb generation, section icons, placeholder links, active state detection, and 34 unit tests are all fully implemented in `src/navigation/nav-tree.ts` (260 lines). The `templates/layout.eta` template (132 lines) contains hierarchical sidebar, collapsible sections via `<details>`, mobile hamburger menu via CSS checkbox hack, breadcrumb trail with JSON-LD, and backward-compatible flat list fallback. However, the render pipeline in `static-generator.ts` does NOT import `buildNavigationTree` or `generateBreadcrumbs`, so the template receives neither `it.navigationTree` nor `it.breadcrumbs`, causing it to fall back to the flat page list at runtime.

**Evidence:**

**Code Files Verified:**
- `src/navigation/nav-tree.ts` (260 lines): NavSection, NavItem, Breadcrumb, BreadcrumbResult interfaces; SECTION_ICONS (6 SVG icons); NAVIGATION_TREE (6 sections, 19 pages); buildNavigationTree(), getNavItems(), findNavItem(), findParentSection(), isActiveSection(), generateBreadcrumbs(), getSectionIcon()
- `src/navigation/index.ts` (18 lines): Barrel exports all functions and types
- `templates/layout.eta` (132 lines): Hierarchical nav with `it.navigationTree`, `<details>` collapsible sections, hamburger toggle via checkbox, breadcrumb trail with JSON-LD, flat list fallback via `it.pages`
- `src/__tests__/navigation.test.ts` (311 lines): 34 tests across 8 describe blocks

**AC Traceability:**

| AC | Status | Evidence |
|----|--------|----------|
| AC-1 Hierarchical Navigation Tree | MET | `nav-tree.ts` lines 67-126: NAVIGATION_TREE with 6 sections (home, guidelines, foundations, identity, icons, about), `layout.eta` lines 44-75: `<details>` collapsible sections |
| AC-2 Section Icons | MET | `nav-tree.ts` lines 52-59: SECTION_ICONS with 6 inline SVGs (home, guidelines, foundations, identity, icons, about), `layout.eta` line 51/57: `<%~ section.icon %>` |
| AC-3 Mobile Navigation | MET | `layout.eta` lines 18-25: hamburger checkbox toggle + mobile header, CSS in `static-generator.ts` provides mobile styles with 44px min touch targets |
| AC-4 Breadcrumb Navigation | MET | `nav-tree.ts` lines 204-248: generateBreadcrumbs() produces items + JSON-LD BreadcrumbList, `layout.eta` lines 10-12 and 91-107: breadcrumb rendering with JSON-LD in head |
| AC-5 Active State Highlighting | MET | `layout.eta` lines 47-48: `nav-section--active` on parent, line 64: `nav-item--active` on current page with `aria-current="page"` |
| AC-6 Placeholder Links | MET | `nav-tree.ts` lines 82, 106-107: manifesto, moodboard, movement-strategy marked `placeholder: true` with `path: '#'`, `layout.eta` line 64: `nav-item--placeholder` class + "Soon" badge |
| AC-7 Existing Pages Preserved | MET | `nav-tree.ts` lines 73, 81, 90-98, 105, 115: All 10 existing pages present with correct paths, navigation.test.ts lines 60-78: verifies all existing slugs |
| AC-8 Static HTML/CSS/JS Only | MET | `layout.eta` uses vanilla JS only (lines 119-130), CSS checkbox hack for hamburger, no npm dependencies |
| AC-9 Responsive Layout | MET | `layout.eta` line 28: sidebar with `role="navigation"`, CSS `--sidebar-width: 260px`, mobile collapse via hamburger |
| AC-10 Tests (34) | MET | `navigation.test.ts` 311 lines: buildNavigationTree (4), getNavItems (4), findNavItem (4), findParentSection (4), isActiveSection (4), generateBreadcrumbs (7), getSectionIcon (3), backward compatibility (4) |

**Concern:**
- ARCH-001 (medium): `static-generator.ts` does not import `buildNavigationTree` or `generateBreadcrumbs` from `navigation/nav-tree`. Template data object lacks `navigationTree` and `breadcrumbs` keys, so `layout.eta` falls back to flat `it.pages` list at runtime. The hierarchical navigation and breadcrumbs are implemented but not wired in.

### Gate Status

Gate: CONCERNS -> docs/qa/gates/bss-a.8-navigation-enhancement.yml

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-26 | 0.1 | Story draft created | River (@sm) |
| 2026-03-30 | 0.2 | PO validation GO (8.7/10). Should-fix: (1) Add explicit list of all 10 existing page slugs to Dev Notes for backward compat verification, (2) QA CONCERNS note: wiring gap in static-generator.ts must be addressed during implementation | Pax (@po) |
| 2026-03-30 | 0.3 | All ACs implemented. 34 navigation tests passing. QA CONCERNS wiring gap resolved (static-generator.ts imports + uses buildNavigationTree and generateBreadcrumbs). Status → Done | Dex (@dev) |
