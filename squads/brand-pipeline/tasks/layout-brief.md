# layout-brief

```yaml
task:
  id: layout-brief
  name: Layout Brief Generation
  agent: architect
  squad: brand-pipeline
  type: analysis
  elicit: false

inputs:
  required:
    - visual_references: "Output from PDL-1 visual-reference-research task"
    - brand_profile: "Brand profile YAML with archetypes and personality traits"
  optional:
    - layout_override: "Manual layout family override (bypasses auto-resolution)"
    - build_type: "Target build type: brand-book, landing-page, site, social-post"

outputs:
  - layout-brief.md: "Structured layout brief with spatial recommendations"

pre_conditions:
  - "visual-references.md exists with 5-10 reference sites"
  - "brand-profile.yaml has archetypes and personality_traits"

post_conditions:
  - "layout-brief.md covers all 7 layout dimensions"
  - "Each recommendation cites source references"
  - "Layout family suggestion with confidence score"
```

## Purpose

Analyze visual references (from PDL-1) alongside the brand profile to produce a structured layout brief with concrete spatial recommendations. This brief drives downstream layout generation (PDL-4+), providing @dev with clear structural guidelines for producing unique HTML/CSS layouts per brand.

## Context: PDL Pipeline Position

```
Brand Profile + visual-references.md --> [THIS TASK] --> Layout Generation
                                         layout-brief.md
```

This task addresses **PDL-2** from the architecture document. It consumes the output of PDL-1 (visual-reference-research) and produces input for PDL-4 (layout generation).

## Valid Enumerations

### Layout Families (6)

| Family | Description |
|--------|-------------|
| `ethereal` | Soft, rounded, spacious, gentle, light |
| `bold-structured` | Sharp, structured, high-contrast, commanding |
| `warm-artisan` | Warm, textured, handcrafted, layered |
| `adventurous-open` | Expansive, editorial, scroll-driven, discovery |
| `playful-dynamic` | Energetic, asymmetric, colorful, surprising |
| `rebel-edge` | Raw, high-contrast, dark, unpolished |

### Navigation Styles (6)

| Style | Description |
|-------|-------------|
| `centered-top` | Centered logo with symmetrical nav links |
| `sidebar-fixed` | Persistent sidebar navigation |
| `breadcrumb-horizontal` | Breadcrumb-style horizontal path |
| `sticky-minimal` | Minimal sticky top bar that shrinks on scroll |
| `floating-pill` | Floating pill-shaped nav overlay |
| `inline-minimal` | Inline text-style navigation within content |

### Whitespace Density Classes

| Density | Multiplier Range | Description |
|---------|-----------------|-------------|
| `compact` | 0.7 - 0.9 | Tight spacing, information-dense |
| `balanced` | 1.0 - 1.1 | Standard spacing |
| `generous` | 1.2 - 1.4 | Open feel with breathing room |
| `spacious` | 1.5 - 2.0 | Luxurious whitespace, editorial |

### Corner Treatments (4)

| Treatment | Radius Range | Description |
|-----------|-------------|-------------|
| `sharp` | 0 - 2px | Precise, corporate, structured |
| `subtle` | 4 - 8px | Gentle softening |
| `rounded` | 12 - 16px | Friendly, approachable |
| `pill` | 24px+ | Playful, modern, organic |

### Divider Styles (8)

| Style | Description |
|-------|-------------|
| `solid-thin` | Clean 1px solid line |
| `solid-thick` | Bold 2-4px solid line |
| `organic-wave` | Curved SVG wave divider |
| `textured-line` | Hand-drawn or textured line |
| `thin-geometric` | Thin geometric pattern (dots, dashes) |
| `zigzag-wave` | Angular zigzag wave pattern |
| `slash-raw` | Diagonal slash or raw cut |
| `none` | No visible section dividers |

### Grid Rhythms (6)

| Rhythm | Description |
|--------|-------------|
| `centered-single` | Single centered column layout |
| `strict-grid` | Rigid multi-column grid |
| `masonry-inspired` | Pinterest-style variable height |
| `editorial-wide` | Wide editorial 2-column layout |
| `broken-asymmetric` | Intentionally off-grid placement |
| `single-column-stacked` | Full-width stacked sections |

### Animation Entrance Types (6)

| Entrance | Description |
|----------|-------------|
| `none` | No entrance animation |
| `fade-up` | Fade in while sliding up |
| `slide-in` | Slide in from side |
| `scroll-reveal` | Progressive reveal on scroll |
| `bounce-in` | Bouncy elastic entrance |
| `cut-in` | Hard cut / instant appear |

### Section Background Types (6)

| Background | Description |
|------------|-------------|
| `flat-solid` | Single solid color background |
| `soft-fill` | Subtle gradient or tinted fill |
| `layered-shadow` | Layered with shadows and depth |
| `full-bleed-image` | Full-width background image |
| `alternating-accent` | Alternating light/accent sections |
| `dark-mono` | Dark monochrome background |

## Workflow

### Phase 1: Input Analysis (10 min)

1. **Read visual-references.md** and extract:
   - Number of references collected
   - Dominant patterns table (from the Pattern Summary section)
   - Per-reference layout observations (nav_style, whitespace_density, corner_treatment, divider_style, grid_rhythm, animation_approach, section_backgrounds)
   - Alignment scores per reference

2. **Read brand-profile.yaml** and extract:
   - Primary archetype (highest weight)
   - Secondary archetype (if present)
   - Personality trait scales: formal_casual, traditional_modern, serious_playful, conservative_bold, minimal_expressive (each 1-5)

3. **Map archetypes to layout families** using the PDL mapping:

   | Archetype | Primary Layout Family |
   |-----------|----------------------|
   | Innocent | ethereal |
   | Dreamer | ethereal |
   | Lover | ethereal |
   | Creator | warm-artisan |
   | Caregiver | warm-artisan |
   | Everyman | warm-artisan |
   | Explorer | adventurous-open |
   | Sage | adventurous-open |
   | Ruler | bold-structured |
   | Hero | bold-structured |
   | Jester | playful-dynamic |
   | Magician | playful-dynamic |
   | Rebel | rebel-edge |
   | Outlaw | rebel-edge |

4. **Check for layout_override input**: If `layout_override` is provided, use that family directly (skip auto-resolution) and note the override in the brief.

### Phase 2: Reference Synthesis (15 min)

For each of the **7 layout dimensions**, analyze what the references show:

1. **Navigation**: Tally nav styles observed across references. Identify the dominant style (most frequent) and any notable alternatives.

2. **Whitespace**: Assess overall density impression. Average any quantitative observations. Note extremes.

3. **Corners**: Identify prevalent corner radius approach. Note if references are consistent or mixed.

4. **Dividers**: Catalog divider approaches observed. Identify dominant pattern.

5. **Grid**: Assess grid rhythm patterns. Note column counts and max widths observed.

6. **Animation**: Catalog entrance animation types observed. Note duration ranges.

7. **Sections**: Assess background treatment patterns. Note hero height tendencies.

For each dimension, record:
- **Dominant pattern**: The consensus across 3+ references
- **Divergent patterns**: Where references disagree
- **Archetype alignment**: How well the dominant pattern fits the target archetype

### Phase 3: Spatial Recommendations (15 min)

Produce concrete recommendations for each of the 7 dimensions:

#### Navigation
- **style**: One of 6 valid navigation styles (see enumerations above)
- **justification**: Which references and archetype traits informed this choice

#### Whitespace
- **density**: One of 4 density classes (compact, balanced, generous, spacious)
- **multiplier**: Numeric multiplier (0.7 - 2.0)
- **section_gap**: Section gap in pixels (e.g., "72px")
- **content_padding**: Content padding in pixels (e.g., "64px")

#### Corners
- **radius_base**: Base corner radius in pixels (e.g., "6px")
- **treatment**: One of 4 treatments (sharp, subtle, rounded, pill)

#### Dividers
- **style**: One of 8 valid divider styles (see enumerations above)

#### Grid
- **rhythm**: One of 6 valid grid rhythms (see enumerations above)
- **max_width**: Maximum content width in pixels (e.g., "1100px")
- **columns**: Number of primary columns (1-12)

#### Animation
- **entrance**: One of 6 valid entrance types (see enumerations above)
- **duration**: Animation duration in milliseconds (e.g., "400ms")

#### Sections
- **background**: One of 6 valid background types (see enumerations above)
- **hero_height**: Hero section height in vh or px (e.g., "70vh")

### Phase 4: Family Suggestion (5 min)

Based on the archetype-to-family mapping (Phase 1) and reference synthesis (Phase 2):

1. **Suggest primary layout family**: The family that best matches the brand's archetype combination and reference patterns.
   - **confidence**: Float 0-1 representing how strongly the data supports this family.
     - 0.9-1.0: Very strong archetype + reference alignment
     - 0.7-0.89: Strong primary archetype match with some reference divergence
     - 0.5-0.69: Moderate match, mixed signals from references
     - Below 0.5: Weak match, consider manual override

2. **Suggest fallback family**: The second-best family (must be different from primary).

3. **Provide reasoning**: A sentence explaining which archetypes + personality traits + reference patterns led to this suggestion.

### Phase 5: Brief Assembly (10 min)

Compile all recommendations into the output format below. For each recommendation:
- Ensure the value is from the valid enumeration
- Ensure the justification cites at least one reference URL or archetype trait
- Ensure spacing values are reasonable (no negative values, no extreme values)

## Output Template

```yaml
brand: "{brand-name}"
date: "YYYY-MM-DD"
sources:
  visual_references: "path/to/visual-references.md"
  brand_profile: "path/to/brand-profile.yaml"

family_suggestion:
  primary: "adventurous-open"
  confidence: 0.85
  fallback: "warm-artisan"
  reasoning: "Explorer primary archetype + bold=4 + modern=4"

recommendations:
  navigation:
    style: "sticky-minimal"
    justification: "References 1, 3, 7 use sticky nav; matches Explorer archetype"
  whitespace:
    density: "generous"
    multiplier: 1.3
    section_gap: "72px"
    content_padding: "64px"
  corners:
    radius_base: "6px"
    treatment: "subtle"
  dividers:
    style: "thin-geometric"
  grid:
    rhythm: "editorial-wide"
    max_width: "1100px"
    columns: 2
  animation:
    entrance: "scroll-reveal"
    duration: "400ms"
  sections:
    background: "full-bleed-image"
    hero_height: "70vh"
```

## Acceptance Criteria

- [ ] Brief covers all 7 layout dimensions with concrete values from valid enumerations
- [ ] Each recommendation includes justification citing reference URLs or archetype traits
- [ ] Family suggestion includes primary + fallback (different families) with confidence score 0-1
- [ ] Spacing values are concrete (px, vh, ms units) not vague descriptors
- [ ] All navigation styles, divider styles, grid rhythms, animation entrances, and backgrounds use valid enumeration values
- [ ] layout_override input bypasses auto-resolution when provided
- [ ] Brief is structured as YAML-parseable output

## Quality Gate

| Criterion | Threshold | Required |
|-----------|-----------|----------|
| All 7 dimensions covered | 100% | Yes |
| Valid enumeration values used | 100% | Yes |
| Reference citations present | >= 5 of 7 dimensions cite references | Yes |
| Confidence score in range | 0 <= confidence <= 1 | Yes |
| Primary != fallback family | Must differ | Yes |
| Spacing values have units | 100% | Yes |

**Pass threshold:** All required criteria must pass.

## Relationship to Other Tasks

| Task | Relationship |
|------|-------------|
| `visual-reference-research.md` (R-I squad) | UPSTREAM -- this task consumes its output (visual-references.md) |
| Layout Generation (PDL-4) | DOWNSTREAM -- this task produces the brief that drives layout token generation |
| `brand-profile.yaml` | INPUT -- brand archetypes and personality traits inform family resolution |
| `full-brand-pipeline.yaml` | WORKFLOW -- this task is Phase 3 (layout-brief) in the full brand pipeline |

---
*Brand Pipeline Squad Task*
