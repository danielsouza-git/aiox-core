# layout-differentiation-check

```yaml
task:
  id: layout-differentiation-check
  name: Cross-Brand Layout Differentiation Check
  agent: visual-qa
  squad: qa-accessibility
  type: testing
  elicit: false

inputs:
  required:
    - layout_a: "Path to generated layout output for Brand A (HTML + CSS)"
    - layout_b: "Path to generated layout output for Brand B (HTML + CSS)"
    - profile_a: "Path to brand-profile.yaml for Brand A"
    - profile_b: "Path to brand-profile.yaml for Brand B"
  optional:
    - viewport: "Viewport width for visual comparison (default: 1440px)"
    - threshold_visual_diff: "Minimum visual diff percentage (default: 15%)"
    - threshold_dimension_diff: "Minimum differing layout dimensions (default: 3 of 7)"
    - page: "Specific page to compare (default: index/overview page)"

outputs:
  - differentiation_report.md: "Full differentiation analysis report"
  - differentiation_score.json: "Machine-readable differentiation data for pipeline integration"
  - screenshots/: "Side-by-side screenshots of both layouts at comparison viewport"
  - diff_overlay.png: "Visual diff overlay highlighting structural differences"

pre_conditions:
  - "Both brand layouts generated and accessible (HTML + CSS files)"
  - "Both brand profiles available with archetypes and personality traits"
  - "Brands have different archetype combinations or personality trait values"
  - "PDL feature flag enabled (bss.personalityDrivenLayouts.enabled: true)"

post_conditions:
  - "Visual diff percentage calculated between both layouts"
  - "All 7 layout dimensions compared between brands"
  - "Structural differences documented with evidence"
  - "Differentiation score calculated (composite of visual + dimensional)"
  - "Report generated with side-by-side comparison"
```

## Purpose

Verify that layouts generated for **different brands** are **visually distinct**. The core promise of Personality-Driven Layouts is that two brands with different personality profiles produce different layout skeletons. This task validates that promise by comparing two generated layouts and quantifying their structural differences. Without this check, two brands could silently receive identical layouts and pass all individual QA gates.

This task addresses audit gap **QA-2** from the PDL domain audit and finding **F6** from the consolidated audit report.

## Context

The PDL architecture guarantees differentiation through two mechanisms:

1. **Family-level differentiation**: Brands with different archetypes resolve to different layout families (e.g., Innocent -> ETHEREAL, Explorer -> ADVENTUROUS-OPEN), producing fundamentally different layouts
2. **Personality modulation**: Brands that resolve to the SAME family but have different personality trait values still receive modulated token values (e.g., both WARM-ARTISAN but different whitespace multipliers and corner radii)

This task must detect both levels of differentiation.

## Workflow

### Phase 1: Brand Context Loading (3 min)

1. Load `brand-profile.yaml` for both brands
2. Extract for each brand:
   - Brand name
   - Primary archetype(s)
   - Personality trait values (formalCasual, traditionalModern, seriousPlayful, conservativeBold, minimalExpressive)
3. Determine expected layout family for each brand:
   - From `layout.json` if available
   - Otherwise from archetype-to-family mapping algorithm
4. Document the **expected differentiation level**:
   - **HIGH**: Different layout families (e.g., ETHEREAL vs ADVENTUROUS-OPEN)
   - **MEDIUM**: Same layout family but different personality trait values (>= 2 traits differ by >= 2 points)
   - **LOW**: Same family, similar personality traits -- minimal differentiation expected

### Phase 2: Visual Diff Comparison (10 min)

1. Capture full-page screenshot of Brand A layout at the comparison viewport (default: 1440px)
2. Capture full-page screenshot of Brand B layout at the same viewport
3. **Normalize for content**: Both screenshots should use the same page type (e.g., index/overview page). If content differs (different text, images), the diff must account for content-independent structural changes
4. Generate a visual diff overlay:
   - Use pixel-by-pixel comparison excluding:
     - Text content (different brand names, copy)
     - Color fills (different brand colors)
     - Logo/image content (different brand assets)
   - Focus structural comparison on:
     - Navigation position and type
     - Content area width and grid structure
     - Section spacing and vertical rhythm
     - Card/container shapes (corner radius)
     - Divider placement and style
     - Background treatment patterns
5. Calculate **visual diff percentage**: percentage of structurally different pixels after content normalization
6. Capture side-by-side comparison screenshot

### Phase 3: Dimensional Comparison (10 min)

Compare both layouts across all 7 layout dimensions. For each dimension, determine if the brands differ.

#### Dimension 1: Navigation Style
- Extract nav pattern from Brand A and Brand B
- **Different** if: nav patterns are different types (e.g., `centered-top` vs `sticky-minimal`)
- **Same** if: both use the same nav type

#### Dimension 2: Whitespace Density
- Measure section gaps and content padding for both brands
- **Different** if: effective whitespace multiplier differs by >= 0.2x (e.g., 1.0x vs 1.3x)
- **Same** if: whitespace multiplier difference < 0.2x

#### Dimension 3: Corner Radius
- Measure `border-radius` values on primary elements for both brands
- **Different** if: radius base differs by >= 6px OR falls in different classification (sharp vs rounded)
- **Same** if: radius difference < 6px AND same classification

#### Dimension 4: Divider Style
- Identify divider pattern for both brands
- **Different** if: divider types are different (e.g., `organic-wave` vs `thin-geometric`)
- **Same** if: both use the same divider type

#### Dimension 5: Animation Entrance
- Identify entrance animation type for both brands
- **Different** if: animation types differ (e.g., `fade-up` vs `scroll-reveal`)
- **Same** if: both use the same animation type

#### Dimension 6: Grid Rhythm
- Identify grid pattern and max-width for both brands
- **Different** if: grid patterns differ OR max-width differs by >= 100px
- **Same** if: same grid pattern AND max-width difference < 100px

#### Dimension 7: Section Background
- Identify section background treatment for both brands
- **Different** if: background treatments differ (e.g., `soft-fill` vs `dark-mono`)
- **Same** if: both use the same treatment

### Phase 4: Differentiation Scoring (5 min)

#### Composite Score Calculation

The differentiation score is a composite of two components:

**Component 1: Visual Diff Score (50% weight)**

| Visual Diff % | Score |
|---------------|-------|
| >= 30% | 100% |
| 20-29% | 80% |
| 15-19% | 60% |
| 10-14% | 40% |
| 5-9% | 20% |
| < 5% | 0% |

**Component 2: Dimensional Diff Score (50% weight)**

```
Dimensional Diff Score = (number of differing dimensions / 7) * 100%
```

**Composite Differentiation Score:**

```
Differentiation Score = (Visual Diff Score * 0.5) + (Dimensional Diff Score * 0.5)
```

#### Minimum Thresholds (both must pass independently)

| Threshold | Requirement | Rationale |
|-----------|-------------|-----------|
| Visual Diff | >= 15% structural pixel difference | Ensures layouts are perceptibly different to a viewer |
| Dimensional Diff | >= 3 of 7 dimensions differ | Ensures differentiation is structural, not just cosmetic |

#### Score Interpretation

| Composite Score | Rating | Verdict |
|-----------------|--------|---------|
| >= 70% | Strong Differentiation | PASS -- brands are clearly visually distinct |
| 50-69% | Adequate Differentiation | PASS WITH CONCERNS -- brands differ but could be more distinct |
| 30-49% | Weak Differentiation | FAIL -- brands are too similar for different personalities |
| < 30% | No Differentiation | FAIL -- brands are effectively identical in layout structure |

#### Context-Adjusted Expectations

The verdict must account for the expected differentiation level from Phase 1:

| Expected Level | Minimum Composite Score | Rationale |
|---------------|------------------------|-----------|
| HIGH (different families) | 60% | Different families should produce clearly distinct layouts |
| MEDIUM (same family, different traits) | 35% | Same family with modulation produces subtler differences |
| LOW (similar profiles) | 20% | Very similar brands may legitimately produce similar layouts |

### Phase 5: Report Generation (5 min)

#### Report Structure

```markdown
# Cross-Brand Layout Differentiation Report

## Summary
- **Brand A:** {brand_a_name} ({archetype_a}) -- Family: {family_a}
- **Brand B:** {brand_b_name} ({archetype_b}) -- Family: {family_b}
- **Expected Differentiation Level:** {HIGH|MEDIUM|LOW}
- **Composite Differentiation Score:** {score}% -- {verdict}

## Brand Profile Comparison

| Trait | Brand A | Brand B | Delta |
|-------|---------|---------|-------|
| Primary Archetype | {a} | {b} | {same/different} |
| formalCasual | {a} | {b} | {delta} |
| traditionalModern | {a} | {b} | {delta} |
| seriousPlayful | {a} | {b} | {delta} |
| conservativeBold | {a} | {b} | {delta} |
| minimalExpressive | {a} | {b} | {delta} |
| Resolved Family | {a} | {b} | {same/different} |

## Visual Diff Analysis
- **Structural Pixel Diff:** {diff}%
- **Visual Diff Score:** {score}%
- **Evidence:** See screenshots/ and diff_overlay.png

## Dimensional Comparison

| Dimension | Brand A | Brand B | Different? | Notes |
|-----------|---------|---------|:----------:|-------|
| Navigation Style | {a} | {b} | {Y/N} | {notes} |
| Whitespace Density | {a} | {b} | {Y/N} | {notes} |
| Corner Radius | {a} | {b} | {Y/N} | {notes} |
| Divider Style | {a} | {b} | {Y/N} | {notes} |
| Animation Entrance | {a} | {b} | {Y/N} | {notes} |
| Grid Rhythm | {a} | {b} | {Y/N} | {notes} |
| Section Background | {a} | {b} | {Y/N} | {notes} |

**Differing Dimensions:** {count}/7

## Scoring
- Visual Diff Score: {score}% (weight: 50%)
- Dimensional Diff Score: {score}% (weight: 50%)
- **Composite Score:** {composite}%
- **Context-Adjusted Minimum:** {minimum}% (for {level} differentiation)

## Verdict
{PASS|PASS WITH CONCERNS|FAIL}
{explanation of verdict}

## Recommendations (if FAIL)
{specific remediation guidance}
```

## Acceptance Criteria

- [ ] Both brand profiles loaded with archetypes and personality traits
- [ ] Expected layout family determined for both brands
- [ ] Expected differentiation level classified (HIGH/MEDIUM/LOW)
- [ ] Full-page screenshots captured for both layouts at comparison viewport
- [ ] Visual diff overlay generated with content-normalized structural comparison
- [ ] Visual diff percentage calculated
- [ ] All 7 layout dimensions compared with per-dimension different/same determination
- [ ] Composite differentiation score calculated (visual + dimensional)
- [ ] Minimum thresholds validated independently (visual >= 15%, dimensions >= 3/7)
- [ ] Context-adjusted expectations applied based on differentiation level
- [ ] Side-by-side comparison screenshots saved
- [ ] Report generated with full dimensional comparison and verdict

## Quality Gate

- Threshold: Composite differentiation score >= context-adjusted minimum
- For HIGH differentiation (different families): >= 60% composite AND >= 15% visual diff AND >= 3/7 dimensions differ
- For MEDIUM differentiation (same family, different traits): >= 35% composite AND >= 2/7 dimensions differ
- For LOW differentiation (similar profiles): >= 20% composite (informational, not blocking)
- Side-by-side comparison screenshots captured as evidence

## References

- PDL Architecture: `docs/architecture/personality-driven-layouts.md` (Section 3: Layout Family Taxonomy, Section 4: Archetype-to-Family Mapping)
- PDL Audit: `docs/reviews/pdl-audit-qa-bp.md` (Gap QA-2)
- Consolidated Audit: `docs/reviews/pdl-audit-consolidated.md` (Finding F6)
- PoC Comparison Brands: Stray Innocence (Innocent/Dreamer) vs Nova Vista Cafe (Explorer/Creator) per PDL-5/PDL-6

---
*QA Accessibility Squad Task - visual-qa*
