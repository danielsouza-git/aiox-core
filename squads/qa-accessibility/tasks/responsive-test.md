# responsive-test

```yaml
task:
  id: responsive-test
  name: Responsive Behavior Testing
  agent: visual-qa
  squad: qa-accessibility
  type: testing
  elicit: true

inputs:
  required:
    - target_url: "URL to test responsive behavior"
  optional:
    - breakpoints: "Custom breakpoints (default: 320, 768, 1024, 1440, 1920)"
    - pages: "List of pages/routes to test"
    - orientation: "Portrait, landscape, or both (default: both for tablet)"

outputs:
  - responsive_report.md: "Responsive behavior report"
  - screenshots/: "Screenshots at each breakpoint"
  - breakpoint_issues.md: "Issues found at specific breakpoints"

pre_conditions:
  - "Target URL accessible"
  - "Responsive design specs available"

post_conditions:
  - "All breakpoints tested"
  - "Layout shifts documented"
  - "Content reflow verified"
  - "Touch targets validated for mobile"
```

## Purpose

Test responsive behavior at all standard breakpoints (320px, 768px, 1024px, 1440px, 1920px) to verify layout adapts correctly, content reflows properly, and no content is hidden or broken at any width.

## Workflow

### Phase 1: Breakpoint Sweep (15 min)
For each breakpoint, verify:

#### 320px - Mobile Small
- [ ] Single-column layout
- [ ] Navigation collapses to hamburger
- [ ] Images resize or stack
- [ ] Text readable without horizontal scroll
- [ ] Touch targets >= 44x44px
- [ ] No horizontal overflow

#### 768px - Tablet
- [ ] Appropriate column layout (1-2 columns)
- [ ] Navigation adapts (may show partial)
- [ ] Images resize appropriately
- [ ] Sidebar behavior (collapse or stack)
- [ ] Portrait and landscape tested

#### 1024px - Desktop Small
- [ ] Full desktop layout begins
- [ ] Navigation fully visible
- [ ] Multi-column layout active
- [ ] Sidebars visible if applicable

#### 1440px - Desktop Standard
- [ ] Primary design viewport
- [ ] All elements at designed sizes
- [ ] Max-width containers centered
- [ ] Full feature set visible

#### 1920px - Desktop Large
- [ ] No stretched elements
- [ ] Max-width respected
- [ ] Background fills gracefully
- [ ] No awkward whitespace

### Phase 2: Transition Testing (10 min)
1. Slowly resize browser from 320px to 1920px
2. Watch for layout jumps or shifts
3. Note exact pixels where layout breaks
4. Verify smooth transitions between breakpoints

### Phase 3: Content Verification (10 min)
1. No content hidden at any breakpoint
2. No text truncation without indication
3. Images have appropriate srcset/sizes
4. Tables adapt (scroll or reflow)
5. Forms usable at all sizes
6. Modals/overlays fit viewport

### Phase 4: Touch & Interaction (5 min)
At mobile breakpoints:
1. Touch targets >= 44x44px (WCAG)
2. Swipe gestures work if implemented
3. No hover-only interactions
4. Tap delays eliminated
5. Scroll behavior smooth

## Breakpoint Reference

| Breakpoint | Width | Device Class | Columns |
|------------|-------|-------------|---------|
| Mobile S | 320px | Small phones | 1 |
| Mobile L | 375px | Standard phones | 1 |
| Tablet P | 768px | iPad portrait | 1-2 |
| Tablet L | 1024px | iPad landscape | 2-3 |
| Desktop | 1440px | Laptop/monitor | 3-4 |
| Desktop XL | 1920px | Large monitor | 3-4 |

## Acceptance Criteria

- [ ] All 5 standard breakpoints tested
- [ ] No horizontal overflow at any breakpoint
- [ ] Content accessible at all sizes
- [ ] Touch targets meet 44x44px minimum
- [ ] Smooth transitions between breakpoints
- [ ] Screenshots captured at each breakpoint
- [ ] Report generated with issues

## Quality Gate
- Threshold: >70%
- All 5 standard breakpoints (320, 768, 1024, 1440, 1920) tested with screenshots
- Zero horizontal overflow issues at any breakpoint
- Touch targets meet 44x44px minimum at mobile breakpoints

---
*QA Accessibility Squad Task - visual-qa*
