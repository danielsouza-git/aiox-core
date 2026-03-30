# content-landscape

```yaml
task:
  id: content-landscape
  name: Content Landscape & Editorial Intelligence
  agent: market-researcher
  squad: research-intelligence
  type: research
  elicit: true

inputs:
  required:
    - industry: "Industry vertical"
    - competitors: "3-8 competitors to analyze"
    - content_types: "Blog, social, video, podcast, newsletter, etc."
  optional:
    - brand_content: "Brand's current content presence"
    - target_audience: "Audience to tailor content for"
    - geographic_focus: "Regional content preferences"
    - language: "Content language (default: same as brand)"
    - editorial_goals: "Content goals (SEO, thought leadership, conversion)"

outputs:
  - content-landscape.md: "Complete content landscape analysis"
  - content-gaps.md: "Content topics competitors cover but brand doesn't"
  - tone-analysis.md: "Tone and voice analysis across competitors"
  - editorial-recommendations.md: "Content strategy recommendations"

pre_conditions:
  - "Industry defined"
  - "Competitor list provided"

post_conditions:
  - "Content landscape mapped"
  - "Content gaps identified"
  - "Tone and voice patterns analyzed"
  - "Editorial recommendations provided"
```

## Purpose

Map the content landscape of an industry by analyzing what competitors publish, how they communicate, what topics they cover, and where content gaps exist. Feeds directly into BSS Editorial Strategy, SEO Documentation, and brand messaging decisions.

## Data Sources (All Public, Zero Risk)

| Data Point | Source | Risk Level |
|------------|--------|------------|
| Blog posts and articles | Public website content | Zero |
| Page headings and topics | Public HTML content | Zero |
| Content frequency | Sitemap dates, blog archive | Zero |
| Tone and vocabulary | Visible text content | Zero |
| Content types present | Website navigation, pages | Zero |
| Social content themes | Public social media posts | Zero |

## Workflow

### Phase 1: Content Inventory (20 min)
Per competitor:
1. Map content sections on website (blog, resources, case studies, FAQ)
2. Estimate content volume (number of articles, pages)
3. Note content freshness (last updated dates)
4. Identify content formats (text, video, infographic, podcast, tool)
5. Check for gated vs ungated content ratio

### Phase 2: Topic Analysis (20 min)
Per competitor:
1. Categorize content by topic/theme
2. Identify most-covered topics (saturation)
3. Note unique topics only one competitor covers
4. Map content to buyer journey stages (awareness, consideration, decision)
5. Identify educational vs promotional content ratio

### Phase 3: Tone & Voice Analysis (15 min)
Per competitor:
1. Characterize writing tone (formal, conversational, technical, friendly)
2. Note vocabulary level (expert, accessible, mixed)
3. Identify signature phrases or patterns
4. Assess use of first person (we/us) vs second person (you/your)
5. Note emotional register (inspiring, authoritative, empathetic, urgent)
6. Rate personality strength (bland/generic vs distinctive)

### Phase 4: Content Gap Analysis (15 min)
1. Build topic coverage matrix across all competitors
2. Identify topics ALL competitors cover (table stakes)
3. Identify topics MOST cover but brand doesn't (gaps)
4. Identify topics NONE cover (blue ocean opportunities)
5. Map gaps to audience pain points and search intent

### Phase 5: Recommendations (15 min)
1. Recommend content pillars for the brand
2. Suggest content types and formats
3. Recommend tone and voice positioning
4. Prioritize content gaps by impact and effort
5. Suggest content frequency and cadence

## Report Template

```markdown
# Content Landscape: [Industry]

## Executive Summary
[Key findings: content maturity of the industry, major gaps, recommendations]

## Content Inventory

| Competitor | Blog | Case Studies | FAQ | Resources | Video | Podcast | Newsletter |
|------------|------|-------------|-----|-----------|-------|---------|------------|
| [Comp 1] | [Y/N] ([count]) | [Y/N] | [Y/N] | [Y/N] | [Y/N] | [Y/N] | [Y/N] |
| [Comp 2] | [Y/N] ([count]) | [Y/N] | [Y/N] | [Y/N] | [Y/N] | [Y/N] | [Y/N] |

## Topic Coverage Matrix

| Topic | [Brand] | [Comp 1] | [Comp 2] | [Comp 3] | Coverage | Type |
|-------|---------|----------|----------|----------|----------|------|
| [Topic 1] | [Y/N] | [Y/N] | [Y/N] | [Y/N] | [X]/[Y] | Table stakes |
| [Topic 2] | [N] | [Y] | [Y] | [Y] | 3/4 | Gap |
| [Topic 3] | [N] | [N] | [N] | [N] | 0/4 | Blue ocean |

## Tone & Voice Comparison

| Attribute | [Brand] | [Comp 1] | [Comp 2] | [Comp 3] | Industry Norm |
|-----------|---------|----------|----------|----------|---------------|
| Formality | [X] | [X] | [X] | [X] | [X] |
| Vocabulary level | [X] | [X] | [X] | [X] | [X] |
| Person (we/you) | [X] | [X] | [X] | [X] | [X] |
| Emotional register | [X] | [X] | [X] | [X] | [X] |
| Personality strength | [1-5] | [1-5] | [1-5] | [1-5] | [avg] |

**Industry voice pattern:** [Description of how most competitors communicate]
**Differentiation opportunity:** [How the brand can stand out tonally]

## Content Gaps

### Table Stakes (must have)
1. **[Topic]** — [X] of [Y] competitors cover this. Brand must too.

### Gaps (competitors have, brand doesn't)
1. **[Topic]** — [X] competitors cover this. Recommended priority: [High/Medium/Low]

### Blue Ocean (nobody covers)
1. **[Topic]** — No competitor covers this. Potential for thought leadership.

## Content by Buyer Journey

| Stage | [Brand] Content | Competitor Average | Gap |
|-------|-----------------|-------------------|-----|
| Awareness | [count/types] | [count/types] | [Y/N] |
| Consideration | [count/types] | [count/types] | [Y/N] |
| Decision | [count/types] | [count/types] | [Y/N] |
| Retention | [count/types] | [count/types] | [Y/N] |

## Recommendations

### Content Pillars
1. **[Pillar 1]** — [Why, based on gaps and audience needs]
2. **[Pillar 2]** — [Why]
3. **[Pillar 3]** — [Why]

### Recommended Tone & Voice
- **Formality:** [Recommendation with rationale]
- **Vocabulary:** [Recommendation]
- **Emotional register:** [Recommendation]
- **Personality positioning:** [How to be distinctive]

### Content Cadence
- **Blog:** [X posts/month] — [Topics to prioritize]
- **[Other format]:** [Frequency] — [Focus]

### Quick Wins
1. **[Action]** — [Expected impact, low effort]

## Sources
- [All URLs analyzed with access dates]
```

## Acceptance Criteria

- [ ] Content inventory completed for all competitors
- [ ] Topic coverage matrix built
- [ ] Content gaps categorized (table stakes, gaps, blue ocean)
- [ ] Tone and voice analyzed per competitor
- [ ] Industry voice pattern identified
- [ ] Content mapped to buyer journey stages
- [ ] Content pillars recommended
- [ ] Tone and voice positioning recommended
- [ ] Quick wins identified
- [ ] All sources cited

## Quality Gate

| Criterio | Threshold | Obrigatorio |
|----------|-----------|-------------|
| Content inventory completo para todos competidores | 100% | Sim |
| Topic coverage matrix construido | >70% dos topicos | Sim |
| Gaps categorizados (table stakes, gaps, blue ocean) | 100% | Sim |
| Tone e voice analisados por competidor | >70% | Sim |
| Content pillars recomendados | >=3 | Sim |
| Fontes citadas | 100% | Sim |
| Completude do output | 100% | Sim |

**Pass threshold:** >70% em todos os criterios obrigatorios

---
*Research Intelligence Squad Task*
