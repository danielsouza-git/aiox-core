# seo-gap-analysis

```yaml
task:
  id: seo-gap-analysis
  name: SEO Competitive Gap Analysis
  agent: competitive-analyst
  squad: research-intelligence
  type: audit
  elicit: true

inputs:
  required:
    - brand_url: "Brand's website URL"
    - competitors: "3-8 competitor URLs"
    - target_keywords: "10-20 target keywords for the industry"
  optional:
    - industry: "Industry vertical"
    - geographic_focus: "Local, national, or global SEO"
    - current_seo_data: "Existing SEO audit data"
    - content_strategy: "Current content strategy"

outputs:
  - seo-gap-analysis.md: "Complete SEO gap analysis report"
  - keyword-gaps.md: "Keywords competitors rank for but brand doesn't"
  - schema-opportunities.md: "Missing schema markup opportunities"
  - content-gaps.md: "Content topics competitors cover but brand doesn't"

pre_conditions:
  - "Brand URL accessible"
  - "Competitor URLs accessible"
  - "Target keywords identified"

post_conditions:
  - "Meta tag comparison completed"
  - "Schema markup gaps identified"
  - "Keyword coverage gaps mapped"
  - "Content gap opportunities listed"
  - "Actionable recommendations provided"
```

## Purpose

Analyze SEO gaps between the brand and competitors by comparing meta tags, schema markup, heading structures, keyword coverage, and content strategy. All analysis uses publicly accessible page data (HTML source, meta tags, structured data) — zero risk, equivalent to viewing page source in a browser.

## Data Sources (All Public, Zero Risk)

| Data Point | How Accessed | Risk Level |
|------------|-------------|------------|
| Meta tags (title, description) | HTML `<head>` — public | Zero |
| Open Graph tags | HTML `<meta property="og:*">` — public | Zero |
| Schema/JSON-LD | HTML `<script type="application/ld+json">` — public | Zero |
| Heading structure | HTML `<h1>` through `<h6>` — public | Zero |
| Content keywords | Visible page text — public | Zero |
| Font loading | CSS `@font-face` or `<link>` — public | Zero |
| Performance | Lighthouse (public tool) | Zero |
| Sitemap | `/sitemap.xml` — public if exists | Zero |
| Robots.txt | `/robots.txt` — public by definition | Zero |

## Workflow

### Phase 1: Meta Tag Audit (20 min)
Per brand + each competitor:
1. Extract `<title>` tag — length, keyword presence, brand mention
2. Extract `<meta name="description">` — length, keyword presence, CTA
3. Extract OG tags — `og:title`, `og:description`, `og:image`, `og:type`
4. Extract Twitter Card tags — `twitter:card`, `twitter:title`, `twitter:image`
5. Check canonical URL setup
6. Check language/hreflang tags

### Phase 2: Schema Markup Audit (15 min)
Per brand + each competitor:
1. Inventory all JSON-LD schema types present
2. Check for Organization/LocalBusiness schema
3. Check for FAQ schema
4. Check for Breadcrumb schema
5. Check for Product/Service schema (if applicable)
6. Check for Review/Rating schema
7. Identify schema types competitors use but brand doesn't

### Phase 3: Content & Keyword Analysis (20 min)
Per brand + each competitor:
1. Extract H1 tag (should be one per page, keyword-rich)
2. Map H2-H6 heading hierarchy
3. Identify primary keyword in headings
4. Note content length and depth (word count estimate)
5. Check for FAQ sections (common for SEO)
6. Identify blog/content hub presence
7. Map keyword coverage: which target keywords appear in competitor content

### Phase 4: Technical SEO Comparison (15 min)
Per brand + each competitor:
1. Check sitemap.xml presence and completeness
2. Check robots.txt configuration
3. Note URL structure patterns (clean vs parameter-heavy)
4. Check mobile viewport meta tag
5. Estimate performance (Lighthouse if available)
6. Note font loading strategy (preload, display swap)
7. Check for Core Web Vitals optimization signals

### Phase 5: Gap Analysis & Recommendations (15 min)
1. Build gap matrix: what competitors have that brand doesn't
2. Prioritize gaps by impact (High/Medium/Low) and effort
3. Identify quick wins (high impact, low effort)
4. Identify strategic investments (high impact, high effort)
5. Create implementation roadmap

## Report Template

```markdown
# SEO Gap Analysis: [Brand] vs. Competitors

## Executive Summary
[Key findings: X gaps identified, Y quick wins, Z strategic investments]

## Meta Tag Comparison

| Element | [Brand] | [Comp 1] | [Comp 2] | [Comp 3] | Best Practice |
|---------|---------|----------|----------|----------|---------------|
| Title length | [X] chars | [X] chars | [X] chars | [X] chars | 50-60 chars |
| Title has keyword | [Y/N] | [Y/N] | [Y/N] | [Y/N] | Yes |
| Description length | [X] chars | [X] chars | [X] chars | [X] chars | 150-160 chars |
| Description has CTA | [Y/N] | [Y/N] | [Y/N] | [Y/N] | Yes |
| OG image | [Y/N] | [Y/N] | [Y/N] | [Y/N] | Yes (1200x630) |
| Twitter Card | [Y/N] | [Y/N] | [Y/N] | [Y/N] | Yes |
| Canonical | [Y/N] | [Y/N] | [Y/N] | [Y/N] | Yes |

## Schema Markup Comparison

| Schema Type | [Brand] | [Comp 1] | [Comp 2] | [Comp 3] | Recommendation |
|-------------|---------|----------|----------|----------|----------------|
| Organization | [Y/N] | [Y/N] | [Y/N] | [Y/N] | Must have |
| LocalBusiness | [Y/N] | [Y/N] | [Y/N] | [Y/N] | If local |
| FAQ | [Y/N] | [Y/N] | [Y/N] | [Y/N] | High impact |
| Breadcrumb | [Y/N] | [Y/N] | [Y/N] | [Y/N] | Recommended |
| Product/Service | [Y/N] | [Y/N] | [Y/N] | [Y/N] | If applicable |
| Review | [Y/N] | [Y/N] | [Y/N] | [Y/N] | High impact |

**Gap:** [Brand] is missing [X] schema types that [Y] of [Z] competitors use.

## Heading & Content Comparison

| Element | [Brand] | [Comp 1] | [Comp 2] | [Comp 3] |
|---------|---------|----------|----------|----------|
| H1 present | [Y/N] | [Y/N] | [Y/N] | [Y/N] |
| H1 has keyword | [Y/N] | [Y/N] | [Y/N] | [Y/N] |
| H2 count | [X] | [X] | [X] | [X] |
| FAQ section | [Y/N] | [Y/N] | [Y/N] | [Y/N] |
| Blog/Content hub | [Y/N] | [Y/N] | [Y/N] | [Y/N] |
| Est. word count | [X] | [X] | [X] | [X] |

## Keyword Gap Matrix

| Keyword | [Brand] | [Comp 1] | [Comp 2] | [Comp 3] | Gap? |
|---------|---------|----------|----------|----------|------|
| [keyword 1] | [Y/N] | [Y/N] | [Y/N] | [Y/N] | [Y/N] |
| [keyword 2] | [Y/N] | [Y/N] | [Y/N] | [Y/N] | [Y/N] |

**Keywords competitors cover but brand doesn't:** [list]

## Technical SEO Comparison

| Element | [Brand] | [Comp 1] | [Comp 2] | [Comp 3] |
|---------|---------|----------|----------|----------|
| Sitemap.xml | [Y/N] | [Y/N] | [Y/N] | [Y/N] |
| Robots.txt | [Y/N] | [Y/N] | [Y/N] | [Y/N] |
| Clean URLs | [Y/N] | [Y/N] | [Y/N] | [Y/N] |
| Mobile viewport | [Y/N] | [Y/N] | [Y/N] | [Y/N] |
| Font preload | [Y/N] | [Y/N] | [Y/N] | [Y/N] |
| Performance est. | [X]/100 | [X]/100 | [X]/100 | [X]/100 |

## Gap Priority Matrix

| Gap | Impact | Effort | Priority | Quick Win? |
|-----|--------|--------|----------|------------|
| [Gap 1] | High | Low | P1 | Yes |
| [Gap 2] | High | Medium | P2 | No |
| [Gap 3] | Medium | Low | P2 | Yes |

## Recommendations

### Quick Wins (implement this week)
1. **[Action]** — [Expected impact]

### Strategic Investments (plan for next quarter)
1. **[Action]** — [Expected impact]

### Monitor (watch competitors for)
1. **[Signal]** — [When to act]

## Sources
- [All URLs analyzed with access dates]
```

## Acceptance Criteria

- [ ] Meta tags compared across all competitors
- [ ] Schema markup inventory completed per competitor
- [ ] Schema gaps identified with recommendations
- [ ] Heading structure analyzed per competitor
- [ ] Keyword coverage gap matrix built
- [ ] Technical SEO elements compared
- [ ] Gaps prioritized by impact and effort
- [ ] Quick wins identified (minimum 3)
- [ ] Recommendations are actionable and specific
- [ ] All competitor URLs and access dates documented

## Quality Gate

| Criterio | Threshold | Obrigatorio |
|----------|-----------|-------------|
| Meta tags comparados entre competidores | 100% dos competidores | Sim |
| Schema markup inventariado por competidor | >70% | Sim |
| Keyword gap matrix construido | >70% das keywords | Sim |
| Gaps priorizados por impacto e esforco | >70% | Sim |
| Quick wins identificados | >=3 | Sim |
| URLs e datas de acesso documentados | 100% | Sim |
| Completude do output | 100% | Sim |

**Pass threshold:** >70% em todos os criterios obrigatorios

---
*Research Intelligence Squad Task*
