# contrast-check

```yaml
task: contrastCheck()
agent: qa-reviewer
squad: branding
prd_refs: [NFR-2.1, FR-1.4]

inputs:
  - name: color_palette
    type: ColorPalette
    required: true
  - name: usage_context
    type: UsageContext
    required: false

outputs:
  - name: contrast_report
    type: markdown
    destination: .aiox/branding/{client}/qa/contrast-report.md
  - name: contrast_matrix
    type: json
    destination: .aiox/branding/{client}/qa/contrast-matrix.json

tools:
  - color-contrast-checker
```

## Purpose

Validate WCAG color contrast ratios for all color combinations in the palette.

## WCAG Contrast Requirements

```yaml
requirements:
  AA_normal_text:
    ratio: ">= 4.5:1"
    applies_to: "Text < 18pt (or < 14pt bold)"

  AA_large_text:
    ratio: ">= 3:1"
    applies_to: "Text >= 18pt (or >= 14pt bold)"

  AA_ui_components:
    ratio: ">= 3:1"
    applies_to: "UI components, graphical objects"

  AAA_normal_text:
    ratio: ">= 7:1"
    applies_to: "Enhanced contrast for normal text"

  AAA_large_text:
    ratio: ">= 4.5:1"
    applies_to: "Enhanced contrast for large text"
```

## Color Pairs to Check

```yaml
mandatory_pairs:
  text_on_backgrounds:
    - text_primary on background_default
    - text_primary on background_surface
    - text_secondary on background_default
    - text_secondary on background_surface
    - text_on_primary on primary_500
    - text_on_secondary on secondary_500

  interactive_elements:
    - primary_500 on white
    - primary_500 on background_default
    - secondary_500 on white
    - link_color on background_default

  semantic_colors:
    - success_text on success_background
    - warning_text on warning_background
    - error_text on error_background
    - info_text on info_background

  dark_mode:
    - text_primary_dark on background_dark
    - text_secondary_dark on background_dark
    - primary_500 on background_dark
```

## Contrast Calculation

```yaml
formula: |
  Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)

  Where:
  - L1 = relative luminance of lighter color
  - L2 = relative luminance of darker color
  - Relative luminance calculated per WCAG formula

luminance_calculation: |
  For each RGB component:
  - Divide by 255
  - If <= 0.03928: value / 12.92
  - Else: ((value + 0.055) / 1.055) ^ 2.4

  L = 0.2126 * R + 0.7152 * G + 0.0722 * B
```

## Check Process

```yaml
steps:
  - step: extract_colors
    from: color_palette
    collect: all_named_colors

  - step: identify_pairs
    method: usage_based + comprehensive
    pairs: mandatory_pairs + all_combinations

  - step: calculate_ratios
    per_pair: contrast_ratio
    record: [color1, color2, ratio]

  - step: evaluate_compliance
    per_pair:
      - aa_normal: ratio >= 4.5
      - aa_large: ratio >= 3.0
      - aaa_normal: ratio >= 7.0
      - aaa_large: ratio >= 4.5

  - step: generate_matrix
    format: all_pairs_with_ratios

  - step: identify_failures
    collect: pairs_below_threshold

  - step: suggest_fixes
    for_each_failure:
      - adjust_lightness
      - suggest_alternative_from_palette

  - step: generate_report
    include:
      - summary
      - failures
      - matrix
      - recommendations
```

## Contrast Matrix Output

```json
{
  "pairs": [
    {
      "foreground": "#1a1a1a",
      "background": "#ffffff",
      "ratio": 16.1,
      "aa_normal": true,
      "aa_large": true,
      "aaa_normal": true,
      "aaa_large": true,
      "usage": "text-primary on background"
    }
  ],
  "summary": {
    "total_pairs": 45,
    "aa_pass": 42,
    "aa_fail": 3,
    "aaa_pass": 38
  }
}
```

## Report Format

```markdown
# Color Contrast Report

**Client:** {client_name}
**Date:** {timestamp}
**Standard:** WCAG 2.1

## Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| Total Pairs Checked | {total} | - |
| AA Pass (Normal) | {count} | {%} |
| AA Pass (Large) | {count} | {%} |
| AAA Pass (Normal) | {count} | {%} |
| **Failures** | {count} | {%} |

## Failing Combinations

| Foreground | Background | Ratio | Required | Usage |
|------------|------------|-------|----------|-------|
| {color} | {color} | {ratio} | 4.5:1 | {usage} |

### Fix Recommendations

**{pair_name}**
- Current ratio: {ratio}
- Required: {required}
- Suggestion: Darken {color} to {suggested_hex} (ratio: {new_ratio})

## Passing Combinations

### Primary Use Cases
| Pair | Ratio | AA | AAA |
|------|-------|----|----|
| text on white | 16.1:1 | ✅ | ✅ |

## Full Contrast Matrix

[See contrast-matrix.json]

## Visual Preview

[Color swatches with pass/fail indicators]
```

## Pre-Conditions

- [ ] Color palette finalized
- [ ] Usage contexts defined

## Post-Conditions

- [ ] All pairs checked
- [ ] Matrix generated
- [ ] Failures documented

## Acceptance Criteria

- [ ] All mandatory pairs AA compliant
- [ ] Fix suggestions for failures
- [ ] Documentation complete

## Quality Gate

- Threshold: >70%
- All text/background pairs tested for WCAG contrast ratios
- Fix suggestions provided for any failing pairs
- Report includes both AA and AAA pass/fail status

---
*Branding Squad Task - qa-reviewer*
