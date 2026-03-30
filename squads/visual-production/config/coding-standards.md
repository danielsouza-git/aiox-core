# Visual Production Squad - Coding Standards

Standards for visual asset files, SVG code, CSS animations, and naming conventions.

## File Naming

### Visual Assets
```
{project}-{category}-{descriptor}-{variant}-{size}.{ext}
```

Examples:
- `acme-hero-homepage-dark-1920x1080.webp`
- `acme-social-instagram-post-01-1080x1080.png`
- `acme-icon-search-default-24x24.svg`
- `acme-motion-loader-primary.json`

### Responsive Variants
```
{project}-{category}-{descriptor}-{breakpoint}w.{ext}
```

Examples:
- `acme-hero-homepage-320w.webp`
- `acme-hero-homepage-640w.webp`
- `acme-hero-homepage-1920w.webp`

### Source Files
```
{project}-{category}-{descriptor}-source.{ext}
```

Examples:
- `acme-hero-homepage-source.psd`
- `acme-logo-full-source.ai`

## SVG Standards

### Structure
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <title>Icon description for accessibility</title>
  <path d="..." stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
```

### Rules
- Always include `viewBox` attribute
- Use `currentColor` for icons (inherits from CSS)
- Remove editor metadata (Illustrator, Inkscape comments)
- Remove `id` attributes unless needed for CSS targeting
- Optimize with SVGO (remove unnecessary attributes)
- Use `<title>` for accessibility
- Prefer `stroke` over `fill` for icon lines
- Use `stroke-linecap="round"` and `stroke-linejoin="round"` consistently

### SVGO Configuration
```yaml
plugins:
  - removeDoctype
  - removeXMLProcInst
  - removeComments
  - removeMetadata
  - removeTitle: false  # Keep for accessibility
  - removeDesc: false
  - removeUselessDefs
  - removeEditorsNSData
  - removeEmptyAttrs
  - removeHiddenElems
  - removeEmptyContainers
  - convertStyleToAttrs
  - convertColors
  - convertPathData
  - convertTransform
  - removeUnknownsAndDefaults
  - removeNonInheritableGroupAttrs
  - removeUselessStrokeAndFill
  - cleanupNumericValues:
      floatPrecision: 2
```

## CSS Animation Conventions

### Naming
```css
/* Keyframes: kebab-case with descriptive name */
@keyframes fade-in-up { ... }
@keyframes slide-from-right { ... }
@keyframes pulse-scale { ... }

/* Animation classes: BEM-like */
.animation--fade-in { ... }
.animation--slide-up { ... }
```

### Animation Token Variables
```css
:root {
  /* Durations */
  --motion-duration-instant: 100ms;
  --motion-duration-fast: 150ms;
  --motion-duration-normal: 300ms;
  --motion-duration-slow: 500ms;
  --motion-duration-slower: 800ms;

  /* Easing */
  --motion-ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
  --motion-ease-in: cubic-bezier(0.4, 0.0, 1, 1);
  --motion-ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  --motion-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* Delays */
  --motion-stagger: 50ms;
}
```

### Reduced Motion
```css
/* Always provide reduced-motion alternative */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Performance Rules
- Only animate `transform` and `opacity` (composite-only properties)
- Use `will-change` sparingly and remove after animation
- Avoid animating `width`, `height`, `top`, `left`, `margin`, `padding`
- Prefer CSS transitions for simple state changes
- Use `requestAnimationFrame` for JS-driven animations

## Lottie File Standards

### JSON Structure
- Max file size: 150KB
- Max layers: 30
- Frame rate: 30fps (web), 60fps (mobile)
- No embedded raster images
- No expressions
- Descriptive layer names

### Naming
```
{project}-{type}-{descriptor}.json
```

Examples:
- `acme-loader-spinner.json`
- `acme-icon-heart-animate.json`
- `acme-transition-page-slide.json`

## Image Export Quality Settings

| Format | Quality | Use Case |
|--------|---------|----------|
| WebP | 85% | Web primary |
| AVIF | 80% | Web next-gen |
| JPG | 90% | Fallback, email |
| PNG | N/A (lossless) | Social, transparency |
| TIFF | 100% (lossless) | Print |

## Version Control

### Versioning System
- `v1` - Initial version
- `v1.1` - Minor revision
- `v2` - Major revision (new direction)

### Status Labels
- `draft` - Work in progress
- `review` - Ready for review
- `approved` - Stakeholder approved
- `final` - Ready for production

## Delivery Format

### For Web/App
- WebP + AVIF + JPG fallback
- Responsive sizes (320w to 1920w)
- srcset HTML snippets included
- Lottie JSON for animations

### For Social Media
- PNG at platform-specific sizes
- No transparency unless required
- Include safe zone guides

### For Print
- TIFF, CMYK color space
- 300 DPI minimum
- Bleed area included (3mm)

---

*Visual Production Squad - Coding Standards v1.0*
