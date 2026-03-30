# brand-book-generate

```yaml
task: brandBookGenerate()
agent: brand-book-builder
squad: branding
prd_refs: [FR-1.7]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: tokens
    type: DesignTokens
    required: true
  - name: voice_guide
    type: VoiceGuide
    required: true
  - name: visual_assets
    type: AssetCollection
    required: true

outputs:
  - name: brand_book_source
    type: directory
    destination: .aiox/branding/{client}/brand-book/
  - name: brand_book_dist
    type: directory
    destination: .aiox/branding/{client}/brand-book/dist/

tools:
  - static-site-generator
  - fuse-js
  - sharp
```

## Purpose

Generate Brand Book as static website (HTML + CSS + JS) with client-side search and responsive design.

## Site Structure

```
brand-book/
├── index.html                  # Home/Overview
├── guidelines/
│   ├── index.html             # Guidelines overview
│   ├── brand-voice.html       # Voice guide
│   └── usage-rules.html       # Do's and Don'ts
├── foundations/
│   ├── index.html             # Foundations overview
│   ├── colors.html            # Color palette
│   ├── typography.html        # Type system
│   └── spacing.html           # Spacing/grid
├── logo/
│   ├── index.html             # Logo system
│   ├── primary.html           # Primary versions
│   ├── secondary.html         # Secondary versions
│   └── clear-space.html       # Usage rules
├── icons/
│   └── index.html             # Icon library
├── components/
│   ├── index.html             # Component overview
│   ├── buttons.html           # Auto-generated from tokens
│   ├── inputs.html
│   └── ...
├── motion/
│   └── index.html             # Motion guidelines
├── templates/
│   └── index.html             # Template gallery
├── moodboard/
│   └── index.html             # Visual inspiration
├── strategy/
│   ├── index.html             # Brand strategy
│   ├── manifesto.html         # Manifesto
│   └── positioning.html       # Positioning
├── assets/
│   ├── css/
│   │   ├── tokens.css         # Design tokens
│   │   └── styles.css         # Site styles
│   ├── js/
│   │   ├── search.js          # Fuse.js search
│   │   └── main.js            # Interactions
│   ├── fonts/                 # Embedded fonts
│   └── images/                # All images
├── search-index.json          # Fuse.js index
└── 404.html
```

## Generation Process

```yaml
steps:
  - step: prepare_content
    collect:
      - brand_profile → strategy pages
      - voice_guide → guidelines pages
      - tokens → foundations + components
      - visual_assets → logo, icons, moodboard

  - step: generate_pages
    template_engine: nunjucks or handlebars
    per_section: true
    inject_tokens: true

  - step: generate_components
    source: design_tokens
    auto_generate:
      - button variants (from button tokens)
      - color swatches (from color tokens)
      - type scale samples (from typography tokens)

  - step: build_search_index
    tool: fuse.js
    index_fields: [title, content, tags]
    output: search-index.json

  - step: embed_assets
    fonts: convert to base64 or copy WOFF2
    images: optimize with sharp
    css: inline critical, link rest
    js: bundle and minify

  - step: ensure_portability
    checks:
      - all_paths_relative
      - no_external_dependencies
      - works_via_file_protocol

  - step: validate_output
    checks:
      - all_links_work
      - images_load
      - search_functional
      - responsive_breakpoints
```

## Portability Requirements (NFR-9.1, NFR-9.2)

```yaml
portability:
  paths: relative only (./assets/, ../index.html)
  dependencies: none (no CDN, no external fonts)
  fonts: embedded WOFF2 in assets/fonts/
  images: local in assets/images/
  js: bundled, no external imports
  works_on: file:// protocol (double-click index.html)
```

## Responsive Design

```yaml
breakpoints:
  mobile: 320px - 767px
  tablet: 768px - 1023px
  desktop: 1024px+

touch_targets: min 44x44px on mobile
```

## Client-Side Search

```javascript
// search.js using Fuse.js
const fuse = new Fuse(searchIndex, {
  keys: ['title', 'content', 'tags'],
  threshold: 0.3,
  includeMatches: true
});

function search(query) {
  return fuse.search(query).slice(0, 10);
}
```

## Pre-Conditions

- [ ] All brand assets complete
- [ ] Design tokens built
- [ ] Voice guide approved

## Post-Conditions

- [ ] Static site generated
- [ ] Search index created
- [ ] All assets embedded

## Acceptance Criteria

- [ ] Opens via index.html (no server)
- [ ] All navigation works
- [ ] Search returns results
- [ ] Responsive on all breakpoints
- [ ] Brand tokens applied correctly

## Quality Gate

- Threshold: >70%
- Brand book contains all required sections (Guidelines through Templates)
- Static HTML site navigable and searchable (Fuse.js functional)
- All brand tokens correctly referenced in documentation

---
*Branding Squad Task - brand-book-builder*
