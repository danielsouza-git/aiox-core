# review-deliverable

```yaml
task: reviewDeliverable()
agent: qa-reviewer
squad: branding
prd_refs: [FR-8.5]

inputs:
  - name: deliverable
    type: Deliverable
    required: true
  - name: deliverable_type
    type: enum
    values: [brand_book, landing_page, social_post, email, video]
    required: true
  - name: brand_profile
    type: BrandProfile
    required: true

outputs:
  - name: review_report
    type: ReviewReport
    destination: .aiox/branding/{client}/reviews/{deliverable_id}-review.md
  - name: checklist_result
    type: json
    destination: .aiox/branding/{client}/reviews/{deliverable_id}-checklist.json

tools:
  - qa-checklist-runner
  - accessibility-checker
  - link-validator
```

## Purpose

Execute quality review checklist before client delivery for any deliverable type.

## Review Checklists by Type

### Brand Identity (7 items)
```yaml
brand_identity:
  - item: Logo files complete (all variants, formats)
    check: file_count >= expected
  - item: Color palette documented with hex/rgb/cmyk
    check: all_colors_have_codes
  - item: Typography system defined with weights
    check: font_files_present
  - item: Brand voice guide complete (8+ pages)
    check: page_count >= 8
  - item: Design tokens exported in required formats
    check: css_scss_json_present
  - item: Asset naming follows convention
    check: naming_pattern_match
  - item: No placeholder content remaining
    check: no_lorem_ipsum
```

### Social Media (6 items)
```yaml
social_media:
  - item: Dimensions match platform specs
    check: size_validation
  - item: Text within safe zones
    check: safe_zone_validation
  - item: Brand colors applied correctly
    check: color_match
  - item: Logo placement consistent
    check: logo_position
  - item: File size within limits
    check: file_size < platform_max
  - item: Caption copy reviewed
    check: copy_approved
```

### Web Design (8 items)
```yaml
web_design:
  - item: Responsive at all breakpoints (320-1920)
    check: breakpoint_test
  - item: Touch targets >= 44x44px on mobile
    check: touch_target_size
  - item: All links functional
    check: link_validation
  - item: Images optimized (WebP, lazy load)
    check: image_optimization
  - item: Forms functional with validation
    check: form_test
  - item: WCAG AA color contrast
    check: contrast_ratio >= 4.5
  - item: Meta tags complete
    check: seo_validation
  - item: Performance (Lighthouse > 90)
    check: lighthouse_score
```

### Email (8 items)
```yaml
email:
  - item: Total size < 102KB
    check: file_size < 102000
  - item: Table-based layout (email client compat)
    check: html_structure
  - item: Alt text on all images
    check: alt_text_present
  - item: Unsubscribe link present
    check: unsubscribe_link
  - item: Preheader text optimized
    check: preheader_present
  - item: Mobile responsive (320px+)
    check: mobile_render
  - item: Subject line variants (3+)
    check: subject_count >= 3
  - item: CTA buttons visible
    check: cta_visible
```

### Motion/Video (7 items)
```yaml
motion:
  - item: Resolution correct (1080p/4K)
    check: resolution_match
  - item: Frame rate correct (30/60fps)
    check: framerate_match
  - item: Audio levels normalized
    check: audio_levels
  - item: Brand colors in motion
    check: color_accuracy
  - item: File format correct (MP4 H.264)
    check: codec_validation
  - item: Duration within spec
    check: duration_check
  - item: No watermarks/artifacts
    check: visual_quality
```

## Review Process

```yaml
steps:
  - step: identify_checklist
    select: based_on_deliverable_type

  - step: run_automated_checks
    execute: programmatic_validations
    record: pass_fail_per_item

  - step: run_manual_checks
    prompt: reviewer for subjective items
    record: pass_fail_with_notes

  - step: calculate_score
    method: pass_percentage
    threshold:
      pass: >= 90%
      review: 70-89%
      fail: < 70%

  - step: generate_report
    include:
      - checklist_results
      - failed_items_detail
      - recommendations
      - overall_verdict

  - step: update_status
    if: pass
    then: ready_for_client
    else: return_for_fixes
```

## Report Format

```markdown
# QA Review Report

**Deliverable:** {name}
**Type:** {type}
**Reviewer:** Quentin (QA)
**Date:** {timestamp}

## Summary

| Metric | Value |
|--------|-------|
| Items Checked | {total} |
| Passed | {passed} |
| Failed | {failed} |
| Score | {percentage}% |
| **Verdict** | ✅ PASS / ⚠️ REVIEW / ❌ FAIL |

## Checklist Results

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | {item} | ✅/❌ | {notes} |

## Failed Items (Action Required)

### {failed_item_1}
- **Issue:** {description}
- **Fix:** {recommendation}
- **Priority:** High/Medium/Low

## Recommendations

1. {recommendation}

## Next Steps

- [ ] Fix failed items
- [ ] Re-submit for review
- [ ] OR approve with noted exceptions
```

## Pre-Conditions

- [ ] Deliverable complete
- [ ] Brand profile available
- [ ] Checklist defined for type

## Post-Conditions

- [ ] Review executed
- [ ] Report generated
- [ ] Status updated

## Acceptance Criteria

- [ ] All items checked
- [ ] Clear pass/fail verdict
- [ ] Actionable fix recommendations
- [ ] Ready for client (if passed)

## Quality Gate

- Threshold: >70%
- All checklist items evaluated with clear pass/fail verdict
- Failed items include actionable fix recommendations
- Overall score calculated and verdict rendered (PASS/REVIEW/FAIL)

---
*Branding Squad Task - qa-reviewer*
