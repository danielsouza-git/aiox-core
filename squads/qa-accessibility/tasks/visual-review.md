# visual-review

```yaml
task:
  id: visual-review
  name: Pixel-Perfect Visual Review
  agent: visual-qa
  squad: qa-accessibility
  type: review
  elicit: true

inputs:
  required:
    - target_url: "URL or path to the implementation to review"
    - design_spec: "Figma link, screenshot, or design spec document"
  optional:
    - viewport: "Specific viewport to test (default: 1440px)"
    - tolerance: "Pixel tolerance threshold (default: 0)"
    - focus_area: "Specific section to focus on"

outputs:
  - visual_review_report.md: "Detailed visual review with findings"
  - screenshots/: "Comparison screenshots (implementation vs spec)"
  - diff_overlay.png: "Visual diff overlay highlighting discrepancies"

pre_conditions:
  - "Implementation deployed or locally accessible"
  - "Design spec or Figma link available"
  - "Target viewport defined"

post_conditions:
  - "All visual elements compared against spec"
  - "Discrepancies documented with screenshots"
  - "Severity assigned to each finding"
  - "Report generated with remediation guidance"
```

## Purpose

Compare implementation pixel-by-pixel against design specifications to ensure visual accuracy. Document all discrepancies with screenshot evidence and provide actionable remediation guidance.

## Workflow

### Phase 1: Preparation (5 min)
1. Load design specification (Figma, screenshot, or document)
2. Identify target URL and viewport configuration
3. Set up screenshot capture environment
4. Define comparison tolerance threshold

### Phase 2: Full-Page Capture (10 min)
1. Capture full-page screenshot of implementation
2. Capture corresponding design spec screenshot
3. Generate diff overlay highlighting discrepancies
4. Calculate overall pixel accuracy percentage

### Phase 3: Element-Level Inspection (15 min)
1. **Layout** - Grid alignment, spacing, margins, padding
2. **Typography** - Font family, size, weight, line-height, letter-spacing, color
3. **Colors** - Background colors, text colors, border colors (exact hex match)
4. **Images** - Resolution, aspect ratio, cropping, positioning
5. **Shadows** - Box shadows, text shadows (offset, blur, spread, color)
6. **Borders** - Width, style, color, radius
7. **Icons** - Size, color, alignment, spacing

### Phase 4: Interactive States (10 min)
1. **Hover states** - All interactive elements
2. **Focus states** - Tab through focusable elements
3. **Active states** - Click/press states
4. **Disabled states** - Disabled element appearance
5. **Loading states** - Skeleton screens, spinners
6. **Error states** - Form validation, error messages

### Phase 5: Report Generation (5 min)
1. Compile findings with severity classification
2. Attach screenshot evidence for each finding
3. Calculate compliance score
4. Provide remediation priority list

## Severity Classification

| Severity | Description | Example |
|----------|-------------|---------|
| **Critical** | Layout broken, content unreadable | Missing section, overlapping text |
| **Major** | Visible deviation from spec | Wrong font size, incorrect spacing |
| **Minor** | Subtle difference | 1-2px alignment, slight color variation |
| **Cosmetic** | Nitpick, barely noticeable | Sub-pixel rendering difference |

## Elicitation Questions

```yaml
elicit:
  - question: "What is the target URL or local path?"
    type: text
    hint: "https://staging.example.com or http://localhost:3000"

  - question: "Where is the design spec?"
    type: text
    hint: "Figma link, screenshot path, or design document"

  - question: "Which viewport should be tested first?"
    options:
      - "1440px - Desktop (default)"
      - "1920px - Desktop XL"
      - "1024px - Tablet landscape"
      - "768px - Tablet portrait"
      - "320px - Mobile"
```

## Acceptance Criteria

- [ ] Full-page screenshot comparison completed
- [ ] All visual elements inspected against spec
- [ ] Interactive states verified (hover, focus, active)
- [ ] Discrepancies documented with screenshot evidence
- [ ] Severity assigned to each finding
- [ ] Compliance score calculated
- [ ] Remediation priority list provided

## Quality Gate
- Threshold: >70%
- Screenshot comparison completed for all specified viewports with diff overlay generated
- Zero critical severity findings (layout broken, content unreadable)
- All interactive states (hover, focus, active) verified with screenshot evidence

---
*QA Accessibility Squad Task - visual-qa*
