# Web Vitals Audit

```yaml
task:
  id: web-vitals-audit
  name: "Web Vitals Audit"
  agent: analytics-specialist
  squad: branding
  type: performance
```

## Proposito

Audit Core Web Vitals (LCP, FID/INP, CLS) for a branding client's website, measuring against target thresholds, identifying performance bottlenecks, and providing prioritized optimization recommendations.

## Input

- Client website URL(s) to audit
- Target thresholds (LCP <2.5s, FID <100ms, CLS <0.1)
- Device types to test (mobile, desktop)
- Priority pages (homepage, landing pages, key conversion pages)

## Output

- Web Vitals score report per page
- Lighthouse performance scores
- Bottleneck analysis with root causes
- Prioritized optimization recommendations
- Before/after comparison data (if re-audit)

## Workflow

### Passo 1: Run PageSpeed Insights
Execute PageSpeed Insights API tests for each priority page on both mobile and desktop, collecting LCP, FID/INP, CLS, and overall performance score.

### Passo 2: Run Lighthouse Audit
Run a full Lighthouse audit for each priority page to capture detailed performance metrics, accessibility scores, and specific improvement opportunities.

### Passo 3: Analyze Bottlenecks
Identify the root causes of any metrics that fail to meet targets: large images, render-blocking resources, layout shifts, slow server response.

### Passo 4: Prioritize Recommendations
Rank optimization recommendations by impact (estimated improvement) and effort (implementation difficulty), focusing on quick wins first.

### Passo 5: Generate Report
Compile all metrics, bottleneck analysis, and prioritized recommendations into a structured report with comparison to targets.

## O que faz

- Measures Core Web Vitals (LCP, FID/INP, CLS) per page
- Runs Lighthouse audits for comprehensive performance scoring
- Identifies specific bottlenecks causing poor performance
- Provides prioritized optimization recommendations
- Tracks improvements over time with before/after comparisons

## O que NAO faz

- Does not implement the performance optimizations (web-builder handles that)
- Does not audit non-web deliverables (social media, PDFs, etc.)
- Does not guarantee specific performance scores after optimization

## Ferramentas

- **PageSpeed Insights API** -- Core Web Vitals field and lab data
- **Lighthouse** -- Comprehensive performance auditing
- **Chrome DevTools** -- Detailed performance profiling

## Quality Gate

- Threshold: >70%
- All priority pages tested on both mobile and desktop
- Each metric compared against target thresholds
- At least 3 actionable optimization recommendations provided

---
*Squad Branding Task*
