# biolink-create

```yaml
task: biolinkCreate()
agent: web-builder
squad: branding
prd_refs: [FR-3.9]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: tokens
    type: DesignTokens
    required: true
  - name: biolink_config
    type: BiolinkConfig
    required: true

outputs:
  - name: biolink_page
    type: directory
    destination: .aiox/branding/{client}/web/biolink/

tools:
  - static-site-builder
  - sharp
```

## Purpose

Create bio link page (Linktree-style, 1080x1920 mobile-first) with brand-matched design.

## Page Structure

```yaml
biolink_structure:
  header:
    elements:
      - avatar/logo (circular, 96-128px)
      - display_name
      - bio_text (1-2 lines)
    position: top_center

  link_blocks:
    count: 5-15 links
    style: buttons or cards
    elements_per_link:
      - icon (optional)
      - title
      - description (optional)
      - url
    animation: subtle_hover

  social_icons:
    position: after_links or footer
    platforms: configurable
    size: 32-40px

  footer:
    elements:
      - powered_by (optional)
      - copyright
    position: bottom
```

## Design Specifications

```yaml
design_specs:
  layout:
    width: 100vw (max 480px centered)
    padding: 24px horizontal
    gap: 12-16px between links

  mobile_first:
    base: 375px
    optimized_for: mobile viewing

  link_buttons:
    height: 56-64px
    border_radius: from_tokens (8-24px)
    background: brand_color or white
    text: contrasting_color

  avatar:
    size: 96px (mobile), 128px (desktop)
    shape: circle
    border: optional brand_color

  background:
    options:
      - solid_color
      - gradient
      - image (subtle)
      - pattern
```

## Link Types

```yaml
link_types:
  standard:
    elements: [icon, title]
    action: open_url

  featured:
    elements: [icon, title, description, thumbnail]
    style: highlighted/larger
    action: open_url

  social:
    elements: [platform_icon]
    style: icon_only
    action: open_social_profile

  embed:
    types: [youtube, spotify, soundcloud]
    style: inline_player

  contact:
    types: [email, phone, whatsapp]
    style: action_button

  download:
    elements: [icon, title, file_type]
    action: download_file
```

## Configuration Schema

```yaml
BiolinkConfig:
  profile:
    name: string
    bio: string (max 150 chars)
    avatar: url or upload

  links:
    - type: standard | featured | social | embed
      title: string
      url: string
      icon: string (optional)
      description: string (optional)
      featured: boolean

  social:
    platforms:
      - platform: instagram | linkedin | youtube | ...
        url: string

  style:
    theme: light | dark | brand
    background: color | gradient | image
    button_style: rounded | square | pill
    animation: none | subtle | playful

  analytics:
    enabled: boolean
    provider: simple_analytics | plausible | none
```

## Output Structure

```yaml
output:
  biolink/
  ├── index.html
  ├── assets/
  │   ├── css/
  │   │   └── styles.css
  │   ├── js/
  │   │   └── main.js (click tracking)
  │   └── images/
  │       └── avatar.webp
  └── favicon.ico
```

## Generation Process

```yaml
steps:
  - step: validate_config
    check: [name, at_least_3_links, avatar]

  - step: process_avatar
    resize: [96px, 128px]
    format: webp
    optimize: true

  - step: apply_brand_tokens
    colors: from_design_tokens
    typography: from_design_tokens
    spacing: from_design_tokens

  - step: generate_html
    template: biolink_template
    inject: [config, tokens]

  - step: add_analytics
    if: analytics_enabled
    script: lightweight_tracker

  - step: optimize
    html: minify
    css: inline_critical
    images: compress
```

## Pre-Conditions

- [ ] Biolink config provided
- [ ] Avatar image available
- [ ] At least 3 links defined

## Post-Conditions

- [ ] Single-page site generated
- [ ] Mobile-optimized
- [ ] All links work

## Acceptance Criteria

- [ ] Looks good on mobile
- [ ] Brand consistent
- [ ] Links functional
- [ ] Fast loading (<1s)

## Quality Gate

- Threshold: >70%
- All links functional and accessible
- Page loads in <1 second
- Brand tokens applied correctly to all elements

---
*Branding Squad Task - web-builder*
