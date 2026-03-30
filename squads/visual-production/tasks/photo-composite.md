# photo-composite

```yaml
task:
  id: photo-composite
  name: Photo Compositing
  agent: photo-editor
  squad: visual-production
  type: editing
  elicit: true

inputs:
  required:
    - base_image: "Background or base image"
    - overlay_elements: "Images/layers to composite"
    - composition_brief: "Description of desired final result"
  optional:
    - lighting_reference: "Reference for lighting matching"
    - brand_guidelines: "Brand visual guidelines"
    - output_dimensions: "Final output dimensions"

outputs:
  - composite/: "Final composited image(s)"
  - layers-breakdown.md: "Layer structure documentation"
  - composite-log.md: "Compositing decisions and techniques"

pre_conditions:
  - "All source images available and sufficient resolution"
  - "Composition brief clearly describes desired result"

post_conditions:
  - "Composite looks natural and cohesive"
  - "Lighting and shadows consistent across layers"
  - "Color grading unified across all elements"
  - "Edge blending is seamless"
```

## Purpose

Combine multiple images, layers, and elements into a single cohesive final asset. Ensure natural blending, consistent lighting, and professional-quality compositing.

## Workflow

### Phase 1: Planning (10 min)
1. Review composition brief and reference
2. Assess each source image:
   - Resolution sufficiency for final output
   - Lighting direction and quality
   - Perspective and angle compatibility
   - Color temperature match
3. Plan layer order and blending approach
4. Identify potential challenges (lighting mismatch, edge complexity)

### Phase 2: Extraction & Preparation (15 min)
1. Extract subjects from backgrounds using:
   - AI-assisted selection (for complex edges like hair)
   - Manual masking (for precise geometric edges)
   - Channel-based extraction (for high-contrast subjects)
2. Clean edges: defringe, refine, feather where needed
3. Match resolution across all layers
4. Color-match individual elements to base lighting

### Phase 3: Assembly (15 min)
1. Place elements according to composition brief
2. Scale and transform to match perspective
3. Apply layer blending modes as needed
4. Create shadow layers for grounded placement
5. Add atmospheric effects (depth of field, haze) for realism

### Phase 4: Integration (15 min)
1. **Lighting Match** - Dodge/burn to match base lighting direction
2. **Shadow Creation** - Contact shadows, cast shadows, ambient occlusion
3. **Color Harmony** - Unified color grade across all layers
4. **Edge Refinement** - Final edge blending and cleanup
5. **Atmospheric Depth** - Blur, haze, color shift for depth

### Phase 5: Final Polish (10 min)
1. Global color grade for cohesion
2. Final sharpening
3. Noise matching between layers
4. Review at 100% zoom for artifacts
5. Export in target format(s)

## Compositing Checklist

| Check | Status |
|-------|--------|
| Perspective angles match | [ ] |
| Lighting direction consistent | [ ] |
| Shadow direction consistent | [ ] |
| Color temperature unified | [ ] |
| Edge blending seamless | [ ] |
| Depth of field consistent | [ ] |
| Noise/grain levels match | [ ] |
| No visible artifacts at 100% | [ ] |

## Elicitation Questions

```yaml
elicit:
  - question: "What type of composite is this?"
    options:
      - "Product placement (product on background)"
      - "Scene construction (multiple elements into scene)"
      - "Portrait composite (subject + environment)"
      - "Collage/montage (artistic arrangement)"

  - question: "What is the realism level needed?"
    options:
      - "Photorealistic - Must look like a single photograph"
      - "Stylized - Artistic composite, some creative license"
      - "Graphic - Design-oriented, visible layering acceptable"
```

## Acceptance Criteria

- [ ] All specified elements composited
- [ ] Lighting direction consistent across layers
- [ ] Shadows natural and correctly placed
- [ ] Edge blending seamless at 100% zoom
- [ ] Color grading unified across composite
- [ ] Perspective angles match between elements
- [ ] Output at specified dimensions and format

## Quality Gate
- Threshold: >70%
- Lighting direction and shadows consistent across all composited layers
- Edge blending seamless at 100% zoom with no visible artifacts
- Color grading unified across the entire composite

---
*Visual Production Squad Task*
