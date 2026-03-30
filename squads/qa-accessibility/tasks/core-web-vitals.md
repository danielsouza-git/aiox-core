# core-web-vitals

```yaml
task:
  id: core-web-vitals
  name: Core Web Vitals Measurement
  agent: performance-auditor
  squad: qa-accessibility
  type: measurement
  elicit: true

inputs:
  required:
    - target_url: "URL to measure Core Web Vitals"
  optional:
    - pages: "List of pages to measure"
    - connection: "Network throttle (4G, 3G, default: 4G)"
    - device: "Mobile or desktop (default: mobile)"
    - runs: "Number of measurement runs (default: 5)"

outputs:
  - cwv_report.md: "Core Web Vitals report"
  - cwv_data.json: "Raw measurement data"
  - optimization_plan.md: "Optimization plan for failing metrics"

pre_conditions:
  - "Target URL accessible"
  - "Measurement tools available"

post_conditions:
  - "All 3 Core Web Vitals measured"
  - "Metrics compared against Google targets"
  - "Root causes identified for failing metrics"
  - "Optimization plan created"
```

## Purpose

Measure all three Core Web Vitals (LCP, FID/INP, CLS) against Google's performance targets. Identify root causes for any failing metrics and provide a concrete optimization plan.

## Workflow

### Phase 1: LCP - Largest Contentful Paint (10 min)
**Target: < 2.5s | Threshold: < 4.0s**

1. Identify the LCP element (what is it?)
2. Measure LCP time across multiple runs
3. Analyze LCP breakdown:
   - Time to First Byte (TTFB)
   - Resource load delay
   - Resource load time
   - Element render delay
4. Identify bottleneck phase

Common LCP issues:
- Slow server response (TTFB > 800ms)
- Render-blocking CSS/JS
- Large unoptimized images
- Client-side rendering delay
- Font loading blocking render

### Phase 2: INP - Interaction to Next Paint (10 min)
**Target: < 200ms | Threshold: < 500ms**

1. Identify slow interactions
2. Measure processing time for:
   - Button clicks
   - Form submissions
   - Navigation interactions
   - Dropdown opens
3. Analyze INP breakdown:
   - Input delay (queued time)
   - Processing time (event handler)
   - Presentation delay (render)
4. Identify longest tasks

Common INP issues:
- Long tasks blocking main thread
- Heavy event handlers
- Excessive re-renders
- Third-party script interference
- Layout thrashing

### Phase 3: CLS - Cumulative Layout Shift (10 min)
**Target: < 0.1 | Threshold: < 0.25**

1. Load page and measure total CLS
2. Identify individual layout shifts
3. For each shift, determine the cause:
   - Images without dimensions
   - Ads/embeds without reserved space
   - Dynamically injected content
   - Web fonts causing FOIT/FOUT
   - Late-loading CSS
4. Document shift elements and magnitude

Common CLS issues:
- Images without width/height attributes
- Ads or iframes without size
- Content injected above existing content
- Font swap causing text reflow
- CSS loaded asynchronously

### Phase 4: Secondary Metrics (5 min)
1. **FCP** - First Contentful Paint (target < 1.8s)
2. **TTFB** - Time to First Byte (target < 800ms)
3. **TBT** - Total Blocking Time (target < 200ms)
4. **Speed Index** - Visual load progress (target < 3.4s)

### Phase 5: Optimization Plan (5 min)
1. Rank issues by impact on CWV scores
2. Estimate effort for each fix
3. Create prioritized action items
4. Set target metrics after optimization

## Core Web Vitals Targets (Google)

| Metric | Good | Needs Improvement | Poor |
|--------|------|--------------------|------|
| **LCP** | <= 2.5s | 2.5s - 4.0s | > 4.0s |
| **INP** | <= 200ms | 200ms - 500ms | > 500ms |
| **CLS** | <= 0.1 | 0.1 - 0.25 | > 0.25 |

## Report Format

```markdown
# Core Web Vitals Report

## Summary

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| LCP | 2.1s | < 2.5s | GOOD |
| INP | 350ms | < 200ms | NEEDS IMPROVEMENT |
| CLS | 0.05 | < 0.1 | GOOD |

## LCP Analysis
- LCP Element: <img src="hero.jpg">
- TTFB: 400ms
- Resource Load: 800ms
- Render Delay: 900ms
- Bottleneck: Resource load time (unoptimized image)

## Optimization Plan
1. [P0] Convert hero image to WebP (est. -0.5s LCP)
2. [P0] Reduce JS bundle blocking INP (est. -150ms)
```

## Acceptance Criteria

- [ ] LCP measured and root cause identified
- [ ] INP measured with slow interactions documented
- [ ] CLS measured with shift elements identified
- [ ] Secondary metrics measured (FCP, TTFB, TBT)
- [ ] All metrics compared against Google targets
- [ ] Optimization plan with priorities created
- [ ] Report generated with full breakdown

## Quality Gate
- Threshold: >70%
- All three Core Web Vitals (LCP, INP, CLS) measured with root causes identified
- LCP < 4.0s and CLS < 0.25 (minimum threshold; target is LCP < 2.5s, CLS < 0.1)
- Optimization plan created with prioritized action items and estimated impact

---
*QA Accessibility Squad Task - performance-auditor*
