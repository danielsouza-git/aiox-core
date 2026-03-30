# color-forecast

```yaml
task:
  id: color-forecast
  name: Color Trend Forecast
  agent: trend-spotter
  squad: research-intelligence
  type: research
  elicit: true

inputs:
  required:
    - industry: "Industry for color contextualization"
    - year: "Forecast year"
  optional:
    - current_palette: "Brand's current color palette"
    - brand_personality: "Brand personality attributes"
    - geographic_focus: "Regional color preferences"
    - competitor_palettes: "Known competitor color palettes"
    - target_audience: "Audience color preferences"

outputs:
  - color-forecast.md: "Complete color forecast report"
  - palette-recommendations.md: "Recommended palette updates"
  - color-psychology.md: "Color psychology and cultural notes"
  - seasonal-palettes.md: "Seasonal color recommendations"
  - dark-mode-guide.md: "Dark mode palette strategy and contrast patterns"

pre_conditions:
  - "Industry context defined"
  - "Forecast year specified"

post_conditions:
  - "Industry color trends documented"
  - "Pantone COTY referenced"
  - "Palette recommendations provided"
  - "Color psychology context included"
```

## Purpose

Produce a color trend forecast that combines Pantone Color of the Year analysis, industry-specific palette trends, emerging color movements, and seasonal recommendations, all contextualized for the target brand and industry.

## Workflow

### Phase 1: Pantone & Authority Analysis (15 min)
1. Document Pantone Color of the Year and its derivatives
2. Review WGSN color forecasts
3. Note Coloro color forecasts
4. Analyze fashion/interior color crossover trends
5. Map industry-specific color authority sources

### Phase 2: Industry Color Landscape (20 min)
1. Audit competitor color palettes (top 5-8)
2. Identify industry color conventions
3. Map overused colors (saturation risk)
4. Spot emerging colors in the industry
5. Note underused colors (differentiation opportunity)

### Phase 3: Color Psychology & Culture (15 min)
1. Document relevant color psychology for the industry
2. Note cultural color associations (regional)
3. Map audience color preferences by demographic
4. Identify emotional targets for the brand
5. Cross-reference psychology with trend data

### Phase 4: Palette Construction (20 min)
1. **Core palette** - Stable brand colors to maintain
2. **Trend accents** - New trending colors to incorporate
3. **Seasonal variations** - Quarterly palette adaptations
4. Provide hex, RGB, and Pantone codes
5. Show palette combinations and usage examples

### Phase 5: Dark Mode Analysis (15 min)
1. Document dark mode adoption trends in the industry
2. Analyze dark mode palette strategies:
   - Surface elevation (grey scale hierarchy)
   - Accent color adaptation (saturation/lightness shifts)
   - Text contrast patterns (pure white vs off-white)
3. Map auto-switching patterns (system preference, manual toggle, scheduled)
4. Note dark mode-specific accessibility requirements (WCAG contrast in dark)
5. Recommend dark mode palette derived from the brand's light palette

### Phase 6: Recommendations (10 min)
1. Map recommendations to brand identity
2. Suggest integration approach (gradual/bold)
3. Identify colors to phase out
4. Provide seasonal activation timeline
5. Note accessibility considerations (WCAG contrast, both light and dark modes)

## Color Forecast Template

```markdown
# Color Forecast: [Industry] — [Year]

## Color of the Year Context

### Pantone [Year]
- **Color:** [Name] ([Pantone Code])
- **Hex:** #[hex]
- **Significance:** [Why this was chosen]
- **Industry relevance:** [How it applies to this industry]

## Industry Color Landscape

### Dominant Colors
| Color | Hex | Usage | Competitor Count | Status |
|-------|-----|-------|------------------|--------|
| [Name] | #[hex] | [How used] | [X] of [Y] | Saturated/Growing/Stable |

### Emerging Colors
| Color | Hex | Signal Source | Strength | Timeline |
|-------|-----|---------------|----------|----------|
| [Name] | #[hex] | [Where spotted] | Weak/Medium/Strong | [When mainstream] |

### Underused (Differentiation Opportunity)
| Color | Hex | Why Underused | Potential |
|-------|-----|---------------|-----------|
| [Name] | #[hex] | [Reason] | [Opportunity] |

## Trend Palettes

### Palette 1: [Theme Name]
[5-6 color swatches with hex codes]
**Mood:** [Description]
**Best for:** [Applications]

### Palette 2: [Theme Name]
[5-6 color swatches with hex codes]
**Mood:** [Description]
**Best for:** [Applications]

### Palette 3: [Theme Name]
[5-6 color swatches with hex codes]
**Mood:** [Description]
**Best for:** [Applications]

## Seasonal Recommendations

| Season | Primary Accent | Supporting Colors | Mood |
|--------|---------------|-------------------|------|
| Q1 (Jan-Mar) | #[hex] [Name] | #[hex], #[hex] | [Mood] |
| Q2 (Apr-Jun) | #[hex] [Name] | #[hex], #[hex] | [Mood] |
| Q3 (Jul-Sep) | #[hex] [Name] | #[hex], #[hex] | [Mood] |
| Q4 (Oct-Dec) | #[hex] [Name] | #[hex], #[hex] | [Mood] |

## Color Psychology Notes

| Color | Psychological Association | Cultural Notes | Industry Fit |
|-------|---------------------------|----------------|--------------|
| [Color] | [Emotions, meanings] | [Regional variations] | [How it fits] |

## Dark Mode Strategy

### Industry Dark Mode Adoption
| Competitor | Has Dark Mode? | Strategy | Quality |
|------------|----------------|----------|---------|
| [Comp 1] | Yes/No | [Auto/Manual/Both] | [Poor/Good/Excellent] |

### Recommended Dark Mode Palette
| Role | Light Mode | Dark Mode | Notes |
|------|-----------|-----------|-------|
| Background | #[hex] | #[hex] | [Surface elevation level] |
| Surface | #[hex] | #[hex] | [Cards, modals] |
| Primary | #[hex] | #[hex] | [Saturation adjustment] |
| Text Primary | #[hex] | #[hex] | [Contrast ratio] |
| Text Secondary | #[hex] | #[hex] | [Contrast ratio] |
| Accent | #[hex] | #[hex] | [Lightness shift] |

### Dark Mode Trends
| Pattern | Description | Stage | Recommendation |
|---------|-------------|-------|----------------|
| [e.g. Elevated surfaces] | [Grey hierarchy instead of shadows] | [Stage] | [Adopt/Monitor] |

## Recommendations for [Brand]

### Adopt
- **[Color]** (#[hex]) - [Why and where to use it]

### Maintain
- **[Color]** (#[hex]) - [Why it remains strong]

### Phase Out
- **[Color]** (#[hex]) - [Why it's declining]

### Accessibility Check
| Foreground | Background | Contrast Ratio | WCAG AA | WCAG AAA |
|------------|------------|----------------|---------|----------|
| #[hex] | #[hex] | [X]:1 | Pass/Fail | Pass/Fail |

## Sources
- Pantone Color Institute - [Year]
- WGSN Color Forecast - [Year]
- [Additional sources with dates]
```

## Acceptance Criteria

- [ ] Pantone COTY referenced and analyzed
- [ ] Industry color landscape mapped (5+ competitors)
- [ ] Emerging colors identified with signal sources
- [ ] 3+ trend palettes with hex codes
- [ ] Seasonal recommendations provided
- [ ] Color psychology documented
- [ ] Dark mode palette strategy documented
- [ ] Dark mode industry adoption analyzed
- [ ] Light-to-dark palette mapping provided
- [ ] Brand-specific recommendations made
- [ ] Accessibility considerations included (light and dark modes)
- [ ] All sources cited

## Quality Gate

| Criterio | Threshold | Obrigatorio |
|----------|-----------|-------------|
| Pantone COTY referenciado e analisado | 100% | Sim |
| Paletas trend com hex codes | >=3 paletas | Sim |
| Competidores mapeados no landscape | >=5 | Sim |
| Dark mode palette strategy documentada | 100% | Sim |
| Acessibilidade (contraste WCAG) verificada | >70% das combinacoes | Sim |
| Fontes citadas | 100% | Sim |
| Completude do output | 100% | Sim |

**Pass threshold:** >70% em todos os criterios obrigatorios

---
*Research Intelligence Squad Task*
