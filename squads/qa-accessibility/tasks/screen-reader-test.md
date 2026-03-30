# screen-reader-test

```yaml
task:
  id: screen-reader-test
  name: Screen Reader Compatibility Test
  agent: a11y-tester
  squad: qa-accessibility
  type: testing
  elicit: true

inputs:
  required:
    - target_url: "URL to test with screen readers"
  optional:
    - screen_readers: "Specific readers to test (default: VoiceOver, NVDA)"
    - pages: "List of pages/routes to test"
    - focus_areas: "Specific components to focus on"

outputs:
  - screen_reader_report.md: "Screen reader test results"
  - reading_order_map.md: "Document reading order analysis"
  - landmark_audit.md: "ARIA landmarks and roles audit"

pre_conditions:
  - "Target URL accessible"
  - "Screen reader test methodology defined"

post_conditions:
  - "Reading order verified"
  - "Landmarks tested"
  - "All interactive elements announce correctly"
  - "Form flow tested end-to-end"
```

## Purpose

Test web deliverables with screen readers (VoiceOver on macOS, NVDA on Windows) to verify reading order, landmark navigation, alt text quality, form label announcements, and overall assistive technology compatibility.

## Workflow

### Phase 1: Reading Order (10 min)
1. Navigate page with screen reader from top to bottom
2. Verify logical reading order matches visual order
3. Check that hidden content is not announced
4. Verify skip links work and announce correctly
5. Document the complete reading sequence

### Phase 2: Landmarks & Structure (10 min)
1. **Navigate by landmarks** (VoiceOver: VO + U, NVDA: D key)
   - `<header>` / `role="banner"` present
   - `<nav>` / `role="navigation"` present and labeled
   - `<main>` / `role="main"` present
   - `<footer>` / `role="contentinfo"` present
   - `<aside>` / `role="complementary"` if applicable

2. **Navigate by headings** (H key)
   - H1 present and unique
   - Heading hierarchy logical (no skipped levels)
   - Headings describe section content

3. **Navigate by links** (K key / Tab)
   - All links have descriptive text (not "click here")
   - Links announce destination or purpose
   - External links indicated

### Phase 3: Image & Media (5 min)
1. All images announce alt text
2. Decorative images are hidden (`alt=""` or `aria-hidden`)
3. Complex images have extended descriptions
4. Video/audio has captions announced
5. Charts/graphs have text alternatives

### Phase 4: Forms & Interactive (10 min)
1. **Form fields** - Labels announced when focused
2. **Required fields** - Required state announced
3. **Error messages** - Errors announced via `aria-live` or focus
4. **Dropdowns** - Options navigable and announced
5. **Custom controls** - Role, name, state announced
6. **Modals** - Focus trapped, dismiss announced
7. **Accordions** - Expanded/collapsed state announced
8. **Tabs** - Tab role, selected state announced

### Phase 5: Dynamic Content (5 min)
1. Live regions (`aria-live`) announce updates
2. Loading states communicated
3. Toast notifications announced
4. Content changes after interaction announced
5. Route changes announce new page title

## Screen Reader Test Matrix

| Test | VoiceOver (macOS) | NVDA (Windows) |
|------|-------------------|----------------|
| Reading order | VO + Right Arrow | Down Arrow |
| Landmarks | VO + U (Landmarks) | D key |
| Headings | VO + U (Headings) | H key |
| Links | VO + U (Links) | K key |
| Forms | VO + U (Form Controls) | F key |

## Acceptance Criteria

- [ ] Complete reading order documented
- [ ] All landmarks present and labeled
- [ ] Heading hierarchy logical
- [ ] All images have appropriate alt text
- [ ] Forms fully accessible (labels, errors, required states)
- [ ] Dynamic content announces via live regions
- [ ] Custom controls announce role, name, state
- [ ] Report generated with pass/fail per area

## Quality Gate
- Threshold: >70%
- All ARIA landmarks present and correctly labeled (header, nav, main, footer)
- Heading hierarchy is logical with no skipped levels
- All form fields announce labels, required state, and error messages correctly

---
*QA Accessibility Squad Task - a11y-tester*
