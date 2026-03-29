# industry-report

```yaml
task:
  id: industry-report
  name: Industry Landscape Report
  agent: market-researcher
  squad: research-intelligence
  type: research
  elicit: true

inputs:
  required:
    - industry: "Industry vertical to analyze"
    - focus_areas: "Specific aspects to emphasize"
  optional:
    - geography: "Geographic focus (default: global)"
    - time_horizon: "Forecast period (default: 5 years)"
    - existing_reports: "Previous reports to build upon"
    - specific_themes: "Themes to investigate"

outputs:
  - industry-report.md: "Complete industry landscape report"
  - disruptions.md: "Disruption and innovation analysis"
  - regulatory.md: "Regulatory landscape summary"
  - forecast.md: "Industry forecast and projections"

pre_conditions:
  - "Industry clearly defined"
  - "Focus areas specified"

post_conditions:
  - "Macro trends documented"
  - "Disruptions identified"
  - "Regulatory landscape covered"
  - "5-year forecast included"
```

## Purpose

Produce a comprehensive industry landscape report covering trends, disruptions, opportunities, and threats. The report serves as strategic context for brand positioning and business decisions.

## Workflow

### Phase 1: Industry Overview (15 min)
1. Define industry boundaries and sub-sectors
2. Document industry lifecycle stage (emerging/growth/mature/declining)
3. Identify value chain structure
4. Note industry concentration (fragmented vs. consolidated)
5. Map key stakeholder groups

### Phase 2: Macro Trend Analysis (25 min)
1. **Technology trends** - Emerging technologies reshaping the industry
2. **Economic trends** - Market forces, pricing pressures, cost structures
3. **Social trends** - Consumer behavior shifts, generational changes
4. **Regulatory trends** - Policy changes, compliance requirements
5. **Environmental trends** - Sustainability, ESG factors
6. Rate each trend by impact (High/Medium/Low) and timeline

### Phase 3: Disruption Mapping (20 min)
1. Identify disruptive entrants and their models
2. Map technology-driven disruptions
3. Note business model innovations
4. Document shifts in distribution channels
5. Assess pace of change

### Phase 4: Competitive Dynamics (15 min)
1. Porter's Five Forces assessment
2. Key success factors in the industry
3. Barriers to entry
4. Switching costs analysis
5. Substitute threats

### Phase 5: Opportunities & Threats (15 min)
1. Map emerging opportunities by segment
2. Identify convergence with adjacent industries
3. Note underserved market niches
4. Document key threats and risk factors
5. Assess regulatory risks

### Phase 6: Forecast & Synthesis (20 min)
1. Project industry growth trajectory
2. Predict structural changes
3. Identify winning strategies
4. Write executive summary
5. Compile source citations

## Report Template

```markdown
# Industry Landscape Report: [Industry]

## Executive Summary
[3-4 paragraph synthesis of key findings and implications]

## Industry Overview
- **Definition:** [What this industry encompasses]
- **Lifecycle Stage:** [Emerging/Growth/Mature/Declining]
- **Global Market Size:** $[X]B ([Year])
- **Growth Rate (CAGR):** [X]% ([Period])
- **Key Sub-Sectors:** [List]

## Macro Trends

| Trend | Category | Impact | Timeline | Implication |
|-------|----------|--------|----------|-------------|
| [Trend] | Tech/Economic/Social/Reg/Env | H/M/L | [Timeframe] | [What it means] |

## Disruptions
1. **[Disruption 1]** - [Description, players, impact]
2. **[Disruption 2]** - [Description, players, impact]

## Competitive Dynamics (Porter's Five Forces)

| Force | Intensity | Key Factors |
|-------|-----------|-------------|
| Rivalry | H/M/L | [Factors] |
| New Entrants | H/M/L | [Factors] |
| Substitutes | H/M/L | [Factors] |
| Buyer Power | H/M/L | [Factors] |
| Supplier Power | H/M/L | [Factors] |

## Opportunities
1. [Opportunity with sizing and rationale]
2. [Opportunity with sizing and rationale]

## Threats
1. [Threat with likelihood and impact]
2. [Threat with likelihood and impact]

## 5-Year Forecast
[Narrative forecast with data projections]

## Methodology & Sources
[Complete source list with dates]
```

## Acceptance Criteria

- [ ] Industry clearly defined with lifecycle stage
- [ ] 5+ macro trends identified and rated
- [ ] Disruptions mapped with impact assessment
- [ ] Porter's Five Forces completed
- [ ] Opportunities and threats documented
- [ ] 5-year forecast with projections
- [ ] All data sourced and cited
- [ ] Executive summary written

---
*Research Intelligence Squad Task*
