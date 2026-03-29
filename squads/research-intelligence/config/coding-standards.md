# Research Intelligence Squad - Coding Standards

Standards for research deliverables, report formatting, and data presentation.

## File Naming

### Research Deliverables
```
{type}-{subject}-{version}.md
```

Examples:
- `market-research-saas-fintech-v1.md`
- `competitive-audit-health-wellness-v2.md`
- `trend-report-ecommerce-2026-v1.md`

### Drafts and Revisions
```
{type}-{subject}-draft-{number}.md
{type}-{subject}-rev-{number}.md
```

Examples:
- `audience-analysis-b2b-draft-1.md`
- `positioning-map-fintech-rev-2.md`

## Document Structure

### Standard Research Document

```markdown
# [Research Type]: [Subject]

## Metadata
- **Client:** [Name]
- **Industry:** [Industry]
- **Author:** [Agent/person]
- **Date:** [YYYY-MM-DD]
- **Version:** [X.X]
- **Status:** [Draft/Review/Approved/Final]
- **Scope:** [quick/standard/deep]

## Executive Summary
[2-3 paragraph overview of key findings]

---

## [RESEARCH CONTENT]

---

## Methodology
[How the research was conducted]

## Sources
[Complete citation list]

## Appendix
[Supporting data, raw data tables]
```

## Data Presentation Standards

### Tables
- Use tables for all comparative data
- Include headers with clear labels
- Right-align numeric columns
- Include units (%, $, count)
- Sort by relevance or descending value

### Citations
```
Source: [Source Name], [Publication Date], [URL]
Confidence: [High/Medium/Low]
```

### Numeric Formatting
| Type | Format | Example |
|------|--------|---------|
| Market size | $[X]B or $[X]M | $4.2B |
| Percentages | [X]% (1 decimal) | 23.5% |
| Growth rates | [X]% CAGR | 12.3% CAGR |
| Dates | YYYY-MM-DD | 2026-03-27 |
| Ranges | [X]-[Y] | 15-20% |

### Confidence Levels
| Level | Definition | Usage |
|-------|-----------|-------|
| **High** | Multiple authoritative sources agree | Confirmed facts, published data |
| **Medium** | Single source or analyst estimate | Industry reports, expert opinions |
| **Low** | Extrapolation or limited data | Estimates, projections, inferences |

## Quality Markers

Include at end of every research document:

```markdown
## Quality Checklist
- [ ] All data points sourced
- [ ] Data recency < 12 months
- [ ] Minimum 3 sources for key metrics
- [ ] Fact vs. inference distinguished
- [ ] Executive summary present
- [ ] Recommendations actionable
```

## Version Control

### Versioning System
- `v1.0` - Initial research
- `v1.1` - Data updates or corrections
- `v2.0` - Major revision or expanded scope
- `v2.1` - Minor updates to v2

### Status Labels
- `Draft` - Work in progress
- `Review` - Ready for review
- `Approved` - Stakeholder approved
- `Final` - Ready for distribution

## Visual Evidence Standards

### Screenshots
- Full-page captures at 1440px viewport (desktop)
- 375px viewport for mobile
- Annotated with callouts if necessary
- Named: `{competitor}-{page}-{date}.png`

### Color Extraction
- Always provide hex codes
- Include RGB when relevant
- Reference Pantone codes where applicable

### Charts and Diagrams
- Use ASCII tables for inline comparison
- Reference external visualization tools for complex charts
- Always include data source below chart

---

*Research Intelligence Squad - Coding Standards v1.0*
