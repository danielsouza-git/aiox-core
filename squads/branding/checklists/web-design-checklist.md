# Web Design Checklist

**Reference:** NFR-7.1
**Items:** 8
**Used by:** qa-reviewer

## Checklist

- [ ] **Responsive Breakpoints** - Layout works at all breakpoints (375px, 768px, 1024px, 1440px)
- [ ] **WCAG AA Contrast** - All text meets 4.5:1 contrast ratio (3:1 for large text)
- [ ] **Interactive States** - All interactive elements have hover, focus, active states
- [ ] **Loading Performance** - Core Web Vitals targets met (LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] **SEO Metadata** - Meta title (<60 chars), description (<155 chars), proper H1-H6 hierarchy
- [ ] **Link Functionality** - All links work, no 404s, external links open in new tab
- [ ] **Form Validation** - Forms have proper validation, error messages, success states
- [ ] **Cross-Browser** - Works in Chrome, Firefox, Safari, Edge (latest versions)

## Responsive Breakpoints

| Breakpoint | Width | Columns |
|------------|-------|---------|
| xs (mobile) | <640px | 4 |
| sm | 640px | 4 |
| md | 768px | 8 |
| lg | 1024px | 12 |
| xl | 1280px | 12 |
| 2xl | 1536px | 12 |

## Core Web Vitals Targets

| Metric | Target | Measure |
|--------|--------|---------|
| **LCP** | <2.5s | Largest Contentful Paint |
| **FID** | <100ms | First Input Delay |
| **CLS** | <0.1 | Cumulative Layout Shift |

## WCAG AA Requirements

- **Normal text:** 4.5:1 contrast ratio
- **Large text (18px+ or 14px+ bold):** 3:1 contrast ratio
- **UI components:** 3:1 contrast ratio
- **Focus indicators:** Visible and distinct

## Verdict Criteria

| Verdict | Criteria |
|---------|----------|
| **PASS** | All 8 items checked |
| **CONCERNS** | 6-7 items checked, minor issues |
| **FAIL** | <6 items checked or accessibility failures |

---
*Branding Squad Checklist*
