# layout-personality-score

```yaml
task:
  id: layout-personality-score
  name: Layout Personality Expression Scoring
  agent: brand-compliance
  squad: qa-accessibility
  type: audit
  elicit: false

inputs:
  required:
    - generated_layout: "Path to generated layout HTML/CSS output (brand book, landing page, or site)"
    - brand_profile: "Path to brand-profile.yaml containing archetypes and personality traits"
  optional:
    - layout_tokens: "Path to layout.json token file (auto-detected from build output if omitted)"
    - layout_brief: "Path to layout-brief.md for brief-alignment cross-check"
    - threshold: "Minimum passing score (default: 60%)"

outputs:
  - layout_personality_report.md: "Full personality expression report with per-dimension breakdown"
  - personality_score.json: "Machine-readable scoring data for pipeline integration"

pre_conditions:
  - "Generated layout accessible (HTML + CSS files available)"
  - "Brand profile with archetypes and personality traits available"
  - "Layout engine has resolved a layout family (layout.json exists or family is determinable from brand profile)"
  - "PDL feature flag enabled (bss.personalityDrivenLayouts.enabled: true)"

post_conditions:
  - "All 7 layout dimensions scored against expected family preset"
  - "Overall personality expression score calculated"
  - "Per-dimension breakdown documented with evidence"
  - "Mismatches flagged with severity and remediation guidance"
  - "Template partial rendering validated against expected family"
```

## Purpose

Validate that a generated layout **expresses the intended brand personality**. This task bridges the gap between structural QA (is the HTML valid, responsive, accessible) and semantic QA (does this layout feel like the intended archetype). A layout that passes all technical gates but renders an Explorer brand with Innocent visual characteristics is a personality expression failure.

This task addresses audit gap **QA-1** from the PDL domain audit and finding **F5** from the consolidated audit report.

## Context: Layout Families and Dimensions

The PDL architecture defines 6 layout families, each with a distinct visual DNA:

| Family | Archetypes | Visual DNA |
|--------|-----------|------------|
| ETHEREAL | Innocent, Dreamer, Lover | Soft, rounded, spacious, gentle, light |
| BOLD-STRUCTURED | Ruler, Hero | Sharp, structured, high-contrast, commanding |
| WARM-ARTISAN | Creator, Caregiver, Everyman | Warm, textured, handcrafted, inviting |
| ADVENTUROUS-OPEN | Explorer, Sage | Expansive, scroll-driven, discovery-oriented |
| PLAYFUL-DYNAMIC | Jester, Magician | Energetic, asymmetric, surprising, colorful |
| REBEL-EDGE | Rebel, Outlaw | High-contrast, raw, unpolished, bold |

Each family is defined across **7 layout dimensions** that form the scoring basis.

## Workflow

### Phase 1: Context Loading (3 min)

1. Load `brand-profile.yaml` and extract:
   - Primary archetype(s)
   - Secondary/tertiary archetypes (if present)
   - Personality trait scales (formalCasual, traditionalModern, seriousPlayful, conservativeBold, minimalExpressive)
2. Determine the **expected layout family** by:
   - Reading `layout.json` if available (authoritative source)
   - Otherwise, applying the archetype-to-family mapping algorithm from the PDL architecture (Section 4)
3. Load the **family preset** (expected token values for the resolved family) from the architecture reference (Section 3)
4. If `layout_brief` is provided, load it for cross-reference in Phase 3

### Phase 2: Layout Dimension Extraction (10 min)

For each of the 7 layout dimensions, extract the **actual value** from the generated output:

#### Dimension 1: Navigation Style
- Inspect the generated HTML for the navigation component structure
- Identify which nav pattern is rendered:
  - `centered-top` -- horizontal nav centered at top, no sidebar
  - `sidebar-fixed` -- fixed vertical sidebar navigation
  - `breadcrumb-horizontal` -- breadcrumb trail with horizontal nav
  - `sticky-minimal` -- minimal nav that appears on scroll
  - `floating-pill` -- pill-shaped floating nav element
  - `inline-minimal` -- inline text-based navigation, no chrome
- Check which nav partial template was rendered (if partial system is in use)
- Evidence: screenshot of navigation component

#### Dimension 2: Whitespace Density
- Measure actual section gaps (vertical space between major sections)
- Measure content padding (horizontal padding on content areas)
- Calculate effective whitespace multiplier relative to the base spacing scale
- Classify as: `compact` (<=0.8x), `balanced` (0.9-1.1x), `generous` (1.2-1.4x), `spacious` (>=1.5x)
- Evidence: measured values in px

#### Dimension 3: Corner Radius
- Inspect CSS for `border-radius` values on cards, containers, and interactive elements
- Check for CSS custom property `--layout-corner-radiusBase` value
- Verify consistency across components (cards, buttons, inputs, sections)
- Classify as: `sharp` (0-2px), `subtle` (4-8px), `rounded` (10-16px), `pill` (>=20px)
- Evidence: measured radius values

#### Dimension 4: Divider Style
- Inspect section dividers (between major content sections)
- Identify the divider pattern:
  - `solid-thin` -- 1px solid line
  - `solid-thick` -- 3px+ solid line
  - `organic-wave` -- SVG-based wave pattern
  - `textured-line` -- CSS gradient or pattern-based
  - `thin-geometric` -- thin line with geometric accents
  - `zigzag-wave` -- SVG-based zigzag
  - `slash-raw` -- diagonal slash pattern
  - `none` -- no visible dividers
- Check which divider partial template was rendered (if partial system is in use)
- Evidence: screenshot of divider elements

#### Dimension 5: Animation Entrance
- Inspect CSS for animation keyframes and transition properties
- Identify the entrance animation type:
  - `none` -- no entrance animation
  - `fade-up` -- fade in with upward translation
  - `slide-in` -- horizontal or vertical slide
  - `scroll-reveal` -- triggered by scroll position
  - `bounce-in` -- bounce/spring entrance
  - `cut-in` -- hard cut, no easing
- Check `--layout-animation-entrance` CSS custom property if present
- Verify `prefers-reduced-motion` is respected
- Evidence: animation CSS rules or keyframe definitions

#### Dimension 6: Grid Rhythm
- Inspect the content grid system used for page layout
- Identify the grid pattern:
  - `centered-single` -- single centered column, narrow max-width
  - `strict-grid` -- 12-column grid with strict alignment
  - `masonry-inspired` -- staggered, mixed-size grid
  - `editorial-wide` -- wide content area, magazine-style
  - `broken-asymmetric` -- intentionally broken grid with overlaps
  - `single-column-stacked` -- full-width stacked sections
- Check `--layout-grid-rhythm` and `--layout-grid-maxWidth` values
- Evidence: grid structure screenshot or CSS grid/flex values

#### Dimension 7: Section Background
- Inspect section-level background treatments
- Identify the background pattern:
  - `flat-solid` -- uniform solid color
  - `soft-fill` -- subtle gradient or pastel fill
  - `layered-shadow` -- layered elements with shadow depth
  - `full-bleed-image` -- full-width background imagery
  - `alternating-accent` -- alternating section colors
  - `dark-mono` -- dark monochrome background
- Evidence: section background CSS rules

### Phase 3: Per-Dimension Scoring (10 min)

For each dimension, compare the **extracted actual value** against the **expected value** from the family preset.

#### Scoring Rules

| Match Level | Score | Criteria |
|-------------|-------|----------|
| **Exact Match** | 100% | Actual value matches expected value exactly |
| **Family-Compatible** | 75% | Value is from the same aesthetic family (e.g., `subtle` radius when `rounded` expected -- same direction, different magnitude) |
| **Neutral** | 50% | Value is generic/default and does not contradict the expected personality |
| **Contradictory** | 0% | Value contradicts the expected personality (e.g., `sharp` corners for ETHEREAL, `pill` corners for REBEL-EDGE) |

#### Contradictory Combinations (always score 0%)

These represent fundamental personality mismatches:

| Family | Contradictory Values |
|--------|---------------------|
| ETHEREAL | sharp corners, compact spacing, solid-thick dividers, cut-in animation, dark-mono background |
| BOLD-STRUCTURED | pill corners, spacious spacing, organic-wave dividers, bounce-in animation, soft-fill background |
| WARM-ARTISAN | sharp corners, aggressive spacing, slash-raw dividers, cut-in animation, dark-mono background |
| ADVENTUROUS-OPEN | sidebar-fixed nav, compact spacing, solid-thick dividers, none animation |
| PLAYFUL-DYNAMIC | sharp corners, sidebar-fixed nav, none animation, flat-solid background |
| REBEL-EDGE | pill corners, spacious spacing, organic-wave dividers, fade-up animation, soft-fill background |

### Phase 4: Template Partial Validation (5 min)

If the PDL template partial system is active:

1. **Nav partial check**: Verify the rendered navigation HTML matches the expected nav partial for the resolved family
   - Expected partial name: `nav-{layout.nav.style}` (e.g., `nav-centered-top` for ETHEREAL)
   - Check HTML structure markers or CSS class names that identify the partial
2. **Divider partial check**: Verify the rendered dividers match the expected divider partial
   - Expected partial name: `divider-{layout.divider.style}` (e.g., `divider-organic-wave` for ETHEREAL)
3. Document any mismatches as HIGH severity findings

### Phase 5: Layout Token Verification (5 min)

If layout tokens (`layout.json`) are available:

1. Verify all `--layout-*` CSS custom properties are present in the output CSS
2. Verify CSS custom property values match the values in `layout.json`
3. Check for hardcoded values that bypass the token system:
   - Search for literal `border-radius: Npx` that should use `var(--layout-corner-radiusBase, ...)`
   - Search for literal padding/margin values that should use `var(--layout-whitespace-*)` or `calc()` with whitespace multiplier
4. Flag any missing or mismatched tokens

### Phase 6: Overall Scoring and Report (5 min)

#### Score Calculation

Each dimension is equally weighted at 1/7 of the total score:

```
Overall Score = (D1 + D2 + D3 + D4 + D5 + D6 + D7) / 7
```

Where D1-D7 are the per-dimension scores from Phase 3 (0-100%).

#### Score Interpretation

| Score | Rating | Verdict |
|-------|--------|---------|
| >= 80% | Strong Expression | PASS -- layout clearly expresses the intended personality |
| 60-79% | Adequate Expression | PASS WITH CONCERNS -- personality is recognizable but some dimensions deviate |
| 40-59% | Weak Expression | FAIL -- layout does not adequately express the intended personality |
| < 40% | Wrong Personality | FAIL -- layout contradicts the intended personality |

#### Report Structure

```markdown
# Layout Personality Expression Report

## Summary
- **Brand:** {brand_name}
- **Expected Family:** {family_name}
- **Primary Archetype:** {archetype}
- **Overall Score:** {score}% -- {verdict}

## Per-Dimension Breakdown

| Dimension | Expected | Actual | Score | Evidence |
|-----------|----------|--------|-------|----------|
| Navigation Style | {expected} | {actual} | {score}% | {evidence_ref} |
| Whitespace Density | {expected} | {actual} | {score}% | {evidence_ref} |
| Corner Radius | {expected} | {actual} | {score}% | {evidence_ref} |
| Divider Style | {expected} | {actual} | {score}% | {evidence_ref} |
| Animation Entrance | {expected} | {actual} | {score}% | {evidence_ref} |
| Grid Rhythm | {expected} | {actual} | {score}% | {evidence_ref} |
| Section Background | {expected} | {actual} | {score}% | {evidence_ref} |

## Mismatches (if any)
{detailed description of each mismatch with remediation guidance}

## Template Partial Validation
{partial check results}

## Layout Token Verification
{token check results}
```

## Acceptance Criteria

- [ ] Brand profile loaded with archetypes and personality traits
- [ ] Expected layout family determined (from layout.json or archetype mapping)
- [ ] All 7 layout dimensions extracted from generated output with evidence
- [ ] Each dimension scored against expected family preset (0-100%)
- [ ] Contradictory combinations flagged as 0% with explanation
- [ ] Template partials validated (if PDL partial system is active)
- [ ] Layout token CSS custom properties verified (if layout.json available)
- [ ] Overall personality expression score calculated
- [ ] Report generated with per-dimension breakdown and remediation guidance
- [ ] Score interpretation provides clear PASS/FAIL verdict

## Quality Gate

- Threshold: >= 60% overall personality expression score
- Zero contradictory dimension scores (any 0% dimension triggers review)
- Navigation and corner radius dimensions must score >= 75% (highest visual impact dimensions)
- All layout token CSS custom properties present (if layout.json exists)

## References

- PDL Architecture: `docs/architecture/personality-driven-layouts.md` (Section 3: Layout Family Taxonomy, Section 5: Layout Token Architecture)
- PDL Audit: `docs/reviews/pdl-audit-qa-bp.md` (Gap QA-1)
- Consolidated Audit: `docs/reviews/pdl-audit-consolidated.md` (Finding F5)
- Layout Families: Section 3 of the architecture document defines the 6 families and their token presets

---
*QA Accessibility Squad Task - brand-compliance*
