# logo-usage-verify

```yaml
task:
  id: logo-usage-verify
  name: Logo Usage Verification
  agent: brand-compliance
  squad: qa-accessibility
  type: verification
  elicit: true

inputs:
  required:
    - deliverable: "URL or file containing logo usage"
    - logo_guidelines: "Logo usage guidelines from brand book"
  optional:
    - logo_assets: "Path to official logo files for comparison"
    - contexts: "Specific usage contexts to verify"

outputs:
  - logo_usage_report.md: "Logo usage verification report"
  - violations_screenshots/: "Screenshots of logo violations"

pre_conditions:
  - "Deliverable accessible"
  - "Logo guidelines available"
  - "Official logo files available for comparison"

post_conditions:
  - "All logo instances found and verified"
  - "Clear space measured for each instance"
  - "Minimum size verified"
  - "Color variant correctness confirmed"
```

## Purpose

Verify that every logo instance in a deliverable follows the brand's logo usage guidelines. Check clear space, minimum size, color variants, background usage, and ensure no unauthorized modifications.

## Workflow

### Phase 1: Logo Instance Discovery (5 min)
1. Scan deliverable for all logo instances
2. Catalog each instance (location, size, variant, context)
3. Note the background/context for each
4. Count total logo instances

### Phase 2: Variant Verification (5 min)
For each logo instance:
1. **Correct variant** - Is the right logo variant used for this context?
   - Primary (full color) for light backgrounds
   - Reversed (white) for dark backgrounds
   - Monochrome for single-color contexts
   - Icon/mark for small spaces
2. **Official file** - Is the official logo file used (not a recreation)?

### Phase 3: Clear Space (10 min)
For each logo instance:
1. Measure the exclusion zone around the logo
2. Compare against the minimum clear space requirement
3. Flag any elements encroaching the clear space
4. Document with annotated screenshots

Clear space rules (typical):
- Minimum clear space = height of logo mark "x" unit
- No text, images, or borders within clear space
- Clear space scales proportionally with logo size

### Phase 4: Minimum Size (5 min)
For each logo instance:
1. Measure the logo dimensions (width and height in px)
2. Compare against minimum size requirements
3. Flag any undersized logos
4. Check that small-size variants are used when below threshold

Typical minimums:
- Full logo: min width 120px digital, 25mm print
- Icon/mark: min width 32px digital, 10mm print

### Phase 5: Background Compliance (5 min)
For each logo instance:
1. Check logo is visible against its background
2. Verify correct variant for background type
3. Check that logo is not placed on busy/distracting backgrounds
4. Verify any required background container is used

### Phase 6: Modification Check (5 min)
Verify NO unauthorized modifications:
- [ ] Logo not stretched or skewed (aspect ratio preserved)
- [ ] Logo not rotated
- [ ] Logo colors not altered
- [ ] Logo not partially cropped
- [ ] No effects applied (shadows, glows, gradients)
- [ ] No elements added to or removed from logo
- [ ] Logo not used as a pattern or texture

## Report Format

```markdown
| Instance | Location | Variant | Clear Space | Min Size | Background | Mods | Status |
|----------|----------|---------|-------------|----------|------------|------|--------|
| Header | Top-left | Primary | 24px (OK) | 140px (OK) | White | None | PASS |
| Footer | Center | Reversed | 12px (FAIL) | 100px (OK) | Dark | None | FAIL |
```

## Acceptance Criteria

- [ ] All logo instances discovered and cataloged
- [ ] Correct variant verified for each context
- [ ] Clear space measured and verified
- [ ] Minimum size compliance checked
- [ ] Background appropriateness verified
- [ ] No unauthorized modifications detected
- [ ] Report generated with screenshot evidence

## Quality Gate
- Threshold: >70%
- All logo instances use the correct variant for their context (primary, reversed, monochrome)
- Clear space requirements met for every logo instance
- Zero unauthorized modifications detected (no stretching, rotation, or color alteration)

---
*QA Accessibility Squad Task - brand-compliance*
