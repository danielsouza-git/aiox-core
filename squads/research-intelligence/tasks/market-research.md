# market-research

```yaml
task:
  id: market-research
  name: Comprehensive Market Research
  agent: market-researcher
  squad: research-intelligence
  type: research
  elicit: true

inputs:
  required:
    - industry: "Industry or vertical to research"
    - geography: "Target market geography"
    - scope: "quick | standard | deep"
  optional:
    - existing_data: "Any existing market data or reports"
    - specific_questions: "Specific research questions to answer"
    - competitor_list: "Known competitors to include"
    - time_horizon: "Forecast timeframe (default: 3 years)"

outputs:
  - market-research-report.md: "Complete market research report"
  - market-sizing.md: "TAM, SAM, SOM calculations"
  - key-players.md: "Major players and market share"
  - opportunities.md: "Growth opportunities and gaps"

pre_conditions:
  - "Industry clearly defined"
  - "Geography scope set"
  - "Research questions identified"

post_conditions:
  - "All data points sourced"
  - "TAM/SAM/SOM calculated"
  - "Key players identified"
  - "Growth projections included"
```

## Purpose

Deliver a comprehensive market research report covering market size, key players, growth trends, and opportunities. All findings are data-backed with clear source citations.

## Workflow

### Phase 1: Scope Definition (10 min)
1. Confirm industry vertical and sub-segments
2. Define geographic boundaries
3. Clarify research depth (quick/standard/deep)
4. Identify specific questions to answer
5. Set time horizon for projections

### Phase 2: Market Sizing (30 min)
1. Calculate Total Addressable Market (TAM)
   - Top-down: Industry reports, analyst estimates
   - Bottom-up: Unit economics extrapolation
2. Calculate Serviceable Addressable Market (SAM)
   - Geographic filters
   - Segment filters
   - Technology/capability filters
3. Calculate Serviceable Obtainable Market (SOM)
   - Realistic capture rate
   - Competitive intensity factor
   - Go-to-market constraints

### Phase 3: Landscape Mapping (30 min)
1. Identify key players (5-15)
2. Estimate market share distribution
3. Map funding and investment activity
4. Identify recent M&A activity
5. Note regulatory landscape

### Phase 4: Trend Analysis (20 min)
1. Identify 3-5 macro trends affecting the market
2. Note technology disruptions
3. Map consumer behavior shifts
4. Forecast growth trajectory (CAGR)
5. Identify risk factors

### Phase 5: Opportunity Mapping (20 min)
1. Identify underserved segments
2. Map unmet customer needs
3. Find pricing gaps
4. Spot geographic white spaces
5. Note emerging sub-markets

### Phase 6: Report Assembly (20 min)
1. Compile all sections with citations
2. Create executive summary
3. Build data visualization tables
4. Add methodology notes
5. Quality check all data points

## Report Template

```markdown
# Market Research Report: [Industry]

## Executive Summary
[2-3 paragraph overview of key findings]

## Market Sizing

### TAM (Total Addressable Market)
- **Size:** $[X]B ([Year])
- **Methodology:** [Top-down/Bottom-up]
- **Source:** [Citation]

### SAM (Serviceable Addressable Market)
- **Size:** $[X]B
- **Filters applied:** [Geography, segment, etc.]

### SOM (Serviceable Obtainable Market)
- **Size:** $[X]M
- **Capture rate assumption:** [X]%

### Growth Projections
| Year | Market Size | YoY Growth | CAGR |
|------|-------------|------------|------|
| [Current] | $[X]B | - | - |
| [+1] | $[X]B | [X]% | [X]% |
| [+3] | $[X]B | [X]% | [X]% |

## Key Players

| Company | Est. Market Share | HQ | Founded | Funding |
|---------|-------------------|-----|---------|---------|
| [Name] | [X]% | [Location] | [Year] | $[X]M |

## Market Trends
1. **[Trend 1]** - [Description with data]
2. **[Trend 2]** - [Description with data]
3. **[Trend 3]** - [Description with data]

## Opportunities
1. **[Opportunity 1]** - [Size estimate, rationale]
2. **[Opportunity 2]** - [Size estimate, rationale]

## Risk Factors
- [Risk 1]
- [Risk 2]

## Methodology & Sources
[List all sources with dates]
```

## Data Quality Standards

| Criterion | Requirement |
|-----------|-------------|
| **Recency** | Data less than 12 months old |
| **Source diversity** | Minimum 3 independent sources for key metrics |
| **Confidence labeling** | High/Medium/Low for each data point |
| **Citation format** | Source name, date, URL |

## Acceptance Criteria

- [ ] TAM, SAM, SOM calculated with methodology documented
- [ ] Minimum 5 key players identified with market share estimates
- [ ] 3-5 market trends identified with supporting data
- [ ] Growth projections with CAGR for 3+ years
- [ ] All data points sourced and cited
- [ ] Opportunities section with size estimates
- [ ] Risk factors identified
- [ ] Executive summary written

## Quality Gate

| Criterio | Threshold | Obrigatorio |
|----------|-----------|-------------|
| TAM/SAM/SOM calculados com metodologia | 100% | Sim |
| Key players identificados com market share | >=5 | Sim |
| Trends de mercado com dados de suporte | >=3 | Sim |
| Growth projections com CAGR (3+ anos) | 100% | Sim |
| Data points com fontes citadas | 100% | Sim |
| Executive summary escrito | 100% | Sim |
| Completude do output | 100% | Sim |

**Pass threshold:** >70% em todos os criterios obrigatorios

---
*Research Intelligence Squad Task*
