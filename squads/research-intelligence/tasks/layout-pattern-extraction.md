# layout-pattern-extraction

```yaml
task:
  id: layout-pattern-extraction
  name: Layout Pattern Extraction from Reference Sites
  agent: competitive-analyst
  squad: research-intelligence
  type: analysis
  elicit: false

inputs:
  required:
    - visual_references: "Output from visual-reference-research task (visual-references.md with 5-10 reference URLs and initial observations)"
    - brand_profile: "Brand profile YAML with archetypes and personality traits"
  optional:
    - layout_family: "Target PDL layout family (e.g., ethereal, adventurous-open) for focused extraction"
    - extraction_depth: "standard | deep (default: standard; deep adds pixel-level measurements)"
    - focus_dimensions: "Specific layout dimensions to prioritize (e.g., nav, grid, animation)"
    - trend_data: "Output from trend-report task for contextualizing extracted patterns against current trends"

outputs:
  - layout-patterns.md: "Complete structured layout pattern extraction with machine-readable data"
  - layout-dna.yaml: "Machine-readable layout DNA in YAML format for consumption by the Layout Personality Engine"
  - pattern-confidence.md: "Confidence assessment per pattern with source triangulation"

pre_conditions:
  - "visual-reference-research task completed with 5-10 reference sites"
  - "Reference URLs verified accessible"
  - "Brand profile with archetypes available"
  - "Web fetch tools accessible for page analysis"

post_conditions:
  - "All reference sites analyzed for 8 core layout dimensions"
  - "Layout DNA extracted in structured YAML format"
  - "Patterns validated across multiple references (triangulation)"
  - "Confidence levels assigned to each extracted pattern"
  - "Output directly consumable by layout brief generation (PDL-2)"
```

## Purpose

Analyze reference sites identified by `visual-reference-research.md` and extract detailed, structured layout patterns. This task transforms qualitative visual observations into quantitative, machine-readable layout specifications that can inform the Layout Personality Engine and layout brief generation.

Unlike the high-level layout observations in `visual-benchmark.md` (which notes "hero type: image/video" and "nav type: top bar"), this task performs **deep structural extraction** -- capturing corner radii values, whitespace ratios, grid column counts, animation timing functions, divider rendering techniques, and visual hierarchy approaches as structured data.

## Context: PDL Pipeline Position

```
Brand Profile --> Visual Reference Research --> [THIS TASK] --> Layout Brief --> AI Layout Generation
                  visual-reference-research.md   layout-pattern-extraction.md
```

This task addresses **PDL-2 data input** from the architecture document and resolves audit findings **RI-2** and **RI-5**.

## Layout Dimensions Schema

The 8 core layout dimensions to extract, aligned with the PDL Layout Token Architecture:

| # | Dimension | PDL Token Group | Extraction Focus |
|---|-----------|-----------------|------------------|
| 1 | **Navigation Style** | `layout.nav` | Pattern, position, behavior on scroll, width, height |
| 2 | **Grid Rhythm** | `layout.grid` | Column count, max-width, symmetry, content flow |
| 3 | **Whitespace Density** | `layout.whitespace` | Section gaps, content padding, vertical rhythm ratio |
| 4 | **Corner Radius** | `layout.corner` | Card corners, button corners, section corners, consistency |
| 5 | **Section Dividers** | `layout.divider` | Style, color, height, SVG vs CSS, spacing around dividers |
| 6 | **Animation Patterns** | `layout.animation` | Entrance type, duration, easing, scroll-triggered behavior |
| 7 | **Section Background** | `layout.section` | Treatment, hero height, color blocking, layering |
| 8 | **Component Shape** | `layout.component` | Card shape, shadow depth, element proportions |

## Workflow

### Phase 1: Reference Intake (5 min)

1. Read `visual-references.md` from the visual-reference-research task
2. Extract the list of 5-10 reference URLs with their initial layout observations
3. Prioritize references by alignment score (highest first)
4. Note the target archetype(s) and expected layout family

### Phase 2: Per-Site Deep Extraction (40 min)

For each reference site (5-10 sites), perform deep layout analysis using WebFetch or direct page inspection:

#### 2a. Navigation Analysis

Extract:
- **Pattern**: top-bar-horizontal | sidebar-fixed | breadcrumb-horizontal | sticky-minimal | floating-pill | inline-minimal | hamburger-hidden | other
- **Position**: top | left | right | bottom | floating
- **Scroll Behavior**: static | sticky-on-scroll | hide-on-scroll-down | transform-on-scroll | parallax
- **Visual Weight**: minimal (text-only) | moderate (text + subtle bg) | heavy (full bg + border)
- **Item Count Estimate**: number of primary nav items visible
- **Mobile Approach**: hamburger | bottom-tab | drawer | accordion | hidden

#### 2b. Grid Rhythm Analysis

Extract:
- **Grid Type**: strict-symmetric | editorial-wide | masonry-inspired | broken-asymmetric | single-column | centered-narrow | full-bleed-sections
- **Column Count (desktop)**: 1 | 2 | 3 | 4 | 6 | 12 | fluid
- **Max Content Width**: narrow (<800px) | medium (800-1100px) | wide (1100-1400px) | full (>1400px)
- **Gutter Width Impression**: tight (<16px) | standard (16-24px) | generous (24-40px) | spacious (>40px)
- **Vertical Rhythm Consistency**: strict (uniform section heights) | varied (intentionally different) | organic (natural flow)
- **Content Alignment**: left | center | justified | mixed

#### 2c. Whitespace Density Analysis

Extract:
- **Density Class**: compact (0.7x-0.8x) | balanced (0.9x-1.1x) | generous (1.2x-1.4x) | spacious (1.5x+)
- **Section Gap Impression**: tight (<48px) | standard (48-72px) | generous (72-96px) | dramatic (>96px)
- **Content Padding Impression**: tight (<32px) | standard (32-60px) | generous (60-96px) | dramatic (>96px)
- **Vertical Rhythm**: tight line-heights (<1.4) | standard (1.4-1.6) | relaxed (1.6-1.8) | airy (>1.8)
- **Empty Space Strategy**: functional-minimal | breathing-room | intentional-void | asymmetric-balance

#### 2d. Corner Radius Analysis

Extract:
- **Dominant Radius Range**: sharp (0-2px) | subtle (4-8px) | rounded (12-16px) | super-rounded (20-24px) | pill (999px)
- **Consistency**: all-same | varied-by-size (larger elements = larger radius) | mixed (no clear pattern)
- **Card Corners**: specific radius observed
- **Button Corners**: specific radius observed
- **Input/Form Corners**: specific radius observed
- **Section/Container Corners**: specific radius observed
- **Image Corners**: specific radius observed (clipped or not)

#### 2e. Section Divider Analysis

Extract:
- **Style**: none | solid-thin (1px) | solid-thick (2-3px) | organic-wave (SVG) | textured-line (CSS gradient) | thin-geometric (dashed/dotted) | zigzag-wave (SVG) | slash-raw (CSS transform) | gradient-fade | whitespace-only
- **Frequency**: every-section | alternating | selective | none
- **Color Relationship**: matches-text | matches-border | accent | subtle-neutral | transparent
- **Spacing Around**: tight (same as section gap) | extra (additional padding around divider)

#### 2f. Animation Pattern Analysis

Extract:
- **Entrance Type**: none | fade-up | fade-in | slide-in-left | slide-in-right | scale-up | blur-in | scroll-reveal | bounce-in | cut-in (instant with no ease)
- **Duration Range**: instant (<100ms) | fast (100-200ms) | standard (200-400ms) | slow (400-600ms) | cinematic (>600ms)
- **Easing**: linear | ease-in | ease-out | ease-in-out | spring/bounce | custom-cubic-bezier
- **Scroll Behavior**: none | parallax-background | scroll-triggered-reveal | scroll-driven-progress | sticky-sections
- **Hover Effects**: none | subtle (opacity/color) | moderate (transform/shadow) | dramatic (3D/morph)
- **Page Transitions**: none | fade | slide | morph

#### 2g. Section Background Analysis

Extract:
- **Treatment**: flat-solid | soft-fill (subtle tint) | layered-shadow | full-bleed-image | alternating-accent | dark-mono | gradient | texture-overlay | video-background
- **Hero Height Impression**: compact (<40vh) | standard (40-60vh) | tall (60-80vh) | full-screen (100vh)
- **Color Blocking**: monochrome | alternating-light-dark | gradient-flow | accent-sections | full-image-sections
- **Layering**: flat | subtle-depth (light shadows) | deep-layered (overlapping sections) | parallax-layers

#### 2h. Component Shape Analysis

Extract:
- **Card Shape**: sharp-rectangle | subtle-rounded | rounded | pill-shaped | custom-organic
- **Shadow Depth**: none | light (0-4px blur) | medium (8-16px blur) | deep (24px+ blur) | colored-shadow
- **Button Style**: rectangle | rounded | pill | text-only | icon-only | ghost/outline
- **Element Proportions**: uniform (same sizes) | hierarchy-driven (varied) | organic (irregular)

### Phase 3: Cross-Reference Triangulation (15 min)

1. For each layout dimension, compile all extracted values across all reference sites
2. Identify the **dominant pattern** (mode/most frequent value)
3. Identify **outliers** (values that differ significantly from the dominant pattern)
4. Assign confidence levels:

   | Confidence | Criteria |
   |------------|----------|
   | HIGH | Pattern consistent across >= 70% of references |
   | MEDIUM | Pattern consistent across 40-69% of references |
   | LOW | Pattern consistent across < 40% of references OR only 1-2 references analyzed |

5. For LOW confidence patterns, note the variation range and recommend which extreme to select based on archetype personality

### Phase 4: Layout DNA Synthesis (15 min)

Generate the structured `layout-dna.yaml` output:

1. For each dimension, select the recommended value based on:
   - Dominant pattern across references (weight: 0.5)
   - Strongest alignment with target archetype (weight: 0.3)
   - Current design trends from trend data, if available (weight: 0.2)

2. Map each recommended value to the corresponding PDL token format
3. Include the reasoning for each selection
4. Note any values where the archetype expectation contradicts the reference evidence

### Phase 5: Validation & Report (10 min)

1. Verify all 8 dimensions have extracted data
2. Verify layout-dna.yaml is complete and parseable
3. Write confidence assessment report
4. Note any dimensions that need additional references for higher confidence
5. Compile final output documents

## Output Templates

### layout-patterns.md

```markdown
# Layout Pattern Extraction: [Brand Name]

## Extraction Parameters
- **Source:** visual-references.md ([N] reference sites analyzed)
- **Target Archetypes:** [Primary], [Secondary]
- **Expected Layout Family:** [Family]
- **Extraction Depth:** [standard/deep]
- **Date:** [YYYY-MM-DD]
- **Analyst:** Cyrus (competitive-analyst)

## Per-Site Extraction

### Site 1: [Brand/Site Name] ([URL])
**Alignment Score:** [X.X]/5.0

| Dimension | Extracted Value | Notes |
|-----------|----------------|-------|
| Nav Style | [value] | [observation] |
| Grid Rhythm | [value] | [observation] |
| Whitespace | [value] | [observation] |
| Corner Radius | [value] | [observation] |
| Dividers | [value] | [observation] |
| Animations | [value] | [observation] |
| Section BG | [value] | [observation] |
| Component Shape | [value] | [observation] |

**Standout Layout Decisions:**
- [Notable decision 1]
- [Notable decision 2]

---

### Site 2: [Brand/Site Name] ([URL])
[Same structure...]

---

## Cross-Reference Analysis

### Dimension: Navigation Style
| Site | Value | Weight (by alignment) |
|------|-------|-----------------------|
| [Site 1] | [value] | [score] |
| [Site 2] | [value] | [score] |
| ... | ... | ... |

**Dominant Pattern:** [value] ([X]% of references)
**Confidence:** [HIGH/MEDIUM/LOW]
**Archetype Fit:** [How well this matches the target archetype]

### Dimension: Grid Rhythm
[Same structure for all 8 dimensions...]

## Recommended Layout DNA

| Dimension | Recommended Value | PDL Token | Confidence | Source |
|-----------|-------------------|-----------|------------|--------|
| Nav Style | [value] | nav.style: [token_value] | [H/M/L] | [X/N sites] |
| Grid Rhythm | [value] | grid.rhythm: [token_value] | [H/M/L] | [X/N sites] |
| Whitespace | [value] | whitespace.density: [token_value] | [H/M/L] | [X/N sites] |
| Corner Radius | [range] | corner.radiusBase: [token_value] | [H/M/L] | [X/N sites] |
| Dividers | [value] | divider.style: [token_value] | [H/M/L] | [X/N sites] |
| Animations | [value] | animation.entrance: [token_value] | [H/M/L] | [X/N sites] |
| Section BG | [value] | section.background: [token_value] | [H/M/L] | [X/N sites] |
| Component Shape | [value] | component.cardShape: [token_value] | [H/M/L] | [X/N sites] |

## Archetype Contradictions
[Any dimensions where reference evidence contradicts archetype expectations]

## Sources
- [Reference 1 URL] -- analyzed [date]
- [Reference 2 URL] -- analyzed [date]
```

### layout-dna.yaml

```yaml
# Layout DNA extracted from visual reference research
# Generated by: layout-pattern-extraction task
# Date: [YYYY-MM-DD]
# Brand: [Brand Name]
# Archetypes: [Primary, Secondary]
# Layout Family: [Family]
# References Analyzed: [N]

layout_dna:
  nav:
    style: "[centered-top|sidebar-fixed|breadcrumb-horizontal|sticky-minimal|floating-pill|inline-minimal]"
    scroll_behavior: "[static|sticky-on-scroll|hide-on-scroll-down|transform-on-scroll]"
    visual_weight: "[minimal|moderate|heavy]"
    confidence: "[HIGH|MEDIUM|LOW]"
    source_count: "[X/N]"
    reasoning: "[Why this value was selected]"

  grid:
    rhythm: "[strict-symmetric|editorial-wide|masonry-inspired|broken-asymmetric|single-column|centered-narrow]"
    columns_desktop: "[1|2|3|4|6|12|fluid]"
    max_width: "[narrow|medium|wide|full]"
    max_width_px: "[estimated px value]"
    gutter: "[tight|standard|generous|spacious]"
    confidence: "[HIGH|MEDIUM|LOW]"
    source_count: "[X/N]"
    reasoning: "[Why this value was selected]"

  whitespace:
    density: "[compact|balanced|generous|spacious]"
    multiplier: "[0.7|0.8|1.0|1.3|1.5]"
    section_gap: "[tight|standard|generous|dramatic]"
    section_gap_px: "[estimated px value]"
    content_padding: "[tight|standard|generous|dramatic]"
    content_padding_px: "[estimated px value]"
    confidence: "[HIGH|MEDIUM|LOW]"
    source_count: "[X/N]"
    reasoning: "[Why this value was selected]"

  corner:
    radius_class: "[sharp|subtle|rounded|super-rounded|pill]"
    radius_base_px: "[estimated px value]"
    consistency: "[all-same|varied-by-size|mixed]"
    confidence: "[HIGH|MEDIUM|LOW]"
    source_count: "[X/N]"
    reasoning: "[Why this value was selected]"

  divider:
    style: "[none|solid-thin|solid-thick|organic-wave|textured-line|thin-geometric|zigzag-wave|slash-raw|gradient-fade|whitespace-only]"
    frequency: "[every-section|alternating|selective|none]"
    color_relationship: "[matches-text|matches-border|accent|subtle-neutral|transparent]"
    confidence: "[HIGH|MEDIUM|LOW]"
    source_count: "[X/N]"
    reasoning: "[Why this value was selected]"

  animation:
    entrance: "[none|fade-up|fade-in|slide-in|scroll-reveal|bounce-in|cut-in|blur-in]"
    duration_class: "[instant|fast|standard|slow|cinematic]"
    duration_ms: "[estimated ms value]"
    easing: "[linear|ease-out|ease-in-out|spring|custom]"
    scroll_behavior: "[none|parallax|scroll-triggered|scroll-driven|sticky-sections]"
    confidence: "[HIGH|MEDIUM|LOW]"
    source_count: "[X/N]"
    reasoning: "[Why this value was selected]"

  section:
    background: "[flat-solid|soft-fill|layered-shadow|full-bleed-image|alternating-accent|dark-mono|gradient|texture-overlay]"
    hero_height: "[compact|standard|tall|full-screen]"
    hero_height_vh: "[estimated vh value]"
    color_blocking: "[monochrome|alternating|gradient-flow|accent-sections|full-image]"
    confidence: "[HIGH|MEDIUM|LOW]"
    source_count: "[X/N]"
    reasoning: "[Why this value was selected]"

  component:
    card_shape: "[sharp-rectangle|subtle-rounded|rounded|pill-shaped|custom-organic]"
    shadow_depth: "[none|light|medium|deep|colored]"
    button_style: "[rectangle|rounded|pill|text-only|ghost]"
    confidence: "[HIGH|MEDIUM|LOW]"
    source_count: "[X/N]"
    reasoning: "[Why this value was selected]"

metadata:
  total_references: "[N]"
  high_confidence_dimensions: "[count]"
  medium_confidence_dimensions: "[count]"
  low_confidence_dimensions: "[count]"
  archetype_contradictions: "[count]"
  extraction_depth: "[standard|deep]"
```

## Acceptance Criteria

- [ ] All reference sites from visual-references.md analyzed
- [ ] All 8 layout dimensions extracted per reference site
- [ ] Cross-reference triangulation completed with dominant patterns identified
- [ ] Confidence levels assigned to all 8 dimensions (HIGH/MEDIUM/LOW)
- [ ] layout-dna.yaml generated with all fields populated
- [ ] PDL token equivalents mapped for each recommended value
- [ ] Reasoning documented for each layout DNA selection
- [ ] Archetype contradictions noted (if any)
- [ ] Sources cited with access dates
- [ ] Output is directly consumable by layout brief generation

## Quality Gate

| Criterio | Threshold | Obrigatorio |
|----------|-----------|-------------|
| Sites de referencia analisados | 100% das referencias do input | Sim |
| Dimensoes de layout extraidas por site | >=6 de 8 dimensoes | Sim |
| Cross-reference triangulation completa | 100% das dimensoes | Sim |
| Confidence levels atribuidos | 100% das dimensoes | Sim |
| layout-dna.yaml completo e parseavel | 100% dos campos | Sim |
| PDL token equivalents mapeados | >=6 de 8 dimensoes | Sim |
| Reasoning documentado por selecao | 100% | Sim |
| Fontes citadas com datas de acesso | 100% | Sim |
| Completude do output | 100% | Sim |

**Pass threshold:** >70% em todos os criterios obrigatorios

## Relationship to Other Tasks

| Task | Relationship |
|------|-------------|
| `visual-reference-research.md` | UPSTREAM -- this task consumes the visual-references.md output containing reference URLs and initial layout observations. |
| `visual-benchmark.md` | COMPLEMENTARY -- visual-benchmark does high-level competitor layout analysis. This task does deep structural extraction on archetype-aligned references. Both can inform the layout brief from different angles. |
| `trend-report.md` | INFORMING -- trend data (Layout & UI Patterns category) contextualizes extracted patterns against current market trends, helping weight selections. |
| Layout Brief (PDL-2, @architect) | DOWNSTREAM -- layout-dna.yaml is a primary input for the architect's layout brief generation, which then feeds the Layout Personality Engine. |

---
*Research Intelligence Squad Task*
