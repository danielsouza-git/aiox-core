# institutional-site

```yaml
task: institutionalSite()
agent: web-builder
squad: branding
prd_refs: [FR-3.3, FR-3.5]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: tokens
    type: DesignTokens
    required: true
  - name: site_brief
    type: InstitutionalSiteBrief
    required: true

outputs:
  - name: institutional_site
    type: directory
    destination: .aiox/branding/{client}/web/institutional/
  - name: site_map
    type: xml
    destination: .aiox/branding/{client}/web/institutional/sitemap.xml

tools:
  - ai-orchestrator
  - static-site-builder
  - figma-api
```

## Purpose

Create institutional website (5-10 pages) as static HTML or optional CMS-enabled site.

## Page Types

```yaml
pages:
  home:
    sections:
      - hero (tagline, cta)
      - features/services overview
      - about snippet
      - testimonials
      - cta
      - footer
    priority: high

  about:
    sections:
      - company story
      - team (photos, bios)
      - values/mission
      - timeline (optional)
      - numbers/achievements
    priority: high

  services_products:
    sections:
      - service grid/cards
      - detail sections
      - process explanation
      - pricing (optional)
      - cta
    priority: high

  portfolio_cases:
    sections:
      - gallery/grid
      - filters (optional)
      - detail template
      - results/metrics
    priority: medium

  blog_listing:
    sections:
      - post grid/list
      - categories
      - search (client-side)
      - pagination
    priority: medium
    cms_recommended: true

  blog_post:
    sections:
      - content area
      - author info
      - related posts
      - share buttons
    priority: medium
    cms_recommended: true

  contact:
    sections:
      - contact form
      - map (optional)
      - info (address, phone, email)
      - social links
    priority: high

  pricing:
    sections:
      - pricing table
      - comparison
      - faq
      - cta
    priority: optional

  legal:
    pages: [terms, privacy, cookies]
    format: long-form with TOC
    priority: required

  404:
    sections:
      - illustration
      - message
      - search
      - helpful links
    priority: required
```

## Site Architecture

```yaml
architecture:
  static_default:
    structure: |
      institutional/
      ├── index.html
      ├── about/index.html
      ├── services/index.html
      ├── portfolio/index.html
      ├── contact/index.html
      ├── blog/index.html
      ├── terms/index.html
      ├── privacy/index.html
      ├── 404.html
      ├── sitemap.xml
      ├── robots.txt
      └── assets/
          ├── css/
          ├── js/
          ├── images/
          └── fonts/

  cms_optional:
    when: "client needs frequent content updates"
    technology: Payload CMS 3.x
    pages_via_cms:
      - blog posts
      - portfolio items
      - team members
    static_pages:
      - home, about, services, contact
```

## Design System Integration

```yaml
design_system:
  tokens:
    inject_as: css_custom_properties
    dark_mode: optional (data-theme)

  components:
    shared:
      - header/navigation
      - footer
      - buttons
      - cards
      - forms
    page_specific:
      - hero variants
      - testimonial cards
      - team cards
      - portfolio grid
```

## Generation Process

```yaml
steps:
  - step: plan_information_architecture
    create: sitemap + page hierarchy
    output: ia_document.md

  - step: generate_copy
    per_page: section content
    total: 3000-6000 words
    seo_optimized: true

  - step: design_pages
    create: figma wireframes + UI
    breakpoints: [1440, 768, 375]

  - step: build_static
    method: html + css + js
    templating: shared components
    inject: brand tokens

  - step: setup_cms
    if: cms_required
    install: payload cms
    configure: collections

  - step: generate_seo
    create:
      - meta tags per page
      - sitemap.xml
      - robots.txt
      - schema.org markup

  - step: optimize
    images: webp + lazy loading
    css: critical inline + async
    js: minimal, deferred

  - step: validate
    lighthouse: all pages
    wcag: automated check
    links: no broken links
```

## Pre-Conditions

- [ ] Site brief with page list
- [ ] Brand tokens available
- [ ] Content/copy inputs

## Post-Conditions

- [ ] All pages generated
- [ ] SEO files created
- [ ] Responsive design verified

## Acceptance Criteria

- [ ] All required pages complete
- [ ] Navigation works
- [ ] Forms functional
- [ ] SEO basics in place
- [ ] WCAG AA compliant

## Quality Gate

- Threshold: >70%
- All required pages created (Home, About, Services, Contact minimum)
- WCAG AA compliance verified
- SEO metadata present on all pages

---
*Branding Squad Task - web-builder*
