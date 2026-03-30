# ai-image-generate

```yaml
task:
  id: ai-image-generate
  name: Generate AI Images
  agent: ai-image-specialist
  squad: visual-production
  type: generation
  elicit: true

inputs:
  required:
    - prompt_description: "What the image should depict"
    - model: "AI model to use (flux, dall-e, midjourney, sdxl)"
    - dimensions: "Output dimensions (e.g., 1920x1080, 1080x1080)"
  optional:
    - style_reference: "Reference images for style matching"
    - brand_palette: "Brand color palette to incorporate"
    - negative_prompt: "Elements to exclude"
    - seed: "Seed for reproducibility"
    - num_images: "Number of variations to generate"

outputs:
  - generated-images/: "Generated image files"
  - prompt-log.md: "Final prompts used with parameters"
  - curation-notes.md: "Notes on selected vs rejected images"

pre_conditions:
  - "Image description or concept provided"
  - "Target dimensions specified"
  - "AI model API accessible"

post_conditions:
  - "Images generated at specified dimensions"
  - "Style consistent with brand direction"
  - "Prompt fully documented for reproducibility"
  - "Best candidates selected and annotated"
```

## Purpose

Generate images using AI models with brand-aligned prompts, ensuring style consistency and production-ready quality.

## Workflow

### Phase 1: Prompt Construction (10 min)
1. Analyze the image description/concept
2. Structure prompt using the standard format:
   ```
   [Subject] + [Style] + [Mood] + [Composition] + [Technical] + [Negative]
   ```
3. Incorporate brand elements (palette, style keywords)
4. Add negative prompt to exclude unwanted elements
5. Set technical parameters (dimensions, seed, guidance scale)

### Phase 2: Model Selection
| Criteria | Flux 1.1 Pro | DALL-E 3 | Midjourney v6 | SDXL |
|----------|-------------|----------|---------------|------|
| Photorealism | Best | Good | Good | Good |
| Illustration | Good | Best | Best | Good |
| Control | High | Medium | Low | Highest |
| Speed | Fast | Fast | Slow | Medium |
| Inpainting | No | No | No | Yes |

### Phase 3: Generation (varies)
1. Submit prompt to selected model
2. Generate multiple variations (minimum 4)
3. If using seeds, document each seed value
4. Apply any model-specific parameters

### Phase 4: Curation (10 min)
1. Review all generated images
2. Score each on: composition, brand alignment, quality, usability
3. Select top candidates (typically 2-3)
4. Document why rejected images failed
5. Note any needed post-processing

### Phase 5: Documentation (5 min)
1. Save final prompts in prompt-log.md
2. Record all parameters for reproducibility
3. Tag images with metadata (model, seed, prompt hash)
4. Link to visual direction document

## Prompt Engineering Rules

### Structure
```
[Main subject and action],
[Style description: photography/illustration/3d],
[Lighting: natural/studio/dramatic/golden hour],
[Color palette: warm/cool/specific colors],
[Composition: centered/rule-of-thirds/close-up/wide],
[Technical: camera model, lens, f-stop, ISO],
[Quality: 8k, ultra detailed, professional],
--no [unwanted elements: text, watermark, blurry, cartoon]
```

### Brand Integration
- Always reference brand palette colors by name
- Include brand mood keywords from visual direction
- Match photography style to brand guidelines
- Avoid generic stock-photo aesthetics

## Elicitation Questions

```yaml
elicit:
  - question: "What is the primary subject of the image?"
    type: text
    hint: "Describe the main subject and any action/pose"

  - question: "Which AI model should be used?"
    options:
      - "Flux 1.1 Pro - Best for photorealistic images"
      - "DALL-E 3 - Best for conceptual/illustration"
      - "Auto-select based on content type"

  - question: "What dimensions do you need?"
    options:
      - "1920x1080 - Hero / banner"
      - "1080x1080 - Social square"
      - "1080x1920 - Social story"
      - "1200x630 - OG image"
      - "Custom dimensions"
```

## Acceptance Criteria

- [ ] Images generated at correct dimensions
- [ ] Style matches brand direction
- [ ] Negative prompt applied (no watermarks, artifacts)
- [ ] Multiple variations provided
- [ ] Prompts documented for reproducibility
- [ ] Top candidates selected and annotated

## Quality Gate
- Threshold: >70%
- Generated images match specified dimensions and brand direction
- No visible artifacts, watermarks, or unwanted elements
- Prompts fully documented for reproducibility

---
*Visual Production Squad Task*
