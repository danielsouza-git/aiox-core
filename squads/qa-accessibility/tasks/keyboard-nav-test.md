# keyboard-nav-test

```yaml
task:
  id: keyboard-nav-test
  name: Keyboard Navigation Test
  agent: a11y-tester
  squad: qa-accessibility
  type: testing
  elicit: true

inputs:
  required:
    - target_url: "URL to test keyboard navigation"
  optional:
    - pages: "List of pages/routes to test"
    - focus_areas: "Specific components to focus on"

outputs:
  - keyboard_nav_report.md: "Keyboard navigation test results"
  - focus_order_map.md: "Tab order documentation"
  - trap_issues.md: "Keyboard trap findings"

pre_conditions:
  - "Target URL accessible"
  - "All interactive elements identifiable"

post_conditions:
  - "Full tab order documented"
  - "All interactive elements reachable"
  - "No keyboard traps found"
  - "Focus indicators visible"
```

## Purpose

Perform a complete keyboard navigation test ensuring all interactive elements are reachable, operable, and have visible focus indicators. Verify no keyboard traps exist and the tab order is logical.

## Workflow

### Phase 1: Tab Order Audit (10 min)
1. Start at the top of the page (refresh to reset focus)
2. Press Tab through every focusable element
3. Document the complete tab order sequence
4. Verify order matches visual layout (left-to-right, top-to-bottom)
5. Check for unexpected focus jumps
6. Verify Shift+Tab reverses the order correctly

### Phase 2: Focus Visibility (5 min)
1. **Focus indicator present** on every focusable element
2. **Focus indicator visible** against background (contrast >= 3:1)
3. **Focus indicator style** is consistent (outline, ring, or highlight)
4. **No focus indicator removal** via `outline: none` without replacement
5. **Custom focus styles** work in all browsers

### Phase 3: Interactive Controls (15 min)

| Control | Expected Keys | Test |
|---------|---------------|------|
| Links | Enter | Activates link |
| Buttons | Enter, Space | Activates button |
| Checkboxes | Space | Toggles checked state |
| Radio buttons | Arrow keys | Moves selection within group |
| Dropdowns | Enter to open, Arrows to navigate, Enter to select, Escape to close | Full flow |
| Menus | Enter/Space to open, Arrows to navigate, Escape to close | Full flow |
| Modals | Tab cycles within, Escape closes, focus returns | Full flow |
| Tabs | Arrow keys switch, Tab moves to panel | Full flow |
| Sliders | Arrow keys adjust value | Full flow |
| Date pickers | Navigate and select via keyboard | Full flow |
| Autocomplete | Type, Arrow to navigate, Enter to select | Full flow |

### Phase 4: Keyboard Traps (5 min)
1. Tab through the entire page looking for traps
2. Test all modal/dialog components (focus should trap then release)
3. Test all embedded content (iframes, videos, third-party widgets)
4. Test all custom dropdown/autocomplete components
5. Verify Escape key works as expected in all contexts

### Phase 5: Skip Navigation (5 min)
1. First Tab should reveal "Skip to content" link
2. Activating skip link moves focus to main content
3. Additional skip links if sidebar present
4. Skip links work consistently across all pages

### Phase 6: Report (5 min)
1. Compile pass/fail per control type
2. Document any keyboard traps
3. Note missing or invisible focus indicators
4. Provide remediation recommendations

## Key Bindings Reference

| Key | Action |
|-----|--------|
| Tab | Move to next focusable element |
| Shift + Tab | Move to previous focusable element |
| Enter | Activate link or button |
| Space | Activate button, toggle checkbox |
| Escape | Close modal, dropdown, menu |
| Arrow keys | Navigate within widget (radio, tabs, menu) |
| Home / End | Jump to first/last item in widget |

## Acceptance Criteria

- [ ] Complete tab order documented
- [ ] All interactive elements reachable via keyboard
- [ ] No keyboard traps detected
- [ ] Visible focus indicators on all focusable elements
- [ ] All control types operable with expected keys
- [ ] Skip navigation functional
- [ ] Report generated with findings

## Quality Gate
- Threshold: >70%
- Zero keyboard traps detected across all pages
- Visible focus indicator present on every focusable element with >= 3:1 contrast
- All interactive controls operable with expected keyboard keys (Enter, Space, Arrows, Escape)

---
*QA Accessibility Squad Task - a11y-tester*
