# competitive-audit

```yaml
task:
  id: competitive-audit
  name: Full Competitive Audit
  agent: competitive-analyst
  squad: research-intelligence
  type: audit
  elicit: true

inputs:
  required:
    - brand: "Brand being audited against competitors"
    - competitors: "List of 5-10 competitors to audit"
    - industry: "Industry vertical"
  optional:
    - focus_dimensions: "Which dimensions to emphasize"
    - brand_profile: "Existing brand profile for comparison"
    - previous_audit: "Previous audit for trend comparison"
    - include_visual: "Include visual evidence (screenshots)"

outputs:
  - competitive-audit.md: "Complete competitive audit report"
  - comparison-matrix.md: "Feature/attribute comparison matrix"
  - visual-evidence.md: "Screenshot and visual evidence catalog"
  - recommendations.md: "Strategic recommendations"

pre_conditions:
  - "Competitor list finalized (5-10)"
  - "Industry context established"
  - "Audit dimensions agreed"

post_conditions:
  - "All competitors audited across all dimensions"
  - "Scoring criteria applied consistently"
  - "Visual evidence collected"
  - "Differentiation opportunities identified"
```

## Purpose

Execute a comprehensive competitive audit across 5 key dimensions, producing an actionable comparison matrix with visual evidence and strategic recommendations for differentiation.

## Workflow

### Phase 1: Competitor Mapping (15 min)
1. Confirm competitor list (5-10)
2. Classify competitors:
   - **Direct:** Same product/service, same audience
   - **Indirect:** Different product, same need
   - **Aspirational:** Brands to learn from (different industry)
3. Gather basic data (founding year, size, funding, HQ)
4. Identify competitor URLs and social profiles

### Phase 2: Visual Identity Audit (30 min)
Per competitor:
1. Logo analysis (style, versatility, memorability)
2. Color palette extraction (primary, secondary, accent)
3. Typography identification (headline, body, brand fonts)
4. Photography style (stock, custom, illustration)
5. Overall visual personality rating

### Phase 3: Messaging Audit (25 min)
Per competitor:
1. Tagline and value proposition
2. Homepage headline and subheadline
3. Key messaging themes
4. Tone and voice characterization
5. Unique claims and proof points

### Phase 4: Positioning Analysis (20 min)
1. Map each competitor's stated position
2. Identify target audience per competitor
3. Note pricing strategy and tier structure
4. Assess perceived premium vs. value positioning
5. Identify positioning clusters and white space

### Phase 5: Digital Presence Audit (20 min)
Per competitor:
1. Website quality and UX assessment
2. Social media presence and engagement
3. Content strategy (blog, resources, thought leadership)
4. SEO visibility (estimated domain authority, keywords)
5. Paid advertising presence

### Phase 6: SEO & Technical Audit (20 min)
Per competitor:
1. Meta tags analysis (title, description, OG tags)
2. Schema markup inventory (JSON-LD types used)
3. Heading structure (H1-H6 hierarchy and keyword usage)
4. Content keyword coverage (primary terms in headings and body)
5. Performance metrics (page load, Core Web Vitals estimates)
6. Tech stack identification (framework, fonts, CDN, analytics)

### Phase 7: Synthesis & Recommendations (20 min)
1. Build comparison matrix with scores
2. Identify differentiation opportunities
3. Flag competitive threats
4. Recommend positioning strategy
5. Compile report with visual evidence

## Comparison Matrix Template

```markdown
# Competitive Audit: [Brand] vs. Market

## Competitor Overview

| Competitor | Type | Founded | Size | Funding | URL |
|------------|------|---------|------|---------|-----|
| [Name] | Direct | [Year] | [Size] | $[X]M | [URL] |

## Visual Identity Comparison

| Attribute | [Brand] | [Comp 1] | [Comp 2] | [Comp 3] | [Comp 4] | [Comp 5] |
|-----------|---------|----------|----------|----------|----------|----------|
| Logo Style | [X] | [X] | [X] | [X] | [X] | [X] |
| Primary Colors | [X] | [X] | [X] | [X] | [X] | [X] |
| Typography | [X] | [X] | [X] | [X] | [X] | [X] |
| Imagery Style | [X] | [X] | [X] | [X] | [X] | [X] |
| Visual Score | [X]/10 | [X]/10 | [X]/10 | [X]/10 | [X]/10 | [X]/10 |

## Messaging Comparison

| Attribute | [Brand] | [Comp 1] | [Comp 2] | [Comp 3] |
|-----------|---------|----------|----------|----------|
| Tagline | [X] | [X] | [X] | [X] |
| Value Prop | [X] | [X] | [X] | [X] |
| Tone | [X] | [X] | [X] | [X] |
| Key Claim | [X] | [X] | [X] | [X] |

## SEO & Technical Comparison

| Attribute | [Brand] | [Comp 1] | [Comp 2] | [Comp 3] |
|-----------|---------|----------|----------|----------|
| Title Tag Quality | [X]/10 | [X]/10 | [X]/10 | [X]/10 |
| Meta Description | [X]/10 | [X]/10 | [X]/10 | [X]/10 |
| Schema Markup Types | [list] | [list] | [list] | [list] |
| H1 Keyword Usage | [Y/N] | [Y/N] | [Y/N] | [Y/N] |
| OG Tags Complete | [Y/N] | [Y/N] | [Y/N] | [Y/N] |
| Performance Score | [X]/100 | [X]/100 | [X]/100 | [X]/100 |
| Framework | [X] | [X] | [X] | [X] |
| Font Loading | [X] | [X] | [X] | [X] |

## Overall Scoring (1-10)

| Dimension | Weight | [Brand] | [Comp 1] | [Comp 2] | [Comp 3] |
|-----------|--------|---------|----------|----------|----------|
| Visual Identity | 20% | [X] | [X] | [X] | [X] |
| Messaging | 20% | [X] | [X] | [X] | [X] |
| Positioning | 15% | [X] | [X] | [X] | [X] |
| Digital Presence | 15% | [X] | [X] | [X] | [X] |
| SEO & Technical | 15% | [X] | [X] | [X] | [X] |
| Content Strategy | 15% | [X] | [X] | [X] | [X] |
| **Weighted Total** | 100% | **[X]** | **[X]** | **[X]** | **[X]** |

## Differentiation Opportunities
1. [Opportunity with rationale]
2. [Opportunity with rationale]
3. [Opportunity with rationale]
```

## Scoring Criteria

| Score | Definition |
|-------|-----------|
| 9-10 | Industry-leading, sets the standard |
| 7-8 | Strong, above average |
| 5-6 | Average, meets expectations |
| 3-4 | Below average, notable gaps |
| 1-2 | Poor, significant issues |

## Acceptance Criteria

- [ ] Minimum 5 competitors audited
- [ ] All 7 dimensions covered per competitor (visual, messaging, positioning, digital, SEO, tech, pricing)
- [ ] Comparison matrix with consistent scoring
- [ ] Visual evidence collected (screenshots or descriptions)
- [ ] SEO comparison table completed (meta tags, schema, headings, performance)
- [ ] Tech stack identified per competitor
- [ ] Differentiation opportunities identified (minimum 3)
- [ ] Competitive threats flagged
- [ ] Recommendations actionable and specific
- [ ] All sources and URLs documented

## Quality Gate

| Criterio | Threshold | Obrigatorio |
|----------|-----------|-------------|
| Competidores auditados | >=5 | Sim |
| Dimensoes cobertas por competidor | 100% (7 dimensoes) | Sim |
| Scoring consistente na comparison matrix | >70% | Sim |
| SEO e technical comparison preenchido | >70% dos campos | Sim |
| Oportunidades de diferenciacao identificadas | >=3 | Sim |
| URLs e fontes documentados | 100% | Sim |
| Completude do output | 100% | Sim |

**Pass threshold:** >70% em todos os criterios obrigatorios

---
*Research Intelligence Squad Task*
