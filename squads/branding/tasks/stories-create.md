# stories-create

```yaml
task: storiesCreate()
agent: creative-producer
squad: branding
prd_refs: [FR-2.3]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: stories_brief
    type: StoriesBrief
    required: true

outputs:
  - name: stories_package
    type: StoriesPackage
    destination: .aiox/branding/{client}/social/stories/{story_id}/

tools:
  - ai-orchestrator
  - satori
  - sharp
```

## Purpose

Create Story/Reel templates (1080x1920px 9:16) for Instagram, Facebook, TikTok with safe zones.

## Story Types

```yaml
story_types:
  poll:
    interactive: true
    elements: [question, option_a, option_b, background]
    engagement: high

  quiz:
    interactive: true
    elements: [question, multiple_options, reveal]
    engagement: high

  behind_the_scenes:
    format: photo_or_video
    elements: [casual_content, text_overlay, timestamp]
    authenticity: high

  testimonial:
    format: quote_card
    elements: [quote, customer_photo, name, background]
    social_proof: true

  cta_link:
    interactive: true
    elements: [hook, value_prop, link_sticker_area, swipe_up]
    conversion: focused

  countdown:
    interactive: true
    elements: [event_name, countdown_sticker_area, cta]
    urgency: true
```

## Safe Zone Requirements

```yaml
safe_zones:
  total_size: 1080x1920px

  danger_zones:
    top: 250px (status bar, username)
    bottom: 200px (navigation, reply bar)
    left: 50px
    right: 50px

  content_safe_area:
    width: 980px
    height: 1470px
    position: centered

  interactive_zone:
    description: "Sticker placement area"
    recommended: center_third

  text_safe_area:
    avoid_top: 10% (gets cut by profile)
    avoid_bottom: 15% (reply bar)
```

## Template Designs

```yaml
templates:
  poll_template:
    background: brand_gradient_or_image
    question:
      position: top_third
      size: 48px bold
    options:
      position: center
      style: pill_buttons
      colors: brand_colors

  quiz_template:
    background: brand_color
    question:
      position: top_quarter
      size: 36px
    options:
      position: center
      layout: 2x2_grid
      style: cards

  testimonial_template:
    background: subtle_pattern
    quote:
      position: center
      size: 28px
      style: quotation_marks
    attribution:
      position: bottom_third
      includes: [photo_circle, name, role]

  cta_template:
    background: attention_grabbing
    hook:
      position: top_third
      size: 48px bold
    value:
      position: center
      size: 24px
    link_area:
      position: bottom_third
      highlight: true
```

## Platform Specifications

```yaml
platforms:
  instagram_stories:
    size: 1080x1920
    duration: 15s max (static: 5s display)
    stickers: poll, quiz, countdown, link
    format: PNG or MP4

  facebook_stories:
    size: 1080x1920
    similar_to: instagram
    format: PNG or MP4

  tiktok:
    size: 1080x1920
    text_position: consider_for_you_overlay
    format: MP4 preferred

  youtube_shorts:
    size: 1080x1920
    subscribe_button: bottom_right
    format: MP4
```

## Generation Process

```yaml
steps:
  - step: analyze_brief
    determine: story_type, platform, goal

  - step: select_template
    based_on: story_type

  - step: generate_copy
    constraint: fits_safe_zone
    style: punchy, scannable

  - step: generate_visual
    background: brand_aligned
    constraint: content_safe_area

  - step: render_story
    tool: satori
    size: 1080x1920
    validate: safe_zones

  - step: export
    formats:
      - png (static)
      - preview_with_zones (internal)

  - step: create_instructions
    for: interactive_elements
    include: sticker_placement_guide
```

## Pre-Conditions

- [ ] Story brief provided
- [ ] Platform specified
- [ ] Brand assets available

## Post-Conditions

- [ ] Story rendered in safe zones
- [ ] Export complete
- [ ] Interactive instructions included

## Acceptance Criteria

- [ ] Content within safe zones
- [ ] Platform specs met
- [ ] Brand consistent
- [ ] Interactive elements marked

## Quality Gate

- Threshold: >70%
- Stories/reels match 1080x1920 platform dimensions
- Brand colors and typography applied consistently
- Interactive elements (polls, stickers) properly positioned

---
*Branding Squad Task - creative-producer*
