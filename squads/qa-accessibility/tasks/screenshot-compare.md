# screenshot-compare

```yaml
task:
  id: screenshot-compare
  name: Screenshot Comparison for Visual Regression
  agent: visual-qa
  squad: qa-accessibility
  type: testing
  elicit: true

inputs:
  required:
    - baseline_url: "URL or screenshots of the baseline version"
    - current_url: "URL or screenshots of the current version"
  optional:
    - threshold: "Pixel difference threshold percentage (default: 0.1%)"
    - pages: "Specific pages to compare"
    - viewport: "Viewport size (default: 1440px)"

outputs:
  - regression_report.md: "Visual regression report"
  - diff_images/: "Diff overlay images highlighting changes"
  - comparison_summary.md: "Summary of all detected changes"

pre_conditions:
  - "Baseline version accessible or screenshots available"
  - "Current version accessible"
  - "Both versions at same viewport"

post_conditions:
  - "All pages compared"
  - "Regressions identified and classified"
  - "Diff images generated"
  - "Report with pass/fail verdict"
```

## Purpose

Compare screenshots between two versions (baseline vs current) to detect visual regressions. Generate diff overlay images that highlight exactly where changes occurred and classify them as intentional or regression.

## Workflow

### Phase 1: Baseline Capture (5 min)
1. Load baseline version (previous release or reference screenshots)
2. Capture full-page screenshots at target viewport
3. Capture component-level screenshots if applicable
4. Store as baseline reference

### Phase 2: Current Capture (5 min)
1. Load current version
2. Capture identical screenshots (same viewport, same pages)
3. Ensure same scroll position and state
4. Wait for all assets to load (fonts, images)

### Phase 3: Pixel Comparison (10 min)
1. Run pixel-by-pixel comparison
2. Generate diff overlay images (changed pixels highlighted in red)
3. Calculate difference percentage per page
4. Flag pages exceeding threshold

### Phase 4: Classification (10 min)
For each detected change:
1. **Intentional** - Expected change from a new feature or design update
2. **Regression** - Unexpected visual change (bug)
3. **Flaky** - Dynamic content that changes between captures (dates, ads)

### Phase 5: Report (5 min)
1. Summary table with pass/fail per page
2. Diff images attached for all changes
3. Regression list with severity
4. Recommended actions

## Comparison Thresholds

| Threshold | Classification | Action |
|-----------|---------------|--------|
| 0% difference | Pixel-perfect match | PASS |
| < 0.1% difference | Sub-pixel variation | PASS (within tolerance) |
| 0.1% - 1% | Minor visual change | REVIEW needed |
| 1% - 5% | Significant change | Likely regression |
| > 5% | Major change | Definite regression or redesign |

## Report Format

```markdown
# Visual Regression Report

| Page | Baseline | Current | Diff % | Status |
|------|----------|---------|--------|--------|
| Home | baseline/home.png | current/home.png | 0.0% | PASS |
| About | baseline/about.png | current/about.png | 2.3% | FAIL |
```

## Acceptance Criteria

- [ ] Baseline and current screenshots captured
- [ ] Pixel comparison completed for all pages
- [ ] Diff overlay images generated
- [ ] Changes classified (intentional, regression, flaky)
- [ ] Threshold-based pass/fail verdict rendered
- [ ] Report generated with evidence

## Quality Gate
- Threshold: >70%
- Diff overlay images generated for all compared pages
- All detected changes classified as intentional, regression, or flaky
- Zero unclassified regressions exceeding the pixel difference threshold

---
*QA Accessibility Squad Task - visual-qa*
