# cross-browser-test

```yaml
task:
  id: cross-browser-test
  name: Cross-Browser Visual Testing
  agent: visual-qa
  squad: qa-accessibility
  type: testing
  elicit: true

inputs:
  required:
    - target_url: "URL to test across browsers"
  optional:
    - browsers: "Specific browsers to test (default: all)"
    - viewport: "Viewport size (default: 1440px)"
    - pages: "List of pages/routes to test"

outputs:
  - cross_browser_report.md: "Browser comparison report"
  - screenshots/: "Per-browser screenshots for each page"
  - comparison_matrix.md: "Side-by-side comparison matrix"

pre_conditions:
  - "Target URL accessible"
  - "Playwright installed with browser engines"

post_conditions:
  - "All target browsers tested"
  - "Screenshots captured per browser"
  - "Inconsistencies documented"
  - "Report generated"
```

## Purpose

Test visual consistency across Chrome, Firefox, Safari, and Edge. Capture screenshots in each browser and document any rendering inconsistencies with evidence.

## Workflow

### Phase 1: Environment Setup (5 min)
1. Verify Playwright browser engines installed
2. Configure viewport and device emulation
3. Identify pages/routes to test
4. Set up screenshot naming convention

### Phase 2: Screenshot Capture (15 min)
For each page, capture in:
1. **Chrome** (Chromium latest) - 1440px viewport
2. **Firefox** (latest) - 1440px viewport
3. **Safari** (WebKit latest) - 1440px viewport
4. **Edge** (Chromium latest) - 1440px viewport

Capture both:
- Full-page screenshot
- Above-the-fold screenshot

### Phase 3: Comparison Analysis (10 min)
1. Compare Chrome vs Firefox rendering
2. Compare Chrome vs Safari rendering
3. Compare Chrome vs Edge rendering
4. Flag any browser-specific rendering issues

Focus areas for cross-browser issues:
- **Fonts** - Rendering, smoothing, kerning differences
- **Flexbox/Grid** - Layout calculation differences
- **Shadows** - Rendering variations
- **Scrollbars** - Custom scrollbar support
- **Animations** - Timing and rendering differences
- **Form elements** - Native styling differences
- **SVGs** - Rendering and filter support

### Phase 4: Report (5 min)
1. Generate comparison matrix
2. Document browser-specific issues
3. Provide CSS fix recommendations
4. Assign severity per inconsistency

## Browser Matrix

| Browser | Engine | Versions | Priority |
|---------|--------|----------|----------|
| Chrome | Chromium | Latest 2 | P0 |
| Firefox | Gecko | Latest 2 | P0 |
| Safari | WebKit | Latest 2 | P1 |
| Edge | Chromium | Latest 2 | P1 |

## Common Cross-Browser Issues

| Issue | Browsers Affected | Typical Fix |
|-------|-------------------|-------------|
| Font rendering | Safari vs Chrome | `-webkit-font-smoothing` |
| Flexbox gaps | Older Safari | Fallback margins |
| Backdrop filter | Firefox | `@supports` fallback |
| Scroll behavior | Safari | JS polyfill |
| Date inputs | Safari/Firefox | Custom component |

## Acceptance Criteria

- [ ] Screenshots captured in all 4 browsers
- [ ] Visual comparison completed for all pages
- [ ] Browser-specific issues documented
- [ ] CSS fix recommendations provided
- [ ] Comparison matrix generated

## Quality Gate
- Threshold: >70%
- Screenshots captured in all 4 target browsers (Chrome, Firefox, Safari, Edge)
- Zero critical rendering inconsistencies that break layout or hide content
- Comparison matrix generated with per-browser pass/fail status

---
*QA Accessibility Squad Task - visual-qa*
