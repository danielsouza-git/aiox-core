# Performance Checklist

Comprehensive web performance checklist for design system and brand deliverables.

## Core Web Vitals

- [ ] **LCP < 2.5s** - Largest Contentful Paint under target on mobile
- [ ] **LCP < 2.5s** - Largest Contentful Paint under target on desktop
- [ ] **INP < 200ms** - Interaction to Next Paint under target
- [ ] **CLS < 0.1** - Cumulative Layout Shift under target
- [ ] **FCP < 1.8s** - First Contentful Paint under target
- [ ] **TTFB < 800ms** - Time to First Byte under target
- [ ] **TBT < 200ms** - Total Blocking Time under target

## Image Optimization

- [ ] **Modern formats** - Images served as WebP or AVIF
- [ ] **Responsive images** - srcset/sizes attributes used
- [ ] **Lazy loading** - Below-fold images use `loading="lazy"`
- [ ] **Dimensions set** - Width/height attributes prevent CLS
- [ ] **Compression** - Images optimized (quality 75-85%)
- [ ] **No oversized images** - Intrinsic size matches display size
- [ ] **Hero image preloaded** - LCP image has `<link rel="preload">`
- [ ] **SVG optimized** - SVGs minified, no unnecessary metadata

## Font Performance

- [ ] **WOFF2 format** - All fonts served as WOFF2
- [ ] **Font preload** - Critical fonts preloaded
- [ ] **Font display** - `font-display: swap` or `optional` set
- [ ] **Subsetting** - Fonts subset to needed character ranges
- [ ] **Max 3 families** - No more than 3 font families loaded
- [ ] **Max 6 weights** - Minimal font weight variants loaded

## CSS Performance

- [ ] **Minified** - CSS minified in production
- [ ] **Compressed** - gzip or brotli compression active
- [ ] **Critical CSS** - Above-fold CSS inlined
- [ ] **No unused CSS** - Dead CSS removed or tree-shaken
- [ ] **No render-blocking** - Non-critical CSS loaded async
- [ ] **Bundle < 100KB** - Total CSS under budget (gzipped)

## JavaScript Performance

- [ ] **Minified** - JS minified in production
- [ ] **Compressed** - gzip or brotli compression active
- [ ] **Code splitting** - Route-based code splitting active
- [ ] **Tree shaking** - Unused exports eliminated
- [ ] **Defer/async** - Non-critical scripts deferred
- [ ] **No long tasks** - No JS tasks > 50ms blocking main thread
- [ ] **Bundle < 200KB** - Total JS under budget (gzipped)

## Caching & CDN

- [ ] **Cache headers** - Appropriate Cache-Control headers set
- [ ] **Immutable assets** - Hashed filenames use long cache TTL
- [ ] **CDN configured** - Static assets served from CDN
- [ ] **Service worker** - Caching strategy for repeat visits (if applicable)
- [ ] **Stale-while-revalidate** - Where appropriate for API responses

## Loading Strategy

- [ ] **Above-fold priority** - Critical content loads first
- [ ] **Below-fold deferred** - Non-visible content lazy loaded
- [ ] **Third-party deferred** - Analytics/tracking scripts deferred
- [ ] **Prefetch** - Next-page resources prefetched on hover
- [ ] **No render blocking** - Nothing blocks first paint unnecessarily

## Lighthouse Scores

- [ ] **Performance >= 90** - Green score on performance
- [ ] **Accessibility >= 95** - Near-perfect accessibility score
- [ ] **Best Practices >= 90** - Modern web standards followed
- [ ] **SEO >= 90** - Search engine optimization standards met

---

## Scoring

| Score | Rating | Action |
|-------|--------|--------|
| 90-100% | Excellent | Performance-optimized, ship it |
| 75-89% | Good | Minor optimizations needed |
| 60-74% | Fair | Significant optimization needed |
| Below 60% | Poor | Major performance issues, fix required |

---

*QA Accessibility Squad - Performance Checklist v1.0*
