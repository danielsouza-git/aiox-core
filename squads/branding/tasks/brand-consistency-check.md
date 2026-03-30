# brand-consistency-check

```yaml
task: brandConsistencyCheck()
agent: qa-reviewer
squad: branding
prd_refs: [NFR-7.3]

inputs:
  - name: deliverables
    type: DeliverableCollection
    required: true
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: design_tokens
    type: DesignTokens
    required: true

outputs:
  - name: consistency_report
    type: markdown
    destination: .aiox/branding/{client}/qa/consistency-report.md
  - name: variance_log
    type: json
    destination: .aiox/branding/{client}/qa/variance-log.json

tools:
  - color-analyzer
  - font-detector
  - style-comparator
```

## Purpose

Verify brand consistency across all deliverables: colors, typography, voice, and visual style.

## Consistency Dimensions

### Color Consistency
```yaml
color_check:
  source_of_truth: design_tokens.colors

  checks:
    - primary_colors_match:
        tolerance: 0 (exact hex match)
    - secondary_colors_match:
        tolerance: 0
    - semantic_colors_correct:
        usage: success/warning/error/info
    - no_off_brand_colors:
        detect: colors not in palette
    - contrast_maintained:
        standard: WCAG AA

  extraction_methods:
    images: dominant_color_extraction
    web: css_color_parsing
    documents: color_sampling
```

### Typography Consistency
```yaml
typography_check:
  source_of_truth: design_tokens.typography

  checks:
    - font_families_correct:
        match: approved fonts only
    - font_weights_appropriate:
        usage: per_guidelines
    - type_scale_followed:
        sizes: match_token_scale
    - line_heights_correct:
        match: token_values
    - no_unapproved_fonts:
        detect: fonts not in system
```

### Voice Consistency
```yaml
voice_check:
  source_of_truth: brand_profile.voice_guide

  checks:
    - tone_appropriate:
        match: channel_tone_spectrum
    - vocabulary_compliant:
        no_forbidden: forbidden_words_list
        uses_approved: when_appropriate
    - personality_reflected:
        traits: brand_adjectives
    - no_voice_violations:
        detect: off_brand_language
```

### Visual Style Consistency
```yaml
style_check:
  source_of_truth: brand_guidelines

  checks:
    - logo_usage_correct:
        placement: per_guidelines
        clear_space: maintained
        no_modifications: true
    - imagery_style_consistent:
        photography: matches_direction
        illustrations: consistent_style
    - layout_patterns_followed:
        spacing: uses_grid
        alignment: consistent
    - iconography_consistent:
        style: matches_icon_set
        stroke: consistent_weight
```

## Check Process

```yaml
steps:
  - step: collect_deliverables
    gather: all_items_for_review
    categorize: by_type

  - step: extract_brand_elements
    per_deliverable:
      - colors_used
      - fonts_used
      - copy_text
      - visual_elements

  - step: compare_to_source
    against: design_tokens + brand_profile
    record: matches + variances

  - step: calculate_consistency_score
    method: weighted_average
    weights:
      colors: 30%
      typography: 25%
      voice: 25%
      visual: 20%

  - step: identify_violations
    severity:
      critical: brand_breaking
      major: noticeable_inconsistency
      minor: slight_variance

  - step: generate_report
    include:
      - overall_score
      - dimension_scores
      - violations_list
      - recommendations
```

## Consistency Score

```yaml
scoring:
  calculation: weighted_average_of_dimensions

  thresholds:
    excellent: >= 95%
    good: 85-94%
    acceptable: 75-84%
    needs_work: < 75%

  per_dimension:
    colors:
      exact_match: 100%
      close_match (delta < 5): 90%
      off_brand: 0%
    typography:
      correct_font: 100%
      wrong_weight: 70%
      wrong_font: 0%
    voice:
      on_brand: 100%
      neutral: 80%
      off_brand: 0%
```

## Report Format

```markdown
# Brand Consistency Report

**Client:** {client_name}
**Date:** {timestamp}
**Deliverables Reviewed:** {count}

## Overall Score: {score}% ({rating})

| Dimension | Score | Status |
|-----------|-------|--------|
| Colors | {score}% | ✅/⚠️/❌ |
| Typography | {score}% | ✅/⚠️/❌ |
| Voice | {score}% | ✅/⚠️/❌ |
| Visual Style | {score}% | ✅/⚠️/❌ |

## Violations Found

### Critical
- {violation_description}
  - Location: {deliverable}
  - Fix: {recommendation}

### Major
- {violation_description}

### Minor
- {violation_description}

## Recommendations

1. {actionable_recommendation}

## Variance Log

[See variance-log.json for detailed data]
```

## Pre-Conditions

- [ ] Deliverables ready for review
- [ ] Design tokens finalized
- [ ] Brand profile complete

## Post-Conditions

- [ ] All deliverables checked
- [ ] Consistency score calculated
- [ ] Violations documented

## Acceptance Criteria

- [ ] Score >= 90% for approval
- [ ] No critical violations
- [ ] Clear fix recommendations

## Quality Gate

- Threshold: >70%
- All brand elements checked (logo, colors, typography, voice)
- No critical brand violations present
- Clear fix recommendations for any inconsistencies found

---
*Branding Squad Task - qa-reviewer*
