# typography-trends

```yaml
task:
  id: typography-trends
  name: Typography Trend Analysis
  agent: trend-spotter
  squad: research-intelligence
  type: research
  elicit: true

inputs:
  required:
    - industry: "Industry to contextualize trends"
    - usage_context: "web | print | both"
  optional:
    - current_typography: "Brand's current font stack"
    - brand_personality: "Brand personality to match"
    - competitor_typography: "Known competitor font choices"
    - budget_constraint: "Free/Google only vs. premium foundries"
    - language_requirements: "Multi-language support needs"

outputs:
  - typography-trends.md: "Complete typography trend analysis"
  - pairing-recommendations.md: "Font pairing recommendations"
  - font-comparison.md: "Font comparison matrix"
  - implementation-guide.md: "Technical implementation notes"

pre_conditions:
  - "Industry and usage context defined"

post_conditions:
  - "Current typography trends documented"
  - "Pairing recommendations provided"
  - "Technical specs included"
  - "Industry context applied"
```

## Purpose

Analyze current and emerging typography trends, popular pairings, variable font movements, and display type trends, all contextualized for the target industry with specific pairing recommendations.

## Workflow

### Phase 1: Trend Scanning (20 min)
1. Review current typography trends:
   - Award-winning sites (Awwwards, Typewolf)
   - Type foundry releases
   - Google Fonts trending
   - Industry-specific typography patterns
2. Categorize trends:
   - Headline/Display trends
   - Body text trends
   - Variable font adoption
   - Kinetic typography
   - Brutalist/experimental typography

### Phase 2: Industry Analysis (15 min)
1. Audit competitor typography (top 5-8)
2. Identify industry typographic conventions
3. Map overused fonts in the industry
4. Spot typographic differentiation opportunities
5. Note audience readability preferences

### Phase 3: Font Pairing Research (20 min)
1. Research top performing pairings
2. Classify pairing strategies:
   - Superfamily (same family, different weights/styles)
   - Serif + Sans-serif (classic contrast)
   - Geometric + Humanist (modern contrast)
   - Display + Text (hierarchy contrast)
3. Test pairing readability
4. Check language support
5. Assess web performance (file sizes)

### Phase 4: Variable Font Analysis (10 min)
1. Document variable font trend adoption
2. Identify key variable fonts trending
3. Note performance benefits
4. Assess browser support status
5. Recommend variable font candidates

### Phase 5: Recommendations (15 min)
1. Recommend 3-5 font pairings for the brand
2. Provide implementation specs
3. Note licensing considerations
4. Include fallback font stacks
5. Address performance optimization

## Typography Trend Report Template

```markdown
# Typography Trends: [Industry] — [Year]

## Executive Summary
[Overview of the typography landscape and key shifts]

## Trend Categories

### 1. Headline & Display Trends
| Trend | Description | Examples | Stage | Industry Fit |
|-------|-------------|----------|-------|-------------|
| [Trend] | [Description] | [Font examples] | [Stage] | [1-5] |

### 2. Body Text Trends
| Trend | Description | Examples | Stage | Industry Fit |
|-------|-------------|----------|-------|-------------|
| [Trend] | [Description] | [Font examples] | [Stage] | [1-5] |

### 3. Variable Font Movement
| Font | Axes | Performance Gain | Browser Support | Recommendation |
|------|------|-----------------|-----------------|----------------|
| [Font] | [wght, wdth, etc.] | [X]% smaller | [X]% | Adopt/Monitor |

### 4. Experimental & Display
| Trend | Description | Use Case | Risk Level |
|-------|-------------|----------|------------|
| [Trend] | [Description] | [When to use] | Low/Medium/High |

## Industry Font Landscape

### Competitor Typography Audit

| Competitor | Headline Font | Body Font | Classification | Notes |
|------------|---------------|-----------|----------------|-------|
| [Comp 1] | [Font] | [Font] | [Serif/Sans/etc.] | [Notes] |

### Overused Fonts (Avoid for Differentiation)
1. **[Font]** - Used by [X] of [Y] competitors
2. **[Font]** - Used by [X] of [Y] competitors

### Differentiation Opportunities
1. **[Font/Style]** - [Why it would stand out]

## Recommended Font Pairings

### Pairing 1: [Name/Theme]
- **Headline:** [Font Name] ([Weight])
- **Body:** [Font Name] ([Weight])
- **Pairing Strategy:** [Contrast type]
- **Personality:** [What it communicates]
- **Source:** [Google Fonts/Adobe/Foundry]
- **License:** [Open Source/Commercial]
- **Performance:** [File size estimate]

**Specimen:**
```
H1: The quick brown fox (Font Name Bold, 48px)
H2: jumps over the lazy dog (Font Name SemiBold, 32px)
Body: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Sed do eiusmod tempor incididunt ut labore. (Font Name Regular, 16px/1.6)
```

### Pairing 2: [Name/Theme]
[Same structure...]

### Pairing 3: [Name/Theme]
[Same structure...]

## Technical Implementation

### CSS Font Stack
```css
/* Headline */
font-family: '[Primary]', '[Fallback1]', [generic-family];

/* Body */
font-family: '[Primary]', '[Fallback1]', [generic-family];
```

### Performance Optimization
- Subset fonts to used character sets
- Use `font-display: swap` for web fonts
- Preload critical fonts with `<link rel="preload">`
- Variable fonts reduce total file size by [X]%
- Target: < 100KB total font budget

### Accessibility
- Minimum body text: 16px
- Line height: 1.5-1.8 for body
- Letter spacing: normal to slightly increased
- Avoid thin weights (< 300) for body text
- Ensure sufficient contrast (WCAG AA)

## Trend Lifecycle

```
EMERGING          GROWING           PEAK              CLASSIC
[Trend A]         [Trend B]         [Trend D]         [Trend F]
[Trend C]         [Trend E]                           [Trend G]
```

## Sources
- Typewolf [Year] Trend Report
- Google Fonts Analytics
- Awwwards Font Usage Data
- [Additional sources with dates]
```

## Acceptance Criteria

- [ ] Current typography trends documented (5+)
- [ ] Industry competitor typography audited (5+)
- [ ] 3+ font pairing recommendations
- [ ] Variable font trends assessed
- [ ] Technical implementation specs included
- [ ] Performance and accessibility notes
- [ ] Licensing information documented
- [ ] All sources cited
- [ ] Industry-specific context applied

## Quality Gate

| Criterio | Threshold | Obrigatorio |
|----------|-----------|-------------|
| Typography trends documentados | >=5 | Sim |
| Competidores typography auditados | >=5 | Sim |
| Font pairing recommendations | >=3 | Sim |
| Variable font trends avaliados | >70% | Sim |
| Performance e accessibility notes | 100% | Sim |
| Licensing documentado | >70% | Sim |
| Fontes citadas | 100% | Sim |
| Completude do output | 100% | Sim |

**Pass threshold:** >70% em todos os criterios obrigatorios

---
*Research Intelligence Squad Task*
