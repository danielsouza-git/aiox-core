# asset-export

```yaml
task:
  id: asset-export
  name: Export Assets in Multiple Formats
  agent: asset-manager
  squad: visual-production
  type: export
  elicit: true

inputs:
  required:
    - source_assets: "Assets to export"
    - export_profile: "Export profile (web, social, print, all)"
  optional:
    - custom_sizes: "Custom size specifications"
    - custom_formats: "Override default format selection"
    - naming_override: "Custom naming pattern"
    - quality_override: "Custom quality settings"

outputs:
  - exports/: "Exported files organized by profile"
  - export-manifest.json: "Export manifest with all variants"
  - export-report.md: "Export summary with file counts and sizes"

pre_conditions:
  - "Source assets available in high resolution"
  - "Export profile selected"

post_conditions:
  - "All formats generated per profile"
  - "All sizes generated per profile"
  - "File naming follows convention"
  - "Total export size documented"
```

## Purpose

Export visual assets in multiple formats and sizes tailored for specific delivery channels. Automate format conversion, resizing, and quality optimization.

## Workflow

### Phase 1: Profile Selection (5 min)
Select export profile(s):

**Web Profile:**
| Size | Formats | Quality |
|------|---------|---------|
| 1920w | WebP, AVIF, JPG | 85%, 80%, 90% |
| 1280w | WebP, AVIF, JPG | 85%, 80%, 90% |
| 640w | WebP, AVIF, JPG | 85%, 80%, 90% |
| 320w | WebP, JPG | 85%, 90% |

**Social Profile:**
| Platform | Size | Format | Quality |
|----------|------|--------|---------|
| Instagram Post | 1080x1080 | PNG | 95% |
| Instagram Story | 1080x1920 | PNG | 95% |
| LinkedIn | 1200x627 | PNG | 95% |
| Facebook | 1200x630 | PNG | 95% |
| Twitter/X | 1200x675 | PNG | 95% |
| YouTube Thumb | 1280x720 | JPG | 95% |

**Print Profile:**
| Size | Format | Color | DPI |
|------|--------|-------|-----|
| A4 | TIFF | CMYK | 300 |
| A3 | TIFF | CMYK | 300 |
| Letter | TIFF | CMYK | 300 |

### Phase 2: Batch Processing (15 min)
For each source asset:
1. Read source image and validate resolution
2. For each size in profile:
   - Resize maintaining aspect ratio (crop if needed)
   - Convert to each target format
   - Apply format-specific quality setting
   - Apply output sharpening
   - Strip metadata (except copyright)
3. Save with naming convention:
   ```
   {project}-{category}-{descriptor}-{width}x{height}.{ext}
   ```

### Phase 3: Validation (5 min)
1. Verify all expected files generated
2. Spot-check quality at each size
3. Verify color accuracy
4. Check file sizes against targets
5. Validate naming consistency

### Phase 4: Manifest & Report (5 min)
1. Generate export-manifest.json:
   ```json
   {
     "export_id": "export-2026-03-27",
     "profile": "web",
     "source_count": 10,
     "total_variants": 40,
     "total_size_mb": 12.5,
     "files": [
       {
         "source": "hero-homepage.png",
         "exports": [
           { "file": "hero-homepage-1920w.webp", "size": "185KB" },
           { "file": "hero-homepage-1920w.avif", "size": "120KB" },
           { "file": "hero-homepage-640w.webp", "size": "45KB" }
         ]
       }
     ]
   }
   ```
2. Write export report with:
   - Total files generated
   - Total size per format
   - Average compression ratio
   - Any issues encountered

## Elicitation Questions

```yaml
elicit:
  - question: "Which export profile do you need?"
    options:
      - "Web - responsive sizes, WebP/AVIF/JPG"
      - "Social - platform-specific sizes, PNG"
      - "Print - CMYK, high DPI, TIFF"
      - "All - every profile combined"
      - "Custom - specify sizes and formats"

  - question: "Should we include @2x retina versions?"
    options:
      - "Yes - include @2x for all sizes"
      - "No - standard resolution only"
      - "Web only - @2x for web profile, standard for others"
```

## Acceptance Criteria

- [ ] All formats generated per selected profile
- [ ] All sizes generated per profile
- [ ] Naming convention consistently applied
- [ ] Quality verified via spot check
- [ ] Export manifest with all variants
- [ ] Export report with size totals
- [ ] No missing or corrupt output files

## Quality Gate
- Threshold: >70%
- All formats and sizes generated per selected export profile
- Naming convention consistently applied across all exports
- Export manifest with complete metadata for every variant

---
*Visual Production Squad Task*
