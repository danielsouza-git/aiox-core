# Analytics Report

```yaml
task:
  id: analytics-report
  name: "Analytics Report"
  agent: analytics-specialist
  squad: branding
  type: reporting
```

## Proposito

Generate a monthly analytics report for a branding client, consolidating data from GA4, Search Console, and advertising platforms into an executive summary with key metrics, trends, and actionable recommendations.

## Input

- Client GA4 property ID
- Reporting period (month/year)
- Search Console property URL
- Advertising platform data (Meta Ads, Google Ads -- if applicable)
- Previous month's report (for trend comparison)

## Output

- Monthly analytics report (markdown/PDF)
- Executive summary with key highlights
- Metrics comparison table (current vs. previous period)
- Channel performance breakdown
- Prioritized recommendations for next period

## Workflow

### Passo 1: Pull GA4 Data
Extract key metrics from GA4: sessions, users, pageviews, average session duration, bounce rate, conversions, and conversion rate for the reporting period.

### Passo 2: Pull Search Console Data
Gather organic search performance: total impressions, clicks, average CTR, average position, and top-performing queries and pages.

### Passo 3: Pull Advertising Data
If applicable, collect advertising metrics: impressions, clicks, CTR, CPC, conversions, and ROAS from Meta Ads and Google Ads.

### Passo 4: Calculate Trends
Compare all metrics against the previous period and calculate percentage changes, flagging significant improvements or declines.

### Passo 5: Generate Report and Recommendations
Compile all data into the report template with executive summary, metrics tables, channel breakdowns, and 3-5 actionable recommendations for the next period.

## O que faz

- Consolidates analytics data from multiple platforms (GA4, Search Console, Ads)
- Calculates period-over-period trends with percentage changes
- Provides an executive summary highlighting key wins and concerns
- Breaks down performance by marketing channel
- Delivers actionable recommendations based on data insights

## O que NAO faz

- Does not modify tracking configurations or events
- Does not execute marketing campaigns or ad optimizations
- Does not guarantee specific traffic or conversion outcomes

## Ferramentas

- **GA4 Reporting API** -- Analytics data extraction
- **Search Console API** -- Organic search data
- **Meta/Google Ads APIs** -- Advertising performance data

## Quality Gate

- Threshold: >70%
- All data sources queried successfully for the full reporting period
- Period-over-period comparison included for all key metrics
- At least 3 data-driven recommendations provided

---
*Squad Branding Task*
