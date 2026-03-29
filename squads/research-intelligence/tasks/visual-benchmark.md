# visual-benchmark

```yaml
task:
  id: visual-benchmark
  name: Visual Benchmarking
  agent: competitive-analyst
  squad: research-intelligence
  type: audit
  elicit: true

inputs:
  required:
    - brand: "Brand to benchmark"
    - competitors: "3-8 competitors to compare"
    - pages_to_compare: "Specific pages (homepage, pricing, about, etc.)"
  optional:
    - brand_guidelines: "Existing brand guidelines"
    - focus_elements: "Specific elements to compare (hero, nav, footer, CTA)"
    - device_targets: "Desktop, mobile, or both"
    - industry: "Industry context for benchmarking"

outputs:
  - visual-benchmark.md: "Complete visual benchmark report"
  - palette-comparison.md: "Color palette extraction and comparison"
  - typography-comparison.md: "Typography comparison matrix"
  - layout-patterns.md: "Layout and structure patterns"

pre_conditions:
  - "Competitor URLs accessible"
  - "Pages to compare agreed"

post_conditions:
  - "All competitors visually documented"
  - "Palettes extracted with hex values"
  - "Typography identified"
  - "Layout patterns cataloged"
```

## Purpose

Produce a detailed visual benchmarking study comparing specific pages and design elements across competitors. Extract color palettes, typography choices, layout patterns, and imagery styles to inform brand design decisions.

## Workflow

### Phase 1: Setup & Capture (15 min)
1. Confirm competitor URLs and pages
2. Capture screenshots of each page per competitor
3. Note device/viewport for each capture
4. Document capture date for freshness

### Phase 2: Color Palette Analysis (20 min)
Per competitor:
1. Extract primary brand color (hex)
2. Extract secondary colors (hex)
3. Identify accent/CTA colors
4. Note background treatment (white/dark/gradient)
5. Assess color contrast and accessibility

### Phase 3: Typography Analysis (20 min)
Per competitor:
1. Identify headline font family
2. Identify body text font family
3. Note font sizes for H1, H2, body
4. Document font weights used
5. Assess readability and hierarchy

### Phase 4: Layout & Structure (20 min)
Per competitor and page:
1. Hero section pattern (image/video/illustration/text-only)
2. Navigation structure (top bar, hamburger, sidebar)
3. Content section patterns
4. CTA placement and style
5. Footer structure
6. Whitespace usage

### Phase 5: Imagery & Visual Elements (15 min)
Per competitor:
1. Photography style (editorial, lifestyle, product, stock)
2. Illustration usage (yes/no, style)
3. Icon style (outlined, filled, custom)
4. Animation and motion
5. Social proof presentation

### Phase 6: Synthesis (15 min)
1. Identify common patterns across competitors
2. Spot unique/differentiating approaches
3. Map visual trends in the industry
4. Recommend visual differentiation strategy
5. Compile comparison tables

## Benchmark Template

```markdown
# Visual Benchmark: [Brand] vs. Competitors

## Pages Compared
- [Page 1] - [URL patterns]
- [Page 2] - [URL patterns]

## Color Palette Comparison

| Brand | Primary | Secondary | Accent/CTA | Background | Contrast |
|-------|---------|-----------|------------|------------|----------|
| [Brand] | #[hex] | #[hex] | #[hex] | [type] | [pass/fail] |
| [Comp 1] | #[hex] | #[hex] | #[hex] | [type] | [pass/fail] |

**Pattern:** [What most competitors do]
**Opportunity:** [Where to differentiate]

## Typography Comparison

| Brand | Headline Font | Body Font | H1 Size | Weight | Readability |
|-------|---------------|-----------|---------|--------|-------------|
| [Brand] | [Font] | [Font] | [px] | [wt] | [score] |
| [Comp 1] | [Font] | [Font] | [px] | [wt] | [score] |

**Pattern:** [Common choices]
**Opportunity:** [Typography differentiation]

## Layout Patterns

| Element | [Brand] | [Comp 1] | [Comp 2] | [Comp 3] | Industry Norm |
|---------|---------|----------|----------|----------|---------------|
| Hero | [type] | [type] | [type] | [type] | [type] |
| Nav | [type] | [type] | [type] | [type] | [type] |
| CTA Style | [type] | [type] | [type] | [type] | [type] |
| Footer | [type] | [type] | [type] | [type] | [type] |

## Imagery Style

| Brand | Photo Style | Illustration | Icons | Animation |
|-------|-------------|--------------|-------|-----------|
| [Brand] | [style] | [Y/N] | [style] | [Y/N] |
| [Comp 1] | [style] | [Y/N] | [style] | [Y/N] |

## Key Findings
1. **[Finding 1]** - [Evidence and implication]
2. **[Finding 2]** - [Evidence and implication]
3. **[Finding 3]** - [Evidence and implication]

## Differentiation Recommendations
1. [Recommendation with rationale]
2. [Recommendation with rationale]
3. [Recommendation with rationale]
```

## Acceptance Criteria

- [ ] All competitor pages captured and documented
- [ ] Color palettes extracted with hex values
- [ ] Typography identified for each competitor
- [ ] Layout patterns cataloged per page type
- [ ] Imagery styles characterized
- [ ] Common patterns identified
- [ ] Differentiation opportunities recommended
- [ ] All URLs and capture dates documented

---
*Research Intelligence Squad Task*
