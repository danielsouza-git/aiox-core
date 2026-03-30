# thumbnails-create

```yaml
task: thumbnailsCreate()
agent: creative-producer
squad: branding
prd_refs: [FR-2.4]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: thumbnail_brief
    type: ThumbnailBrief
    required: true

outputs:
  - name: thumbnail_package
    type: ThumbnailPackage
    destination: .aiox/branding/{client}/social/thumbnails/{thumbnail_id}/

tools:
  - ai-orchestrator
  - satori
  - sharp
```

## Purpose

Create YouTube thumbnail templates (1280x720px 16:9, max 2MB) optimized for click-through rate.

## Thumbnail Types

```yaml
thumbnail_types:
  standard:
    description: "Bold text over compelling image"
    elements: [background_image, headline, logo]
    text_words: 5-7 max

  face_focused:
    description: "Human face for emotional connection"
    elements: [face_image, expression, text_overlay]
    face_area: 30-40% of frame
    emotion: strong (surprise, excitement, curiosity)

  bold_text:
    description: "Text-dominant, minimal image"
    elements: [solid_background, large_text, accent_graphic]
    text_words: 3-5

  comparison:
    description: "Before/after or A vs B"
    elements: [split_image, labels, vs_indicator]
    contrast: high

  branded_series:
    description: "Consistent series look"
    elements: [series_template, episode_number, title]
    recognizability: high
```

## YouTube Overlay Safe Zones

```yaml
safe_zones:
  total_size: 1280x720px

  danger_zones:
    bottom_right:
      area: 150x40px
      reason: "Video duration overlay"
    bottom_left:
      area: varies
      reason: "Watch later button on hover"

  text_safe_area:
    recommended: top_two_thirds
    avoid: bottom_right_corner

  mobile_consideration:
    thumbnail_display: smaller
    text_minimum: 24px equivalent
```

## Design Principles

```yaml
design_principles:
  contrast:
    - text_vs_background: high
    - use_outlines_or_shadows: recommended
    - avoid_busy_backgrounds: under_text

  readability:
    - font_size: large (readable at 100px width)
    - font_weight: bold
    - max_words: 5-7
    - avoid: thin fonts, low contrast

  emotional_triggers:
    - faces: expression visible
    - curiosity_gap: hint at content
    - urgency: if relevant
    - numbers: specific, odd preferred

  branding:
    - logo_placement: corner (subtle)
    - color_palette: brand colors
    - consistency: series recognition

  technical:
    - resolution: 1280x720 minimum
    - file_size: under 2MB
    - format: PNG or JPG
    - no_misleading_content: YouTube policy
```

## Template Variants

```yaml
templates:
  standard_bold:
    background: full_bleed_image
    text:
      position: left_or_center
      style: bold_with_shadow
      color: white_or_brand
    logo:
      position: bottom_right
      size: small
      opacity: 80%

  face_forward:
    face:
      position: right_third
      size: 30-40% of frame
      cutout: yes (no background)
    text:
      position: left_side
      style: bold
    reaction_elements: optional (arrows, emojis)

  split_comparison:
    layout: 50/50 split
    divider: bold line or VS
    labels: clear on each side
    text: minimal, let images speak

  series_template:
    brand_bar: top or side
    episode_indicator: number or title
    consistent_layout: across series
    thumbnail_thumbnail: recognizable
```

## Generation Process

```yaml
steps:
  - step: analyze_brief
    extract: [video_topic, target_emotion, thumbnail_type]

  - step: generate_headline
    constraints:
      - max_7_words
      - curiosity_inducing
      - not_clickbait

  - step: generate_background
    options:
      - ai_generated_image
      - provided_screenshot
      - face_photo

  - step: apply_template
    inject: [headline, image, logo]
    ensure: safe_zones_respected

  - step: render_thumbnail
    tool: satori
    size: 1280x720

  - step: optimize
    tool: sharp
    target: under_2MB
    quality: maximum_within_limit

  - step: create_variants
    count: 2-3
    differences: [text_position, color_accent, image_crop]
```

## Pre-Conditions

- [ ] Video topic/title provided
- [ ] Brand assets available
- [ ] Face photo (if face-focused)

## Post-Conditions

- [ ] Thumbnail rendered
- [ ] Under 2MB
- [ ] Variants created

## Acceptance Criteria

- [ ] Readable at small sizes
- [ ] Emotionally compelling
- [ ] Brand consistent
- [ ] YouTube policy compliant

## Quality Gate

- Threshold: >70%
- Thumbnails at correct YouTube dimensions (1280x720)
- Text readable at small preview sizes
- Brand consistency maintained across thumbnail set

---
*Branding Squad Task - creative-producer*
