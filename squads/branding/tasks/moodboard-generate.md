# moodboard-generate

```yaml
task: moodboardGenerate()
agent: brand-strategist
squad: branding
prd_refs: [FR-1.1]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: visual_preferences
    type: object
    required: true

outputs:
  - name: moodboard
    type: image_collection
    destination: .aiox/branding/{client}/moodboard/
  - name: moodboard_rationale
    type: markdown
    destination: .aiox/branding/{client}/moodboard-rationale.md

tools:
  - ai-orchestrator
  - image-generate
```

## Purpose

Generate visual moodboard (8-12 AI-generated reference images) to establish visual direction before design phase.

## Moodboard Categories

```yaml
categories:
  - color_mood:
      count: 2-3
      focus: color palette atmosphere

  - typography_mood:
      count: 2
      focus: type style direction

  - photography_style:
      count: 2-3
      focus: image treatment, subjects

  - texture_pattern:
      count: 1-2
      focus: supporting visual elements

  - overall_aesthetic:
      count: 2-3
      focus: brand world feeling
```

## Generation Process

```yaml
steps:
  - step: analyze_visual_direction
    input: [brand_profile, visual_preferences]
    output: prompt_direction

  - step: generate_prompts
    per_category: 3-4 prompt variations
    style_modifiers: [brand_personality, industry, target_audience]

  - step: generate_images
    provider: flux-1.1-pro
    fallback: dall-e-3
    count_per_prompt: 2
    select_best: 1

  - step: curate_collection
    total: 8-12 images
    human_review: required

  - step: document_rationale
    per_image: why selected, what it represents
```

## Prompt Engineering

```yaml
prompt_structure:
  base: "[style] [subject] [mood] [color_direction]"
  modifiers:
    - "professional brand photography"
    - "high-end advertising style"
    - "minimal composition"
  negative_prompts:
    - "text, logos, watermarks"
    - "low quality, blurry"
    - "generic stock photo feel"
```

## Output Structure

```
moodboard/
├── 01-color-mood-warm.png
├── 02-color-mood-accent.png
├── 03-typography-bold.png
├── 04-typography-elegant.png
├── 05-photography-lifestyle.png
├── 06-photography-product.png
├── 07-texture-organic.png
├── 08-aesthetic-overall.png
├── 09-aesthetic-detail.png
└── moodboard-composite.png  # All images in grid
```

## Rationale Document

```yaml
rationale:
  visual_direction_summary: paragraph
  images:
    - filename: string
      category: string
      represents: string
      brand_connection: string
  recommended_next_steps:
    - color_palette_extraction
    - typography_pairing
    - photography_guidelines
```

## Pre-Conditions

- [ ] Brand profile with visual preferences
- [ ] AI image generation credits available
- [ ] Style direction confirmed

## Post-Conditions

- [ ] 8-12 images generated
- [ ] Rationale documented
- [ ] Client review ready

## Acceptance Criteria

- [ ] Images align with brand personality
- [ ] No AI artifacts (hands, text issues)
- [ ] Cohesive visual story
- [ ] Client approved direction

## Quality Gate

- Threshold: >70%
- Moodboard contains 8-12 curated images
- Visual direction aligned with brand personality and preferences
- Confidence levels documented for all AI-inferred selections

---
*Branding Squad Task - brand-strategist*
