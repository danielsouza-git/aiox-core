# batch-generate

```yaml
task: batchGenerate()
agent: creative-producer
squad: branding
prd_refs: [FR-2.7, NFR-1.3]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: content_calendar
    type: ContentCalendar
    required: true
  - name: batch_size
    type: number
    default: 30

outputs:
  - name: generated_posts
    type: PostCollection
    destination: .aiox/branding/{client}/social/batch-{batch_id}/
  - name: batch_report
    type: markdown
    destination: .aiox/branding/{client}/social/batch-{batch_id}/report.md

tools:
  - ai-orchestrator
  - satori
  - sharp
```

## Purpose

Generate batch of social media creatives (30 posts in ~10 minutes) using AI pipeline.

## Pipeline Architecture

```yaml
pipeline:
  intake: content_brief
  copy: claude_api (parallel)
  image: flux_1.1_pro (parallel)
  render: satori_jsx_to_svg
  rasterize: sharp
  export: review_queue

target_time: 10 minutes for 30 posts
```

## Pipeline Stages

### Stage 1: Content Brief Processing (1 min)
```yaml
steps:
  - parse_content_calendar
  - extract_post_briefs
  - assign_templates
  - queue_for_generation
```

### Stage 2: Copy Generation (2 min parallel)
```yaml
config:
  provider: claude-api
  parallelism: 10 concurrent
  per_post:
    - headline
    - body_copy (HCEA framework)
    - cta
    - hashtags (8-12)
    - caption (150-300 words)
```

### Stage 3: Image Generation (5 min parallel)
```yaml
config:
  provider: flux-1.1-pro
  fallback: dall-e-3
  parallelism: 5 concurrent
  per_post:
    - background_image
    - optional: secondary_elements
```

### Stage 4: Template Rendering (2 min batch)
```yaml
config:
  renderer: satori
  process:
    - inject copy into JSX template
    - inject image as background
    - apply brand tokens (colors, fonts)
    - render to SVG
```

### Stage 5: Rasterization (1 min batch)
```yaml
config:
  tool: sharp
  outputs_per_post:
    - instagram_feed: 1080x1080, PNG
    - instagram_story: 1080x1920, PNG
    - linkedin: 1200x627, PNG
  optimization:
    - quality: 90
    - compress: true
```

## Template System

```yaml
templates:
  quote:
    layout: centered_text_over_image
    elements: [background, quote_text, attribution, logo]

  tip:
    layout: numbered_list
    elements: [background, number, tip_text, logo]

  statistic:
    layout: big_number_focus
    elements: [background, number, context, source, logo]

  before_after:
    layout: split_comparison
    elements: [before_image, after_image, labels, logo]

  question:
    layout: centered_question
    elements: [background, question_text, cta, logo]

  announcement:
    layout: headline_focus
    elements: [background, headline, subhead, cta, logo]

  testimonial:
    layout: quote_with_avatar
    elements: [background, quote, avatar, name, role, logo]
```

## Parallel Processing

```javascript
// Pseudocode for parallel generation
async function batchGenerate(briefs) {
  // Stage 2: Parallel copy generation
  const copyPromises = briefs.map(brief =>
    generateCopy(brief).catch(e => ({ error: e, brief }))
  );
  const copies = await Promise.all(copyPromises);

  // Stage 3: Parallel image generation
  const imagePromises = briefs.map(brief =>
    generateImage(brief).catch(e => ({ error: e, brief }))
  );
  const images = await Promise.all(imagePromises);

  // Stage 4-5: Sequential render + rasterize
  const posts = await renderAll(copies, images);

  return posts;
}
```

## Output Structure

```
batch-{batch_id}/
├── report.md
├── posts/
│   ├── post-001/
│   │   ├── instagram-feed.png
│   │   ├── instagram-story.png
│   │   ├── linkedin.png
│   │   ├── copy.md
│   │   └── metadata.json
│   ├── post-002/
│   └── ...
└── summary.json
```

## Pre-Conditions

- [ ] Content calendar defined
- [ ] Brand tokens available
- [ ] API credits available

## Post-Conditions

- [ ] All posts generated
- [ ] All formats exported
- [ ] Report generated

## Acceptance Criteria

- [ ] 30 posts in ~10 minutes
- [ ] All platform formats correct
- [ ] No generation errors
- [ ] Quality review ready

## Quality Gate

- Threshold: >70%
- 30 posts generated within target time (~10 minutes)
- All platform format dimensions correct (Instagram, LinkedIn, etc.)
- No generation errors in the batch report

---
*Branding Squad Task - creative-producer*
