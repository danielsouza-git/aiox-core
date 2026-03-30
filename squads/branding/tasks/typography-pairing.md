# typography-pairing

```yaml
task: typographyPairing()
agent: token-engineer
squad: branding
prd_refs: [FR-1.5]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: moodboard
    type: image_collection
    required: false

outputs:
  - name: typography_system
    type: TypographySystem
    destination: .aiox/branding/{client}/tokens/typography.yaml
  - name: font_licenses
    type: markdown
    destination: .aiox/branding/{client}/tokens/font-licenses.md

tools:
  - ai-orchestrator
  - google-fonts-api
```

## Purpose

Define Typography System with Display/Heading, Body/Interface, and Mono/Code font families, complete type scale, and licensing documentation.

## Typography Structure

```yaml
TypographySystem:
  families:
    display:
      name: string
      weights: [400, 500, 600, 700]
      usage: "Headlines, hero text, marketing"
      fallback: "system-ui, sans-serif"

    body:
      name: string
      weights: [400, 500, 600]
      usage: "Body text, interface, forms"
      fallback: "system-ui, sans-serif"

    mono:
      name: string
      weights: [400, 500]
      usage: "Code, technical, data"
      fallback: "ui-monospace, monospace"

  scale:
    # 8-12 sizes with line-height and letter-spacing
    xs:   { size: 0.75rem,  line: 1rem,    letter: 0.025em }
    sm:   { size: 0.875rem, line: 1.25rem, letter: 0.015em }
    base: { size: 1rem,     line: 1.5rem,  letter: 0 }
    lg:   { size: 1.125rem, line: 1.75rem, letter: -0.01em }
    xl:   { size: 1.25rem,  line: 1.75rem, letter: -0.015em }
    2xl:  { size: 1.5rem,   line: 2rem,    letter: -0.02em }
    3xl:  { size: 1.875rem, line: 2.25rem, letter: -0.025em }
    4xl:  { size: 2.25rem,  line: 2.5rem,  letter: -0.03em }
    5xl:  { size: 3rem,     line: 1,       letter: -0.035em }
    6xl:  { size: 3.75rem,  line: 1,       letter: -0.04em }

  responsive:
    # CSS clamp values for fluid typography
    h1: "clamp(2.25rem, 5vw, 3.75rem)"
    h2: "clamp(1.875rem, 4vw, 3rem)"
    h3: "clamp(1.5rem, 3vw, 2.25rem)"
    h4: "clamp(1.25rem, 2.5vw, 1.875rem)"
    body: "clamp(1rem, 1.5vw, 1.125rem)"
```

## Pairing Criteria

```yaml
pairing_rules:
  contrast:
    description: "Display and body should have visual contrast"
    methods: [serif_sans, geometric_humanist, modern_classic]

  harmony:
    description: "Fonts should share similar x-height, proportions"
    check: [x_height_ratio, cap_height_ratio]

  readability:
    description: "Body font optimized for long-form reading"
    requirements: [open_counters, distinct_letterforms, good_hinting]

  brand_alignment:
    description: "Typography reflects brand personality"
    map:
      modern: [geometric, clean]
      classic: [serif, traditional]
      bold: [high_contrast, display]
      minimal: [grotesque, neutral]
```

## Generation Process

```yaml
steps:
  - step: analyze_brand_personality
    input: brand_profile
    output: typography_direction

  - step: suggest_pairings
    count: 3-5 options
    sources: [google_fonts, adobe_fonts]
    criteria: [pairing_rules, licensing]

  - step: validate_pairings
    checks:
      - x_height_compatibility
      - weight_availability
      - language_support
      - web_performance

  - step: define_scale
    method: modular_scale
    ratio: 1.25 (major_third) or 1.333 (perfect_fourth)

  - step: generate_responsive
    method: css_clamp
    min_viewport: 320px
    max_viewport: 1440px

  - step: document_licenses
    include: [license_type, attribution, usage_restrictions]
```

## Pre-Conditions

- [ ] Brand profile with style direction
- [ ] Target platforms defined (web, print, both)

## Post-Conditions

- [ ] 3 font families selected
- [ ] Complete type scale defined
- [ ] Responsive values calculated
- [ ] Licenses documented

## Acceptance Criteria

- [ ] Fonts available for web (WOFF2)
- [ ] License allows commercial use
- [ ] Pairing visually harmonious
- [ ] Scale readable at all sizes
- [ ] Client approved selection

## Quality Gate

- Threshold: >70%
- Font pairing has clear visual hierarchy (heading vs body)
- All font files available for required weights and styles
- Type scale follows consistent ratio with accessible minimum sizes

---
*Branding Squad Task - token-engineer*
