# Branding Squad - Coding Standards

## Overview

This document defines coding standards for all technical deliverables produced by the Branding Squad, including static sites, design tokens, scripts, and automation tools.

## General Principles

1. **Portability First** — All deliverables must work without server dependencies
2. **Brand Token Integration** — Use design tokens for all styling decisions
3. **Accessibility by Default** — WCAG AA compliance is non-negotiable
4. **Performance Optimized** — Lighthouse scores > 90 for all metrics

---

## HTML Standards

### Structure
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title | Brand Name</title>
  <!-- Critical CSS inline -->
  <style>/* critical styles */</style>
  <!-- Non-critical CSS async -->
  <link rel="preload" href="./assets/css/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
</head>
<body>
  <!-- Content -->
  <script src="./assets/js/main.js" defer></script>
</body>
</html>
```

### Conventions
- Use semantic HTML5 elements (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`)
- One `<h1>` per page, logical heading hierarchy
- All images require `alt` attributes
- Use `loading="lazy"` for below-fold images
- Relative paths only (`./assets/`, `../images/`)

### Forbidden
- Inline JavaScript (except critical analytics)
- External CDN dependencies
- Absolute paths (`/assets/`, `https://...`)
- `<div>` soup without semantic meaning

---

## CSS Standards

### Token Integration
```css
:root {
  /* Import from design tokens */
  --color-primary-500: #2563eb;
  --color-text-primary: var(--color-neutral-900);
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --spacing-4: 1rem;
}

/* Use tokens, never hardcode values */
.button {
  background: var(--color-primary-500);
  font-family: var(--font-family-sans);
  padding: var(--spacing-4);
}
```

### Architecture
- **Methodology:** BEM (Block Element Modifier) or utility-first
- **Organization:**
  ```
  assets/css/
  ├── tokens.css      # Design tokens (auto-generated)
  ├── base.css        # Reset, typography, base styles
  ├── components.css  # Component styles
  └── utilities.css   # Utility classes
  ```

### Conventions
- Mobile-first media queries
- Use CSS custom properties for theming
- Prefer `rem` over `px` for scalability
- Use CSS Grid for layouts, Flexbox for components
- Logical properties when possible (`margin-inline`, `padding-block`)

### Performance
- Critical CSS inlined in `<head>`
- Non-critical CSS loaded async
- Minify for production
- Remove unused styles

### Forbidden
- `!important` (except for utility overrides)
- Deep nesting (> 3 levels)
- Hardcoded colors, fonts, or spacing
- Float-based layouts

---

## JavaScript Standards

### General
- ES6+ syntax
- No jQuery or heavy libraries for simple interactions
- Progressive enhancement — core functionality works without JS

### Structure
```javascript
// Module pattern
const BrandBook = {
  init() {
    this.bindEvents();
    this.initSearch();
  },

  bindEvents() {
    // Event delegation
    document.addEventListener('click', (e) => {
      if (e.target.matches('.nav-toggle')) {
        this.toggleNav();
      }
    });
  },

  toggleNav() {
    document.body.classList.toggle('nav-open');
  },

  initSearch() {
    // Fuse.js integration
  }
};

document.addEventListener('DOMContentLoaded', () => BrandBook.init());
```

### Conventions
- Use `const` by default, `let` when reassignment needed
- Arrow functions for callbacks
- Template literals for string interpolation
- Async/await over promise chains
- Event delegation over individual listeners

### Performance
- `defer` attribute on scripts
- Lazy-load non-critical functionality
- Debounce scroll/resize handlers
- Minify for production

### Forbidden
- `var` keyword
- `document.write()`
- Blocking `<script>` tags in `<head>`
- Inline event handlers (`onclick="..."`)
- External dependencies via CDN

---

## Design Token Standards

### Format (W3C DTCG)
```json
{
  "color": {
    "primary": {
      "500": {
        "$value": "#2563eb",
        "$type": "color",
        "$description": "Primary brand color"
      }
    }
  }
}
```

### Architecture
```
tokens/
├── primitives/
│   ├── colors.json
│   ├── typography.json
│   └── spacing.json
├── semantic/
│   ├── colors.json
│   └── typography.json
├── components/
│   └── button.json
└── tokens.json (merged)
```

### Naming Convention
- `kebab-case` for token names
- Three tiers: `primitive` → `semantic` → `component`
- Semantic tokens reference primitives: `{color.blue.500}`

### Required Exports
- CSS Custom Properties
- SCSS Variables
- JSON (flat and nested)
- Tailwind Config
- Figma Variables (Tokens Studio format)

---

## Image Standards

### Formats
| Use Case | Format | Notes |
|----------|--------|-------|
| Photos | WebP (JPEG fallback) | Quality 80-85 |
| Graphics/logos | SVG | Always vector |
| Icons | SVG sprite or inline | 24x24 base |
| Thumbnails | WebP | Max 100KB |

### Optimization
- Compress all images (TinyPNG, Sharp)
- Responsive images with `srcset`
- Lazy loading for below-fold
- Max dimensions: 2x display size

### Naming Convention
```
{type}-{name}-{variant}-{size}.{ext}
logo-primary-horizontal-2x.svg
hero-home-desktop.webp
icon-arrow-right.svg
```

---

## File Organization

### Static Site Structure
```
project/
├── index.html
├── [pages]/
│   └── index.html
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   ├── fonts/
│   │   └── *.woff2
│   └── images/
│       ├── logos/
│       ├── icons/
│       └── photos/
├── sitemap.xml
├── robots.txt
└── favicon.ico
```

### Naming Conventions
- Files: `kebab-case.ext`
- Folders: `kebab-case/`
- No spaces, no special characters
- Lowercase only

---

## Accessibility Requirements

### Mandatory
- [ ] Color contrast >= 4.5:1 (text), >= 3:1 (UI)
- [ ] All images have `alt` text
- [ ] Keyboard navigable (tab order, focus visible)
- [ ] Skip link to main content
- [ ] Form labels associated with inputs
- [ ] ARIA landmarks where appropriate
- [ ] No autoplay media with sound

### Testing
- Automated: axe-core, Lighthouse
- Manual: keyboard navigation, screen reader
- Contrast: WebAIM Contrast Checker

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 95 |
| Lighthouse Best Practices | > 90 |
| Lighthouse SEO | > 95 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Time to Interactive | < 3s |

---

## Version Control

### Commit Messages
```
type(scope): description

feat(tokens): add dark mode color variants
fix(landing): correct mobile nav z-index
docs(readme): update deployment instructions
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Tests
- `chore`: Maintenance

---

## Quality Checklist

Before delivery, all code must pass:

- [ ] HTML validation (W3C)
- [ ] CSS validation (no errors)
- [ ] JavaScript lint (ESLint)
- [ ] Accessibility audit (axe-core)
- [ ] Lighthouse scores meet targets
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Mobile responsive (320px - 1920px)
- [ ] All links functional
- [ ] No console errors

---

*Branding Squad Coding Standards v1.0*
*Last updated: 2026-03-10*
