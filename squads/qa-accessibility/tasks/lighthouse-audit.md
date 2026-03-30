# lighthouse-audit

```yaml
task:
  id: lighthouse-audit
  name: Lighthouse Performance Audit
  agent: performance-auditor
  squad: qa-accessibility
  type: audit
  elicit: true

inputs:
  required:
    - target_url: "URL to audit with Lighthouse"
  optional:
    - categories: "Categories to audit (default: all)"
    - device: "Mobile or desktop (default: both)"
    - runs: "Number of runs for averaging (default: 3)"
    - budget: "Performance budget JSON file"

outputs:
  - lighthouse_report.md: "Lighthouse audit report"
  - lighthouse_results.json: "Raw Lighthouse JSON output"
  - recommendations.md: "Prioritized optimization recommendations"

pre_conditions:
  - "Target URL accessible"
  - "Lighthouse available via Playwright or CLI"

post_conditions:
  - "All Lighthouse categories audited"
  - "Scores recorded and compared to targets"
  - "Recommendations prioritized"
  - "Budget compliance verified (if budget provided)"

tools:
  - lighthouse
  - playwright
```

## Purpose

Run a full Lighthouse audit covering Performance, Accessibility, Best Practices, and SEO. Average multiple runs for reliability. Compare scores against performance budgets and provide actionable optimization recommendations.

## Workflow

### Phase 1: Configuration (5 min)
1. Define target URL(s) and pages to audit
2. Configure Lighthouse categories:
   - Performance
   - Accessibility
   - Best Practices
   - SEO
3. Set device emulation (mobile and desktop)
4. Load performance budget if provided
5. Configure number of runs (3 for averaging)

### Phase 2: Audit Execution (10 min)
1. Run Lighthouse on desktop (3 runs)
2. Run Lighthouse on mobile (3 runs)
3. Calculate median scores across runs
4. Collect detailed metrics per run

### Phase 3: Performance Analysis (10 min)

| Metric | Target | Threshold | Source |
|--------|--------|-----------|--------|
| Performance Score | >= 90 | >= 75 | Lighthouse |
| First Contentful Paint | < 1.8s | < 3.0s | Performance |
| Largest Contentful Paint | < 2.5s | < 4.0s | Performance |
| Total Blocking Time | < 200ms | < 600ms | Performance |
| Cumulative Layout Shift | < 0.1 | < 0.25 | Performance |
| Speed Index | < 3.4s | < 5.8s | Performance |

### Phase 4: Category Deep Dive (10 min)
1. **Performance** - Largest opportunities for improvement
   - Render-blocking resources
   - Image optimization opportunities
   - Unused CSS/JS
   - Server response time
2. **Accessibility** - WCAG violations detected
3. **Best Practices** - Security, modern API usage
4. **SEO** - Crawlability, structured data

### Phase 5: Budget Compliance (5 min)
If performance budget provided:
1. Compare actual sizes against budget limits
2. Flag over-budget resources
3. Calculate budget headroom or deficit
4. List specific resources to optimize

### Phase 6: Report (5 min)
1. Summary scorecard (all 4 categories, both devices)
2. Performance metrics table with pass/fail
3. Top 10 optimization opportunities ranked by impact
4. Budget compliance table (if applicable)
5. Trend comparison (if previous results available)

## Score Targets

| Category | Target | Minimum | Critical |
|----------|--------|---------|----------|
| Performance | >= 90 | >= 75 | < 75 |
| Accessibility | >= 95 | >= 90 | < 90 |
| Best Practices | >= 90 | >= 80 | < 80 |
| SEO | >= 90 | >= 80 | < 80 |

## Report Format

```markdown
# Lighthouse Audit Report

## Scores

| Category | Desktop | Mobile | Target | Status |
|----------|---------|--------|--------|--------|
| Performance | 92 | 78 | >= 90 | PARTIAL |
| Accessibility | 97 | 97 | >= 95 | PASS |
| Best Practices | 95 | 92 | >= 90 | PASS |
| SEO | 100 | 100 | >= 90 | PASS |

## Top Optimization Opportunities

| Opportunity | Est. Savings | Effort | Priority |
|------------|-------------|--------|----------|
| Serve images in WebP | 1.2s LCP | Low | P0 |
| Remove unused CSS | 0.4s FCP | Medium | P1 |
```

## Acceptance Criteria

- [ ] Lighthouse run completed (3 runs averaged)
- [ ] Both desktop and mobile tested
- [ ] All 4 categories scored
- [ ] Scores compared against targets
- [ ] Top optimization opportunities identified
- [ ] Budget compliance checked (if applicable)
- [ ] Report generated with actionable recommendations

## Quality Gate
- Threshold: >70%
- Lighthouse Performance score >= 75 on both mobile and desktop
- Lighthouse Accessibility score >= 90
- Top optimization opportunities documented with estimated savings and priority

---
*QA Accessibility Squad Task - performance-auditor*
