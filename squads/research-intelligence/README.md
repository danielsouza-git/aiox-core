# Research Intelligence Squad

Brand intelligence and market research squad. Feed the branding pipeline with data-driven insights: competitive analysis, market trends, audience research, and brand perception audits.

## Overview

| Aspect | Value |
|--------|-------|
| **Domain** | Brand Research & Intelligence |
| **Agents** | 4 |
| **Tasks** | 12 |
| **Workflows** | 3 |

## Agents

| Icon | ID | Name | Role |
|------|-----|------|------|
| :mag: | `market-researcher` | Maya | Market Analysis & Audience Insights |
| :crossed_swords: | `competitive-analyst` | Cyrus | Competitive Audits & Positioning |
| :mag_right: | `brand-auditor` | Blake | Brand Perception & Consistency |
| :ocean: | `trend-spotter` | Tessa | Design Trends & Forecasting |

## Quick Start

```bash
# Activate an agent
@research-intelligence:market-researcher

# Or use slash command
/research-intelligence:market-researcher

# Run a command
*research
```

## Workflows

### 1. Research Pipeline Flow
Full market research from data collection to insight delivery.
```
market-research -> audience-analysis -> competitive-audit -> trend-report -> final-report
```

### 2. Competitive Intelligence Flow
Deep competitor analysis from identification to positioning.
```
competitor-identification -> competitive-audit -> visual-benchmark -> positioning-map
```

### 3. Brand Health Check Flow
Brand perception audit from assessment to recommendations.
```
brand-perception-audit -> touchpoint-audit -> consistency-score -> recommendations
```

## Integration with Branding Squad

The Research Intelligence Squad integrates seamlessly with the Branding Squad:

**Receives from Branding:**
- Brand profile & personality
- Competitor URLs
- Industry classification

**Provides to Branding:**
- Market insights & sizing
- Competitive analysis
- Trend data & forecasts
- Audience personas

**Provides to Copy:**
- Audience language patterns
- Pain points & desires
- Competitor messaging analysis

```bash
# Example: Branding Squad requests research
@branding:brand-strategist -> identifies competitors
@research-intelligence:competitive-analyst -> runs full competitive audit
@research-intelligence:trend-spotter -> identifies relevant design trends
@branding:token-engineer -> uses trend data for palette decisions
```

## Usage Examples

### Run market research
```bash
@research-intelligence:market-researcher
*research --industry "SaaS" --scope full
```

### Deep audience analysis
```bash
@research-intelligence:market-researcher
*audience --segments 4 --depth psychographic
```

### Competitive audit
```bash
@research-intelligence:competitive-analyst
*audit --competitors 8 --include-visual true
```

### Visual benchmarking
```bash
@research-intelligence:competitive-analyst
*benchmark --focus "homepage,pricing" --competitors 5
```

### Brand perception audit
```bash
@research-intelligence:brand-auditor
*perception --channels "web,social,email"
```

### Consistency scoring
```bash
@research-intelligence:brand-auditor
*score --touchpoints all
```

### Trend report
```bash
@research-intelligence:trend-spotter
*trends --industry "fintech" --timeframe "2026"
```

### Color forecast
```bash
@research-intelligence:trend-spotter
*colors --industry "health-wellness" --year 2027
```

## File Structure

```
squads/research-intelligence/
+-- squad.yaml              # Manifest
+-- README.md               # This file
+-- config/
|   +-- coding-standards.md
|   +-- tech-stack.md
|   +-- research-sources.md
+-- agents/
|   +-- market-researcher.md
|   +-- competitive-analyst.md
|   +-- brand-auditor.md
|   +-- trend-spotter.md
+-- tasks/
|   +-- market-research.md
|   +-- audience-analysis.md
|   +-- industry-report.md
|   +-- competitive-audit.md
|   +-- visual-benchmark.md
|   +-- positioning-map.md
|   +-- brand-perception-audit.md
|   +-- touchpoint-audit.md
|   +-- consistency-score.md
|   +-- trend-report.md
|   +-- color-forecast.md
|   +-- typography-trends.md
+-- workflows/
|   +-- research-pipeline-flow.yaml
|   +-- competitive-intelligence-flow.yaml
|   +-- brand-health-check-flow.yaml
+-- checklists/
    +-- research-quality-checklist.md
    +-- competitive-audit-checklist.md
    +-- brand-health-checklist.md
```

## License

MIT

---

*Research Intelligence Squad - Part of AIOX Framework*
