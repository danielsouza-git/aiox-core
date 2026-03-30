# carousel-create

```yaml
task: carouselCreate()
agent: creative-producer
squad: branding
prd_refs: [FR-2.2, FR-2.10]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: carousel_brief
    type: CarouselBrief
    required: true

outputs:
  - name: carousel_package
    type: CarouselPackage
    destination: .aiox/branding/{client}/social/carousels/{carousel_id}/

tools:
  - ai-orchestrator
  - satori
  - sharp
```

## Purpose

Create Instagram/LinkedIn carousel (1080x1350px, 2-10 slides) with content continuity.

## Carousel Structure

```yaml
slides:
  cover:
    purpose: "Hook - grab attention"
    elements: [hook_headline, visual_intrigue, swipe_indicator]
    copy_length: 5-10 words

  content_slides:
    count: 3-8
    purpose: "Deliver value"
    types:
      - numbered_point
      - comparison
      - process_step
      - statistic
      - quote
    continuity: [arrows, slide_numbers, progress_dots]

  summary:
    purpose: "Recap key points"
    elements: [bullet_summary, key_takeaway]

  cta:
    purpose: "Call to action + branding"
    elements: [cta_text, profile_tag, logo, follow_prompt]
```

## Slide Templates

```yaml
templates:
  cover_hook:
    layout: centered
    elements:
      - background_image
      - hook_text (large)
      - swipe_arrow
      - logo (corner)

  numbered_point:
    layout: left_aligned
    elements:
      - number (large, brand color)
      - point_headline
      - supporting_text
      - visual_element
      - progress_indicator

  comparison:
    layout: split
    elements:
      - before_side
      - after_side
      - divider
      - labels

  statistic:
    layout: centered
    elements:
      - big_number
      - context_text
      - source_citation

  cta_slide:
    layout: centered
    elements:
      - cta_headline
      - action_buttons
      - profile_handle
      - logo
```

## Caption Generation (HCEA)

```yaml
caption:
  framework: HCEA
  structure:
    hook: "Attention-grabbing first line"
    context: "Why this matters to you"
    entrega: "Summary of carousel value (bullets)"
    action: "Save, share, comment CTAs"

  length: 200-400 words
  hashtags: 8-12
  mentions: optional
```

## Continuity Elements

```yaml
continuity:
  visual:
    - consistent_color_scheme
    - repeated_design_elements
    - same_typography
    - brand_watermark

  navigational:
    arrows:
      position: right_edge
      style: brand_colored
    slide_numbers:
      format: "1/10"
      position: top_right
    progress_dots:
      position: bottom_center
      style: filled_current, outline_others
```

## Generation Process

```yaml
steps:
  - step: analyze_brief
    extract: [topic, key_points, target_audience, cta_goal]

  - step: generate_outline
    create: slide_by_slide_structure
    assign: template_per_slide

  - step: generate_copy
    provider: ai-orchestrator
    per_slide: [headline, body, supporting]

  - step: generate_visuals
    provider: ai-orchestrator
    elements: [backgrounds, icons, illustrations]

  - step: render_slides
    tool: satori
    size: 1080x1350px
    apply: brand_tokens

  - step: export
    formats:
      - individual_pngs
      - combined_preview
      - metadata_json

  - step: generate_caption
    framework: HCEA
    include: content_summary
```

## Pre-Conditions

- [ ] Carousel brief provided
- [ ] Brand tokens available
- [ ] 3-10 points of content

## Post-Conditions

- [ ] All slides generated
- [ ] Caption created
- [ ] Exports complete

## Acceptance Criteria

- [ ] Visual continuity across slides
- [ ] Swipe logic clear
- [ ] Caption complements slides
- [ ] Ready for posting

## Quality Gate

- Threshold: >70%
- Carousel contains 2-10 slides with consistent visual style
- Text within safe zones on all slides
- Caption complements slides with appropriate CTA

---
*Branding Squad Task - creative-producer*
