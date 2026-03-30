# image-generate

```yaml
task: imageGenerate()
agent: ai-orchestrator
squad: branding
prd_refs: [FR-2.7, CON-15]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: image_brief
    type: ImageBrief
    required: true
  - name: moodboard
    type: image_collection
    required: false

outputs:
  - name: generated_images
    type: image_collection
    destination: .aiox/branding/{client}/images/{batch_id}/
  - name: generation_log
    type: json
    destination: .aiox/branding/{client}/logs/image-generation.json

tools:
  - flux-1.1-pro
  - dall-e-3
  - sharp
```

## Purpose

Generate brand-aligned images using AI for social media, marketing materials, and web assets.

## Critical Constraint (CON-15)

```yaml
prohibited:
  - logo_generation
  - brand_mark_creation
  - trademark_elements

reason: |
  Logos and brand marks must be human-created due to:
  - Legal/copyright issues with AI-generated trademarks
  - Trademark registrability requirements
  - Brand identity uniqueness

allowed_ai_assist:
  - concept_exploration
  - moodboard_references
  - style_direction
```

## Image Types

```yaml
image_types:
  hero_image:
    size: 1920x1080
    usage: landing pages, headers

  social_background:
    sizes:
      instagram_feed: 1080x1080
      instagram_story: 1080x1920
      linkedin: 1200x627
    usage: post backgrounds

  product_mockup:
    size: varies
    usage: showcase products

  illustration:
    size: varies
    style: brand-aligned

  texture_pattern:
    size: 512x512 (tileable)
    usage: backgrounds, overlays
```

## Generation Process

```yaml
steps:
  - step: analyze_brief
    extract:
      - subject
      - style_direction
      - color_requirements
      - mood

  - step: build_prompt
    structure: "[style] [subject] [mood] [color_direction]"
    modifiers:
      - "professional brand photography"
      - "high-end advertising style"
      - brand_specific_modifiers
    negative_prompts:
      - "text, logos, watermarks"
      - "low quality, blurry"
      - "generic stock photo feel"
      - "malformed hands, text"

  - step: generate_images
    provider: flux-1.1-pro
    fallback: dall-e-3
    count: 4 per prompt
    select_best: 1-2

  - step: validate_output
    checks:
      - no_artifacts
      - brand_color_alignment
      - resolution_sufficient
      - no_text_in_image
      - no_logo_elements

  - step: post_process
    tool: sharp
    actions:
      - resize_to_spec
      - optimize_filesize
      - export_formats

  - step: human_review
    required: true
    criteria:
      - brand_alignment
      - quality
      - usability

  - step: log_generation
    include:
      - prompt_used
      - provider
      - cost
      - selected_images
```

## Prompt Engineering

```yaml
prompt_structure:
  base: |
    {style_prefix} {subject_description},
    {mood_keywords},
    {color_palette_description},
    {technical_specs}

  style_prefixes:
    modern: "clean minimal contemporary"
    classic: "elegant timeless sophisticated"
    bold: "vibrant dynamic energetic"
    organic: "natural warm authentic"

  technical_specs:
    photo: "professional photography, studio lighting, 8k"
    illustration: "digital illustration, vector style, clean lines"
    abstract: "abstract art, geometric shapes, gradient"
```

## Cost Management

```yaml
cost_tracking:
  flux_1.1_pro: ~$0.04/image
  dall_e_3: ~$0.08/image (HD)

  budget_per_client: $20-30
  estimated_images: 50-100

  optimization:
    - batch_similar_requests
    - reuse_successful_prompts
    - upscale_instead_of_regenerate
```

## Pre-Conditions

- [ ] Brand profile with visual direction
- [ ] Image brief provided
- [ ] API credits available

## Post-Conditions

- [ ] Images generated and stored
- [ ] No logo/trademark elements
- [ ] Cost logged

## Acceptance Criteria

- [ ] Images brand-aligned
- [ ] No AI artifacts
- [ ] Resolution meets requirements
- [ ] Human review approved

## Quality Gate

- Threshold: >70%
- Generated images match brand visual direction
- No logos generated (CON-15 compliance)
- Image resolution meets minimum quality for target platform

---
*Branding Squad Task - ai-orchestrator*
