# accessibility-check

```yaml
task: accessibilityCheck()
agent: qa-reviewer
squad: branding
prd_refs: [NFR-2.1, CON-9]

inputs:
  - name: deliverable
    type: WebDeliverable
    required: true
  - name: compliance_level
    type: enum
    values: [A, AA, AAA]
    default: AA

outputs:
  - name: accessibility_report
    type: markdown
    destination: .aiox/branding/{client}/qa/accessibility-{page_id}.md
  - name: issues_json
    type: json
    destination: .aiox/branding/{client}/qa/a11y-issues-{page_id}.json

tools:
  - axe-core
  - lighthouse
  - pa11y
```

## Purpose

Validate WCAG compliance for all web deliverables (landing pages, brand book sites).

## WCAG Requirements

### Level A (Minimum)
```yaml
level_a:
  perceivable:
    - non_text_content: "Alt text for images"
    - audio_video_alternatives: "Captions, transcripts"
    - info_relationships: "Semantic HTML"
    - sensory_characteristics: "Not color-only"

  operable:
    - keyboard_accessible: "All functions via keyboard"
    - no_keyboard_traps: "Can navigate away"
    - timing_adjustable: "Can extend time limits"
    - seizure_safe: "No flashing > 3/sec"
    - navigable: "Skip links, page titles"

  understandable:
    - readable: "Language defined"
    - predictable: "Consistent navigation"
    - input_assistance: "Error identification"

  robust:
    - compatible: "Valid HTML, ARIA"
```

### Level AA (Target for MVP)
```yaml
level_aa:
  includes: all_level_a

  additional:
    - contrast_minimum: "4.5:1 normal, 3:1 large text"
    - resize_text: "200% without loss"
    - images_of_text: "Avoid (exceptions apply)"
    - reflow: "No horizontal scroll at 320px"
    - non_text_contrast: "3:1 for UI components"
    - text_spacing: "Adjustable without breaking"
    - content_on_hover: "Dismissible, hoverable"
    - multiple_ways: "Multiple ways to find pages"
    - headings_labels: "Descriptive headings"
    - focus_visible: "Visible focus indicator"
    - consistent_navigation: "Same order across pages"
    - consistent_identification: "Same function, same name"
    - error_suggestion: "Suggest corrections"
    - error_prevention: "Reversible, confirmable"
```

### Level AAA (Out of Scope for MVP)
```yaml
level_aaa:
  note: "Not required for MVP per CON-9"
  examples:
    - contrast_enhanced: "7:1 normal text"
    - low_or_no_background_audio
    - sign_language
    - extended_audio_description
```

## Automated Checks

```yaml
automated_tools:
  axe_core:
    purpose: "DOM-based accessibility testing"
    checks:
      - color_contrast
      - aria_roles
      - form_labels
      - heading_order
      - link_names
      - image_alt

  lighthouse:
    purpose: "Comprehensive audit"
    score_target: ">= 95"
    checks:
      - accessibility_score
      - best_practices
      - performance_impact

  pa11y:
    purpose: "WCAG standard mapping"
    standard: WCAG2AA
    checks:
      - all_wcag2aa_criteria
```

## Manual Checks

```yaml
manual_checks:
  keyboard_navigation:
    - tab_through_all_interactive
    - logical_focus_order
    - visible_focus_indicator
    - no_keyboard_traps
    - skip_link_functional

  screen_reader:
    - page_title_announces
    - headings_structure_logical
    - images_describe_content
    - forms_announce_labels
    - errors_announced
    - live_regions_work

  zoom_reflow:
    - 200%_zoom_no_horizontal_scroll
    - content_remains_readable
    - functionality_preserved

  motion:
    - animations_respect_prefers_reduced_motion
    - no_auto_play_video_with_sound
```

## Check Process

```yaml
steps:
  - step: run_automated_tools
    tools: [axe-core, lighthouse, pa11y]
    collect: all_issues

  - step: categorize_issues
    by:
      - wcag_criterion
      - severity (critical, serious, moderate, minor)
      - impact (blocker, major, minor)

  - step: run_manual_checks
    checklist: manual_checks
    record: pass_fail_notes

  - step: calculate_compliance
    method: |
      compliance = (passed_criteria / total_criteria) * 100

  - step: generate_report
    include:
      - compliance_percentage
      - issues_by_severity
      - remediation_guidance
      - pass_fail_summary
```

## Report Format

```markdown
# Accessibility Report

**Page:** {page_name}
**URL:** {url}
**Standard:** WCAG 2.1 {level}
**Date:** {timestamp}

## Summary

| Metric | Value |
|--------|-------|
| Compliance Level | {AA/A/Fail} |
| Lighthouse Score | {score}/100 |
| Critical Issues | {count} |
| Total Issues | {count} |

## Issues by Severity

### Critical (Must Fix)
| Issue | WCAG | Location | Fix |
|-------|------|----------|-----|
| {issue} | {criterion} | {selector} | {how_to_fix} |

### Serious
...

### Moderate
...

### Minor
...

## Manual Check Results

| Check | Status | Notes |
|-------|--------|-------|
| Keyboard Navigation | ✅/❌ | {notes} |
| Screen Reader | ✅/❌ | {notes} |
| Zoom/Reflow | ✅/❌ | {notes} |

## Remediation Priority

1. {highest_priority_fix}
2. {second_priority_fix}

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [How to Fix: {common_issue}]({link})
```

## Pre-Conditions

- [ ] Web deliverable deployed or locally testable
- [ ] Target compliance level defined

## Post-Conditions

- [ ] Automated scan complete
- [ ] Manual checks performed
- [ ] Report generated

## Acceptance Criteria

- [ ] WCAG AA compliance achieved
- [ ] No critical issues
- [ ] Lighthouse accessibility >= 95

## Quality Gate

- Threshold: >70%
- WCAG AA minimum compliance verified
- No critical accessibility issues remaining
- Lighthouse accessibility score >= 95

---
*Branding Squad Task - qa-reviewer*
