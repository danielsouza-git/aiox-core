# Research Intelligence Squad - Tech Stack

Tools, integrations, and platforms used for research and intelligence gathering.

## Primary Tools

| Tool | Purpose | Access Method |
|------|---------|---------------|
| **EXA Search** | AI-powered web search, research queries | MCP via docker-gateway |
| **Apify** | Web scraping, data extraction, competitor monitoring | MCP via docker-gateway |
| **Claude API** | Analysis, synthesis, report generation | Direct API / MCP |

## Research Platforms

### Web Research
| Platform | Use Case | Data Type |
|----------|----------|-----------|
| **EXA** | Targeted web search with AI filtering | Articles, reports, company pages |
| **Apify Actors** | Automated web scraping | Competitor pages, social profiles |
| **Google Scholar** | Academic research | Research papers, citations |

### Market Data
| Source | Data Available | Recency |
|--------|---------------|---------|
| **Statista** | Market sizing, industry reports | Monthly updates |
| **SimilarWeb** | Website traffic, competitor analytics | Monthly |
| **BuiltWith** | Technology stack detection | Real-time |
| **Crunchbase** | Funding, company data | Daily updates |

### Visual Intelligence
| Tool | Purpose | Output |
|------|---------|--------|
| **Wayback Machine** | Historical website snapshots | Visual timeline |
| **Screely/CleanShot** | Screenshot capture | Visual evidence |
| **Coolors/Adobe Color** | Color palette extraction | Hex/RGB values |
| **WhatFont** | Typography identification | Font family names |

### Trend Sources
| Source | Focus | Update Frequency |
|--------|-------|-----------------|
| **Pantone** | Color of the Year, color trends | Annual + seasonal |
| **WGSN** | Consumer trends, color forecasting | Quarterly |
| **Dribbble/Behance** | Design trends, visual patterns | Real-time |
| **Awwwards** | Web design trends, typography | Real-time |
| **Typewolf** | Typography trends and pairings | Monthly |
| **Google Fonts** | Font popularity, trending typefaces | Real-time |

## Data Processing

### Analysis Pipeline
```
Data Collection (EXA + Apify)
    -> Data Cleaning & Validation
    -> AI-Assisted Analysis (Claude)
    -> Report Generation
    -> Quality Check (Checklist)
    -> Delivery
```

### Data Storage
- Research outputs: `squads/research-intelligence/data/`
- Client-specific: Project output directories
- Temporary scrapes: Cleaned up after analysis

## Integration Points

### With Branding Squad
| Direction | Data | Format |
|-----------|------|--------|
| Receive | Brand profile | Markdown |
| Receive | Competitor URLs | List |
| Provide | Market insights | Research report |
| Provide | Competitive analysis | Audit report |
| Provide | Trend data | Trend report |

### With Copy Squad
| Direction | Data | Format |
|-----------|------|--------|
| Provide | Audience language | Persona documents |
| Provide | Pain points | Pain point matrix |
| Provide | Competitor messaging | Messaging analysis |

## Performance Targets

| Metric | Target |
|--------|--------|
| Quick research | < 30 min |
| Standard research | < 2 hours |
| Deep research | < 4 hours |
| Competitor audit (5 competitors) | < 2 hours |
| Full pipeline (all phases) | < 1 day |

---

*Research Intelligence Squad - Tech Stack v1.0*
