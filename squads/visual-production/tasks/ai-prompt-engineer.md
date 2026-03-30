# ai-prompt-engineer

```yaml
task:
  id: ai-prompt-engineer
  name: AI Prompt Engineering
  agent: ai-image-specialist
  squad: visual-production
  type: creation
  elicit: true

inputs:
  required:
    - concept: "What images need to be generated"
    - brand_style: "Brand visual style and direction"
    - target_model: "Primary AI model (flux, dall-e, midjourney, sdxl)"
  optional:
    - reference_images: "Style reference images"
    - existing_prompts: "Previously successful prompts"
    - batch_context: "If prompts are for batch generation"

outputs:
  - prompt-library.md: "Documented prompt templates"
  - negative-prompt-bank.md: "Standard negative prompts"
  - prompt-variants.md: "Variations for A/B testing"
  - style-tokens.md: "Reusable style descriptors"

pre_conditions:
  - "Concept or image requirements defined"
  - "Brand style direction available"

post_conditions:
  - "Prompt templates created and tested"
  - "Style tokens documented for reuse"
  - "Negative prompt bank established"
  - "Prompt variants ready for batch generation"
```

## Purpose

Create and refine AI image generation prompts that produce consistent, brand-aligned results across multiple generations. Build reusable prompt templates and style tokens.

## Workflow

### Phase 1: Concept Decomposition (10 min)
1. Break concept into visual components
2. Identify required elements: subject, setting, mood, color
3. Map concept to brand style tokens
4. Define success criteria for the generated images

### Phase 2: Style Token Creation (15 min)
Create reusable style descriptors:

```markdown
## Style Tokens

### Photography Style
TOKEN_PHOTO_STYLE: "professional editorial photography, soft natural lighting,
shallow depth of field, Canon EOS R5, 85mm f/1.4"

### Color Mood
TOKEN_WARM: "warm golden tones, amber highlights, soft shadows"
TOKEN_COOL: "cool blue tones, crisp whites, subtle contrast"

### Quality
TOKEN_QUALITY: "8k uhd, ultra detailed, professional, sharp focus"

### Brand Specific
TOKEN_BRAND_STYLE: "[brand-specific descriptors from visual direction]"
```

### Phase 3: Prompt Assembly (15 min)
1. Combine style tokens with subject description
2. Add composition directives
3. Build negative prompt (standard + context-specific)
4. Create 3-5 prompt variants with different emphasis

### Phase 4: Testing & Refinement (20 min)
1. Generate test images with each prompt variant
2. Evaluate results against success criteria
3. Identify which tokens produce best results
4. Refine prompts based on output quality
5. Document effective vs ineffective modifiers

### Phase 5: Template Documentation (10 min)
1. Save final prompt templates
2. Document parameter recommendations per model
3. Create quick-reference prompt card
4. Tag templates by use case (hero, social, product, etc.)

## Prompt Template Format

```markdown
## Template: [Name]
**Use Case:** [hero/social/product/editorial]
**Model:** [flux/dall-e/midjourney/sdxl]
**Tested:** [date]

### Prompt
[Main prompt with {variables} for customization]

### Negative Prompt
[Standard exclusions]

### Parameters
- Dimensions: [WxH]
- Guidance Scale: [value]
- Steps: [value]
- Seed: [value or "random"]

### Variables
| Variable | Description | Example |
|----------|------------|---------|
| {subject} | Main subject | "woman in business attire" |
| {setting} | Environment | "modern office space" |
```

## Elicitation Questions

```yaml
elicit:
  - question: "What type of images will these prompts generate?"
    options:
      - "Product photography"
      - "Lifestyle/editorial"
      - "Abstract/conceptual"
      - "Portraits/headshots"
      - "Landscapes/environments"
      - "Mixed types (batch template)"

  - question: "How many prompt templates do you need?"
    options:
      - "1 - Single use case"
      - "3-5 - Campaign set"
      - "10+ - Full prompt library"
```

## Acceptance Criteria

- [ ] Prompt templates documented with variables
- [ ] Style tokens created and reusable
- [ ] Negative prompt bank established
- [ ] At least 3 prompt variants per concept
- [ ] Templates tested with actual generation
- [ ] Parameter recommendations documented per model

## Quality Gate
- Threshold: >70%
- Prompt templates tested with actual generation and validated
- Style tokens documented and reusable across prompt variants
- Negative prompt bank established with standard exclusions

---
*Visual Production Squad Task*
