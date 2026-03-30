# a11y-remediate

```yaml
task: a11yRemediate()
agent: a11y-auditor
squad: design-system

inputs:
  - name: audit_report
    type: markdown
    required: true
    description: a11y audit report with identified issues
  - name: component_files
    type: object
    required: true
    description: Component HTML/CSS/JS files to fix
  - name: severity_filter
    type: enum
    values: [critical, serious, moderate, all]
    default: serious

outputs:
  - name: fixed_files
    type: object
    destination: .aiox/design-system/{project}/components/{level}/{name}/
  - name: remediation_log
    type: markdown
    destination: .aiox/design-system/{project}/a11y/{component}-remediation-log.md

tools:
  - axe-core
```

## Purpose

Fix accessibility issues identified in an a11y audit. Applies targeted remediations to component HTML, CSS, and JavaScript files. Verifies each fix resolves the issue without introducing regressions.

## Workflow

### Phase 1: Triage
```yaml
steps:
  - parse_issues: Extract all issues from audit report
  - filter_severity: Filter by severity threshold
  - order_by_impact: Sort by user impact (most impactful first)
  - group_by_type: Group related issues (e.g., all contrast issues together)
```

### Phase 2: HTML Remediation
```yaml
fixes:
  - add_aria_labels: Add aria-label or aria-labelledby to interactive elements
  - add_roles: Add missing ARIA roles
  - fix_heading_hierarchy: Adjust heading levels
  - add_alt_text: Add meaningful alt text to images
  - add_form_labels: Associate labels with form inputs
  - fix_semantic_html: Replace divs with semantic elements
  - add_live_regions: Add aria-live for dynamic content
```

### Phase 3: CSS Remediation
```yaml
fixes:
  - fix_contrast: Adjust colors to meet AA/AAA contrast ratios
  - add_focus_styles: Add :focus-visible outlines using tokens
  - fix_touch_targets: Ensure minimum 44x44px interactive areas
  - add_motion_preference: Add prefers-reduced-motion media query
  - fix_text_resize: Ensure text scales with user preferences
```

### Phase 4: JavaScript Remediation
```yaml
fixes:
  - add_keyboard_handlers: Add Enter/Space/Escape key handlers
  - add_focus_management: Implement focus trapping for overlays
  - add_arrow_navigation: Implement arrow key navigation for menus/tabs
  - add_state_announcements: Announce state changes via aria-live
  - prevent_keyboard_traps: Ensure user can always Tab away
```

### Phase 5: Verification
```yaml
steps:
  - rerun_axe: Run axe-core on fixed component
  - verify_fixes: Confirm each issue is resolved
  - check_regressions: Ensure fixes did not break other components
  - update_log: Document each fix with before/after
```

## Pre-Conditions

- [ ] a11y audit report exists with identified issues
- [ ] Component files are editable

## Post-Conditions

- [ ] All targeted issues fixed
- [ ] Verification confirms fixes resolve issues
- [ ] Remediation log documents all changes

## Acceptance Criteria

- [ ] All critical and serious issues fixed
- [ ] axe-core re-audit shows zero violations at target severity
- [ ] No regressions introduced
- [ ] Remediation log includes before/after for each fix

## Quality Gate
- Threshold: >70%
- axe-core re-audit shows zero violations at target severity level
- No accessibility regressions introduced by fixes (verified via re-audit)
- Remediation log documents before/after for each applied fix

---
*Design System Squad Task - a11y-auditor*
