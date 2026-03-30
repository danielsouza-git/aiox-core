# typography-compliance

```yaml
task:
  id: typography-compliance
  name: Typography Compliance Verification
  agent: brand-compliance
  squad: qa-accessibility
  type: verification
  elicit: true

inputs:
  required:
    - deliverable: "URL or file to verify typography"
    - typography_spec: "Brand typography specification"
  optional:
    - scope: "Full audit or specific sections"
    - tolerance: "Size tolerance in px (default: 0)"

outputs:
  - typography_report.md: "Typography compliance report"
  - font_inventory.json: "All font properties found"
  - violations.md: "Typography violations with fixes"

pre_conditions:
  - "Deliverable accessible"
  - "Typography specification available"

post_conditions:
  - "All text styles inventoried"
  - "Font families verified"
  - "Font sizes compared against type scale"
  - "Line heights and letter spacing verified"
```

## Purpose

Verify that all typography in a deliverable matches the brand's typography specification. Check font families, weights, sizes, line-heights, and letter-spacing against the approved type scale.

## Workflow

### Phase 1: Typography Extraction (10 min)
1. Extract all computed text styles from the deliverable:
   - `font-family`
   - `font-weight`
   - `font-size`
   - `line-height`
   - `letter-spacing`
   - `text-transform`
   - `font-style`
2. Group by element type (h1-h6, body, caption, label, etc.)
3. Deduplicate and catalog unique combinations

### Phase 2: Font Family Verification (5 min)
1. List all font families loaded
2. Compare against approved font families:
   - Primary typeface (headings)
   - Secondary typeface (body)
   - Monospace typeface (code, if applicable)
3. Flag any unapproved font families
4. Check font loading (WOFF2 format, preload, fallback stack)

### Phase 3: Type Scale Verification (10 min)
Compare each text element against the approved type scale:

| Element | Expected Size | Expected Weight | Expected Line-Height |
|---------|--------------|-----------------|---------------------|
| H1 | per spec | per spec | per spec |
| H2 | per spec | per spec | per spec |
| H3 | per spec | per spec | per spec |
| H4 | per spec | per spec | per spec |
| H5 | per spec | per spec | per spec |
| H6 | per spec | per spec | per spec |
| Body | per spec | per spec | per spec |
| Body Small | per spec | per spec | per spec |
| Caption | per spec | per spec | per spec |
| Label | per spec | per spec | per spec |
| Button | per spec | per spec | per spec |

### Phase 4: Weight & Style Verification (5 min)
1. Only approved font weights loaded (avoid loading unnecessary weights)
2. Font weights match brand scale (e.g., 400, 500, 700)
3. No bold text that should be regular (or vice versa)
4. Italic usage matches guidelines
5. Text transforms match guidelines (uppercase for labels, etc.)

### Phase 5: Spacing Verification (5 min)
1. **Letter-spacing** matches spec per text element
2. **Word-spacing** appropriate (typically default)
3. **Line-height** matches spec (usually 1.4-1.6 for body)
4. **Paragraph spacing** consistent
5. **Heading spacing** above/below consistent

### Phase 6: Responsive Typography (5 min)
1. Font sizes scale appropriately at breakpoints
2. No text becomes unreadable at any viewport
3. Minimum font size >= 14px for body text
4. Heading hierarchy maintained across viewports
5. Line lengths appropriate (45-75 characters per line)

### Phase 7: Report (5 min)
1. Generate font inventory table
2. Document all violations
3. Calculate compliance percentage
4. Provide fix instructions for each violation

## Report Format

```markdown
| Element | Property | Expected | Actual | Status |
|---------|----------|----------|--------|--------|
| H1 | font-family | Inter | Inter | PASS |
| H1 | font-size | 48px | 48px | PASS |
| H1 | font-weight | 700 | 600 | FAIL |
| H1 | line-height | 1.2 | 1.2 | PASS |
| Body | font-family | Inter | Roboto | FAIL |
```

## Acceptance Criteria

- [ ] All text styles extracted and cataloged
- [ ] Font families verified against approved list
- [ ] Type scale compared element by element
- [ ] Font weights and styles verified
- [ ] Letter-spacing and line-height verified
- [ ] Responsive typography checked
- [ ] Compliance percentage calculated
- [ ] Violations documented with fix instructions

## Quality Gate
- Threshold: >70%
- Only approved font families used across all deliverables
- Type scale matches spec for all heading levels and body text (family, size, weight, line-height)
- Responsive typography verified with minimum 14px body text at all breakpoints

---
*QA Accessibility Squad Task - brand-compliance*
