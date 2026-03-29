# imagery-trends

```yaml
task:
  id: imagery-trends
  name: Photography & Imagery Trend Analysis
  agent: trend-spotter
  squad: research-intelligence
  type: research
  elicit: true

inputs:
  required:
    - industry: "Industry to contextualize imagery trends"
    - usage_context: "web | social | print | all"
  optional:
    - current_imagery_style: "Brand's current photography/imagery approach"
    - brand_personality: "Brand personality to match"
    - competitor_imagery: "Known competitor imagery styles"
    - budget_constraint: "Stock only | Custom photography | AI-generated | Mixed"
    - target_audience: "Audience demographics and preferences"

outputs:
  - imagery-trends.md: "Complete imagery trend analysis"
  - style-recommendations.md: "Recommended imagery styles for the brand"
  - ai-imagery-guide.md: "AI image generation guidelines and prompts"
  - stock-direction.md: "Stock photography selection criteria"

pre_conditions:
  - "Industry and usage context defined"

post_conditions:
  - "Current imagery trends documented"
  - "Industry-specific imagery landscape mapped"
  - "Style recommendations provided"
  - "AI imagery guidelines included if applicable"
  - "Sources cited for all trends"
```

## Purpose

Analyze current and emerging photography and imagery trends, including AI-generated visuals, authentic photography movements, illustration styles, gradient/overlay treatments, and industry-specific visual language, with actionable recommendations for the brand.

## Workflow

### Phase 1: Imagery Trend Scanning (20 min)
1. Review current imagery trends:
   - Stock photography: Unsplash, Adobe Stock, Getty trending
   - AI-generated: Midjourney community, DALL-E showcases, Stable Diffusion trends
   - Illustration: Dribbble, Behance illustration categories
   - Brand campaigns: Recent award-winning campaigns (D&AD, Cannes Lions)
2. Categorize trends:
   - Photography styles (authentic, editorial, lifestyle, abstract)
   - AI-generated approaches (photorealistic, stylized, hybrid)
   - Illustration styles (flat, 3D, hand-drawn, collage)
   - Treatment styles (duotone, gradient overlays, grain, blur)
   - Composition patterns (centered, asymmetric, full-bleed, grid)

### Phase 2: Industry Analysis (15 min)
1. Audit competitor imagery (top 5-8)
2. Identify industry visual conventions
3. Map overused imagery cliches in the industry
4. Spot visual differentiation opportunities
5. Note audience visual preferences and expectations

### Phase 3: Style Deep Dives (20 min)
Per trending style:
1. What it looks like (clear visual description)
2. Why it resonates (cultural/psychological drivers)
3. Who is using it (brands with examples)
4. Technical approach (how to achieve it)
5. Longevity assessment (flash vs lasting)

### Phase 4: AI Imagery Assessment (15 min)
1. Document AI imagery adoption in the industry
2. Map AI vs traditional photography perception
3. Identify safe AI use cases (backgrounds, textures, concepts)
4. Identify risky AI use cases (people, products, branded content)
5. Note ethical considerations (disclosure, authenticity, bias)

### Phase 5: Recommendations (10 min)
1. Recommend 3-5 imagery directions for the brand
2. Provide visual direction briefs (mood, tone, technical specs)
3. Note stock photography selection criteria
4. Include AI generation prompt guidelines if applicable
5. Address budget-appropriate alternatives

## Imagery Trend Report Template

```markdown
# Imagery Trends: [Industry] — [Year]

## Executive Summary
[Overview of the imagery landscape and key shifts]

## Trend Categories

### 1. Photography Styles
| Style | Description | Stage | Industry Fit | Examples |
|-------|-------------|-------|-------------|----------|
| [e.g. Authentic/unposed] | [Description] | [Stage] | [1-5] | [Brands using it] |

### 2. AI-Generated Imagery
| Approach | Description | Stage | Risk Level | Best For |
|----------|-------------|-------|------------|----------|
| [e.g. Photorealistic scenes] | [Description] | [Stage] | [Low/Medium/High] | [Use cases] |

### 3. Illustration Styles
| Style | Description | Stage | Industry Fit | Complexity |
|-------|-------------|-------|-------------|------------|
| [e.g. 3D rendered objects] | [Description] | [Stage] | [1-5] | [Simple/Medium/Complex] |

### 4. Visual Treatments
| Treatment | Description | Stage | Best Applied To |
|-----------|-------------|-------|-----------------|
| [e.g. Duotone overlay] | [Description] | [Stage] | [Photos/Illustrations/Both] |

### 5. Composition Patterns
| Pattern | Description | Stage | Platform Fit |
|---------|-------------|-------|-------------|
| [e.g. Asymmetric crop] | [Description] | [Stage] | [Web/Social/Print] |

## Industry Imagery Landscape

### Competitor Visual Audit
| Competitor | Primary Style | Treatment | AI Usage | Quality | Notes |
|------------|---------------|-----------|----------|---------|-------|
| [Comp 1] | [Style] | [Treatment] | [Yes/No/Unknown] | [1-5] | [Notes] |

### Overused Imagery Cliches (Avoid)
1. **[Cliche]** - [Why it's overused, e.g. "Smiling dentist with crossed arms"]
2. **[Cliche]** - [Why it's overused]

### Differentiation Opportunities
1. **[Direction]** - [Why it would stand out in this industry]

## Recommended Imagery Directions

### Direction 1: [Name/Theme]
- **Style:** [Photography/AI/Illustration/Hybrid]
- **Mood:** [Emotional tone]
- **Color treatment:** [Natural/Duotone/Gradient/Desaturated]
- **Composition:** [Centered/Asymmetric/Full-bleed]
- **Subjects:** [People/Objects/Abstract/Scenes]
- **Personality match:** [How it aligns with brand personality]
- **Budget:** [Stock/Custom shoot/AI-generated]
- **Example brief:** [1-2 sentence creative brief]

### Direction 2: [Name/Theme]
[Same structure...]

### Direction 3: [Name/Theme]
[Same structure...]

## AI Imagery Guidelines

### Safe Use Cases
- [e.g. Abstract backgrounds, textures, conceptual illustrations]

### Risky Use Cases (Proceed with Caution)
- [e.g. People, products requiring accuracy, branded environments]

### Ethical Considerations
- Disclosure: [When to label AI-generated content]
- Authenticity: [Maintaining brand trust]
- Bias: [Representation and diversity in AI outputs]

### Prompt Guidelines (if AI-generated)
| Purpose | Style Prompt | Quality Modifiers | Avoid |
|---------|-------------|-------------------|-------|
| [Hero image] | [Prompt template] | [Lighting, resolution] | [What not to include] |

## Stock Photography Selection Criteria

### Do's
- [e.g. Natural lighting, diverse subjects, authentic poses]

### Don'ts
- [e.g. Obvious stock poses, over-processed, culturally insensitive]

### Recommended Search Terms
- [Term 1] - [Why effective for this brand]
- [Term 2] - [Why effective for this brand]

## Trend Lifecycle

```
EMERGING          GROWING           PEAK              DECLINING
[Style A]         [Style B]         [Style D]         [Style F]
[Style C]         [Style E]                           [Style G]
```

## Sources
- [Source 1] - [Date accessed]
- [Source 2] - [Date accessed]
```

## Acceptance Criteria

- [ ] Photography style trends documented (3+)
- [ ] AI-generated imagery trends assessed
- [ ] Illustration style trends documented (2+)
- [ ] Visual treatment trends documented (3+)
- [ ] Industry competitor imagery audited (5+)
- [ ] Overused cliches identified
- [ ] 3+ imagery direction recommendations
- [ ] AI imagery guidelines provided (if relevant)
- [ ] Stock photography selection criteria included
- [ ] Ethical considerations documented
- [ ] Industry-specific context applied
- [ ] All sources cited

---
*Research Intelligence Squad Task*
