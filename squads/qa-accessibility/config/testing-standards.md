# QA Accessibility Squad - Testing Standards

Standards, targets, and methodologies for all testing activities.

## WCAG Compliance Standards

### Target Level
- **Default:** WCAG 2.2 Level AA
- **Stretch:** WCAG 2.2 Level AAA (select criteria)
- **Minimum:** WCAG 2.2 Level A

### Success Criteria Scope
| Level | Criteria Count | Coverage |
|-------|---------------|----------|
| A | 30 | Mandatory - all must pass |
| AA | 20 | Target - all should pass |
| AAA | 28 | Stretch - selected criteria |

### Testing Methodology
1. **Automated first** - axe-core + Pa11y for broad coverage
2. **Manual verification** - Keyboard, screen reader, visual inspection
3. **User testing** - When possible, test with real assistive tech users
4. **Regression testing** - Re-run automated suite on every release

## Browser Matrix

### Desktop Browsers
| Browser | Engine | Versions | Priority | Test Frequency |
|---------|--------|----------|----------|----------------|
| Chrome | Chromium | Latest, Latest-1 | P0 | Every release |
| Firefox | Gecko | Latest, Latest-1 | P0 | Every release |
| Safari | WebKit | Latest, Latest-1 | P1 | Every release |
| Edge | Chromium | Latest | P1 | Major releases |

### Mobile Browsers
| Browser | OS | Device | Priority | Test Frequency |
|---------|-----|--------|----------|----------------|
| Chrome | Android | Pixel 5 | P1 | Major releases |
| Safari | iOS | iPhone 13 | P1 | Major releases |

## Device Matrix

### Responsive Breakpoints
| Name | Width | Device Class | Priority |
|------|-------|-------------|----------|
| Mobile S | 320px | Small phones (iPhone SE) | P0 |
| Mobile L | 375px | Standard phones (iPhone 13) | P1 |
| Tablet P | 768px | Tablet portrait (iPad) | P0 |
| Tablet L | 1024px | Tablet landscape (iPad) | P1 |
| Desktop | 1440px | Standard desktop | P0 |
| Desktop XL | 1920px | Large desktop | P1 |

### Touch Target Minimums
- **WCAG 2.2 minimum:** 24x24px
- **Recommended:** 44x44px
- **Spacing between targets:** >= 8px

## Performance Budgets

### Core Web Vitals
| Metric | Good | Needs Work | Poor |
|--------|------|-----------|------|
| **LCP** | <= 2.5s | 2.5s - 4.0s | > 4.0s |
| **INP** | <= 200ms | 200ms - 500ms | > 500ms |
| **CLS** | <= 0.1 | 0.1 - 0.25 | > 0.25 |

### Lighthouse Scores
| Category | Target | Minimum | Critical |
|----------|--------|---------|----------|
| Performance | >= 90 | >= 75 | < 75 |
| Accessibility | >= 95 | >= 90 | < 90 |
| Best Practices | >= 90 | >= 80 | < 80 |
| SEO | >= 90 | >= 80 | < 80 |

### Asset Budgets
| Asset Type | Max Size | Format |
|------------|----------|--------|
| Hero Image | 200KB | WebP/AVIF |
| Thumbnail | 50KB | WebP |
| Icon/Logo | 10KB | SVG |
| Font File | 50KB/weight | WOFF2 |
| CSS Total | 100KB | Minified + gzip |
| JS Total | 200KB | Minified + gzip |
| Total Page Weight | 1MB | All resources |

## Color Contrast Standards

### WCAG AA Requirements
| Text Type | Minimum Ratio |
|-----------|---------------|
| Normal text (< 18pt) | 4.5:1 |
| Large text (>= 18pt / >= 14pt bold) | 3:1 |
| UI components | 3:1 |
| Focus indicators | 3:1 |

### WCAG AAA Requirements (Stretch)
| Text Type | Minimum Ratio |
|-----------|---------------|
| Normal text | 7:1 |
| Large text | 4.5:1 |

## Brand Compliance Standards

### Scoring Methodology
| Category | Weight | Description |
|----------|--------|-------------|
| Logo Usage | 25% | Variant, clear space, size, modifications |
| Color Palette | 25% | Hex exact match, usage context |
| Typography | 20% | Family, weight, size, line-height |
| Spacing/Layout | 15% | Grid, margins, component gaps |
| Imagery/Tone | 15% | Style, treatment, messaging |

### Compliance Levels
| Score | Level | Action Required |
|-------|-------|-----------------|
| 95-100% | Compliant | Approved for delivery |
| 85-94% | Minor Violations | Fix before delivery |
| 70-84% | Significant | Revisions required |
| < 70% | Non-Compliant | Major rework |

## Visual Regression Standards

### Comparison Thresholds
| Threshold | Classification | Action |
|-----------|---------------|--------|
| 0% | Pixel-perfect | PASS |
| < 0.1% | Sub-pixel | PASS (tolerance) |
| 0.1% - 1% | Minor change | REVIEW |
| 1% - 5% | Significant | Likely regression |
| > 5% | Major | Definite regression |

### Baseline Management
- New baseline established on each approved release
- Baselines stored per environment (staging, production)
- Baseline approval requires visual-qa sign-off

## Report Delivery Standards

### Turnaround Times
| Test Type | SLA |
|-----------|-----|
| Visual Review | 1 business day |
| Cross-Browser Test | 1 business day |
| WCAG Audit | 2 business days |
| Full QA Pipeline | 3 business days |
| Performance Audit | 1 business day |

### Required Deliverables
Every test engagement produces:
1. **Summary report** - High-level findings with pass/fail
2. **Detailed report** - Per-item findings with evidence
3. **Evidence package** - Screenshots, diffs, recordings
4. **Remediation plan** - Prioritized fix list with effort estimates

---

*QA Accessibility Squad - Testing Standards v1.0*
