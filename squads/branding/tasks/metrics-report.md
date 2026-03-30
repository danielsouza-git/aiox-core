# Metrics Report

```yaml
task:
  id: metrics-report
  name: "Metrics Report"
  agent: operations-coordinator
  squad: branding
  type: reporting
```

## Proposito

Generate a comprehensive project metrics dashboard covering delivery timelines, revision counts, asset volumes, cost tracking, and team productivity for a branding client project.

## Input

- Client project identifier
- Reporting period (weekly, monthly, or custom range)
- ClickUp project data
- R2 storage usage data
- AI cost tracking data

## Output

- Metrics dashboard report (markdown)
- Summary statistics (JSON)
- Trend analysis with comparisons to previous periods

## Workflow

### Passo 1: Collect Project Data
Pull task completion rates, revision counts, timeline adherence, and status distributions from ClickUp for the specified period.

### Passo 2: Collect Storage Metrics
Gather R2 storage usage, asset counts by category, and upload/download volumes.

### Passo 3: Collect Cost Data
Aggregate AI API costs (copy generation, image generation) from the cost tracking system and compare against the monthly budget cap.

### Passo 4: Calculate KPIs
Compute key performance indicators: on-time delivery rate, average revision rounds, cost per deliverable, and throughput metrics.

### Passo 5: Generate Report
Assemble all metrics into a formatted report with tables, trends, and actionable recommendations.

## O que faz

- Aggregates data from ClickUp, R2, and cost tracking systems
- Calculates project KPIs (on-time rate, revision average, cost efficiency)
- Produces formatted dashboard reports for stakeholders
- Identifies trends and provides actionable recommendations
- Tracks AI cost usage against budget caps

## O que NAO faz

- Does not modify project timelines or budgets
- Does not make resource allocation decisions
- Does not generate financial invoices

## Ferramentas

- **ClickUp API** -- Project and task data retrieval
- **Cloudflare R2 API** -- Storage metrics
- **Cost Tracker** -- AI API usage and cost aggregation

## Quality Gate

- Threshold: >70%
- All data sources successfully queried
- KPIs calculated with no missing data points
- Report includes trend comparison to previous period

---
*Squad Branding Task*
