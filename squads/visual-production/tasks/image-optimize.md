# image-optimize

```yaml
task:
  id: image-optimize
  name: Image Optimization for Web
  agent: photo-editor
  squad: visual-production
  type: optimization
  elicit: false

inputs:
  required:
    - source_images: "Images to optimize"
    - target_platform: "Web, social, email, or all"
  optional:
    - max_file_size: "Maximum file size per image"
    - responsive_sizes: "Breakpoint widths for responsive images"
    - formats: "Target formats (default: webp, avif, fallback)"
    - quality: "Quality percentage (default: 85)"

outputs:
  - optimized/: "Optimized images organized by format"
  - optimization-report.md: "Before/after sizes and savings"
  - srcset-snippets.md: "Ready-to-use HTML srcset code"

pre_conditions:
  - "Source images available in high resolution"
  - "Target platform defined"

post_conditions:
  - "All images optimized for target platform"
  - "Multiple formats generated (WebP + AVIF + fallback)"
  - "Responsive sizes generated if specified"
  - "Total file size reduction documented"
```

## Purpose

Optimize images for web delivery by generating multiple formats, responsive sizes, and ensuring optimal compression without visible quality loss.

## Workflow

### Phase 1: Analysis (5 min)
1. Inventory source images: count, dimensions, current sizes
2. Determine optimization targets per platform:
   | Platform | Max Width | Formats | Quality |
   |----------|----------|---------|---------|
   | Web hero | 1920px | WebP, AVIF, JPG | 85% |
   | Social | 1080px | PNG | 95% |
   | Email | 600px | JPG | 80% |
   | Thumbnail | 640px | WebP, JPG | 80% |
3. Calculate expected savings

### Phase 2: Format Generation (10 min)
For each source image, generate:

1. **WebP** (primary web format)
   - Quality: 85% (or as specified)
   - Effort: 6 (balanced speed/compression)

2. **AVIF** (next-gen format)
   - Quality: 80%
   - Speed: 4

3. **Fallback** (JPG for legacy or PNG for transparency)
   - Quality: 90%
   - Progressive: true (JPG)

### Phase 3: Responsive Sizes (10 min)
Generate sizes for common breakpoints:
```
srcset:
  - 320w   (mobile small)
  - 640w   (mobile large)
  - 768w   (tablet)
  - 1024w  (tablet landscape)
  - 1280w  (desktop small)
  - 1920w  (desktop large)
```

### Phase 4: Quality Verification (5 min)
1. Visual comparison at each size: no visible artifacts
2. Verify file sizes within targets
3. Check metadata stripped (reduce size, privacy)
4. Validate color accuracy (sRGB for web)

### Phase 5: Output & Documentation (5 min)
1. Organize outputs:
   ```
   optimized/
   ├── webp/
   │   ├── image-320w.webp
   │   ├── image-640w.webp
   │   └── image-1920w.webp
   ├── avif/
   │   └── (same structure)
   └── fallback/
       └── (jpg/png)
   ```
2. Generate HTML srcset snippets:
   ```html
   <picture>
     <source srcset="image-320w.avif 320w, image-640w.avif 640w, image-1920w.avif 1920w" type="image/avif">
     <source srcset="image-320w.webp 320w, image-640w.webp 640w, image-1920w.webp 1920w" type="image/webp">
     <img src="image-1920w.jpg" alt="[description]" loading="lazy" decoding="async">
   </picture>
   ```
3. Write optimization report with before/after sizes

## Optimization Targets

| Metric | Target |
|--------|--------|
| WebP quality | 85% |
| AVIF quality | 80% |
| Hero image max | 200KB |
| Thumbnail max | 50KB |
| Total page images | < 1MB |
| Largest Contentful Paint impact | < 2.5s |

## Sharp CLI Reference

```bash
# WebP conversion
sharp input.jpg -o output.webp --webp-quality 85

# AVIF conversion
sharp input.jpg -o output.avif --avif-quality 80

# Resize + convert
sharp input.jpg --resize 640 -o output-640w.webp --webp-quality 85
```

## Acceptance Criteria

- [ ] All images converted to WebP and AVIF
- [ ] Fallback format generated (JPG or PNG)
- [ ] Responsive sizes generated for specified breakpoints
- [ ] File sizes within defined targets
- [ ] No visible quality degradation
- [ ] srcset HTML snippets provided
- [ ] Optimization report with savings documented

## Quality Gate
- Threshold: >70%
- All images converted to WebP and AVIF with fallback format
- File sizes within defined targets (hero <200KB, thumbnail <50KB)
- No visible quality degradation at target display size

---
*Visual Production Squad Task*
