# color-palette-generate

```yaml
task: colorPaletteGenerate()
agent: token-engineer
squad: branding
prd_refs: [FR-1.4]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: moodboard
    type: image_collection
    required: false

outputs:
  - name: color_palette
    type: ColorPalette
    destination: .aiox/branding/{client}/tokens/colors.yaml
  - name: contrast_report
    type: markdown
    destination: .aiox/branding/{client}/tokens/contrast-report.md

tools:
  - ai-orchestrator
  - color-analyzer
```

## Purpose

Generate comprehensive color palette with WCAG AA/AAA compliance documentation.

## Palette Structure

```yaml
ColorPalette:
  primary:
    count: 2-3
    usage: main brand colors
    scales: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  secondary:
    count: 2-4
    usage: supporting colors
    scales: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  neutral:
    count: 1
    usage: text, backgrounds, borders
    scales: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  semantic:
    success:
      tones: [light, default, dark, contrast-text, subtle-bg]
    warning:
      tones: [light, default, dark, contrast-text, subtle-bg]
    error:
      tones: [light, default, dark, contrast-text, subtle-bg]
    info:
      tones: [light, default, dark, contrast-text, subtle-bg]

  dark_mode:
    description: inverted/adjusted palette for dark theme
    auto_generate: true
```

## Generation Process

```yaml
steps:
  - step: extract_from_moodboard
    if: moodboard_available
    method: dominant color extraction
    tools: [sharp, color-thief]

  - step: generate_base_palette
    input: [brand_profile.visual_direction, extracted_colors]
    output: base_colors (primary, secondary)

  - step: generate_scales
    method: HSL manipulation
    steps_per_color: 11 (50-950)
    preserve_brand_color_at: 500

  - step: generate_semantic
    method: derive from primary/secondary
    ensure: distinct from brand colors

  - step: validate_contrast
    standard: WCAG 2.1
    levels: [AA, AAA]
    pairs:
      - text on background
      - primary on white
      - primary on dark
      - semantic on surfaces

  - step: generate_dark_mode
    method: invert lightness, adjust saturation
    preserve: brand recognition
```

## Contrast Validation

```yaml
wcag_requirements:
  AA_normal_text: 4.5:1
  AA_large_text: 3:1
  AA_ui_components: 3:1
  AAA_normal_text: 7:1
  AAA_large_text: 4.5:1

contrast_report:
  - pair: [color1, color2]
    ratio: number
    AA_pass: boolean
    AAA_pass: boolean
    recommended_usage: string
```

## Output Format (W3C DTCG)

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

## Pre-Conditions

- [ ] Brand profile with color preferences
- [ ] Moodboard (optional but recommended)

## Post-Conditions

- [ ] Full palette generated (100+ color values)
- [ ] WCAG contrast validation complete
- [ ] Dark mode variants included

## Acceptance Criteria

- [ ] All text pairs meet WCAG AA minimum
- [ ] Primary colors recognizable in dark mode
- [ ] Semantic colors distinct and appropriate
- [ ] Client approved palette

## Quality Gate

- Threshold: >70%
- All text/background pairs meet WCAG AA minimum (4.5:1 ratio)
- Full palette generated with 100+ color values including dark mode
- Primary brand colors recognizable in both light and dark modes

---
*Branding Squad Task - token-engineer*
