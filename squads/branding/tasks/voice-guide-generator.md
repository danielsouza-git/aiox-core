# voice-guide-generator

```yaml
task: voiceGuideGenerator()
agent: brand-strategist
squad: branding
prd_refs: [FR-1.8]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
    source: brand-discovery output

outputs:
  - name: voice_guide
    type: markdown
    destination: .aiox/branding/{client}/brand-voice-guide.md
  - name: voice_guide_pdf
    type: pdf
    destination: .aiox/branding/{client}/exports/brand-voice-guide.pdf

tools:
  - ai-orchestrator
  - pdf-generator
```

## Purpose

Generate comprehensive Brand Voice Guide (8-12 pages) documenting personality, voice pillars, tone spectrum, and vocabulary.

## Output Structure

### 1. Brand Personality (2 pages)
```yaml
sections:
  - personality_adjectives:
      count: 3-5
      format: adjective + description
  - brand_archetype:
      primary: string
      secondary: string
      description: paragraph
  - personality_traits:
      visual: radar chart data
      scales: 5 dimensions
```

### 2. Voice Pillars (2 pages)
```yaml
sections:
  - core_principles:
      count: 3
      format: principle + explanation + example
  - voice_characteristics:
      what_we_are: string[]
      what_we_are_not: string[]
```

### 3. Tone Spectrum (2 pages)
```yaml
sections:
  - tone_by_channel:
      channels: [website, social, email, support, ads]
      scale: formal(1) to casual(5)
      examples_per_channel: 2
  - situational_tone:
      situations: [celebration, crisis, education, promotion]
      guidelines_per_situation: paragraph
```

### 4. Do/Don't List (2 pages)
```yaml
sections:
  - dos:
      count: 10-15
      format: guideline + good example
  - donts:
      count: 10-15
      format: guideline + bad example + why
```

### 5. Vocabulary Bank (2 pages)
```yaml
sections:
  - approved_words:
      count: 20-30
      categories: [action, description, emotion, technical]
  - forbidden_words:
      count: 10-15
      reason_per_word: string
  - alternatives_table:
      format: "instead of X, use Y"
```

## AI Generation Process

```yaml
steps:
  - step: analyze_brand_profile
    input: brand_profile
    output: voice_direction

  - step: generate_personality_section
    prompt_template: voice-personality-v1
    human_review: required

  - step: generate_pillars_section
    prompt_template: voice-pillars-v1
    human_review: required

  - step: generate_tone_spectrum
    prompt_template: voice-tone-v1
    human_review: required

  - step: generate_vocabulary
    prompt_template: voice-vocabulary-v1
    human_review: required

  - step: compile_document
    format: markdown
    export: pdf
```

## Pre-Conditions

- [ ] Brand profile completed and approved
- [ ] Industry context available
- [ ] Target audience defined

## Post-Conditions

- [ ] Voice guide 8-12 pages
- [ ] All sections complete
- [ ] PDF exported

## Acceptance Criteria

- [ ] Personality accurately reflects brand profile
- [ ] Examples are industry-appropriate
- [ ] Vocabulary aligns with target audience
- [ ] No forbidden words in approved list
- [ ] Client approval received

## Quality Gate

- Threshold: >70%
- Voice guide contains minimum 8 pages of content
- Tone attributes aligned with brand personality from discovery
- Writing examples provided for at least 3 content types

---
*Branding Squad Task - brand-strategist*
