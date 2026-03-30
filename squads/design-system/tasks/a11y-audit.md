# a11y-audit

```yaml
task: a11yAudit()
agent: a11y-auditor
squad: design-system

inputs:
  - name: target
    type: string
    required: true
    description: Component path or URL to audit
  - name: level
    type: enum
    values: [A, AA, AAA]
    default: AA

outputs:
  - name: audit_report
    type: markdown
    destination: .aiox/design-system/{project}/a11y/{component}-a11y-report.md
  - name: issues_json
    type: json
    destination: .aiox/design-system/{project}/a11y/{component}-issues.json

tools:
  - axe-core
  - lighthouse
```

## Purpose

Run a comprehensive WCAG 2.2 accessibility audit on design system components. Checks contrast ratios, keyboard navigation, ARIA usage, screen reader compatibility, motion preferences, and touch target sizing. Produces a detailed report with severity-ranked issues and specific remediation guidance.

## Workflow

### Phase 1: Automated Audit
```yaml
steps:
  - run_axe_core: Execute axe-core on component, capture all violations
  - run_lighthouse_a11y: Run Lighthouse accessibility audit
  - check_contrast: Measure contrast ratios for all text/background pairs
  - check_focus: Verify :focus-visible styles exist for interactive elements
  - check_motion: Verify prefers-reduced-motion is respected
```

### Phase 2: Structural Review
```yaml
steps:
  - check_semantic_html: Verify semantic elements used (not div soup)
  - check_heading_hierarchy: Verify heading levels are logical (no skipped levels)
  - check_landmarks: Verify ARIA landmarks are present and correct
  - check_form_labels: Verify all form inputs have associated labels
  - check_alt_text: Verify all images have meaningful alt text
  - check_lang: Verify lang attribute on HTML element
```

### Phase 3: Keyboard Audit
```yaml
steps:
  - test_tab_order: Verify tab order follows visual layout
  - test_focus_trap: Verify focus is trapped in modals/dialogs
  - test_skip_link: Verify skip-to-content link exists (page level)
  - test_escape: Verify Escape closes overlays
  - test_arrow_keys: Verify arrow key navigation for menus/tabs
  - test_no_keyboard_trap: Verify user can always Tab away from any element
```

### Phase 4: Screen Reader Audit
```yaml
steps:
  - verify_accessible_names: All interactive elements have accessible names
  - verify_live_regions: Dynamic content updates use aria-live
  - verify_error_messages: Form errors are announced
  - verify_state_changes: State changes (expanded, selected, checked) are announced
  - verify_reading_order: DOM order matches visual order
```

### Phase 5: Report
```yaml
steps:
  - categorize_issues: Group by severity (critical, serious, moderate, minor)
  - map_to_wcag: Map each issue to specific WCAG 2.2 success criteria
  - write_remediation: Provide specific fix for each issue
  - calculate_score: Compute accessibility score (pass/total criteria)
  - generate_report: Produce detailed markdown report
```

## Issue Severity

| Severity | Definition | Action |
|----------|-----------|--------|
| **Critical** | Prevents access for users with disabilities | Must fix immediately |
| **Serious** | Significant barrier to access | Fix before release |
| **Moderate** | Creates difficulty but not a barrier | Fix in next iteration |
| **Minor** | Best practice improvement | Fix when possible |

## Pre-Conditions

- [ ] Component or page is renderable
- [ ] axe-core is available

## Post-Conditions

- [ ] Audit report generated with all issues
- [ ] Each issue mapped to WCAG 2.2 success criteria
- [ ] Remediation guidance provided per issue

## Acceptance Criteria

- [ ] All WCAG 2.2 Level AA criteria tested (or Level AAA if specified)
- [ ] Contrast ratios measured for every text/background pair
- [ ] Keyboard navigation tested for all interactive elements
- [ ] Screen reader compatibility verified
- [ ] Report includes severity, WCAG reference, and specific fix per issue

## Quality Gate
- Threshold: >70%
- All WCAG 2.2 Level AA criteria tested with axe-core (zero critical violations)
- Each issue mapped to specific WCAG success criterion with remediation guidance
- Keyboard navigation verified for all interactive elements (tab order, focus trap, escape)

---
*Design System Squad Task - a11y-auditor*
