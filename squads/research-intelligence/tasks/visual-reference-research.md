# visual-reference-research

```yaml
task:
  id: visual-reference-research
  name: Visual Reference Research by Archetype
  agent: competitive-analyst
  squad: research-intelligence
  type: research
  elicit: false

inputs:
  required:
    - brand_profile: "Brand profile YAML with archetypes and personality traits"
    - archetypes: "1-3 brand archetypes from the Jungian framework (e.g., Explorer, Creator, Innocent)"
    - industry: "Industry vertical for contextualizing visual references"
  optional:
    - mood_keywords: "Additional mood/aesthetic keywords (e.g., ethereal, bold, handcrafted)"
    - geographic_focus: "Geographic region for cultural relevance (default: global)"
    - exclude_urls: "URLs to exclude from results (e.g., already-analyzed competitors)"
    - layout_families: "Target PDL layout families to bias search toward (e.g., ethereal, adventurous-open)"
    - min_references: "Minimum number of reference sites to collect (default: 5, max: 10)"

outputs:
  - visual-references.md: "Complete visual reference collection with URLs, descriptions, and alignment scores"
  - reference-screenshots.md: "Screenshot descriptions and visual notes per reference site"
  - archetype-alignment-matrix.md: "Matrix scoring each reference against archetype dimensions"

pre_conditions:
  - "Brand profile with archetypes and personality traits available"
  - "Industry context established"
  - "Web search tools accessible (EXA Search, WebSearch, or Apify)"

post_conditions:
  - "5-10 reference sites collected per archetype combination"
  - "Each reference scored for archetype alignment"
  - "Layout-relevant observations documented per site"
  - "All URLs validated and accessible"
  - "Sources include award sites, portfolios, and industry leaders"
```

## Purpose

Research and collect visual references from real-world websites that exemplify specific brand archetypes. This task is the first step in the PDL (Personality-Driven Layouts) pipeline, feeding into layout pattern extraction and ultimately the layout brief that drives AI layout generation.

Unlike `visual-benchmark.md` (which analyzes specific competitor URLs provided by the user), this task performs **proactive, archetype-driven discovery** -- searching for sites that express a particular brand personality regardless of whether they are competitors.

## Context: PDL Pipeline Position

```
Brand Profile --> [THIS TASK] --> Layout Pattern Extraction --> Layout Brief --> AI Layout Generation
                  visual-reference-research.md    layout-pattern-extraction.md
```

This task addresses **PDL-1** from the architecture document and resolves audit findings **RI-1** and **RI-3**.

## Workflow

### Phase 1: Archetype Interpretation (10 min)

1. Read the brand profile and extract:
   - Primary archetype (weight 1.0)
   - Secondary archetype (weight 0.6)
   - Tertiary archetype, if present (weight 0.3)
   - Personality trait scales (formal_casual, traditional_modern, serious_playful, conservative_bold, minimal_expressive)

2. Map archetypes to visual DNA keywords using the PDL Layout Family Taxonomy:

   | Archetype | Visual DNA Keywords | Associated Layout Family |
   |-----------|-------------------|------------------------|
   | Innocent | soft, rounded, spacious, gentle, light, pastel | ETHEREAL |
   | Dreamer | ethereal, flowing, centered, organic, airy | ETHEREAL |
   | Creator | warm, textured, handcrafted, layered, artisan | WARM-ARTISAN |
   | Caregiver | warm, inviting, rounded, accessible, nurturing | WARM-ARTISAN |
   | Explorer | expansive, editorial, scroll-driven, discovery, bold imagery | ADVENTUROUS-OPEN |
   | Sage | clean, structured, editorial, wide, intellectual | ADVENTUROUS-OPEN |
   | Ruler | sharp, structured, high-contrast, commanding, precise | BOLD-STRUCTURED |
   | Hero | bold, powerful, structured, strong typography, authoritative | BOLD-STRUCTURED |
   | Jester | energetic, asymmetric, colorful, surprising, bouncy | PLAYFUL-DYNAMIC |
   | Magician | dynamic, transformative, interactive, unexpected | PLAYFUL-DYNAMIC |
   | Rebel | raw, high-contrast, dark, unpolished, aggressive | REBEL-EDGE |
   | Outlaw | edgy, unconventional, bold, minimal chrome | REBEL-EDGE |
   | Everyman | approachable, familiar, warm, balanced | WARM-ARTISAN |
   | Lover | elegant, sensual, soft, luxurious, flowing | ETHEREAL |

3. Generate a search strategy combining:
   - Archetype visual DNA keywords
   - Industry vertical terms
   - Optional mood keywords from input
   - Layout-specific terms (e.g., "full-bleed hero", "minimal navigation", "editorial grid")

### Phase 2: Source Discovery (30 min)

Search across multiple source categories to find 15-25 candidate sites:

#### 2a. Award Sites (3-5 results)
Search queries (adapt to archetype):
- `site:awwwards.com {archetype visual DNA keywords} {industry}`
- `site:cssdesignawards.com {archetype visual DNA keywords}`
- `site:thefwa.com {archetype keywords}`
- `"site of the day" {archetype visual DNA} {industry}`

#### 2b. Design Portfolios (2-4 results)
Search queries:
- `site:dribbble.com web design {archetype visual DNA keywords}`
- `site:behance.net web design {archetype visual DNA keywords} {industry}`
- `{archetype} brand website design case study`

#### 2c. Industry Leaders (3-5 results)
Search queries:
- `best {industry} website design {current year}`
- `{industry} brand {archetype visual DNA} website`
- `top {industry} websites {archetype mood}`

#### 2d. Curated Collections (2-3 results)
Search queries:
- `site:siteinspire.com {archetype visual DNA keywords}`
- `site:onepagelove.com {archetype keywords}`
- `site:lapa.ninja {archetype keywords}`
- `site:godly.website {archetype keywords}`

#### 2e. Archetype-Specific Search (2-3 results)
Search queries:
- `"{archetype name}" brand identity website`
- `{layout family name} aesthetic website design`
- `{visual DNA keyword 1} {visual DNA keyword 2} web design`

### Phase 3: Candidate Evaluation (20 min)

For each candidate site (15-25 sites), perform a quick evaluation:

1. **Accessibility check**: Is the site live and loading?
2. **Visual personality match**: Does the overall aesthetic match the target archetype?
3. **Layout relevance**: Does the site demonstrate interesting layout decisions (not just color/type)?
4. **Quality threshold**: Is it professionally designed (not a template or low-effort site)?
5. **Diversity check**: Does it add something different from already-selected references?

Score each candidate on a 1-5 scale across these dimensions:

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Archetype Alignment | 30% | How well does the site embody the target archetype visual personality? |
| Layout Interest | 25% | Does the site demonstrate noteworthy layout decisions (grid, spacing, nav, sections)? |
| Design Quality | 20% | Overall design quality and execution |
| Industry Relevance | 15% | How relevant is the site to the target industry? |
| Uniqueness | 10% | Does it bring a unique perspective vs. other selected references? |

**Selection threshold:** Sites scoring >= 3.0 weighted average advance to final selection.

### Phase 4: Deep Documentation (25 min)

For each of the 5-10 selected reference sites, document:

1. **Basic Information**
   - URL
   - Brand name
   - Industry
   - Award recognition (if any)
   - Date accessed

2. **Archetype Expression**
   - Which archetype traits are expressed and how
   - Personality scale estimates (formal_casual, traditional_modern, etc.)
   - Emotional impression in 2-3 words

3. **Layout Observations** (critical for PDL pipeline)
   - Navigation style observed (top-bar, sidebar, sticky, floating, inline, breadcrumb)
   - Hero section type (full-bleed image, video, illustration, text-only, split, parallax)
   - Grid rhythm (strict symmetric, editorial wide, masonry, broken asymmetric, single column)
   - Whitespace density impression (compact, balanced, generous, spacious)
   - Section divider approach (solid line, organic/wave, geometric, gradient, none)
   - Corner radius tendency (sharp 0-2px, subtle 4-8px, rounded 12-16px, pill 24px+)
   - Animation patterns observed (none, fade, slide, scroll-reveal, bounce, parallax)
   - Color blocking strategy (flat solid, gradient, layered, alternating, dark mono)

4. **Visual Evidence Notes**
   - Key visual elements that make this site a strong reference
   - What specifically makes it align with the target archetype
   - Any surprising or unconventional layout decisions

5. **Alignment Score**
   - Overall weighted score from Phase 3
   - Breakdown per dimension

### Phase 5: Synthesis (15 min)

1. **Pattern Summary**: Identify common layout patterns across the selected references
2. **Archetype-Layout Correlation**: Note which layout decisions most strongly express the target archetype
3. **Recommendations**: Suggest which references are strongest for informing the layout brief
4. **Gaps**: Note any aspects of the archetype that are underrepresented in found references
5. **Cross-Reference**: If multiple archetypes are present (e.g., Explorer + Creator), note sites that bridge both

## Output Template

```markdown
# Visual Reference Research: [Brand Name]

## Research Parameters
- **Archetypes:** [Primary] (1.0), [Secondary] (0.6), [Tertiary] (0.3)
- **Industry:** [Industry]
- **Target Layout Family:** [Family Name] (from PDL mapping)
- **Mood Keywords:** [keywords]
- **Date:** [YYYY-MM-DD]
- **Researcher:** Cyrus (competitive-analyst)

## Reference Collection

### Reference 1: [Brand/Site Name]

**URL:** [https://...]
**Industry:** [industry]
**Awards:** [Awwwards SOTD / CSS Design Awards / None]
**Alignment Score:** [X.X]/5.0

**Archetype Expression:**
- Traits observed: [list]
- Emotional impression: [2-3 words]
- Personality estimates: formal_casual=[X], traditional_modern=[X], conservative_bold=[X], minimal_expressive=[X]

**Layout Observations:**
| Dimension | Observation | PDL Token Equivalent |
|-----------|-------------|---------------------|
| Nav Style | [observed] | nav.style: [value] |
| Hero Section | [observed] | section.heroHeight: [value] |
| Grid Rhythm | [observed] | grid.rhythm: [value] |
| Whitespace | [observed] | whitespace.density: [value] |
| Dividers | [observed] | divider.style: [value] |
| Corner Radius | [observed] | corner.radiusBase: [value] |
| Animations | [observed] | animation.entrance: [value] |
| Section BG | [observed] | section.background: [value] |

**Why This Reference:**
[2-3 sentences explaining why this site is a strong reference for the target archetype]

---

### Reference 2: [Brand/Site Name]
[Same structure...]

---

## Pattern Summary

### Common Layout Patterns Across References
| Dimension | Dominant Pattern | Frequency | Confidence |
|-----------|-----------------|-----------|------------|
| Nav Style | [pattern] | [X/N references] | [HIGH/MEDIUM/LOW] |
| Grid Rhythm | [pattern] | [X/N references] | [HIGH/MEDIUM/LOW] |
| Whitespace | [pattern] | [X/N references] | [HIGH/MEDIUM/LOW] |
| Corner Radius | [pattern] | [X/N references] | [HIGH/MEDIUM/LOW] |
| Animations | [pattern] | [X/N references] | [HIGH/MEDIUM/LOW] |
| Dividers | [pattern] | [X/N references] | [HIGH/MEDIUM/LOW] |

### Archetype-Layout Correlation
[Which layout decisions most strongly express the target archetype and why]

### Strongest References for Layout Brief
1. [Reference X] -- [reason]
2. [Reference Y] -- [reason]
3. [Reference Z] -- [reason]

### Coverage Gaps
[Any aspects of the archetype that are underrepresented in references found]

## Sources
- [Source 1] -- [Date accessed]
- [Source 2] -- [Date accessed]
```

## Acceptance Criteria

- [ ] 5-10 reference sites collected and documented
- [ ] Each reference scored with weighted alignment score
- [ ] All 8 layout dimensions documented per reference (nav, hero, grid, whitespace, dividers, corners, animations, section BG)
- [ ] PDL token equivalents mapped for each layout observation
- [ ] References sourced from at least 3 different source categories (award sites, portfolios, industry leaders, curated collections)
- [ ] Pattern summary table with dominant patterns and confidence levels
- [ ] No competitor URLs included (unless explicitly in exclude_urls -- this is reference research, not competitive analysis)
- [ ] All URLs verified accessible at time of research
- [ ] Archetype-layout correlation analysis provided
- [ ] Sources cited for all references

## Quality Gate

| Criterio | Threshold | Obrigatorio |
|----------|-----------|-------------|
| Referencias coletadas e documentadas | >=5 (idealmente 8-10) | Sim |
| Alignment score calculado por referencia | 100% | Sim |
| Layout dimensions documentadas por referencia | >=6 de 8 dimensoes | Sim |
| PDL token equivalents mapeados | >=6 de 8 dimensoes | Sim |
| Categorias de fonte diversificadas | >=3 categorias | Sim |
| Pattern summary com dominant patterns | 100% das dimensoes cobertas | Sim |
| URLs verificados acessiveis | 100% | Sim |
| Fontes citadas | 100% | Sim |
| Completude do output | 100% | Sim |

**Pass threshold:** >70% em todos os criterios obrigatorios

## Relationship to Other Tasks

| Task | Relationship |
|------|-------------|
| `visual-benchmark.md` | COMPLEMENTARY -- visual-benchmark analyzes specific competitors (URL-driven); this task discovers references by archetype (personality-driven). Different inputs, different purpose. |
| `layout-pattern-extraction.md` | DOWNSTREAM -- this task feeds its output (reference URLs + initial observations) into layout-pattern-extraction for deep structural analysis. |
| `trend-report.md` | INFORMING -- trend data (especially Layout & UI Patterns category) can inform which layout patterns are currently trending and should be weighted higher in reference selection. |
| `competitive-audit.md` | SEPARATE -- competitive audit analyzes business competitors holistically. This task searches for visual references regardless of competitive relationship. |

---
*Research Intelligence Squad Task*
