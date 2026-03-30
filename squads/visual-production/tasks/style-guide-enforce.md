# style-guide-enforce

```yaml
task:
  id: style-guide-enforce
  name: Enforce Brand Style Guide
  agent: art-director
  squad: visual-production
  type: review
  elicit: false

inputs:
  required:
    - assets_to_review: "List of visual assets to review"
    - style_guide: "Brand style guide or visual direction document"
  optional:
    - tolerance_level: "strict, moderate, or lenient"
    - previous_violations: "Known recurring violations"

outputs:
  - compliance-report.md: "Detailed compliance report per asset"
  - violation-log.md: "List of violations with severity"
  - fix-recommendations.md: "Actionable fixes for each violation"

pre_conditions:
  - "Style guide or visual direction document available"
  - "Assets to review are accessible"

post_conditions:
  - "Every asset reviewed against style guide"
  - "Violations categorized by severity"
  - "Fix recommendations provided for each violation"
  - "Overall compliance score calculated"
```

## Purpose

Review visual assets against the brand style guide and flag any violations. Provides actionable feedback to bring assets into compliance.

## Workflow

### Phase 1: Style Guide Load (5 min)
1. Load brand style guide / visual direction document
2. Extract key checkpoints: colors, typography, composition, imagery
3. Identify critical vs. advisory rules
4. Note any context-specific exceptions

### Phase 2: Asset Inventory (5 min)
1. List all assets to review
2. Categorize by type (hero, social, icon, motion, etc.)
3. Note intended usage context for each asset
4. Prioritize review order (customer-facing first)

### Phase 3: Compliance Check (20 min per asset batch)
For each asset, check:

**Color Compliance:**
- [ ] Uses only approved palette colors
- [ ] Color ratios match guide (60/30/10 or as specified)
- [ ] Contrast ratios meet WCAG AA (4.5:1 text, 3:1 large text)
- [ ] No unauthorized color modifications

**Typography Compliance:**
- [ ] Uses approved font families only
- [ ] Weight hierarchy matches guide
- [ ] Size scale follows specification
- [ ] Line height and letter spacing correct

**Composition Compliance:**
- [ ] Grid alignment matches guide
- [ ] Safe zones respected
- [ ] Whitespace proportions appropriate
- [ ] Visual hierarchy clear

**Imagery Compliance:**
- [ ] Photography style matches direction
- [ ] Color grading consistent
- [ ] Subject treatment aligned
- [ ] No prohibited visual elements

### Phase 4: Severity Classification
| Severity | Definition | Action |
|----------|-----------|--------|
| **Critical** | Brand identity compromised | Must fix before use |
| **Major** | Noticeable inconsistency | Fix before next review |
| **Minor** | Subtle deviation | Fix when convenient |
| **Advisory** | Suggestion for improvement | Optional |

### Phase 5: Report Generation (10 min)
1. Calculate overall compliance score
2. List violations grouped by severity
3. Provide specific fix instructions per violation
4. Highlight patterns (recurring issues across assets)

## Compliance Report Template

```markdown
# Style Guide Compliance Report

**Date:** [YYYY-MM-DD]
**Reviewer:** Vincent (art-director)
**Assets Reviewed:** [count]
**Overall Score:** [X]%

## Summary
| Severity | Count |
|----------|-------|
| Critical | [N] |
| Major | [N] |
| Minor | [N] |
| Advisory | [N] |

## Violations
### [Asset Name]
- **Issue:** [description]
- **Severity:** [level]
- **Rule:** [style guide reference]
- **Fix:** [specific action to resolve]
```

## Acceptance Criteria

- [ ] All provided assets reviewed against style guide
- [ ] Violations categorized by severity
- [ ] Specific fix recommendations for each violation
- [ ] Overall compliance score calculated
- [ ] Report structured for easy action

## Quality Gate
- Threshold: >70%
- All assets reviewed against the active style guide
- Violations categorized by severity with fix recommendations
- Overall compliance score calculated and documented

---
*Visual Production Squad Task*
