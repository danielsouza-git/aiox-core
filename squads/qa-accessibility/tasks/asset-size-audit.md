# asset-size-audit

```yaml
task:
  id: asset-size-audit
  name: Asset Size & Optimization Audit
  agent: performance-auditor
  squad: qa-accessibility
  type: audit
  elicit: true

inputs:
  required:
    - target_url: "URL to audit assets"
  optional:
    - budget: "Asset budget limits per type"
    - pages: "Specific pages to audit"
    - include_third_party: "Include third-party assets (default: true)"

outputs:
  - asset_audit_report.md: "Asset size audit report"
  - asset_inventory.json: "Complete asset inventory with sizes"
  - optimization_opportunities.md: "Optimization recommendations"

pre_conditions:
  - "Target URL accessible"
  - "Network inspection capabilities available"

post_conditions:
  - "All assets inventoried with sizes"
  - "Oversized assets identified"
  - "Format optimization opportunities noted"
  - "Lazy loading compliance verified"
```

## Purpose

Audit all assets (images, fonts, CSS, JS, videos) for size, format optimization, compression, and lazy loading. Identify assets that exceed budget limits and provide specific optimization recommendations.

## Workflow

### Phase 1: Asset Discovery (10 min)
1. Load page and capture all network requests
2. Categorize assets:
   - **Images** - JPEG, PNG, WebP, AVIF, SVG, GIF
   - **Fonts** - WOFF2, WOFF, TTF, OTF
   - **CSS** - Stylesheets (inline and external)
   - **JavaScript** - Scripts (inline and external)
   - **Video/Audio** - Media files
   - **Third-party** - External domain resources
3. Record size (compressed and uncompressed) for each
4. Calculate total page weight

### Phase 2: Image Audit (10 min)

| Check | Criteria |
|-------|----------|
| Format | WebP or AVIF preferred (not JPEG/PNG) |
| Dimensions | Not larger than display size (no oversized images) |
| Compression | Optimized quality (< 80% for photos) |
| Responsive | srcset/sizes attributes for responsive images |
| Lazy loading | Below-fold images have `loading="lazy"` |
| Art direction | `<picture>` element for different viewports |

Image size budgets:
- Hero image: max 200KB
- Thumbnail: max 50KB
- Icon/Logo: max 10KB (prefer SVG)
- Background: max 150KB

### Phase 3: Font Audit (5 min)

| Check | Criteria |
|-------|----------|
| Format | WOFF2 (smallest, best support) |
| Subsetting | Only needed characters loaded |
| Weights | Only needed weights loaded |
| Preload | Critical fonts preloaded |
| Display | `font-display: swap` or `optional` |
| Count | Max 2-3 font families |

Font size budget: max 50KB per weight file

### Phase 4: CSS/JS Audit (10 min)

| Check | Criteria |
|-------|----------|
| Minification | All CSS/JS minified |
| Compression | gzip or brotli compression |
| Unused code | No significant unused CSS/JS |
| Code splitting | Route-based code splitting active |
| Critical CSS | Above-fold CSS inlined |
| Defer/async | Non-critical scripts deferred |

Bundle budgets:
- CSS total: max 100KB (gzipped)
- JS total: max 200KB (gzipped)
- Per-chunk: max 50KB (gzipped)

### Phase 5: Lazy Loading & Caching (5 min)
1. Below-fold images use `loading="lazy"`
2. Non-critical CSS/JS loaded asynchronously
3. Cache headers set correctly (immutable for hashed files)
4. Service worker caching for repeat visits
5. CDN configured for static assets

### Phase 6: Report (5 min)
1. Total page weight summary
2. Asset inventory table sorted by size
3. Budget compliance per category
4. Top optimization opportunities ranked by savings
5. Quick wins vs long-term improvements

## Asset Budgets

| Category | Budget | Format |
|----------|--------|--------|
| Images (total) | 500KB | WebP/AVIF |
| Fonts (total) | 150KB | WOFF2 |
| CSS (total) | 100KB | Minified + gzip |
| JS (total) | 200KB | Minified + gzip |
| Total Page Weight | 1MB | All included |

## Report Format

```markdown
# Asset Size Audit Report

## Page Weight Summary

| Category | Count | Size (raw) | Size (gzip) | Budget | Status |
|----------|-------|------------|-------------|--------|--------|
| Images | 12 | 1.2MB | 1.1MB | 500KB | OVER |
| Fonts | 4 | 180KB | 160KB | 150KB | OVER |
| CSS | 3 | 95KB | 28KB | 100KB | OK |
| JS | 8 | 450KB | 180KB | 200KB | OK |
| **Total** | 27 | 1.9MB | 1.5MB | 1MB | OVER |

## Top Optimization Opportunities

| Asset | Current | Optimized | Savings | Action |
|-------|---------|-----------|---------|--------|
| hero.png | 800KB | 150KB | 650KB | Convert to WebP |
| font-bold.woff | 90KB | 45KB | 45KB | Subset to Latin |
```

## Acceptance Criteria

- [ ] All assets inventoried with sizes
- [ ] Images audited for format, dimensions, compression
- [ ] Fonts audited for format, subsetting, preloading
- [ ] CSS/JS audited for minification, compression, splitting
- [ ] Lazy loading compliance verified
- [ ] Budget compliance checked per category
- [ ] Optimization recommendations with estimated savings
- [ ] Report generated with full inventory

## Quality Gate
- Threshold: >70%
- Total page weight under 1MB (gzipped) or all over-budget categories documented
- All images audited for modern format (WebP/AVIF) and lazy loading compliance
- Optimization recommendations provided with estimated savings per asset

---
*QA Accessibility Squad Task - performance-auditor*
