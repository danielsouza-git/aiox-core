# batch-image-generate

```yaml
task:
  id: batch-image-generate
  name: Batch Image Generation
  agent: ai-image-specialist
  squad: visual-production
  type: production
  elicit: true

inputs:
  required:
    - prompt_template: "Parameterized prompt template"
    - variables: "Variable values for each generation"
    - model: "AI model to use"
    - count: "Number of images to generate"
  optional:
    - dimensions: "Output dimensions (default from template)"
    - style_lock: "Seed or style reference for consistency"
    - output_format: "PNG, JPG, WebP"
    - naming_convention: "File naming pattern"

outputs:
  - batch-output/: "Generated image files"
  - batch-manifest.json: "Manifest with metadata per image"
  - batch-report.md: "Generation report with stats"
  - rejected/: "Rejected images with reasons"

pre_conditions:
  - "Prompt template tested and validated"
  - "Variable matrix defined"
  - "API rate limits understood"

post_conditions:
  - "All images generated successfully"
  - "Style consistency across batch verified"
  - "Manifest with metadata for each image"
  - "Quality check passed on all accepted images"
```

## Purpose

Generate multiple images at scale from a parameterized prompt template, maintaining style consistency across the entire batch.

## Workflow

### Phase 1: Template Validation (5 min)
1. Load prompt template from prompt library
2. Verify all variable placeholders are defined
3. Test template with first variable set
4. Confirm output quality meets standards

### Phase 2: Variable Matrix Setup (10 min)
1. Define the variable matrix:
   ```
   | Variable | Values |
   |----------|--------|
   | {subject} | "woman", "man", "team" |
   | {setting} | "office", "outdoor", "studio" |
   | {mood} | "confident", "approachable", "energetic" |
   ```
2. Calculate total combinations (or select specific pairs)
3. Set generation order and priority
4. Define naming convention for outputs

### Phase 3: Batch Execution (varies)
1. For each variable combination:
   - Assemble final prompt from template + variables
   - Submit to AI model with consistent parameters
   - Save output with structured filename
   - Log prompt, seed, and parameters in manifest
2. Respect API rate limits (add delays if needed)
3. Track progress: generated / total

### Phase 4: Quality Gate (15 min)
1. Review each generated image:
   - Style consistency with batch (compare to reference)
   - Technical quality (resolution, artifacts, coherence)
   - Brand alignment (colors, mood, composition)
2. Mark as: accepted, needs-regeneration, rejected
3. Regenerate failed images with adjusted parameters
4. Move rejected images to rejected/ with reasons

### Phase 5: Manifest & Report (5 min)
1. Generate batch-manifest.json:
   ```json
   {
     "batch_id": "batch-2026-03-27-001",
     "model": "flux-1.1-pro",
     "total_generated": 20,
     "accepted": 18,
     "rejected": 2,
     "images": [
       {
         "filename": "hero-confident-office-001.webp",
         "prompt_hash": "abc123",
         "seed": 42,
         "variables": {"subject": "woman", "setting": "office"}
       }
     ]
   }
   ```
2. Write batch-report.md with summary statistics
3. Calculate acceptance rate and note patterns in rejections

## Elicitation Questions

```yaml
elicit:
  - question: "How many images do you need in this batch?"
    type: number
    hint: "Total count including variants"

  - question: "What level of variation between images?"
    options:
      - "Minimal - Same composition, different subjects"
      - "Moderate - Same style, different scenes"
      - "High - Different compositions, consistent brand"

  - question: "Should images use the same seed for consistency?"
    options:
      - "Yes - Lock seed for maximum consistency"
      - "No - Different seeds for natural variation"
      - "Mixed - Same seed per group, different between groups"
```

## Acceptance Criteria

- [ ] All requested images generated
- [ ] Style consistency verified across batch
- [ ] Acceptance rate above 80%
- [ ] Manifest with metadata for every image
- [ ] Rejected images documented with reasons
- [ ] Batch report with statistics generated

## Quality Gate
- Threshold: >70%
- Batch acceptance rate above 80% (accepted / total generated)
- Style consistency verified across the entire batch
- Manifest with metadata generated for every accepted image

---
*Visual Production Squad Task*
