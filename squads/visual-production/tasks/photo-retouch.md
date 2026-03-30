# photo-retouch

```yaml
task:
  id: photo-retouch
  name: Professional Photo Retouching
  agent: photo-editor
  squad: visual-production
  type: editing
  elicit: true

inputs:
  required:
    - source_image: "Original image file to retouch"
    - retouch_level: "Level: basic, standard, advanced"
  optional:
    - style_reference: "Reference image for color grading"
    - brand_palette: "Brand colors for color correction"
    - specific_edits: "List of specific adjustments needed"
    - output_format: "Desired output format and quality"

outputs:
  - retouched/: "Retouched image files"
  - edit-log.md: "Log of all adjustments made"
  - before-after.md: "Before/after comparison notes"

pre_conditions:
  - "Source image provided in editable format"
  - "Retouch level defined"

post_conditions:
  - "All requested adjustments applied"
  - "Original file preserved untouched"
  - "Color accuracy maintained or improved"
  - "Edit log documents all changes"
```

## Purpose

Perform professional photo retouching with non-destructive editing practices. Cover exposure correction, color grading, blemish removal, and detail enhancement.

## Workflow

### Phase 1: Assessment (5 min)
1. Open source image and assess current state
2. Check technical metadata (resolution, color space, bit depth)
3. Identify areas needing correction:
   - Exposure (under/over exposed areas)
   - White balance (color cast)
   - Sharpness (soft areas)
   - Blemishes or distractions
4. Plan editing sequence

### Phase 2: Global Adjustments (10 min)
1. **Exposure** - Adjust highlights, shadows, midtones
2. **White Balance** - Correct color temperature and tint
3. **Contrast** - Set black/white points, adjust curves
4. **Vibrance/Saturation** - Balance color intensity
5. **Clarity** - Enhance or soften midtone contrast

### Phase 3: Color Grading (10 min)
1. Apply brand-aligned color grade if specified
2. Match to style reference if provided
3. Ensure skin tones remain natural (if applicable)
4. Verify color consistency with other project assets
5. Check in both sRGB and target color space

### Phase 4: Detail Work (varies by level)
**Basic:**
- Spot removal (dust, minor blemishes)
- Straighten horizon
- Basic crop to composition

**Standard (includes Basic +):**
- Skin retouching (frequency separation approach)
- Background cleanup
- Object removal if needed
- Dodge and burn for dimension

**Advanced (includes Standard +):**
- Complex compositing
- Hair/edge refinement
- Advanced skin work
- Light painting / relighting
- Perspective correction

### Phase 5: Sharpening & Export (5 min)
1. Apply output sharpening appropriate for medium
2. Convert to target color space
3. Export in specified format(s)
4. Verify file size within targets
5. Document all edits in edit-log.md

## Retouch Levels

| Level | Time | Scope | Use Case |
|-------|------|-------|----------|
| **Basic** | 5-10 min | Exposure, WB, crop | Social media, quick posts |
| **Standard** | 15-25 min | + skin, cleanup, grade | Marketing materials, web |
| **Advanced** | 30-60 min | + compositing, relighting | Hero images, print, ads |

## Elicitation Questions

```yaml
elicit:
  - question: "What retouch level do you need?"
    options:
      - "Basic - Exposure, white balance, crop"
      - "Standard - Basic + skin retouch, cleanup, color grade"
      - "Advanced - Standard + compositing, relighting, complex edits"

  - question: "What is the intended use?"
    options:
      - "Web hero image"
      - "Social media post"
      - "Print material"
      - "Email campaign"
      - "Ad creative"
```

## Acceptance Criteria

- [ ] Original file preserved untouched
- [ ] Exposure and white balance corrected
- [ ] Color grading applied (if specified)
- [ ] Detail work completed per retouch level
- [ ] Output sharpened for intended medium
- [ ] Export in correct format and color space
- [ ] Edit log documents all adjustments

## Quality Gate
- Threshold: >70%
- Original file preserved untouched with non-destructive edits
- Color accuracy maintained (no unwanted color shifts)
- Output exported in correct format and color space for intended medium

---
*Visual Production Squad Task*
