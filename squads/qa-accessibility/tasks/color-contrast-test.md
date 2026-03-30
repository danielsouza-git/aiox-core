# color-contrast-test

```yaml
task:
  id: color-contrast-test
  name: Color Contrast Ratio Testing
  agent: a11y-tester
  squad: qa-accessibility
  type: testing
  elicit: true

inputs:
  required:
    - target_url: "URL to test color contrast"
  optional:
    - compliance_level: "AA or AAA (default: AA)"
    - pages: "List of pages/routes to test"
    - palette: "Brand palette for reference"

outputs:
  - contrast_report.md: "Color contrast audit report"
  - failing_pairs.json: "Text/background pairs that fail"
  - remediation_palette.md: "Suggested color adjustments"

pre_conditions:
  - "Target URL accessible"
  - "Brand palette defined"

post_conditions:
  - "All text/background combos tested"
  - "Contrast ratios calculated"
  - "Failures documented with fix suggestions"
```

## Purpose

Test all text/background color combinations for WCAG contrast ratio compliance (4.5:1 for AA normal text, 3:1 for AA large text, 7:1 for AAA normal text). Document every failing pair and provide alternative colors that pass.

## Workflow

### Phase 1: Automated Scan (5 min)
1. Run axe-core contrast check on all pages
2. Collect all text/background color pairs
3. Calculate contrast ratio for each pair
4. Flag any pair below target threshold

### Phase 2: Manual Verification (10 min)
1. **Body text** - All paragraph and list text
2. **Headings** - All heading levels
3. **Links** - Default, hover, visited, active states
4. **Buttons** - Text on button backgrounds
5. **Form elements** - Labels, placeholders, input text
6. **Error messages** - Error text on background
7. **Navigation** - Menu items in all states
8. **Badges/Tags** - Text on colored backgrounds
9. **Overlay text** - Text on images or gradients
10. **Footer** - Text on footer background

### Phase 3: Non-Text Contrast (5 min)
1. **UI components** - Borders, icons, form controls (3:1 minimum)
2. **Focus indicators** - Focus ring against background (3:1 minimum)
3. **Charts/graphs** - Data series distinguishable
4. **Icons** - Meaningful icons against background

### Phase 4: Color-Only Information (5 min)
1. No information conveyed by color alone
2. Error states have icon/text in addition to red
3. Required fields have asterisk in addition to color
4. Status indicators have text labels
5. Links distinguishable from text without color (underline)

### Phase 5: Report (5 min)
1. Generate passing/failing pairs table
2. Calculate overall compliance rate
3. For each failing pair, suggest closest passing alternative
4. Prioritize fixes by visibility/frequency

## WCAG Contrast Requirements

| Level | Text Type | Minimum Ratio |
|-------|-----------|---------------|
| AA | Normal text (< 18pt / < 14pt bold) | 4.5:1 |
| AA | Large text (>= 18pt / >= 14pt bold) | 3:1 |
| AA | UI components and graphics | 3:1 |
| AAA | Normal text | 7:1 |
| AAA | Large text | 4.5:1 |

## Report Format

```markdown
| Element | Foreground | Background | Ratio | Target | Status |
|---------|-----------|------------|-------|--------|--------|
| Body text | #333333 | #FFFFFF | 12.6:1 | 4.5:1 | PASS |
| Link text | #0066CC | #F5F5F5 | 5.2:1 | 4.5:1 | PASS |
| Error msg | #FF0000 | #FFF0F0 | 3.1:1 | 4.5:1 | FAIL |
```

## Acceptance Criteria

- [ ] All text/background pairs identified and tested
- [ ] Contrast ratios calculated for every pair
- [ ] Non-text contrast checked (UI, icons, focus)
- [ ] Color-only information issues identified
- [ ] Failing pairs documented with suggested fixes
- [ ] Overall compliance percentage calculated
- [ ] Report generated with evidence

## Quality Gate
- Threshold: >70%
- All text/background pairs meet WCAG AA contrast ratios (4.5:1 normal, 3:1 large)
- Zero instances of information conveyed by color alone
- Non-text UI components meet 3:1 minimum contrast against adjacent colors

---
*QA Accessibility Squad Task - a11y-tester*
