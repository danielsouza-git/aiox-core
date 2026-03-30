# trend-report

```yaml
task:
  id: trend-report
  name: Curated Trend Report
  agent: trend-spotter
  squad: research-intelligence
  type: research
  elicit: true

inputs:
  required:
    - industry: "Industry to spot trends for"
    - categories: "Trend categories (design, layout, motion, iconography, spacing, UX, accessibility, technology, culture)"
  optional:
    - timeframe: "Forecast period (default: current year)"
    - geographic_focus: "Global, regional, or country-specific"
    - previous_report: "Previous trend report for continuity"
    - brand_context: "Brand to contextualize trends for"
    - depth: "overview | standard | deep"

outputs:
  - trend-report.md: "Complete curated trend report"
  - trend-cards.md: "Individual trend cards for reference"
  - applicability-matrix.md: "Trend applicability to the brand/industry"
  - action-items.md: "Recommended trend adoptions"

pre_conditions:
  - "Industry context established"
  - "Trend categories agreed"

post_conditions:
  - "Trends categorized by lifecycle stage"
  - "Applicability assessed per trend"
  - "Action recommendations provided"
  - "Sources cited for all trends"
```

## Purpose

Deliver a curated trend report covering design, layout, motion, iconography, spacing/grid, UX, accessibility, technology, and culture trends relevant to a specific industry. Each trend is assessed for lifecycle stage, applicability, and recommended action.

## Workflow

### Phase 1: Trend Scanning (30 min)
1. Scan primary trend sources:
   - Design: Dribbble, Behance, Awwwards, Design Week
   - Layout: Awwwards, SiteInspire, Mobbin, One Page Love
   - Motion: Codrops, CodePen, Lottie community, GSAP showcases
   - Iconography: Noun Project, Phosphor, Lucide, Heroicons changelog
   - Spacing/Grid: Design system changelogs (Material, Ant, Carbon, Radix)
   - UX: Nielsen Norman Group, Baymard, UX Collective
   - Accessibility: W3C updates, A11y Project, Inclusive Design Principles
   - Technology: TechCrunch, Wired, Product Hunt
   - Culture: WGSN, trend reports, social signals
2. Identify 20-30 candidate trends across all categories
3. Filter for industry relevance
4. Select 12-18 strongest trends

### Phase 2: Trend Classification (15 min)
Per trend:
1. Assign lifecycle stage (Emerging/Growing/Peak/Declining/Classic)
2. Classify by category (Design/Layout/Motion/Iconography/Spacing/UX/Accessibility/Technology/Culture)
3. Rate relevance to the specific industry (1-5)
4. Estimate longevity (Flash/Seasonal/Multi-year/Permanent)
5. Note origin and early adopters

### Phase 3: Trend Deep Dives (30 min)
Per selected trend:
1. What it is (clear definition)
2. Why it matters (driving forces)
3. Who is using it (examples with evidence)
4. Industry-specific manifestation
5. Recommended adoption approach

### Phase 4: Applicability Assessment (15 min)
1. Map each trend to brand/industry context
2. Score adoption feasibility (1-5)
3. Score potential impact (1-5)
4. Identify risks of adoption
5. Identify risks of ignoring

### Phase 5: Recommendations (10 min)
1. "Adopt Now" trends (high impact, growing stage)
2. "Monitor" trends (emerging, uncertain fit)
3. "Avoid" trends (declining, poor fit)
4. Create implementation priorities
5. Suggest pilot approaches

## Trend Report Template

```markdown
# Trend Report: [Industry] — [Timeframe]

## Executive Summary
[Overview of the trend landscape, 3-5 key takeaways]

## Trend Matrix

| # | Trend | Category | Stage | Relevance | Impact | Action |
|---|-------|----------|-------|-----------|--------|--------|
| 1 | [Name] | [Cat] | [Stage] | [1-5] | [1-5] | Adopt/Monitor/Avoid |

## Trend Cards

### 1. [Trend Name]

**Category:** [Design/Layout/Motion/Iconography/Spacing/UX/Accessibility/Technology/Culture]
**Stage:** [Emerging/Growing/Peak/Declining/Classic]
**Longevity:** [Flash/Seasonal/Multi-year/Permanent]

**What It Is:**
[Clear 2-3 sentence definition]

**Why It Matters:**
[Driving forces behind this trend]

**Who's Using It:**
- [Example 1] - [How they use it]
- [Example 2] - [How they use it]
- [Example 3] - [How they use it]

**Industry Application:**
[How this applies specifically to [industry]]

**Adoption Recommendation:**
[Specific recommendation for the brand]

**Risk of Ignoring:**
[What happens if this trend is not addressed]

---

### 2. [Trend Name]
[Same structure...]

## Category Spotlights

### Layout & UI Patterns
| Pattern | Description | Stage | Examples |
|---------|-------------|-------|----------|
| [e.g. Bento Grid] | [Description] | [Stage] | [Who uses it] |

### Motion & Animation
| Pattern | Type | Stage | Use Case |
|---------|------|-------|----------|
| [e.g. Scroll-driven animations] | [Micro/Macro/Transition] | [Stage] | [When to use] |

### Iconography
| Style | Description | Stage | Best For |
|-------|-------------|-------|----------|
| [e.g. Variable stroke width] | [Description] | [Stage] | [Applications] |

### Spacing & Grid Systems
| Pattern | Description | Stage | Impact |
|---------|-------------|-------|--------|
| [e.g. Fluid spacing with clamp()] | [Description] | [Stage] | [How it affects layout] |

### Accessibility Evolution
| Pattern | Description | Stage | WCAG Reference |
|---------|-------------|-------|----------------|
| [e.g. Motion-reduced alternatives] | [Description] | [Stage] | [Guideline] |

## Trend Lifecycle Map

```
EMERGING        GROWING         PEAK            DECLINING
[Trend A]       [Trend B]       [Trend D]       [Trend F]
[Trend C]       [Trend E]
```

## Recommendations Summary

### Adopt Now
1. **[Trend]** - [Why and how to start]

### Monitor Closely
1. **[Trend]** - [What signals to watch for]

### Avoid / Phase Out
1. **[Trend]** - [Why to avoid or phase out]

## Sources
- [Source 1] - [Date accessed]
- [Source 2] - [Date accessed]
```

## Acceptance Criteria

- [ ] 12-18 trends identified and documented
- [ ] Each trend has lifecycle stage assigned
- [ ] Each trend has industry relevance rated
- [ ] Minimum 2 real examples per trend
- [ ] Layout/UI pattern trends covered
- [ ] Motion/animation trends covered
- [ ] Iconography trends covered
- [ ] Spacing/grid trends covered
- [ ] Accessibility evolution trends covered
- [ ] Applicability matrix completed
- [ ] Adopt/Monitor/Avoid recommendations for each
- [ ] All trends sourced and cited
- [ ] Executive summary written

## Quality Gate

| Criterio | Threshold | Obrigatorio |
|----------|-----------|-------------|
| Trends identificados e documentados | >=12 | Sim |
| Lifecycle stage atribuido por trend | 100% | Sim |
| Exemplos reais por trend | >=2 por trend | Sim |
| Categorias cobertas (layout, motion, icons, spacing, a11y) | >=5 categorias | Sim |
| Adopt/Monitor/Avoid para cada trend | 100% | Sim |
| Fontes citadas | 100% | Sim |
| Completude do output | 100% | Sim |

**Pass threshold:** >70% em todos os criterios obrigatorios

---
*Research Intelligence Squad Task*
