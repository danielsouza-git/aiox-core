# landing-page-create

```yaml
task: landingPageCreate()
agent: web-builder
squad: branding
prd_refs: [FR-3.1, FR-3.2, FR-3.4, FR-3.5]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: tokens
    type: DesignTokens
    required: true
  - name: page_brief
    type: LandingPageBrief
    required: true

outputs:
  - name: landing_page
    type: directory
    destination: .aiox/branding/{client}/web/landing/{page_id}/
  - name: figma_wireframe
    type: figma_link
    destination: .aiox/branding/{client}/web/landing/{page_id}/wireframe.md

tools:
  - ai-orchestrator
  - static-site-builder
  - figma-api
```

## Purpose

Create conversion-focused landing page with copy (1500-3000 words) + design + static HTML build.

## Conversion Architecture (8 Sections)

```yaml
sections:
  1_hero:
    content:
      - pre_headline (optional)
      - h1_headline
      - sub_headline
      - primary_cta
      - social_proof_snippet
    design:
      - full_width
      - hero_image_or_video
      - above_the_fold

  2_problem:
    content:
      - problem_headline
      - pain_agitation (3-4 symptom bullets)
      - empathy_statement
    design:
      - visual_representation
      - emotional_imagery

  3_solution:
    content:
      - solution_headline
      - features_with_benefits (3-6)
      - how_it_helps
    design:
      - feature_cards_or_list
      - icons_per_feature

  4_how_it_works:
    content:
      - process_headline
      - steps (3-4)
      - simplicity_emphasis
    design:
      - numbered_steps
      - visual_flow

  5_social_proof:
    content:
      - testimonials (2-4)
      - metrics_and_numbers
      - logos_if_applicable
    design:
      - testimonial_cards
      - star_ratings
      - photo_avatars

  6_pricing:
    content:
      - pricing_tiers (if applicable)
      - value_comparison
      - guarantee
    design:
      - pricing_table
      - highlighted_recommended

  7_faq:
    content:
      - questions (5-8)
      - objection_addressing
    design:
      - accordion_style
      - searchable (optional)

  8_final_cta:
    content:
      - urgency_element
      - risk_removal
      - final_cta_button
    design:
      - contrasting_background
      - prominent_button
```

## Copy Requirements

```yaml
copy_specs:
  total_length: 1500-3000 words
  headline_formula: "Benefit + Specificity + Curiosity"
  cta_formula: "Action + Benefit (e.g., 'Get Your Free Guide')"

  frameworks:
    hero: AIDA (Attention, Interest, Desire, Action)
    problem: PAS (Problem, Agitation, Solution)
    features: FAB (Features, Advantages, Benefits)
    testimonials: STAR (Situation, Task, Action, Result)
```

## Design Specifications (NFR-3.2)

```yaml
design_specs:
  responsive:
    breakpoints:
      desktop: 1440px
      tablet: 768px
      mobile: 375px

  layout:
    max_content_width: 1200-1440px
    vertical_rhythm: 8px base grid
    line_length: 65-75 characters

  touch_targets:
    minimum: 44x44px on mobile

  performance:
    lcp_target: < 2.5s
    cls_target: < 0.1
    image_optimization: required
```

## Build Output

```yaml
output_structure:
  landing/
  ├── index.html
  ├── assets/
  │   ├── css/
  │   │   ├── tokens.css
  │   │   └── styles.css
  │   ├── js/
  │   │   └── main.js (minimal)
  │   ├── images/
  │   └── fonts/
  ├── thank-you.html (optional)
  └── 404.html
```

## Generation Process

```yaml
steps:
  - step: generate_copy
    provider: ai-orchestrator
    framework: conversion_architecture
    output: copy_document.md

  - step: create_wireframe
    fidelity: mid-fi
    tool: figma
    breakpoints: [desktop, mobile]

  - step: design_ui
    apply: brand_tokens
    create: high-fi mockups

  - step: build_html
    method: static
    inject: tokens_as_css_vars
    responsive: true

  - step: optimize
    images: compress + webp
    css: minify
    js: minimal

  - step: validate
    checks:
      - lighthouse_scores
      - wcag_compliance
      - mobile_responsive
      - forms_work
```

## Pre-Conditions

- [ ] Page brief with conversion goal
- [ ] Brand tokens available
- [ ] Content/offer defined

## Post-Conditions

- [ ] Static HTML site generated
- [ ] All breakpoints work
- [ ] Forms functional (if any)

## Acceptance Criteria

- [ ] Copy follows conversion architecture
- [ ] Mobile-first responsive
- [ ] Lighthouse performance > 90
- [ ] WCAG AA compliant

## Quality Gate

- Threshold: >70%
- All 8 conversion architecture sections implemented
- Lighthouse performance score >90
- Mobile-first responsive at all breakpoints (320-1920px)

---
*Branding Squad Task - web-builder*
