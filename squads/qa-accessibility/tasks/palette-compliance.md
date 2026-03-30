# palette-compliance

```yaml
task:
  id: palette-compliance
  name: Color Palette Compliance Verification
  agent: brand-compliance
  squad: qa-accessibility
  type: verification
  elicit: true

inputs:
  required:
    - deliverable: "URL or file to verify colors"
    - brand_palette: "Official brand color palette (hex values)"
  optional:
    - tolerance: "Color distance tolerance (default: exact match)"
    - scope: "Full palette check or specific categories"

outputs:
  - palette_compliance_report.md: "Color compliance report"
  - color_inventory.json: "All colors found in deliverable"
  - unapproved_colors.md: "List of off-brand colors with suggested replacements"

pre_conditions:
  - "Deliverable accessible"
  - "Brand palette with hex values defined"

post_conditions:
  - "All colors in deliverable inventoried"
  - "Each color compared against approved palette"
  - "Unapproved colors flagged"
  - "Replacement suggestions provided"
```

## Purpose

Verify that all colors used in a deliverable exactly match the approved brand palette. Extract every color from the implementation, compare against the brand's hex values, and flag any unapproved colors with suggested brand-palette replacements.

## Workflow

### Phase 1: Color Extraction (10 min)
1. Extract all colors from the deliverable:
   - CSS `color`, `background-color`, `border-color` values
   - Inline style colors
   - SVG fill and stroke colors
   - Image overlay/tint colors
   - Gradient color stops
2. Convert all formats to hex (rgb, hsl, named colors)
3. Deduplicate and count usage frequency

### Phase 2: Palette Mapping (10 min)
1. Load approved brand palette:
   - **Primary** colors (1-3)
   - **Secondary** colors (1-3)
   - **Accent** colors (1-2)
   - **Neutral** scale (white, grays, black)
   - **Semantic** colors (success, warning, error, info)
2. Match each extracted color to the nearest palette color
3. Flag exact matches, close matches, and no matches

### Phase 3: Usage Context Verification (10 min)
1. **Primary colors** used for primary actions (CTAs, headers)
2. **Secondary colors** used for secondary elements
3. **Accent colors** used sparingly for highlights
4. **Neutral colors** used for body text, backgrounds, borders
5. **Semantic colors** used correctly (green=success, red=error)
6. **No off-palette colors** in any context

### Phase 4: Report (5 min)
1. Generate color inventory table
2. Show approved vs unapproved breakdown
3. For each unapproved color, suggest closest palette match
4. Calculate compliance percentage

## Color Comparison

| Category | Hex | Usage Rule |
|----------|-----|------------|
| Primary | Brand-specific | CTAs, headings, key elements |
| Secondary | Brand-specific | Supporting elements, accents |
| Neutral-100 | #F7F7F7 (example) | Light backgrounds |
| Neutral-900 | #1A1A1A (example) | Body text |
| Success | #22C55E (example) | Success states only |
| Error | #EF4444 (example) | Error states only |

## Report Format

```markdown
| Color | Hex | Frequency | Nearest Palette | Distance | Status |
|-------|-----|-----------|-----------------|----------|--------|
| Body text | #333333 | 47 | Neutral-900 #1A1A1A | 19 | REVIEW |
| CTA bg | #0066CC | 12 | Primary #0066CC | 0 | PASS |
| Divider | #E5E5E5 | 23 | Neutral-200 #E5E5E5 | 0 | PASS |
| Badge bg | #FF6B35 | 3 | (none) | -- | FAIL |
```

## Acceptance Criteria

- [ ] All colors extracted from deliverable
- [ ] Colors converted to consistent hex format
- [ ] Each color compared against approved palette
- [ ] Unapproved colors flagged with usage context
- [ ] Replacement suggestions provided for violations
- [ ] Compliance percentage calculated
- [ ] Report generated with full inventory

## Quality Gate
- Threshold: >70%
- All colors extracted and compared against the approved brand palette
- Zero unapproved colors in primary UI elements (CTAs, headings, navigation)
- Compliance percentage calculated with replacement suggestions for every violation

---
*QA Accessibility Squad Task - brand-compliance*
