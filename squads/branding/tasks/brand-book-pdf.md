# brand-book-pdf

```yaml
task: brandBookPdf()
agent: brand-book-builder
squad: branding
prd_refs: [FR-1.7]

inputs:
  - name: brand_book_source
    type: directory
    required: true
    source: brand-book-generate output

outputs:
  - name: brand_book_pdf
    type: pdf
    destination: .aiox/branding/{client}/exports/brand-book.pdf

tools:
  - puppeteer
  - pdf-lib
```

## Purpose

Generate PDF export of Brand Book (50-100 pages) optimized for print and digital distribution.

## PDF Structure

```yaml
pages:
  cover: 1 page
  table_of_contents: 1-2 pages

  introduction:
    - brand_story: 1-2 pages
    - mission_vision: 1 page
    - manifesto: 1 page

  brand_strategy:
    - positioning: 2-3 pages
    - target_audience: 1-2 pages
    - brand_personality: 2 pages
    - voice_guide: 6-10 pages

  visual_identity:
    - logo_system: 6-10 pages
    - color_palette: 4-6 pages
    - typography: 4-6 pages
    - iconography: 2-4 pages
    - photography: 2-4 pages
    - patterns_textures: 2 pages

  applications:
    - stationery: 2-4 pages
    - digital: 2-4 pages
    - social_media: 2-4 pages
    - signage: 2 pages

  guidelines:
    - dos_and_donts: 4-6 pages
    - spacing_rules: 2 pages
    - incorrect_usage: 2-4 pages

  appendix:
    - color_codes: 1-2 pages
    - font_licenses: 1 page
    - contact: 1 page

total_pages: 50-100
```

## Generation Process

```yaml
steps:
  - step: prepare_print_styles
    create: print.css
    settings:
      page_size: A4 (210x297mm)
      margins: 20mm
      bleed: 3mm (for print-ready)
      color_space: RGB (will note CMYK values)

  - step: render_pages
    tool: puppeteer
    options:
      format: A4
      printBackground: true
      preferCSSPageSize: true

  - step: generate_toc
    method: extract_headings
    add_page_numbers: true

  - step: add_page_numbers
    position: bottom_center
    skip: cover_page
    format: "Page X of Y"

  - step: optimize_pdf
    tool: pdf-lib
    actions:
      - compress_images
      - embed_fonts
      - set_metadata

  - step: create_print_ready
    optional: true
    add_bleed: 3mm
    add_crop_marks: true
    color_profile: note_cmyk_values
```

## Print Specifications

```yaml
print_specs:
  page_size: A4 (210 x 297 mm)
  orientation: portrait
  margins:
    top: 20mm
    bottom: 25mm  # extra for page numbers
    left: 20mm
    right: 20mm

  bleed: 3mm (when print-ready)
  safe_zone: 5mm from trim

  resolution: 300 DPI for images
  color: RGB with CMYK values noted

  fonts: embedded (subset)
```

## PDF Metadata

```yaml
metadata:
  title: "{Client Name} Brand Book"
  author: "Brand System Service"
  subject: "Brand Guidelines and Visual Identity"
  keywords: ["brand", "guidelines", "identity", "{client}"]
  creator: "AIOX Brand System"
  creation_date: auto
```

## Quality Checks

```yaml
quality_checks:
  - all_images_300dpi
  - fonts_embedded
  - no_missing_glyphs
  - colors_consistent
  - links_work (for digital version)
  - toc_accurate
  - page_numbers_correct
```

## Pre-Conditions

- [ ] Brand book HTML generated
- [ ] All assets high-resolution
- [ ] Fonts available for embedding

## Post-Conditions

- [ ] PDF generated
- [ ] Metadata set
- [ ] File size reasonable (<50MB)

## Acceptance Criteria

- [ ] 50-100 pages complete
- [ ] Print-quality resolution
- [ ] TOC navigable
- [ ] Client approved

## Quality Gate

- Threshold: >70%
- PDF contains 50-100 pages with correct formatting
- All images rendered at print-quality resolution
- Table of contents with working page links

---
*Branding Squad Task - brand-book-builder*
