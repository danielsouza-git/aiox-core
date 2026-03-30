# asset-organize

```yaml
task:
  id: asset-organize
  name: Organize Asset Library
  agent: asset-manager
  squad: visual-production
  type: organization
  elicit: true

inputs:
  required:
    - asset_source: "Location of assets to organize"
    - project_name: "Project identifier for naming"
  optional:
    - existing_structure: "Current folder structure if migrating"
    - naming_convention: "Override default naming convention"
    - metadata_template: "Custom metadata fields"

outputs:
  - organized/: "Reorganized asset folder structure"
  - manifest.json: "Complete asset manifest with metadata"
  - migration-log.md: "Log of file moves and renames"
  - README.md: "Asset library guide"

pre_conditions:
  - "Assets accessible at source location"
  - "Project name defined"

post_conditions:
  - "All assets categorized and renamed"
  - "Manifest with metadata for every asset"
  - "Folder structure follows convention"
  - "No orphaned or uncategorized files"
```

## Purpose

Organize visual assets into a structured library with consistent naming, categorization, and metadata. Create a searchable manifest for asset discovery.

## Workflow

### Phase 1: Asset Discovery (10 min)
1. Scan source location for all files
2. Identify file types and categorize:
   - Images: PNG, JPG, WebP, AVIF, TIFF, SVG
   - Motion: TSX (Framer Motion components), JSON (Lottie legacy), MP4, GIF, MOV
   - Source: PSD, AI, FIGMA, SKETCH
   - Documents: PDF, MD
3. Count totals per category
4. Identify duplicates (same content, different names)

### Phase 2: Categorization (10 min)
Assign each asset a category:
| Category | File Types | Example |
|----------|-----------|---------|
| `hero` | PNG, JPG, WebP | Banner images |
| `social` | PNG, JPG | Instagram, LinkedIn posts |
| `icon` | SVG, PNG | UI icons |
| `logo` | SVG, PNG | Logo variations |
| `photo` | JPG, WebP | Photography |
| `motion` | JSON, MP4, GIF | Animations |
| `bg` | JPG, PNG, SVG | Background images |
| `thumb` | JPG, WebP | Thumbnails |
| `ad` | PNG, JPG | Ad creatives |
| `source` | PSD, AI, FIGMA | Source files |

### Phase 3: Rename & Structure (15 min)
1. Apply naming convention:
   ```
   {project}-{category}-{descriptor}-{variant}-{size}.{ext}
   ```
2. Create folder structure:
   ```
   assets/{project}/
   ├── originals/
   ├── hero/
   ├── social/
   ├── icon/
   ├── logo/
   ├── photo/
   ├── motion/
   ├── bg/
   ├── thumb/
   ├── ad/
   └── source/
   ```
3. Move files to appropriate folders
4. Log all moves in migration-log.md

### Phase 4: Metadata Generation (10 min)
For each asset, generate metadata:
```json
{
  "id": "asset-001",
  "filename": "acme-hero-homepage-dark-1920x1080.webp",
  "category": "hero",
  "project": "acme",
  "dimensions": "1920x1080",
  "format": "webp",
  "fileSize": "185KB",
  "colorSpace": "sRGB",
  "created": "2026-03-27",
  "tags": ["homepage", "dark-mode", "hero"],
  "variants": ["acme-hero-homepage-light-1920x1080.webp"]
}
```

### Phase 5: Manifest & Documentation (5 min)
1. Generate manifest.json with all asset metadata
2. Create README.md with:
   - Folder structure explanation
   - Naming convention reference
   - How to add new assets
   - Asset counts by category
3. Validate: no orphans, no duplicates, all categorized

## Elicitation Questions

```yaml
elicit:
  - question: "Is this a new library or reorganization of existing?"
    options:
      - "New - organizing fresh assets"
      - "Migration - reorganizing existing structure"
      - "Merge - combining multiple sources"

  - question: "What level of detail for metadata?"
    options:
      - "Basic - filename, category, dimensions"
      - "Standard - Basic + tags, dates, variants"
      - "Full - Standard + color analysis, alt text, usage tracking"
```

## Acceptance Criteria

- [ ] All assets categorized and moved to correct folders
- [ ] Naming convention consistently applied
- [ ] manifest.json generated with metadata per asset
- [ ] No orphaned or uncategorized files
- [ ] Migration log documents all changes
- [ ] README with library guide created
- [ ] Duplicates identified and resolved

## Quality Gate
- Threshold: >70%
- All assets categorized with consistent naming convention
- Manifest.json generated with complete metadata per asset
- No orphaned, uncategorized, or duplicate files remaining

---
*Visual Production Squad Task*
